CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    data_evento DATE NOT NULL,
    local VARCHAR(200),
    cidade VARCHAR(100),
    categoria VARCHAR(50),
    preco DECIMAL(10,2),
    capacidade INTEGER,
    vendidos INTEGER DEFAULT 0,
    imagem VARCHAR(500),
    organizador VARCHAR(100),
    destaque BOOLEAN DEFAULT 0,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingressos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    evento_id INTEGER,
    usuario_id INTEGER,
    quantidade INTEGER,
    valor_total DECIMAL(10,2),
    data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ativo',
    FOREIGN KEY (evento_id) REFERENCES eventos(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100),
    email VARCHAR(150),
    assunto VARCHAR(200),
    mensagem TEXT,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP
);
SELECT name FROM sqlite_master WHERE type='table';
