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
  telefone: Joi.string().allow('', null).optional()
});

const updateProfileSchema = Joi.object({
  nome: Joi.string().min(2).max(100).required(),
  telefone: Joi.string().allow('', null).optional(),
  pais: Joi.string().allow('', null).optional(),
  estado: Joi.string().allow('', null).optional(),
  cidade: Joi.string().allow('', null).optional(),
  bairro: Joi.string().allow('', null).optional(),
  rua: Joi.string().allow('', null).optional(),
  numero: Joi.string().allow('', null).optional(),
  complemento: Joi.string().allow('', null).optional(),
  cep: Joi.string().allow('', null).optional()
});

const changePasswordSchema = Joi.object({
  senhaAtual: Joi.string().required(),
  novaSenha: Joi.string().min(6).required()
});

const updateEnderecoSchema = Joi.object({
  rua: Joi.string().allow('', null).optional(),
  numero: Joi.string().allow('', null).optional(),
  bairro: Joi.string().allow('', null).optional(),
  cidade: Joi.string().allow('', null).optional(),
  estado: Joi.string().allow('', null).optional(),
  cep: Joi.string().allow('', null).optional()
});

const publicUserFields = `
  id, nome, email, cpf, telefone, role, created_at,
  pais, estado, cidade, bairro, rua, numero, complemento, cep
`;

export const usuariosController = {
  async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) return res.status(400).json({ erro: error.details[0].message });

      const {
        nome, email, senha, cpf, pais, estado, cidade,
        bairro, rua, numero, complemento, cep, telefone
      } = value;


      const [existing] = await db.query(
        'SELECT id FROM usuarios WHERE email = ? OR cpf = ?', [email, cpf]
      );
      if (existing.length) return res.status(409).json({ erro: 'Email ou CPF já cadastrado' });

      const hashed = await bcrypt.hash(senha, 10);

      const [result] = await db.query(
        `INSERT INTO usuarios
        (nome, email, senha, cpf, pais, estado, cidade, bairro, rua, numero, complemento, cep, telefone, role)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [nome, email, hashed, cpf, pais, estado, cidade,
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

      res.json({
        token,
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          role: user.role
        }
      });
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
  },

  async getMe(req, res) {
    try {
      const [rows] = await db.query(`SELECT ${publicUserFields} FROM usuarios WHERE id = ?`, [req.user.id]);
      const user = rows[0];

      if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

      res.json(user);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar perfil', detalhes: err.message });
    }
  },

  async updateMe(req, res) {
    try {
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) return res.status(400).json({ erro: error.details[0].message });

      const {
        nome, telefone, pais, estado, cidade,
        bairro, rua, numero, complemento, cep
      } = value;

      await db.query(
        `UPDATE usuarios
         SET nome = ?, telefone = ?, pais = ?, estado = ?, cidade = ?,
             bairro = ?, rua = ?, numero = ?, complemento = ?, cep = ?
         WHERE id = ?`,
        [
          nome, telefone || null, pais || null, estado || null, cidade || null,
          bairro || null, rua || null, numero || null, complemento || null, cep || null,
          req.user.id
        ]
      );

      const [rows] = await db.query(`SELECT ${publicUserFields} FROM usuarios WHERE id = ?`, [req.user.id]);
      res.json({ mensagem: 'Perfil atualizado com sucesso!', usuario: rows[0] });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar perfil', detalhes: err.message });
    }
  },

  async changePassword(req, res) {
    try {
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) return res.status(400).json({ erro: error.details[0].message });

      const [rows] = await db.query('SELECT senha FROM usuarios WHERE id = ?', [req.user.id]);
      const user = rows[0];

      if (!user) return res.status(404).json({ erro: 'Usuário não encontrado' });

      const senhaConfere = await bcrypt.compare(value.senhaAtual, user.senha);
      if (!senhaConfere) return res.status(401).json({ erro: 'Senha atual incorreta' });

      const hashed = await bcrypt.hash(value.novaSenha, 10);
      await db.query('UPDATE usuarios SET senha = ? WHERE id = ?', [hashed, req.user.id]);

      res.json({ mensagem: 'Senha alterada com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao alterar senha', detalhes: err.message });
    }
  },

updateEndereco: async (req, res) => {

  const id = req.user.id

  const {
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep
  } = req.body

  try {

    await db.query(
      `
      UPDATE usuarios
      SET
        rua = ?,
        numero = ?,
        bairro = ?,
        cidade = ?,
        estado = ?,
        cep = ?
      WHERE id = ?
      `,
      [
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        id
      ]
    )

    res.json({
      msg: "Endereço atualizado!"
    })

  } catch (error) {

    res.status(500).json({
      erro: "Erro ao atualizar endereço",
      detalhes: error.message
    })

  }

},

  async getMyPurchases(req, res) {
    try {
      const [rows] = await db.query(
        `SELECT v.*, c.marca, c.modelo, c.ano, c.preco AS preco_atual, c.imagem
         FROM vendas v
         JOIN carros c ON v.carro_id = c.id
         WHERE v.usuario_id = ?
         ORDER BY v.data_venda DESC`,
        [req.user.id]
      );

      res.json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar histórico de compras', detalhes: err.message });
    }
  },

  async getMyReviews(req, res) {
    try {
      const [rows] = await db.query(
        `SELECT a.id, a.usuario_id, a.carro_id, a.nota, a.comentario,
                c.marca, c.modelo, c.ano, c.imagem
         FROM avaliacoes a
         LEFT JOIN carros c ON a.carro_id = c.id
         WHERE a.usuario_id = ?
         ORDER BY a.id DESC`,
        [req.user.id]
      );

      res.json(rows);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar avaliações', detalhes: err.message });
    }
  }
};
