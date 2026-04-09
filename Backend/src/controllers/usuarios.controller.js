import db from '../config/db.js';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const registerSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(6).required(),
  cpf: Joi.string().required(),
  pais: Joi.string().required(),
  estado: Joi.string().required(),
  cidade: Joi.string().required(),
  bairro: Joi.string().required(),
  rua: Joi.string().required(),
  numero: Joi.string().required(),
  complemento: Joi.string().allow('', null),
  cep: Joi.string().required(),
  telefone: Joi.string().optional()
});

export const usuariosController = {
  async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) return res.status(400).json({ erro: error.details[0].message });

      const { 
        nome, email, senha, cpf, pais, estado, cidade, 
        bairro, rua, numero, complemento, cep, telefone 
      } = value;

      // NOME DA TABELA AJUSTADO PARA 'usuarios'
      const [existing] = await db.query(
        'SELECT id FROM usuarios WHERE email = ? OR cpf = ?', 
        [email, cpf]
      );
      if (existing.length) return res.status(409).json({ erro: 'Email ou CPF já cadastrado' });

      const hashed = await bcrypt.hash(senha, 10);

      const [result] = await db.query(
        `INSERT INTO usuarios 
        (nome, email, senha, cpf, pais, estado, cidade, bairro, rua, numero, complemento, cep, telefone, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nome, email, hashed, cpf, pais, estado, cidade, 
          bairro, rua, numero, complemento || null, cep, telefone || null, 'user'
        ]
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