import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = 'gemini-2.5-flash';

// Retry automático com espera exponencial
async function chamarGeminiComRetry(fn, tentativas = 3) {
  for (let i = 0; i < tentativas; i++) {
    try {
      return await fn();
    } catch (error) {
      const e503 = error.message?.includes('503');
      const e429 = error.message?.includes('429');
      if ((e503 || e429) && i < tentativas - 1) {
        const espera = (i + 1) * 3000; // 3s, 6s, 9s
        console.log(`[Gemini] Serviço ocupado, tentando novamente em ${espera/1000}s... (tentativa ${i+2}/${tentativas})`);
        await new Promise(r => setTimeout(r, espera));
        continue;
      }
      throw error;
    }
  }
}

// ─── Análise de Sentimento ────────────────────────────────────────────────────
export async function analisarMensagem(texto) {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `Retorne APENAS este JSON preenchido, sem nenhum texto antes ou depois, sem markdown, sem backticks:

{"sentimento":{"tipo":"PREENCHER","confianca":0.0,"emocoes":[],"girias_detectadas":[],"contexto_geek":[]},"toxico":false,"razao_toxicidade":null}

Regras para "tipo":
- "positivo": elogios, empolgação, kkk/haha, "amei", "top", "incrível", "mt bom", felicidade, animação
- "negativo": reclamações, tristeza, frustração, "odeio", "chato", "horrível", raiva, desânimo
- "neutro": perguntas simples, informações sem emoção clara

Regras para "toxico" (marque true se qualquer um se aplicar):
- Xingamentos diretos a pessoas: "seu idiota", "burro", "imbecil", "lixo"
- Ameaças ou incitação: "some daqui", "vai se ferrar", "te mato"
- Bullying ou humilhação direcionada a alguém
- Discurso de ódio contra grupos: raça, gênero, orientação sexual
- Palavrões usados de forma agressiva e ofensiva (não conta "porra" de empolgação)
- Expressões de ódio generalizado agressivo: "odeio todo mundo", "vocês são uma bosta"

Para "confianca": use 0.9+ quando a emoção for clara, 0.6-0.8 quando moderada.

Analise agora: "${texto.replace(/"/g, "'")}"`;

  try {
    const analise = await chamarGeminiComRetry(async () => {
      const result = await model.generateContent(prompt);
      let raw = result.response.text().trim();
      const inicio = raw.indexOf('{');
      const fim = raw.lastIndexOf('}');
      if (inicio === -1 || fim === -1) throw new Error('JSON não encontrado');
      return JSON.parse(raw.slice(inicio, fim + 1));
    });

    console.log(`[Gemini] Análise: ${analise.sentimento?.tipo} (${analise.sentimento?.confianca}) | tóxico: ${analise.toxico}`);

    return {
      sentimento: {
        tipo: ['positivo','negativo','neutro'].includes(analise.sentimento?.tipo) ? analise.sentimento.tipo : 'neutro',
        confianca: typeof analise.sentimento?.confianca === 'number' ? analise.sentimento.confianca : 0.5,
        emocoes: analise.sentimento?.emocoes || [],
        girias_detectadas: analise.sentimento?.girias_detectadas || [],
        contexto_geek: analise.sentimento?.contexto_geek || [],
      },
      toxico: analise.toxico === true,
      razaoToxicidade: analise.razao_toxicidade || null,
    };
  } catch (error) {
    console.error('[Gemini] Erro ao analisar:', error.message);
    // Fallback manual
    const t = texto.toLowerCase();
    const toxicos = ['idiota','burro','imbecil','some daqui','vai se ferrar','seu lixo','cala boca','te odeio','odeio todo mundo','vocês são'];
    const positivos = ['amei','incrível','top','kkk','haha','legal','mt bom','adorei','massa','uau'];
    const negativos = ['odeio','horrível','chato','raiva','péssimo','ruim','detesto','triste'];
    const eToxico = toxicos.some(p => t.includes(p));
    return {
      sentimento: {
        tipo: eToxico || negativos.some(p => t.includes(p)) ? 'negativo' : positivos.some(p => t.includes(p)) ? 'positivo' : 'neutro',
        confianca: 0.7,
        emocoes: [], girias_detectadas: [], contexto_geek: [],
      },
      toxico: eToxico,
      razaoToxicidade: eToxico ? 'Linguagem ofensiva detectada (fallback)' : null,
    };
  }
}

// ─── Chat IA ──────────────────────────────────────────────────────────────────
const historicos = new Map();
const MAX_TURNS = 5;

export async function responderPergunta(pergunta, authorId) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: `Você é o GeekSense, assistente animado do Clube Geek Universitário brasileiro! 🎮✨
Personalidade: descontraído, usa gírias geek com moderação, sempre útil e empolgado.
Conhece muito sobre animes, mangás, jogos, séries, quadrinhos, cosplay e tecnologia.
Responda em português brasileiro. Máximo 3 parágrafos curtos. Use emojis com moderação.`,
  });

  if (!historicos.has(authorId)) historicos.set(authorId, []);
  const hist = historicos.get(authorId);

  try {
    const resposta = await chamarGeminiComRetry(async () => {
      const chat = model.startChat({ history: hist });
      const result = await chat.sendMessage(pergunta);
      return result.response.text();
    });

    hist.push(
      { role: 'user', parts: [{ text: pergunta }] },
      { role: 'model', parts: [{ text: resposta }] }
    );
    if (hist.length > MAX_TURNS * 2) hist.splice(0, 2);

    return resposta;
  } catch (error) {
    console.error('[Gemini Chat] Erro:', error.message);
    return 'Opa, tive um problema técnico momentâneo! 😅 Pode repetir sua pergunta?';
  }
}

// ─── Sugestões ────────────────────────────────────────────────────────────────
export async function gerarSugestoes(topicos) {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = `Você é assistente de um clube geek universitário brasileiro.
Tópicos mais discutidos: ${topicos.join(', ')}
Sugira em português, animado e curto (máximo 4 linhas):
- Um evento temático para o clube
- Um conteúdo para recomendar (anime, jogo, série ou mangá)
- Um tema para discussão dessa semana`;

  try {
    return await chamarGeminiComRetry(async () => {
      const result = await model.generateContent(prompt);
      return result.response.text();
    });
  } catch (error) {
    console.error('[Gemini Sugestões] Erro:', error.message);
    return null;
  }
}
