import mongoose from 'mongoose';

export async function conectarMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas conectado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB desconectado. Tentando reconectar...');
});

mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB reconectado!');
});
