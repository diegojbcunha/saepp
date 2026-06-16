const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../database');

router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    
    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (rows.length === 0) {
            return res.json({ 
                sucesso: false, 
                mensagem: 'E-mail nao encontrado.' 
            });
        }
        
        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.json({ 
                sucesso: false, 
                mensagem: 'Senha incorreta.' 
            });
        }
        
        req.session.usuario = { 
            id: usuario.id, 
            nome: usuario.nome, 
            email: usuario.email 
        };
        
        return res.json({ sucesso: true });
        
    } catch (err) {
        console.error('Erro no login:', err);
        return res.json({ sucesso: false, mensagem: 'Erro no servidor.' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

module.exports = router;