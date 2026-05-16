import db from '../config/db.js';

export const carroModel = {

  // Buscar todos os carros
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 20,
      marca,
      modelo,
      ano,
      precoMin,
      precoMax,
      categoria,
      busca,
      ordem
    } = options;

    let sql = 'SELECT id, marca, modelo, ano, preco, quilometragem, motor, cambio, categoria, cor, descricao, imagem, status_id, velocidade_max FROM carros';
    const where = [];
    const params = [];

    // Melhorei a busca por categoria para ser mais precisa
    if (marca) { where.push('marca = ?'); params.push(marca); }
    if (modelo) { where.push('modelo = ?'); params.push(modelo); }
    if (ano) { where.push('ano = ?'); params.push(ano); }
    if (precoMin !== undefined) { where.push('preco >= ?'); params.push(precoMin); }
    if (precoMax !== undefined) { where.push('preco <= ?'); params.push(precoMax); }
    if (categoria) { where.push('LOWER(TRIM(categoria)) = LOWER(TRIM(?))'); params.push(categoria); }
    if (busca) { where.push('(LOWER(marca) LIKE LOWER(?) OR LOWER(modelo) LIKE LOWER(?))'); params.push(`%${busca}%`, `%${busca}%`);}

    if (where.length) sql += ' WHERE ' + where.join(' AND ');

    // Agora o options.ordem vai funcionar!
    if (ordem === 'maior_preco') {
      sql += ' ORDER BY preco DESC';
    } else if (ordem === 'menor_preco') {
      sql += ' ORDER BY preco ASC';
    } else {
      sql += ' ORDER BY id DESC'; // Ordem padrão
    }

    const lim = Number(limit) || 20;
    const pg = Math.max(Number(page) || 1, 1);

    sql += ' LIMIT ? OFFSET ?';
    params.push(lim, (pg - 1) * lim);

    const [carros] = await db.query(sql, params);
    return carros;
  },

  // Buscar carro por ID
  async findById(id) {
    const [carro] = await db.query(
      'SELECT * FROM carros WHERE id = ?',
      [id]
    );

    return carro[0];
  },

  // Criar novo carro
  async create(dados) {

    const {
      marca,
      modelo,
      ano,
      preco,
      quilometragem,
      motor,
      cambio,
      categoria,
      cor,
      descricao,
      imagem,
      status_id,
      velocidade_max
    } = dados;

    const [result] = await db.query(
      `INSERT INTO carros 
      (marca, modelo, ano, preco, quilometragem, motor, cambio, categoria, cor, descricao, imagem, status_id, velocidade_max) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        marca,
        modelo,
        ano,
        preco,
        quilometragem,
        motor,
        cambio,
        categoria,
        cor,
        descricao,
        imagem,
        status_id,
        velocidade_max
      ]
    );

    return result;
  },

  // Atualizar carro
  async update(id, dados) {

    const {
      marca,
      modelo,
      ano,
      preco,
      quilometragem,
      motor,
      cambio,
      categoria,
      cor,
      descricao,
      imagem,
      status_id,
      velocidade_max
    } = dados;

    const [result] = await db.query(
      `UPDATE carros SET 
      marca = ?, 
      modelo = ?, 
      ano = ?, 
      preco = ?, 
      quilometragem = ?, 
      motor = ?, 
      cambio = ?, 
      categoria = ?, 
      cor = ?, 
      descricao = ?, 
      imagem = ?, 
      status_id = ?,
      velocidade_max = ?
      WHERE id = ?`,
      [
        marca,
        modelo,
        ano,
        preco,
        quilometragem,
        motor,
        cambio,
        categoria,
        cor,
        descricao,
        imagem,
        status_id,
        velocidade_max,
        id
      ]
    );

    return result;
  },

  // Deletar carro
  async delete(id) {

    const [result] = await db.query(
      'DELETE FROM carros WHERE id = ?',
      [id]
    );

    return result;

  }

};

export default carroModel;