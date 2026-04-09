import { vendaModel } from '../models/venda.model.js';

export const vendasController = {
  // 1. Listar todas as vendas
  async getAllVendas(req, res) {
    try {
      const { page, limit } = req.query;
      const vendas = await vendaModel.findAll({ page, limit });
      res.json(vendas);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar vendas', detalhes: err.message });
    }
  },

  // 2. Buscar por ID
  async getVendaById(req, res) {
    try {
      const { id } = req.params;
      const venda = await vendaModel.findById(id);
      if (!venda) return res.status(404).json({ erro: 'Venda não encontrada' });
      res.json(venda);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar venda', detalhes: err.message });
    }
  },

  // 3. Buscar vendas de um usuário específico
  async getVendasByUser(req, res) {
    try {
      const { usuario_id } = req.params;
      const vendas = await vendaModel.findByUserId(usuario_id);
      res.json(vendas);
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao buscar vendas do usuário', detalhes: err.message });
    }
  },

  // 4. Criar venda
  async createVenda(req, res) {
    try {
      const usuario_id = req.user.id; // Pega do token
      const { carro_id, preco_venda } = req.body;
      const result = await vendaModel.create({ usuario_id, carro_id, preco_venda });
      res.status(201).json({ mensagem: 'Pedido realizado com sucesso!', id: result.insertId });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao processar venda', detalhes: err.message });
    }
  },

  // 5. Atualizar Status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { id_status } = req.body;
      const result = await vendaModel.updateStatus(id, id_status);
      res.json({ mensagem: 'Status atualizado com sucesso!' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao atualizar status', detalhes: err.message });
    }
  },

  // 6. Deletar Venda (Faltava esta função!)
  async deleteVenda(req, res) {
    try {
      const { id } = req.params;
      await vendaModel.delete(id); // Verifique se tem o .delete no seu venda.model.js
      res.json({ mensagem: 'Venda removida com sucesso' });
    } catch (err) {
      res.status(500).json({ erro: 'Erro ao deletar venda', detalhes: err.message });
    }
  }
};