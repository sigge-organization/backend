import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';
import { userRoutes } from './routes/userRoutes';
import { studentGroupRoutes } from './routes/studentGroupRoutes';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3333;

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL || '',
  ].filter(Boolean),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const io = new Server(server, {
  cors: corsOptions
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Novo usuário conectado via WebSocket: ${socket.id}`);

  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    console.log(`👤 Usuário ${socket.id} entrou na sala do grupo: ${groupId}`);
  });

  socket.on('leave_group', (groupId) => {
    socket.leave(groupId);
    console.log(`👋 Usuário ${socket.id} saiu da sala do grupo: ${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Usuário desconectado: ${socket.id}`);
  });
});

app.use('/users', userRoutes);
app.use('/student-groups', studentGroupRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Servidor SIGGE rodando na porta ${PORT} (com WebSockets)`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Link local: http://localhost:${PORT}`);
  }
});

function gracefulShutdown() {
  console.log('🔄 Desligando o servidor...');
  io.close(() => {
    server.close(() => {
      console.log('✅ Servidor desligado com sucesso.');
      process.exit(0);
    });
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);