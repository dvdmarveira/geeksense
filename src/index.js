import 'dotenv/config';
import { Client, GatewayIntentBits, Partials, EmbedBuilder } from 'discord.js';
import { conectarMongoDB } from './services/mongoService.js';
import { handleMensagem } from './services/messageListener.js';
import { handleAnalisar } from './commands/analisar.js';
import { handleRelatorio } from './commands/relatorio.js';
import { handleChatIA } from './commands/chatIA.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

// ─── Bot pronto ───────────────────────────────────────────────────────────────
client.once('clientReady', async () => {
  console.log(`\n🤖 GeekSense online como ${client.user.tag}`);
  console.log(`📡 Monitorando ${client.guilds.cache.size} servidor(es)`);
  console.log(`🔑 ADMIN_CHANNEL_ID configurado: ${process.env.ADMIN_CHANNEL_ID ? '✅ ' + process.env.ADMIN_CHANNEL_ID : '❌ NÃO CONFIGURADO'}\n`);
  client.user.setActivity('os canais do clube 👁️', { type: 3 });
});

// ─── Nova mensagem ────────────────────────────────────────────────────────────
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Comandos
  if (message.content.startsWith('!analisar')) return handleAnalisar(message);
  if (message.content.startsWith('!relatorio') || message.content.startsWith('!relatório')) return handleRelatorio(message);
  if (message.content === '!ajuda' || message.content === '!help') return handleAjuda(message, client);

  // Canal de chat com IA
  const nomeCanal = message.channel.name?.toLowerCase() || '';
  if (nomeCanal.includes('pergunte') || nomeCanal.includes('geeksense')) {
    return handleChatIA(message);
  }

  // Monitoramento automático de todos os outros canais
  await handleMensagem(message, client);
});

// ─── Ajuda ────────────────────────────────────────────────────────────────────
async function handleAjuda(message) {
  const embed = new EmbedBuilder()
    .setTitle('🤖 GeekSense — Comandos')
    .setColor(0x5865f2)
    .addFields(
      { name: '`!analisar <texto>`', value: 'Analisa o sentimento de um texto manualmente' },
      { name: '`!relatorio`', value: 'Gera relatório semanal *(requer role Líder/Admin)*' },
      { name: '`#pergunte-ao-geeksense`', value: 'Canal para perguntas sobre cultura geek' },
    )
    .setFooter({ text: 'GeekSense • Monitoramento automático ativo em todos os canais' });
  return message.reply({ embeds: [embed] });
}

// ─── Erros ────────────────────────────────────────────────────────────────────
process.on('unhandledRejection', (error) => {
  console.error('[Bot] Erro não tratado:', error.message);
});

// ─── Inicialização ────────────────────────────────────────────────────────────
async function iniciar() {
  await conectarMongoDB();
  await client.login(process.env.DISCORD_TOKEN);
}

iniciar();
