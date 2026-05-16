import db from '../config/db.js';

export const favoritosController = {
    // Alinhando os nomes com o que você chamou na rota
    addFavorito: async (req, res) => {
        const { id_carro } = req.body;
        const id_usuario = req.user.id;

        try {
            await db.query("INSERT INTO favoritos (id_usuario, id_carro) VALUES (?, ?)", [id_usuario, id_carro]);
            res.status(201).json({ msg: "Carro favoritado com sucesso!" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getMeusFavoritos: async (req, res) => {
        const id_usuario = req.user.id;
        try {
            const [rows] = await db.query(
                "SELECT carros.* FROM favoritos JOIN carros ON favoritos.id_carro = carros.id WHERE favoritos.id_usuario = ?", 
                [id_usuario]
            );
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    removeFavorito: async (req, res) => {
        const { id } = req.params;
        const id_usuario = req.user.id;
        try {
            await db.query("DELETE FROM favoritos WHERE id = ? AND id_usuario = ?", [id, id_usuario]);
            res.json({ msg: "Removido dos favoritos" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};