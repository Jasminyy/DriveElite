import 'dotenv/config';
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido no .env');
}

import db, { testConnection } from './src/config/db.js';
import usuariosRoutes from "./src/routes/usuarios.routes.js";
import carrosRoutes from "./src/routes/carros.routes.js";
import vendasRoutes from "./src/routes/vendas.routes.js";
import favoritosRoutes from "./src/routes/favoritos.routes.js"; 

import UsuarioRepository from './src/repositories/UsuarioRepository.js';
import CarroRepository from './src/repositories/CarroRepository.js';
import VendaRepository from './src/repositories/VendaRepository.js'

import cors from 'cors';
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use("/images", express.static(path.join(__dirname, "public/carros")));
app.use("/carros", express.static("public/carros"))

app.locals.db = db;

// Rotas Base
app.get('/', (req, res) => {
  res.status(200).send('Servidor do DriveElite rodando!');
});

app.get('/status', (req, res) => {
  res.status(200).json({
    projeto: 'Loja de carros de Luxo',
    nome: 'DriveElite',
    status: 'Em desenvolvimento',
    versao: '1.0.0',
    dataDeLancamentoPrevisto: '2026-04-22'
  });
});

// 2. Registro das Rotas Principais
app.use("/usuarios", usuariosRoutes);
app.use("/carros", carrosRoutes);
app.use("/vendas", vendasRoutes);
// 3. Nova rota de favoritos adicionada aqui
app.use("/favoritos", favoritosRoutes); 

app.use((req, res) => {
  res.status(404).send('Rota não encontrada');
});

app.use(errorHandler);

 // Instanciamos os repositórios UMA VEZ e guardamos no app.locals
 app.locals.usuariosRepo = new UsuarioRepository(db);
 app.locals.carrosRepo = new CarroRepository(db);
 app.locals.vendasRepo = new VendaRepository(db);

// Inicia o servidor APENAS após conectar ao banco
async function startServer() {
  const dbConnected = await testConnection();

  if (!dbConnected) {
    console.error('❌ Não foi possível conectar ao banco. Servidor não iniciado.');
    process.exit(1);
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor DriveElite rodando na porta ${PORT}`);
  })
};

startServer();