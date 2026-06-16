-- Banco de dados: saep_db
CREATE DATABASE IF NOT EXISTS saep_db;
USE saep_db;

DROP TABLE IF EXISTS movimentacoes;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) NOT NULL,
    material_cabeca VARCHAR(50),
    material_cabo VARCHAR(50),
    revestimento_isolante BOOLEAN DEFAULT FALSE,
    ponta_imantada BOOLEAN DEFAULT FALSE,
    tamanho VARCHAR(30),
    peso DECIMAL(8,2),
    estoque_atual INT DEFAULT 0,
    estoque_minimo INT DEFAULT 5
);

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    tipo ENUM('entrada','saida') NOT NULL,
    quantidade INT NOT NULL CHECK (quantidade > 0),
    data_mov DATE NOT NULL,
    observacao TEXT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Inserts iniciais
INSERT INTO usuarios (nome, email, senha) VALUES 
('Administrador', 'admin@saep.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'), -- senha: admin123
('João Almoxarife', 'joao@saep.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Maria Silva', 'maria@saep.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

INSERT INTO produtos (nome, descricao, categoria, material_cabeca, material_cabo, tamanho, peso, estoque_atual, estoque_minimo) VALUES
('Martelo de Unha 25mm', 'Martelo com cabo de madeira e cabeça de aço forjado', 'Martelo', 'Aço', 'Madeira', '25mm', 0.75, 15, 10),
('Martelo Bola 300g', 'Martelo bola com cabo de fibra de vidro', 'Martelo', 'Aço', 'Fibra de Vidro', '300g', 0.90, 8, 8),
('Chave de Fenda 1/4 x 6', 'Chave de fenda com ponta imantada e revestimento isolante', 'Chave de Fenda', NULL, NULL, '1/4 x 6', 0.12, 20, 15);

INSERT INTO produtos (nome, descricao, categoria, material_cabeca, material_cabo, revestimento_isolante, ponta_imantada, tamanho, peso, estoque_atual, estoque_minimo) VALUES
('Chave de Fenda 1/8 x 4', 'Chave de fenda simples, ponta imantada', 'Chave de Fenda', NULL, NULL, FALSE, TRUE, '1/8 x 4', 0.08, 3, 5);

INSERT INTO movimentacoes (produto_id, usuario_id, tipo, quantidade, data_mov, observacao) VALUES
(1, 1, 'entrada', 20, '2026-06-10', 'Reposição inicial'),
(2, 1, 'entrada', 10, '2026-06-11', 'Compra de emergência'),
(3, 2, 'saida', 2, '2026-06-12', 'Uso na produção'),
(4, 1, 'entrada', 10, '2026-06-13', 'Recebimento do fornecedor');