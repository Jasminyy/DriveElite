import express from "express";
import { vendasController } from "../controllers/vendas.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// Todas as funções abaixo devem existir no vendasController
router.get("/", auth, vendasController.getAllVendas);
router.get("/:id", auth, vendasController.getVendaById);
router.get("/usuario/:usuario_id", auth, vendasController.getVendasByUser);
router.post("/", auth, vendasController.createVenda);
router.patch("/:id/status", auth, vendasController.updateStatus);
router.delete("/:id", auth, vendasController.deleteVenda);

export default router;