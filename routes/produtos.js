const express = require('express');
const router = express.Router();
const pool = require('../database');

// Listar produtos (com busca)
router.get('/', async (req, res) => {
  const termo = req.query.busca || '';
  try {
    let query = 'SELECT * FROM produtos';
    let params = [];
    if (termo) {
      query += ' WHERE nome LIKE ? OR categoria LIKE ? OR descricao LIKE ?';
      const likeTermo = `%${termo}%`;
      params = [likeTermo, likeTermo, likeTermo];
    }
    query += ' ORDER BY nome ASC';
    const [produtos] = await pool.query(query, params);
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar produtos' });
  }
});

// Cadastrar
router.post('/', async (req, res) => {
  const { nome, descricao, categoria, material_cabeca, material_cabo, revestimento_isolante, ponta_imantada, tamanho, peso, estoque_minimo, estoque_atual } = req.body;
  if (!nome || !categoria) {
    return res.json({ sucesso: false, mensagem: 'Nome e categoria obrigatórios.' });
  }
  try {
    await pool.query(
      `INSERT INTO produtos (nome, descricao, categoria, material_cabeca, material_cabo, revestimento_isolante, ponta_imantada, tamanho, peso, estoque_minimo, estoque_atual)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, descricao, categoria, material_cabeca || null, material_cabo || null,
       revestimento_isolante ? 1 : 0, ponta_imantada ? 1 : 0,
       tamanho || null, peso || 0, estoque_minimo || 5, estoque_atual || 0]
    );
    res.json({ sucesso: true });
  } catch (err) {
    res.json({ sucesso: false, mensagem: 'Erro ao cadastrar.' });
  }
});

// Editar
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, categoria, material_cabeca, material_cabo, revestimento_isolante, ponta_imantada, tamanho, peso, estoque_minimo, estoque_atual } = req.body;
  if (!nome || !categoria) {
    return res.json({ sucesso: false, mensagem: 'Nome e categoria obrigatórios.' });
  }
  try {
    await pool.query(
      `UPDATE produtos SET nome=?, descricao=?, categoria=?, material_cabeca=?, material_cabo=?,
       revestimento_isolante=?, ponta_imantada=?, tamanho=?, peso=?, estoque_minimo=?, estoque_atual=? WHERE id=?`,
      [nome, descricao, categoria, material_cabeca || null, material_cabo || null,
       revestimento_isolante ? 1 : 0, ponta_imantada ? 1 : 0,
       tamanho || null, peso || 0, estoque_minimo || 5, estoque_atual || 0, id]
    );
    res.json({ sucesso: true });
  } catch (err) {
    res.json({ sucesso: false, mensagem: 'Erro ao editar.' });
  }
});

// Excluir
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM produtos WHERE id = ?', [id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.json({ sucesso: false, mensagem: 'Erro ao excluir. Talvez haja movimentações vinculadas.' });
  }
});

module.exports = router;