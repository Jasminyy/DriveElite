import express from "express";
import { usuariosController } from "../controllers/usuarios.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js"; // Importe ambos

const router = express.Router();

// 1. Rotas Públicas (Ninguém precisa de token para se cadastrar ou logar)
router.post('/register', usuariosController.register);
router.post('/login', usuariosController.login);

router.get('/me', verifyToken, usuariosController.getMe);
router.put('/me', verifyToken, usuariosController.updateMe);
router.put('/endereco', verifyToken, usuariosController.updateEndereco);
router.patch('/me/senha', verifyToken, usuariosController.changePassword);
router.get('/me/compras', verifyToken, usuariosController.getMyPurchases);
router.get('/me/avaliacoes', verifyToken, usuariosController.getMyReviews);

// 2. Rotas Protegidas (Apenas Admin/Professor pode listar todos os usuários)
// Usei o verifyToken primeiro e o isAdmin logo em seguida
router.get('/', verifyToken, isAdmin, usuariosController.getAllUsers);

export default router;
