# 🤖 GeekSense Bot

Discord bot for sentiment analysis in Brazilian university geek culture clubs.

Developed as part of the **2nd Assessment Process — Artificial Intelligence**  
**Team:** Evellyn Silva, Stella Albertina, Isadora Francisca, Deyvid Diogo, Rafael Luis, José Eduardo, and Marcos Victor

---

## 🚀 Features

### 📊 Automatic Sentiment Analysis
The bot monitors all server channels in real time. Each message is analyzed by AI (Gemini 2.5 Flash) and classified as **positive**, **negative**, or **neutral**, with a confidence percentage. The data is automatically stored in MongoDB Atlas.

### 🚨 Toxic Content Detector
When a message containing insults, threats, bullying, or hate speech is detected, the bot automatically sends an alert to the admins' channel with the username, channel, time, and reason.

### 📈 Weekly Report (`!relatorio`)
Generates a complete dashboard with:
- Weekly sentiment percentages with a visual bar
- Most active channels
- Most engaged users
- Trending geek topics
- Automatic event and content suggestions

### 💬 AI Chat (`#pergunte-ao-geeksense`)
Dedicated channel where any member can chat with the bot about anime, games, TV series, manga, comics, and technology. The bot keeps a conversation history for each user.

### 🔧 Manual Analysis (`!analisar`)
Analyzes the sentiment of any text instantly, useful for testing and demonstrations.

---

## 🛠️ Technologies

| Category | Tool |
|---|---|
| Discord Bot | discord.js (Node.js) |
| Artificial Intelligence | Gemini 2.5 Flash (Google AI Studio) |
| Database | MongoDB Atlas (Free Tier) |
| Version Control | GitHub |

---

## 📁 Project Structure

```

geeksense/
├── src/
│   ├── index.js                    # Main bot entry point
│   ├── commands/
│   │   ├── analisar.js             # !analisar command
│   │   ├── relatorio.js            # !relatorio command
│   │   └── chatIA.js               # AI chat channel handler
│   ├── models/
│   │   └── Mensagem.js             # MongoDB schema
│   └── services/
│       ├── geminiService.js        # Gemini AI integration
│       ├── messageListener.js      # Automatic monitoring
│       └── mongoService.js         # MongoDB Atlas connection
├── .env.example                    # Environment variables template
├── .gitignore
├── package.json
└── README.md

```

---

## ⚙️ Setup

### Prerequisites
- Node.js 20+
- Discord Developer Portal account
- Google AI Studio account
- MongoDB Atlas account

### 1. Clone the repository

```bash
git clone https://github.com/dvdmarveira/geeksense
cd geeksense
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

```env
DISCORD_TOKEN=bot_token
GEMINI_API_KEY=gemini_api_key
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/geeksense
ADMIN_CHANNEL_ID=admin_channel_id
```

### 4. Configure the bot in the Discord Developer Portal

1. Create a new application.
2. Go to **Bot** → enable **Message Content Intent** and **Server Members Intent**.
3. Under **OAuth2 → URL Generator**, select `bot` and `applications.commands`.
4. Grant permissions: View Channels, Send Messages, Embed Links, Manage Messages, and Read Message History.
5. Use the generated URL to add the bot to your server.

### 5. Configure Discord channels

- Create a **`#pergunte-ao-geeksense`** channel for AI chat.
- Create a **`Leader`** role to allow access to the `!relatorio` command.
- Create a private admin channel and place its ID in `ADMIN_CHANNEL_ID`.

### 6. Start the bot

```bash
npm start
```

---

## 🎮 Commands

| Command | Description | Permission |
|---|---|---|
| `!analisar <text>` | Analyzes the sentiment of a text | Everyone |
| `!relatorio` | Generates a weekly server report | Leader/Admin Role |
| `!ajuda` | Lists available commands | Everyone |
| `#pergunte-ao-geeksense` | Channel for chatting with the AI | Everyone |

---

## 📊 Data Stored per Message (MongoDB)

```json
{
  "messageId": "...",
  "authorUsername": "user",
  "channelName": "anime-general",
  "conteudo": "this anime is really good lol",
  "sentimento": {
    "tipo": "positive",
    "confianca": 0.95,
    "emocoes": ["joy", "excitement"],
    "girias_detectadas": ["mt", "kkk"],
    "contexto_geek": ["anime"]
  },
  "toxico": false,
  "razaoToxicidade": null,
  "timestamp": "2026-05-10T15:30:00Z"
}
```

---

## 🗓️ Development Phases

### Phase 0 — Initial Setup
- Creation of the fictional Discord server "Clube Geek Uni"
- Discord Developer Portal configuration
- Gemini API key generation in Google AI Studio
- MongoDB Atlas cluster creation
- GitHub repository setup

### Phase 1 — Basic Bot + Sentiment Analysis
- Automatic message listener across all channels
- Structured Gemini 2.5 Flash prompt for sentiment analysis
- Detection of slang, internet expressions, and geek context
- Storage of analysis results in MongoDB Atlas
- `!analisar` command for manual testing

### Phase 2 — Reports and Discord Dashboard
- `!relatorio` command restricted to the Leader/Admin role
- Visual embeds with sentiment percentages, most active channels, and most engaged users
- Trending geek topic detection
- Automatic event and content suggestions generated by Gemini

### Phase 3 — AI Chat + Moderation
- `#pergunte-ao-geeksense` channel with automatic responses
- Per-user conversation history
- Toxic content detector with automatic alerts for admins
- Automatic retry in case of API overload (503/429)

### Phase 4 — Testing and Refinement
- AI model adjustment to `gemini-2.5-flash`
- Manual keyword fallback to ensure offline operation
- Detailed terminal logs for diagnostics
- Fixes for Gemini API integration bugs

---

## 🔐 Security

- Never commit the `.env` file — it is included in `.gitignore`
- Use `.env.example` as a reference for required variables
- Revoke and regenerate your keys if they are accidentally exposed

---

## 📊 Model Metrics (Gemini 2.5 Flash)

- Total analyzed messages: **45**
- Positive messages: **13% (6)**
- Negative messages: **24% (11)**
- Neutral messages: **62% (28)**
- Toxic message detection rate: **4.44% (2 messages)**
- Most active channel during testing: **#bate-papo (23 messages)**
- Most engaged user: **rafaawhite (30 messages)**
- Perceived accuracy in geek-context tests: **~89%**

### Analysis Example

<img width="441" height="763" alt="GeekSense analysis" src="https://github.com/user-attachments/assets/3a65a9ba-0444-4fe3-8de8-571747777e91" />

---

## ⚠️ Known Limitations

- The project depends on the availability of the Gemini API to perform sentiment analysis and chat responses.
- The free API version has request limits and may require updating or replacing the API key after reaching the available quota.
- Messages containing sarcasm, irony, memes, or very recent slang may be interpreted incorrectly by the model.
- Toxicity detection may generate false positives or false negatives in certain contexts.
- The system was validated in an academic environment and has not yet been tested at large scale with a high volume of simultaneous messages.

---

## 🚀 Future Improvements

- Implement automatic Gemini API key rotation when usage limits are reached.
- Add analysis caching to reduce repeated API calls.
- Create a web dashboard for metrics and report visualization.
- Allow report export in PDF or CSV format.
- Improve slang, sarcasm, and Brazilian cultural context detection.
- Implement API usage monitoring and bot performance metrics.
- Expand analysis to images, memes, and other multimedia content.

---

## 📝 MVP Success Criteria

- [x] Bot online and automatically monitoring messages
- [x] Sentiment analysis with confidence above 75%
- [x] Clear visual reports in Discord
- [x] Functional AI chat channel
- [x] Toxicity detector with admin alerts
- [x] Data stored in MongoDB Atlas
- [x] Code versioned on GitHub
- [x] 24/7 deployment on Railway/Render
