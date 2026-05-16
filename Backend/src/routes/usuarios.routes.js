import express from "express";
import { usuariosController } from "../controllers/usuarios.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js"; // Importe ambos

const router = express.Router();

// 1. Rotas Públicas (Ninguém precisa de token para se cadastrar ou logar)
router.post('/register', usuariosController.register);
router.post('/login', usuariosController.login);

// 2. Rotas Protegidas (Apenas Admin/Professor pode listar todos os usuários)
// Usamos o verifyToken primeiro e o isAdmin logo em seguida
router.get('/', verifyToken, isAdmin, usuariosController.getAllUsers);

export default router;