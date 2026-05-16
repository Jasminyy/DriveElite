import express from "express";
import { carrosController } from "../controllers/carros.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", carrosController.getAllCarros);
router.get("/:id", carrosController.getCarroById);

// PROTEÇÃO ADMIN
router.post("/", verifyToken, isAdmin, carrosController.createCarro);
router.put("/:id", verifyToken, isAdmin, carrosController.updateCarro);
router.delete("/:id", verifyToken, isAdmin, carrosController.deleteCarro);

export default router;