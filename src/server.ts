import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRoutes } from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3333;

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor SIGGE rodando na porta ${PORT}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Link local: http://localhost:${PORT}`);
  }
});