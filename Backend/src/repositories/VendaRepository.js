class VendaRepository {
  constructor(db) {
    this.db = db;
  }

  async registrarVenda(usuarioId, carroId, valorTotal) {
    const query = 'INSERT INTO vendas (usuario_id, carro_id, valor_total, data_venda) VALUES (?, ?, ?, NOW())';
    const [result] = await this.db.query(query, [usuarioId, carroId, valorTotal]);
    return result.insertId;
  }

  async listarVendasPorUsuario(usuarioId) {
    const query = `
      SELECT v.*, c.modelo, c.marca 
      FROM vendas v 
      JOIN carros c ON v.carro_id = c.id 
      WHERE v.usuario_id = ?`;
    const [rows] = await this.db.query(query, [usuarioId]);
    return rows;
  }
}

export default VendaRepository;