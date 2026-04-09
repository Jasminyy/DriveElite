import db from '../config/db.js';

export const vendaModel = {
  // 1. Buscar TODAS as vendas (Visão do Admin/Professor)
  async findAll(options = {}) {
    const { page = 1, limit = 20 } = options;
    const lim = Number(limit) || 20;
    const pg = Math.max(Number(page) || 1, 1);

    const [vendas] = await db.query(
      `SELECT v.id, v.usuario_id, v.carro_id, v.preco_venda, v.data_venda, v.id_status,
        u.nome as usuario_nome, c.marca, c.modelo 
       FROM vendas v
       JOIN usuarios u ON v.usuario_id = u.id
       JOIN carros c ON v.carro_id = c.id
       ORDER BY v.data_venda DESC
       LIMIT ? OFFSET ?`,
      [lim, (pg - 1) * lim]
    );
    return vendas;
  },

  // 2. Buscar uma venda específica por ID
  async findById(id) {
    const [venda] = await db.query(
      `SELECT v.id, v.usuario_id, v.carro_id, v.preco_venda, v.data_venda, v.id_status,
       u.nome as usuario_nome, c.marca, c.modelo
       FROM vendas v
       JOIN usuarios u ON v.usuario_id = u.id
       JOIN carros c ON v.carro_id = c.id
       WHERE v.id = ?`,
      [id]
    );
    return venda[0];
  },

  // 3. Buscar vendas de um usuário específico (Visão do Aluno)
  async findByUserId(usuario_id) {
    const [vendas] = await db.query(
      `SELECT v.id, v.usuario_id, v.carro_id, v.preco_venda, v.data_venda, v.id_status,
              c.marca, c.modelo
       FROM vendas v
       JOIN carros c ON v.carro_id = c.id
       WHERE v.usuario_id = ?
       ORDER BY v.data_venda DESC`,
      [usuario_id]
    );
    return vendas;
  },

  // 4. Criar nova venda (O Aluno faz o pedido)
  // Nota: id_status começa como 1 (Pendente) por padrão
  async create(dados) {
    const { usuario_id, carro_id, preco_venda } = dados;
    const [result] = await db.query(
      'INSERT INTO vendas (usuario_id, carro_id, preco_venda, data_venda, id_status) VALUES (?, ?, ?, NOW(), 1)',
      [usuario_id, carro_id, preco_venda]
    );
    return result;
  },

  // 5. Atualizar dados gerais da venda
  async update(id, dados) {
    const { usuario_id, carro_id, preco_venda, id_status } = dados;
    const [result] = await db.query(
      'UPDATE vendas SET usuario_id = ?, carro_id = ?, preco_venda = ?, id_status = ? WHERE id = ?',
      [usuario_id, carro_id, preco_venda, id_status, id]
    );
    return result;
  },

  // 6. Atualizar APENAS o Status (Ação principal do Admin)
  async updateStatus(id, id_status) {
    const [result] = await db.query(
      'UPDATE vendas SET id_status = ? WHERE id = ?',
      [id_status, id]
    );
    return result;
  },

  // 7. Deletar venda
  async delete(id) {
    const [result] = await db.query(
      'DELETE FROM vendas WHERE id = ?',
      [id]
    );
    return result;
  }
};

export default vendaModel;