# 🤖 GeekSense Bot — Fase 1

Bot Discord para análise de sentimento em clubes de cultura geek universitária.

## 📁 Estrutura

```
geeksense/
├── src/
│   ├── index.js                    # Entrada principal do bot
│   ├── commands/
│   │   └── analisar.js             # Comando !analisar
│   ├── models/
│   │   └── Mensagem.js             # Schema MongoDB
│   └── services/
│       ├── geminiService.js        # Integração com Gemini AI
│       ├── messageListener.js      # Monitoramento automático
│       └── mongoService.js         # Conexão com MongoDB Atlas
├── .env.example
├── package.json
└── README.md
```

## ⚙️ Configuração passo a passo

### 1. Pré-requisitos
- Node.js 20+
- Conta no [Discord Developer Portal](https://discord.com/developers/applications)
- Conta no [Google AI Studio](https://aistudio.google.com)
- Conta no [MongoDB Atlas](https://cloud.mongodb.com)

### 2. Criar o Bot no Discord
1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Clique em **New Application** → dê o nome "GeekSense"
3. Vá em **Bot** → clique em **Add Bot**
4. Em **Privileged Gateway Intents**, ative:
   - ✅ **MESSAGE CONTENT INTENT**
   - ✅ **SERVER MEMBERS INTENT**
5. Copie o **Token** do bot
6. Para adicionar ao servidor: vá em **OAuth2 > URL Generator**, marque `bot` e as permissões:
   - Read Messages/View Channels
   - Send Messages
   - Embed Links
   - Read Message History

### 3. Obter a API Key do Gemini
1. Acesse [Google AI Studio](https://aistudio.google.com)
2. Clique em **Get API Key** → **Create API Key**
3. Copie a chave gerada

### 4. Configurar MongoDB Atlas
1. Acesse [MongoDB Atlas](https://cloud.mongodb.com) e crie uma conta
2. Crie um cluster gratuito (M0 Free Tier)
3. Em **Database Access**: crie um usuário com senha
4. Em **Network Access**: adicione `0.0.0.0/0` (permite acesso de qualquer IP)
5. Clique em **Connect** → **Compass** → copie a URI de conexão

### 5. Instalar e rodar

```bash
# Instalar dependências
npm install

# Copiar e preencher as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas chaves

# Iniciar o bot
npm start

# Modo desenvolvimento (reinicia ao salvar)
npm run dev
```

## 🗂️ Arquivo .env

```env
DISCORD_TOKEN=seu_token_do_bot
GEMINI_API_KEY=sua_api_key_do_gemini
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/geeksense
ADMIN_CHANNEL_ID=id_do_canal_privado_dos_admins
```

> **Como pegar o ID de um canal Discord:** ative o Modo Desenvolvedor em Configurações > Avançado, depois clique com o botão direito no canal > "Copiar ID"

## 🎮 Comandos disponíveis (Fase 1)

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `!analisar <texto>` | Analisa o sentimento de um texto manualmente | `!analisar cara esse anime é incrível kkk` |

## 🔍 O que o bot faz automaticamente

- **Monitora** todas as mensagens dos canais (exceto do próprio bot e canais ignorados)
- **Analisa** sentimento via Gemini (positivo/negativo/neutro)
- **Detecta** gírias, internetês e contexto geek
- **Salva** cada análise no MongoDB Atlas
- **Alerta** admins em caso de conteúdo tóxico

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
  "timestamp": "2026-05-10T15:30:00Z"
}
```
