import mongoose from 'mongoose';

const mensagemSchema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  authorId: {
    type: String,
    required: true,
  },
  authorUsername: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  channelName: {
    type: String,
    required: true,
  },
  conteudo: {
    type: String,
    required: true,
  },
  sentimento: {
    tipo: {
      type: String,
      enum: ['positivo', 'negativo', 'neutro'],
      required: true,
    },
    confianca: {
      type: Number, // 0 a 1
      required: true,
    },
    emocoes: [String], // ex: ['empolgação', 'alegria']
    girias_detectadas: [String], // ex: ['kkkk', 'slk', 'mt bom']
    contexto_geek: [String], // ex: ['anime', 'jogo']
  },
  toxico: {
    type: Boolean,
    default: false,
  },
  razaoToxicidade: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Índices para queries de relatório mais rápidas
mensagemSchema.index({ guildId: 1, timestamp: -1 });
mensagemSchema.index({ channelId: 1, timestamp: -1 });
mensagemSchema.index({ authorId: 1 });
mensagemSchema.index({ 'sentimento.tipo': 1 });

export const Mensagem = mongoose.model('Mensagem', mensagemSchema);
