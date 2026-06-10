[README (1).md](https://github.com/user-attachments/files/28771490/README.1.md)
# 🤖 GeekSense Bot

Bot Discord para análise de sentimento em clubes de cultura geek universitária brasileira.

Desenvolvido como parte do **2º Processo Avaliativo — Inteligência Artificial**
**Equipe:** Evellyn Silva, Stella Albertina, Isadora Francisca, Deyvid Diogo, Rafael Luis, José Eduardo e Marcos Victor

---

## 🚀 Funcionalidades

### 📊 Análise de Sentimento Automática
O bot monitora todos os canais do servidor em tempo real. Cada mensagem é analisada pela IA (Gemini 2.5 Flash) e classificada como **positivo**, **negativo** ou **neutro**, com percentual de confiança. Os dados são salvos automaticamente no MongoDB Atlas.

### 🚨 Detector de Conteúdo Tóxico
Quando uma mensagem com xingamentos, ameaças, bullying ou discurso de ódio é detectada, o bot envia automaticamente um alerta no canal dos admins com o nome do usuário, canal, horário e motivo.

### 📈 Relatório Semanal (`!relatorio`)
Gera um painel completo com:
- Percentual de sentimentos da semana com barra visual
- Canais mais ativos
- Usuários mais engajados
- Tópicos geek em alta
- Sugestões automáticas de eventos e conteúdos

### 💬 Chat com IA (`#pergunte-ao-geeksense`)
Canal dedicado onde qualquer membro pode conversar com o bot sobre animes, jogos, séries, mangás, quadrinhos e tecnologia. O bot mantém histórico de conversa por usuário.

### 🔧 Análise Manual (`!analisar`)
Analisa o sentimento de qualquer texto na hora, útil para testes e demonstrações.

---

## 🛠️ Tecnologias

| Categoria | Ferramenta |
|---|---|
| Bot Discord | discord.js (Node.js) |
| Inteligência Artificial | Gemini 2.5 Flash (Google AI Studio) |
| Banco de Dados | MongoDB Atlas (Free Tier) |
| Controle de Versão | GitHub |

---

## 📁 Estrutura do Projeto

```
geeksense/
├── src/
│   ├── index.js                    # Entrada principal do bot
│   ├── commands/
│   │   ├── analisar.js             # Comando !analisar
│   │   ├── relatorio.js            # Comando !relatorio
│   │   └── chatIA.js               # Handler do canal de chat
│   ├── models/
│   │   └── Mensagem.js             # Schema MongoDB
│   └── services/
│       ├── geminiService.js        # Integração com Gemini AI
│       ├── messageListener.js      # Monitoramento automático
│       └── mongoService.js         # Conexão com MongoDB Atlas
├── .env.example                    # Modelo das variáveis de ambiente
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Configuração

### Pré-requisitos
- Node.js 20+
- Conta no [Discord Developer Portal](https://discord.com/developers/applications)
- Conta no [Google AI Studio](https://aistudio.google.com)
- Conta no [MongoDB Atlas](https://cloud.mongodb.com)

### 1. Clonar o repositório
```bash
git clone https://github.com/dvdmarveira/geeksense
cd geeksense
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Copie o arquivo de exemplo e preencha com suas chaves:
```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=token_do_bot
GEMINI_API_KEY=api_key_do_gemini
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/geeksense
ADMIN_CHANNEL_ID=id_do_canal_admin
```

### 4. Configurar o bot no Discord Developer Portal
1. Crie um novo app em [discord.com/developers](https://discord.com/developers/applications)
2. Vá em **Bot** → ative **Message Content Intent** e **Server Members Intent**
3. Em **OAuth2 → URL Generator**, marque `bot` e `applications.commands`
4. Nas permissões do bot marque: Ver canais, Enviar mensagens, Inserir links, Gerenciar mensagens, Ver histórico de mensagens
5. Use a URL gerada para adicionar o bot ao servidor

### 5. Configurar canais no Discord
- Crie um canal **`#pergunte-ao-geeksense`** para o chat com IA
- Crie uma role **`Líder`** para liberar o comando `!relatorio`
- Crie um canal privado para admins e coloque o ID no `ADMIN_CHANNEL_ID`

### 6. Iniciar o bot
```bash
npm start
```

---

## 🎮 Comandos

| Comando | Descrição | Permissão |
|---|---|---|
| `!analisar <texto>` | Analisa o sentimento de um texto | Todos |
| `!relatorio` | Gera relatório semanal do servidor | Role Líder/Admin |
| `!ajuda` | Lista os comandos disponíveis | Todos |
| `#pergunte-ao-geeksense` | Canal para conversar com a IA | Todos |

---

## 📊 Dados salvos por mensagem (MongoDB)

```json
{
  "messageId": "...",
  "authorUsername": "fulano",
  "channelName": "anime-geral",
  "conteudo": "esse anime é mt bom kkk",
  "sentimento": {
    "tipo": "positivo",
    "confianca": 0.95,
    "emocoes": ["alegria", "empolgação"],
    "girias_detectadas": ["mt", "kkk"],
    "contexto_geek": ["anime"]
  },
  "toxico": false,
  "razaoToxicidade": null,
  "timestamp": "2026-05-10T15:30:00Z"
}
```

---

## 🗓️ Fases de Desenvolvimento

### Fase 0 — Configuração Inicial
- Criação do servidor Discord fictício "Clube Geek Uni"
- Configuração do bot no Discord Developer Portal
- Criação da API Key do Gemini no Google AI Studio
- Criação do cluster no MongoDB Atlas
- Configuração do repositório GitHub

### Fase 1 — Bot Básico + Análise de Sentimento
- Listener de mensagens automático em todos os canais
- Prompt estruturado no Gemini 2.5 Flash para análise de sentimento
- Identificação de gírias, internetês e contexto geek
- Armazenamento das análises no MongoDB Atlas
- Comando `!analisar` para testes manuais

### Fase 2 — Relatórios e Dashboard no Discord
- Comando `!relatorio` restrito à role Líder/Admin
- Embeds visuais com percentual de sentimentos, canais mais ativos e usuários mais engajados
- Detecção de tópicos geek em alta
- Sugestões automáticas de eventos e conteúdos geradas pelo Gemini

### Fase 3 — Chat IA + Moderação
- Canal `#pergunte-ao-geeksense` com respostas automáticas
- Histórico de conversa por usuário
- Detector de conteúdo tóxico com alerta automático no canal dos admins
- Retry automático em caso de sobrecarga da API (503/429)

### Fase 4 — Testes e Polimento
- Ajuste do modelo de IA para `gemini-2.5-flash`
- Fallback manual com palavras-chave para garantir funcionamento offline
- Logs detalhados no terminal para diagnóstico
- Correção de bugs de integração com a API do Gemini

---
## 📊 Métricas do Modelo (Gemini 2.5 Flash)

- Total de mensagens analisadas: **45**
- Mensagens positivas: **13% (6)**
- Mensagens negativas: **24% (11)**
- Mensagens neutras: **62% (28)**
- Taxa de mensagens tóxicas detectadas: **4,44% (2 mensagens)**
- Canal mais ativo durante os testes: **#bate-papo (23 mensagens)**
- Usuário mais engajado: **rafaawhite (30 mensagens)**
- Precisão percebida em contexto geek (testes manuais): **~89%**

### Exemplos de análise
![Exemplo - Análise Negativa e Positiva]
<img width="441" height="763" alt="analise geek sense" src="https://github.com/user-attachments/assets/3a65a9ba-0444-4fe3-8de8-571747777e91" />

---
## ⚠️ Limitações Conhecidas

- O projeto depende da disponibilidade da API Gemini para realizar análises de sentimento e respostas no chat.
- A versão gratuita da API possui limite de requisições, podendo exigir a atualização ou substituição da chave de acesso após atingir a cota disponível.
- Mensagens com sarcasmo, ironia, memes ou gírias muito recentes podem ser interpretadas de forma incorreta pelo modelo.
- A detecção de toxicidade pode gerar falsos positivos ou falsos negativos em alguns contextos.
- O sistema foi validado em ambiente acadêmico e ainda não foi testado em larga escala com grande volume de mensagens simultâneas.
---
## 🚀 Melhorias Futuras

- Implementar rotação automática de chaves da API Gemini ao atingir limites de uso.
- Adicionar cache de análises para reduzir chamadas repetidas à API.
- Criar dashboard web para visualização de métricas e relatórios.
- Permitir exportação de relatórios em PDF ou CSV.
- Aprimorar a detecção de gírias, sarcasmo e contexto cultural brasileiro.
- Implementar monitoramento de uso da API e métricas de desempenho do bot.
- Expandir a análise para imagens, memes e outros conteúdos multimídia.
---
## 🔐 Segurança

- Nunca commite o arquivo `.env` — ele está no `.gitignore`
- Use o `.env.example` como referência para as variáveis necessárias
- Revogue e recrie suas chaves caso elas sejam expostas acidentalmente

---

## 📝 Critérios de Sucesso do MVP

- [x] Bot online e monitorando mensagens automaticamente
- [x] Análise de sentimento com confiança acima de 75%
- [x] Relatórios visuais claros no Discord
- [x] Canal de chat com IA funcional
- [x] Detector de toxicidade com alerta aos admins
- [x] Dados salvos no MongoDB Atlas
- [x] Código versionado no GitHub
- [x] Deploy 24h no Railway/Render
