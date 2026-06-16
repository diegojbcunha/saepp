const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');
const estoqueRoutes = require('./routes/estoque');

const app = express();

// Configuração para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sessão
app.use(session({
  secret: 'saep_chave_secreta_2024',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hora
}));

// Middleware para verificar login nas rotas da API
function verificarAutenticacao(req, res, next) {
  if (req.session.usuario) {
    return next();
  }
  res.status(401).json({ erro: 'Não autorizado' });
}

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/produtos', verificarAutenticacao, produtosRoutes);
app.use('/api/estoque', verificarAutenticacao, estoqueRoutes);

// Rota para obter dados do usuário logado
app.get('/api/usuario', verificarAutenticacao, (req, res) => {
  res.json({ nome: req.session.usuario.nome });
});

// Redirecionar raiz para index.html (após login)
app.get('/', (req, res) => {
  if (req.session.usuario) {
    res.redirect('/index.html');
  } else {
    res.redirect('/login.html');
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/login.html`);
});