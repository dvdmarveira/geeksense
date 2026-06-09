import { EmbedBuilder } from 'discord.js';
import { analisarMensagem } from '../services/geminiService.js';

const CORES = { positivo: 0x57f287, negativo: 0xed4245, neutro: 0xfee75c };
const EMOJIS = { positivo: '😄', negativo: '😔', neutro: '😐' };

export async function handleAnalisar(message) {
  const args = message.content.slice('!analisar'.length).trim();

  if (!args) {
    return message.reply(
      '❌ Passa um texto para analisar!\n**Uso:** `!analisar <texto>`\n**Exemplo:** `!analisar cara esse anime é incrível kkk amei demais`'
    );
  }

  await message.channel.sendTyping();

  const analise = await analisarMensagem(args);
  const { sentimento, toxico, razaoToxicidade } = analise;

  const embed = new EmbedBuilder()
    .setTitle(`${EMOJIS[sentimento.tipo]} Análise de Sentimento — GeekSense`)
    .setColor(CORES[sentimento.tipo])
    .setDescription(`> ${args.length > 200 ? args.slice(0, 200) + '...' : args}`)
    .addFields(
      {
        name: '📊 Sentimento',
        value: `**${sentimento.tipo.toUpperCase()}** (${Math.round(sentimento.confianca * 100)}% de confiança)`,
        inline: true,
      },
      {
        name: '🚨 Tóxico?',
        value: toxico ? `⚠️ Sim\n*${razaoToxicidade}*` : '✅ Não',
        inline: true,
      }
    );

  if (sentimento.emocoes.length > 0) {
    embed.addFields({ name: '💭 Emoções detectadas', value: sentimento.emocoes.join(', '), inline: false });
  }
  if (sentimento.girias_detectadas.length > 0) {
    embed.addFields({ name: '🗣️ Gírias / Internetês', value: sentimento.girias_detectadas.join(', '), inline: true });
  }
  if (sentimento.contexto_geek.length > 0) {
    embed.addFields({ name: '🎮 Contexto geek', value: sentimento.contexto_geek.join(', '), inline: true });
  }

  embed.setFooter({ text: 'GeekSense Bot • Análise via Gemini 2.0 Flash' }).setTimestamp();

  return message.reply({ embeds: [embed] });
}
