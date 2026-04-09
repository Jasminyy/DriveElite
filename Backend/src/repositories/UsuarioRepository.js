class UsuarioRepository {
  constructor(db) {
    this.db = db;
  }

  // Verifica se o usuário já existe por Email ou CPF
  async verificarExistencia(nome, email, cpf, senha) {
    const query = 'SELECT id FROM usuarios WHERE email = ? OR cpf = ?';
    const [rows] = await this.db.query(query, [nome, email, cpf, senha]);
    return rows;
  }

  // Busca completa para o Login
  async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    const [rows] = await this.db.query(query, [email]);
    return rows[0];
  }

  // Lista simplificada para o Painel Admin
  async listarTodos() {
    const query = 'SELECT id, nome, email, cpf, role FROM usuarios';
    const [rows] = await this.db.query(query);
    return rows;
  }

  // O cadastro completo com todos os seus campos
  async criar(dados) {
    const { 
      nome, email, senha, cpf, pais, estado, cidade, 
      bairro, rua, numero, complemento, cep, telefone, role 
    } = dados;

    const query = `
      INSERT INTO usuarios 
      (nome, email, senha, cpf, pais, estado, cidade, bairro, rua, numero, complemento, cep, telefone, role) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nome, email, senha, cpf, pais, estado, cidade, 
      bairro, rua, numero, complemento || null, cep, telefone || null, role || 'user'
    ];
    
    const [result] = await this.db.query(query, values);
    return result.insertId;
  }
}

export default UsuarioRepository;