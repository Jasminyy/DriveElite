import express from "express";
import { favoritosController } from "../controllers/favoritos.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, favoritosController.getMeusFavoritos);
router.post("/", auth, favoritosController.addFavorito);
router.delete("/:id", auth, favoritosController.removeFavorito);

export default router;