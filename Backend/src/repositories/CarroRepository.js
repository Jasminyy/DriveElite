class CarroRepository {
  constructor(db) {
    this.db = db;
  }

  async listarTodos() {
    const [rows] = await this.db.query('SELECT * FROM carros');
    return rows;
  }

  async buscarPorId(id) {
    const [rows] = await this.db.query(
      'SELECT * FROM carros WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  async atualizarStatus(id, status_id) {
    await this.db.query(
      'UPDATE carros SET status_id = ? WHERE id = ?',
      [status_id, id]
    );
  }
}

export default CarroRepository;