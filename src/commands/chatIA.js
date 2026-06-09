import { EmbedBuilder } from 'discord.js';
import { responderPergunta } from '../services/geminiService.js';

export async function handleChatIA(message) {
  const pergunta = message.content.trim();
  if (!pergunta || pergunta.length < 2) return;

  await message.channel.sendTyping();

  try {
    // Passa o ID do autor para manter histórico individual
    const resposta = await responderPergunta(pergunta, message.author.id);

    if (resposta.length <= 150) {
      return message.reply(resposta);
    }

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setAuthor({
        name: 'GeekSense',
        iconURL: message.client.user.displayAvatarURL(),
      })
      .setDescription(resposta.slice(0, 4000))
      .setFooter({ text: `Perguntado por ${message.author.username}` })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  } catch (error) {
    console.error('[ChatIA] Erro inesperado:', error.message);
    return message.reply('Opa, tive um problema técnico! Tenta de novo em instantes. 😅');
  }
}
