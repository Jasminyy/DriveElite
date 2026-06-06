import db from '../config/db.js';
 
 export const favoritosController = {
     addFavorito: async (req, res) => {
         const { id_carro } = req.body;
         const id_usuario = req.user.id;
 
        if (!id_carro) {
            return res.status(400).json({ erro: 'Informe o veículo para favoritar' });
        }

         try {
            const [existing] = await db.query(
                'SELECT id FROM favoritos WHERE id_usuario = ? AND id_carro = ?',
                [id_usuario, id_carro]
            );

            if (existing.length) {
                return res.status(200).json({ msg: 'Carro já estava nos favoritos', favorito_id: existing[0].id });
            }

            const [result] = await db.query(
                'INSERT INTO favoritos (id_usuario, id_carro) VALUES (?, ?)',
                [id_usuario, id_carro]
            );

            res.status(201).json({ msg: 'Carro favoritado com sucesso!', favorito_id: result.insertId });
         } catch (error) {
            res.status(500).json({ erro: 'Erro ao favoritar carro', detalhes: error.message });
         }
     },
 
     getMeusFavoritos: async (req, res) => {
         const id_usuario = req.user.id;
         try {
             const [rows] = await db.query(
                `SELECT favoritos.id AS favorito_id, carros.*
                 FROM favoritos
                 JOIN carros ON favoritos.id_carro = carros.id
                 WHERE favoritos.id_usuario = ?
                 ORDER BY favoritos.id DESC`,
                 [id_usuario]
             );
             res.json(rows);
         } catch (error) {
           res.status(500).json({ erro: 'Erro ao buscar favoritos', detalhes: error.message });
         }
     },
 
     removeFavorito: async (req, res) => {
         const { id } = req.params;
         const id_usuario = req.user.id;
         try {
            const [result] = await db.query(
                'DELETE FROM favoritos WHERE id_usuario = ? AND (id = ? OR id_carro = ?)',
                [id_usuario, id, id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ erro: 'Favorito não encontrado' });
            }

            res.json({ msg: 'Removido dos favoritos' });
         } catch (error) {
            res.status(500).json({ erro: 'Erro ao remover favorito', detalhes: error.message });
         }
     }

};
