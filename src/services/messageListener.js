import { EmbedBuilder } from 'discord.js';
import { analisarMensagem } from './geminiService.js';
import { Mensagem } from '../models/Mensagem.js';

const TAMANHO_MINIMO = 4;
const processando = new Set();

// Canais que o bot NÃO monitora (canal de chat com IA)
function deveIgnorar(channelName) {
  const nome = (channelName || '').toLowerCase();
  return nome.includes('pergunte') || nome.includes('geeksense');
}

export async function handleMensagem(message, client) {
  if (message.author.bot) return;
  if (message.content.trim().length < TAMANHO_MINIMO) return;
  if (message.content.startsWith('!')) return;
  if (deveIgnorar(message.channel.name)) return;
  if (processando.has(message.id)) return;

  processando.add(message.id);

  try {
    console.log(`[Monitor] Analisando mensagem de ${message.author.username} em #${message.channel.name}: "${message.content.slice(0, 50)}"`);

    const analise = await analisarMensagem(message.content);
    const { sentimento, toxico, razaoToxicidade } = analise;

    // Tenta salvar no MongoDB
    try {
      await Mensagem.create({
        messageId: message.id,
        authorId: message.author.id,
        authorUsername: message.author.username,
        guildId: message.guild.id,
        channelId: message.channel.id,
        channelName: message.channel.name,
        conteudo: message.content,
        sentimento: {
          tipo: sentimento.tipo,
          confianca: sentimento.confianca,
          emocoes: sentimento.emocoes,
          girias_detectadas: sentimento.girias_detectadas,
          contexto_geek: sentimento.contexto_geek,
        },
        toxico,
        razaoToxicidade,
      });
    } catch (dbError) {
      if (dbError.code !== 11000) {
        console.error('[Monitor] Erro ao salvar no MongoDB:', dbError.message);
      }
    }

    const emoji = sentimento.tipo === 'positivo' ? '😄' : sentimento.tipo === 'negativo' ? '😔' : '😐';
    console.log(`[Monitor] ✅ ${emoji} ${sentimento.tipo} (${Math.round(sentimento.confianca * 100)}%)${toxico ? ' ⚠️ TÓXICO!' : ''}`);

    if (toxico) {
      console.log(`[Monitor] 🚨 Alertando admins sobre mensagem tóxica!`);
      await alertarAdmins(message, razaoToxicidade, client);
    }

  } catch (error) {
    console.error('[Monitor] Erro geral:', error.message);
  } finally {
    processando.delete(message.id);
  }
}

async function alertarAdmins(message, razao, client) {
  const adminChannelId = process.env.ADMIN_CHANNEL_ID;

  if (!adminChannelId) {
    console.warn('[Monitor] ⚠️ ADMIN_CHANNEL_ID não configurado no .env!');
    return;
  }

  const adminChannel = client.channels.cache.get(adminChannelId);

  if (!adminChannel) {
    console.warn(`[Monitor] ⚠️ Canal admin (${adminChannelId}) não encontrado no cache! Verifique o ID no .env`);
    return;
  }

  try {
    const embed = new EmbedBuilder()
      .setTitle('⚠️ Conteúdo Tóxico Detectado')
      .setColor(0xff0000)
      .addFields(
        { name: '👤 Usuário', value: `<@${message.author.id}> (${message.author.username})`, inline: true },
        { name: '📍 Canal', value: `<#${message.channel.id}>`, inline: true },
        { name: '🕐 Horário', value: `<t:${Math.floor(message.createdTimestamp / 1000)}:F>`, inline: false },
        { name: '💬 Mensagem', value: `\`\`\`${message.content.slice(0, 500)}\`\`\`` },
        { name: '🔍 Motivo', value: razao || 'Linguagem ofensiva detectada' }
      )
      .setFooter({ text: 'GeekSense • Sistema de Moderação' })
      .setTimestamp();

    await adminChannel.send({ embeds: [embed] });
    console.log('[Monitor] ✅ Alerta enviado para canal admin!');
  } catch (error) {
    console.error('[Monitor] Erro ao enviar alerta:', error.message);
  }
}
