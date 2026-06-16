document.getElementById('formLogin').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const resposta = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    const dados = await resposta.json();
    if (dados.sucesso) {
        window.location.href = '/index.html';
    } else {
        const erroDiv = document.getElementById('erro');
        erroDiv.textContent = dados.mensagem;
        erroDiv.style.display = 'block';
    }
});