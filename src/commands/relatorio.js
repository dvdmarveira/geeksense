import { EmbedBuilder } from 'discord.js';
import { Mensagem } from '../models/Mensagem.js';
import { gerarSugestoes } from '../services/geminiService.js';

const CORES = {
  positivo: 0x57f287,
  negativo: 0xed4245,
  neutro:   0xfee75c,
  geral:    0x5865f2,
};

export async function handleRelatorio(message) {
  // Verifica se o usuário tem a role "Líder" ou "líder" ou é admin do servidor
  const temPermissao =
    message.member.permissions.has('Administrator') ||
    message.member.roles.cache.some(r =>
      r.name.toLowerCase().includes('líder') ||
      r.name.toLowerCase().includes('lider') ||
      r.name.toLowerCase().includes('admin')
    );

  if (!temPermissao) {
    return message.reply('❌ Você precisa ter a role **Líder** ou **Admin** para ver relatórios!');
  }

  await message.channel.sendTyping();

  try {
    const agora = new Date();
    const seteDiasAtras = new Date(agora - 7 * 24 * 60 * 60 * 1000);

    // Busca todas as mensagens da última semana do servidor
    const mensagens = await Mensagem.find({
      guildId: message.guild.id,
      timestamp: { $gte: seteDiasAtras },
    });

    if (mensagens.length === 0) {
      return message.reply('📭 Nenhuma mensagem analisada nos últimos 7 dias ainda!');
    }

    // ── Estatísticas de sentimento ──────────────────────────────────────────
    const contSentimento = { positivo: 0, negativo: 0, neutro: 0 };
    mensagens.forEach(m => contSentimento[m.sentimento.tipo]++);

    const total = mensagens.length;
    const pctPos = Math.round((contSentimento.positivo / total) * 100);
    const pctNeg = Math.round((contSentimento.negativo / total) * 100);
    const pctNeu = Math.round((contSentimento.neutro / total) * 100);

    // ── Canais mais ativos ──────────────────────────────────────────────────
    const porCanal = {};
    mensagens.forEach(m => {
      porCanal[m.channelName] = (porCanal[m.channelName] || 0) + 1;
    });
    const canaisOrdenados = Object.entries(porCanal)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // ── Usuários mais engajados ─────────────────────────────────────────────
    const porUsuario = {};
    mensagens.forEach(m => {
      porUsuario[m.authorUsername] = (porUsuario[m.authorUsername] || 0) + 1;
    });
    const usuariosOrdenados = Object.entries(porUsuario)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // ── Contexto geek mais citado ───────────────────────────────────────────
    const porContexto = {};
    mensagens.forEach(m => {
      (m.sentimento.contexto_geek || []).forEach(ctx => {
        porContexto[ctx] = (porContexto[ctx] || 0) + 1;
      });
    });
    const topContextos = Object.entries(porContexto)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([k]) => k);

    // ── Mensagens tóxicas ───────────────────────────────────────────────────
    const toxicas = mensagens.filter(m => m.toxico).length;

    // ── Barra visual de sentimento ──────────────────────────────────────────
    const barraPos = '🟢'.repeat(Math.round(pctPos / 10));
    const barraNeg = '🔴'.repeat(Math.round(pctNeg / 10));
    const barraNeu = '🟡'.repeat(Math.round(pctNeu / 10));

    // ── Embed principal ─────────────────────────────────────────────────────
    const embedPrincipal = new EmbedBuilder()
      .setTitle('📊 Relatório Semanal — GeekSense')
      .setColor(CORES.geral)
      .setDescription(`**Período:** últimos 7 dias  |  **Total de mensagens analisadas:** ${total}`)
      .addFields(
        {
          name: '😄 Sentimentos',
          value: [
            `${barraPos || '▫️'} Positivo: **${pctPos}%** (${contSentimento.positivo})`,
            `${barraNeg || '▫️'} Negativo: **${pctNeg}%** (${contSentimento.negativo})`,
            `${barraNeu || '▫️'} Neutro: **${pctNeu}%** (${contSentimento.neutro})`,
          ].join('\n'),
          inline: false,
        },
        {
          name: '📍 Canais mais ativos',
          value: canaisOrdenados.map(([nome, qtd], i) => `${['🥇','🥈','🥉','4️⃣','5️⃣'][i]} #${nome} — ${qtd} msgs`).join('\n') || 'Nenhum dado',
          inline: true,
        },
        {
          name: '🏆 Usuários mais engajados',
          value: usuariosOrdenados.map(([nome, qtd], i) => `${['🥇','🥈','🥉','4️⃣','5️⃣'][i]} ${nome} — ${qtd} msgs`).join('\n') || 'Nenhum dado',
          inline: true,
        },
        {
          name: '🎮 Tópicos geek em alta',
          value: topContextos.length > 0 ? topContextos.join(', ') : 'Nenhum detectado',
          inline: false,
        },
        {
          name: '🚨 Conteúdo tóxico detectado',
          value: toxicas > 0 ? `⚠️ **${toxicas}** mensagem(ns) sinalizadas` : '✅ Nenhum conteúdo tóxico',
          inline: false,
        }
      )
      .setFooter({ text: 'GeekSense Bot • Relatório gerado automaticamente' })
      .setTimestamp();

    await message.reply({ embeds: [embedPrincipal] });

    // ── Sugestões automáticas (se houver contexto geek) ─────────────────────
    if (topContextos.length > 0) {
      await message.channel.sendTyping();
      const sugestoes = await gerarSugestoes(topContextos);
      if (sugestoes) {
        const embedSugestoes = new EmbedBuilder()
          .setTitle('💡 Sugestões para o Clube')
          .setColor(0xeb459e)
          .setDescription(sugestoes)
          .setFooter({ text: 'GeekSense • Sugestões baseadas nas discussões recentes' });

        await message.channel.send({ embeds: [embedSugestoes] });
      }
    }

  } catch (error) {
    console.error('[Relatório] Erro:', error.message);
    await message.reply('❌ Erro ao gerar relatório. Tenta novamente em instantes!');
  }
}
