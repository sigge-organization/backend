// src/server.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRoutes } from './routes/userRoutes'; // Ajustado sem o .js se preferir o padrão TS

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS baseada no seu projeto de referência
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', // Adicionado padrão do Vite
    // Adicione aqui os domínios do seu novo projeto SIGGE quando fizer o deploy
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Essencial para cookies funcionarem
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Rotas da aplicação SIGGE
app.use('/users', userRoutes);

// Placeholder para futuras rotas que você criar (Groups, Events, etc)
// app.use('/groups', groupRoutes);
// app.use('/events', eventRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor SIGGE rodando na porta ${PORT}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Link local: http://localhost:${PORT}`);
  }
});