import carroModel from '../models/carro.model.js';

export const carrosController = {
  // GET todos os carros
  async getAllCarros(req, res) {
    try {
      const { page, limit, marca, modelo, ano, precoMin, precoMax, disponivel } = req.query;
      const filtros = {
        page,
        limit,
        marca,
        modelo,
        ano: ano ? Number(ano) : undefined,
        precoMin: precoMin ? Number(precoMin) : undefined,
        precoMax: precoMax ? Number(precoMax) : undefined,
        disponivel: disponivel !== undefined ? (disponivel === 'true' || disponivel === '1') : undefined
      };

      const carros = await carroModel.findAll(filtros);
      res.status(200).json(carros);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar carros', detalhes: error.message });
    }
  },

  // GET carro por ID
  async getCarroById(req, res) {
    try {
      const { id } = req.params;
      const carro = await carroModel.findById(id);
      
      if (!carro) {
        return res.status(404).json({ erro: 'Carro não encontrado' });
      }
      
      res.status(200).json(carro);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar carro', detalhes: error.message });
    }
  },

  // POST criar novo carro
  async createCarro(req, res) {
    try {
      const { marca, modelo, ano, preco, descricao } = req.body;

      // Validação básica
      if (!marca || !modelo || !ano || !preco) {
        return res.status(400).json({ 
          erro: 'Campos obrigatórios faltando: marca, modelo, ano, preco' 
        });
      }

      if (preco < 0 || !Number.isInteger(ano) || ano < 1900) {
        return res.status(400).json({ 
          erro: 'Dados inválidos: preço deve ser positivo, ano deve ser válido' 
        });
      }

      const result = await carroModel.create(req.body);
      
      res.status(201).json({ 
        mensagem: 'Carro criado com sucesso',
        id: result.insertId
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar carro', detalhes: error.message });
    }
  },

  // PUT atualizar carro
  async updateCarro(req, res) {
    try {
      const { id } = req.params;
      const { marca, modelo, ano, preco, descricao, disponivel } = req.body;

      // Verificar se carro existe
      const carro = await carroModel.findById(id);
      if (!carro) {
        return res.status(404).json({ erro: 'Carro não encontrado' });
      }

      // Validação
      if (preco !== undefined && (preco < 0 || typeof preco !== 'number')) {
        return res.status(400).json({ erro: 'Preço inválido' });
      }

      await carroModel.update(id, req.body);
      
      res.status(200).json({ 
        mensagem: 'Carro atualizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar carro', detalhes: error.message });
    }
  },

  // DELETE carro
  async deleteCarro(req, res) {
    try {
      const { id } = req.params;

      // Verificar se carro existe
      const carro = await carroModel.findById(id);
      if (!carro) {
        return res.status(404).json({ erro: 'Carro não encontrado' });
      }

      await carroModel.delete(id);
      
      res.status(200).json({ 
        mensagem: 'Carro deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao deletar carro', detalhes: error.message });
    }
  }
};

export default carrosController;
