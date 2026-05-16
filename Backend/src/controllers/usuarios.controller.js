import db from '../config/db.js';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  cpf: Joi.string().required(), // Agora obrigatório conforme seu pedido
  // Todos os outros campos abaixo devem ser .optional() ou .allow(null, '')
  pais: Joi.string().optional(),
  estado: Joi.string().optional(),
  cidade: Joi.string().optional(),
  bairro: Joi.string().optional(),
  rua: Joi.string().optional(),
  numero: Joi.string().optional(),
  complemento: Joi.string().allow('', null),
  cep: Joi.string().optional(),
  telefone: Joi.string().optional()
});

export const usuariosController = {
  async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) return res.status(400).json({ erro: error.details[0].message });

      const {
        nome, email, senha, cpf
      } = value;

      // NOME DA TABELA AJUSTADO PARA 'usuarios'
      const [existing] = await db.query(
        'SELECT id FROM usuarios WHERE email = ? OR cpf = ?',
        [email, cpf]
      );
      if (existing.length) return res.status(409).json({ erro: 'Email ou CPF já cadastrado' });

      const hashed = await bcrypt.hash(senha, 10);

      const [result] = await db.query(
        `INSERT INTO usuarios (nome, email, senha, cpf, role) VALUES (?, ?, ?, ?, ?)`,
        [nome, email, hashed, cpf, 'user']
      );

res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
  res.status(500).json({ erro: 'Erro ao cadastrar', detalhes: err.message });
}
  },

  async login(req, res) {
  try {
    const { email, senha } = req.body;
    // NOME DA TABELA AJUSTADO PARA 'usuarios'
    const [rows] = await db.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login', detalhes: err.message });
  }
},

  async getAllUsers(req, res) {
  try {
    const [rows] = await db.query('SELECT id, nome, email, cpf, role FROM usuarios');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar usuários', detalhes: err.message });
  }
}
};

export default usuariosController;