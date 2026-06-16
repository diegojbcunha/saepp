document.addEventListener('DOMContentLoaded', () => {
    carregarUsuario();
    carregarEstoque();
});

async function carregarUsuario() {
    const resp = await fetch('/api/usuario');
    if (resp.status === 401) window.location.href = '/login.html';
    const dados = await resp.json();
    document.getElementById('nomeUsuario').textContent = dados.nome;
}

async function carregarEstoque() {
    const resp = await fetch('/api/estoque');
    const produtos = await resp.json();
    const tbody = document.getElementById('tabelaEstoque');
    tbody.innerHTML = produtos.map(p => `
        <tr class="${p.estoque_atual < p.estoque_minimo ? 'table-warning' : ''}">
            <td>${p.nome}</td>
            <td>${p.estoque_atual}</td>
            <td>${p.estoque_minimo}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="selecionarProduto(${p.id}, '${p.nome.replace(/'/g, "\\'")}')">Selecionar</button>
            </td>
        </tr>
    `).join('');
}

function selecionarProduto(id, nome) {
    document.getElementById('produtoIdMov').value = id;
    document.getElementById('nomeProdutoMov').value = nome;
}

async function registrarMovimentacao() {
    const produto_id = document.getElementById('produtoIdMov').value;
    const tipo = document.getElementById('tipoMov').value;
    const quantidade = document.getElementById('quantidadeMov').value;
    const data_mov = document.getElementById('dataMov').value;
    const observacao = document.getElementById('obsMov').value;

    if (!produto_id || !tipo || !quantidade || !data_mov) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    const resp = await fetch('/api/estoque/movimentar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produto_id, tipo, quantidade, data_mov, observacao })
    });
    const resultado = await resp.json();
    if (resultado.sucesso) {
        if (resultado.alerta) {
            document.getElementById('alertaMensagem').textContent = '⚠️ ' + resultado.alerta;
            document.getElementById('alertaDiv').style.display = 'block';
        } else {
            document.getElementById('alertaDiv').style.display = 'none';
        }
        carregarEstoque();
        // Limpar formulário
        document.getElementById('produtoIdMov').value = '';
        document.getElementById('nomeProdutoMov').value = '';
        document.getElementById('tipoMov').value = '';
        document.getElementById('quantidadeMov').value = '';
        document.getElementById('dataMov').value = '';
        document.getElementById('obsMov').value = '';
    } else {
        alert(resultado.mensagem || 'Erro na movimentação.');
    }
}