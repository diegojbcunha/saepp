const express = require('express');
const router = express.Router();
const pool = require('../database');

// Bubble sort
function bubbleSort(produtos) {
  let n = produtos.length;
  let swapped;
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (produtos[j].nome.toLowerCase() > produtos[j + 1].nome.toLowerCase()) {
        let temp = produtos[j];
        produtos[j] = produtos[j + 1];
        produtos[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return produtos;
}

// Listar produtos ordenados
router.get('/', async (req, res) => {
  try {
    const [produtos] = await pool.query('SELECT * FROM produtos');
    const ordenados = bubbleSort(produtos);
    res.json(ordenados);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao carregar estoque' });
  }
});

// Movimentar
router.post('/movimentar', async (req, res) => {
  const { produto_id, tipo, quantidade, data_mov, observacao } = req.body;
  const usuario_id = req.session.usuario.id;
  if (!produto_id || !tipo || !quantidade || !data_mov) {
    return res.json({ sucesso: false, mensagem: 'Preencha todos os campos obrigatórios.' });
  }
  try {
    const [produtos] = await pool.query('SELECT * FROM produtos WHERE id = ?', [produto_id]);
    if (produtos.length === 0) return res.json({ sucesso: false, mensagem: 'Produto não encontrado.' });
    const produto = produtos[0];
    let novoEstoque = produto.estoque_atual;

    if (tipo === 'entrada') {
      novoEstoque += parseInt(quantidade);
    } else if (tipo === 'saida') {
      if (parseInt(quantidade) > produto.estoque_atual) {
        return res.json({ sucesso: false, mensagem: 'Quantidade de saída maior que o estoque disponível!' });
      }
      novoEstoque -= parseInt(quantidade);
    }

    await pool.query('UPDATE produtos SET estoque_atual = ? WHERE id = ?', [novoEstoque, produto_id]);
    await pool.query(
      'INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data_mov, observacao) VALUES (?, ?, ?, ?, ?, ?)',
      [produto_id, usuario_id, tipo, parseInt(quantidade), data_mov, observacao || '']
    );

    let alerta = null;
    if (novoEstoque < produto.estoque_minimo) {
      alerta = `ALERTA: O produto "${produto.nome}" está com estoque abaixo do mínimo! (Atual: ${novoEstoque}, Mínimo: ${produto.estoque_minimo})`;
    }

    // Retorna sucesso e alerta
    res.json({ sucesso: true, alerta });
  } catch (err) {
    console.log(err);
    res.json({ sucesso: false, mensagem: 'Erro ao processar movimentação.' });
  }
});

module.exports = router;