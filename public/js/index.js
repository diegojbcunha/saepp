async function carregarUsuario() {
    try {
        const resp = await fetch('/api/usuario');
        if (resp.status === 401) window.location.href = '/login.html';
        const dados = await resp.json();
        document.getElementById('nomeUsuario').textContent += dados.nome;
    } catch (err) {
        window.location.href = '/login.html';
    }
}
carregarUsuario();