let modalProduto;

document.addEventListener('DOMContentLoaded', () => {
    modalProduto = new bootstrap.Modal(document.getElementById('modalProduto'));
    carregarUsuario();
    carregarProdutos();
});

async function carregarUsuario() {
    const resp = await fetch('/api/usuario');
    if (resp.status === 401) window.location.href = '/login.html';
    const dados = await resp.json();
    document.getElementById('nomeUsuario').textContent = dados.nome;
}

async function carregarProdutos(termo = '') {
    const resp = await fetch(`/api/produtos?busca=${termo}`);
    const produtos = await resp.json();
    const tbody = document.getElementById('tabelaProdutos');
    tbody.innerHTML = produtos.map(p => `
        <tr>
            <td>${p.nome}</td>
            <td>${p.categoria}</td>
            <td>${p.tamanho || '-'}</td>
            <td>${p.estoque_atual}</td>
            <td>${p.estoque_minimo}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarProduto(${p.id}, '${p.nome.replace(/'/g, "\\'")}', '${(p.descricao || '').replace(/'/g, "\\'")}', '${p.categoria}', '${p.material_cabeca || ''}', '${p.material_cabo || ''}', ${p.revestimento_isolante}, ${p.ponta_imantada}, '${p.tamanho || ''}', ${p.peso}, ${p.estoque_minimo}, ${p.estoque_atual})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="excluirProduto(${p.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

function buscar() {
    const termo = document.getElementById('busca').value;
    carregarProdutos(termo);
}

function limparModal() {
    document.getElementById('modalTitulo').innerText = 'Novo Produto';
    document.getElementById('produtoId').value = '';
    document.getElementById('nome').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('material_cabeca').value = '';
    document.getElementById('material_cabo').value = '';
    document.getElementById('tamanho').value = '';
    document.getElementById('peso').value = '';
    document.getElementById('estoque_minimo').value = 5;
    document.getElementById('estoque_atual').value = 0;
    document.getElementById('revestimento_isolante').checked = false;
    document.getElementById('ponta_imantada').checked = false;
}

function editarProduto(id, nome, desc, cat, matCab, matCabo, revIso, pontaIm, tam, peso, estMin, estAtual) {
    document.getElementById('modalTitulo').innerText = 'Editar Produto';
    document.getElementById('produtoId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('categoria').value = cat;
    document.getElementById('descricao').value = desc;
    document.getElementById('material_cabeca').value = matCab;
    document.getElementById('material_cabo').value = matCabo;
    document.getElementById('tamanho').value = tam;
    document.getElementById('peso').value = peso;
    document.getElementById('estoque_minimo').value = estMin;
    document.getElementById('estoque_atual').value = estAtual;
    document.getElementById('revestimento_isolante').checked = revIso == 1;
    document.getElementById('ponta_imantada').checked = pontaIm == 1;
    modalProduto.show();
}

async function salvarProduto() {
    const id = document.getElementById('produtoId').value;
    const nome = document.getElementById('nome').value;
    const categoria = document.getElementById('categoria').value;
    if (!nome || !categoria) {
        alert('Nome e categoria são obrigatórios.');
        return;
    }
    const produto = {
        nome,
        descricao: document.getElementById('descricao').value,
        categoria,
        material_cabeca: document.getElementById('material_cabeca').value,
        material_cabo: document.getElementById('material_cabo').value,
        revestimento_isolante: document.getElementById('revestimento_isolante').checked,
        ponta_imantada: document.getElementById('ponta_imantada').checked,
        tamanho: document.getElementById('tamanho').value,
        peso: document.getElementById('peso').value,
        estoque_minimo: document.getElementById('estoque_minimo').value,
        estoque_atual: document.getElementById('estoque_atual').value
    };

    const url = id ? `/api/produtos/${id}` : '/api/produtos';
    const metodo = id ? 'PUT' : 'POST';
    const resp = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
    });
    const resultado = await resp.json();
    if (resultado.sucesso) {
        modalProduto.hide();
        carregarProdutos();
    } else {
        alert(resultado.mensagem || 'Erro ao salvar.');
    }
}

async function excluirProduto(id) {
    if (!confirm('Deseja realmente excluir?')) return;
    const resp = await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
    const resultado = await resp.json();
    if (resultado.sucesso) {
        carregarProdutos();
    } else {
        alert(resultado.mensagem || 'Erro ao excluir.');
    }
}