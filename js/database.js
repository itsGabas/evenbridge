// js/database.js
class DatabaseManager {
    constructor() {
        this.dbName = 'eventbridge.db';
        this.init();
    }
    
    init() {
        // Para desenvolvimento, vamos simular SQLite com localStorage
        // Em produção, isso seria substituído por chamadas reais ao SQLite
        if (!localStorage.getItem('db_initialized')) {
            this.initializeTables();
            localStorage.setItem('db_initialized', 'true');
        }
    }
    
    initializeTables() {
    // Só inicializar se não existir nada
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify([]));
    }
    
    // Verificar se eventos já existem antes de sobrescrever
    localStorage.setItem('eventos', JSON.stringify(this.getInitialEvents()));
    
    if (!localStorage.getItem('ingressos')) {
        localStorage.setItem('ingressos', JSON.stringify([]));
    }
    
    if (!localStorage.getItem('contatos')) {
        localStorage.setItem('contatos', JSON.stringify([]));
    }
}
    
    // Simular operações SQL
    async query(sql, params = []) {
        // Simulação de queries SQL
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const result = this.executeQuery(sql, params);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, 100); // Simular delay de rede
        });
    }
    
    executeQuery(sql, params) {
        // Parsing básico de SQL para localStorage
        const sqlLower = sql.toLowerCase().trim();
        
        if (sqlLower.startsWith('select')) {
            return this.handleSelect(sql, params);
        } else if (sqlLower.startsWith('insert')) {
            return this.handleInsert(sql, params);
        } else if (sqlLower.startsWith('update')) {
            return this.handleUpdate(sql, params);
        } else if (sqlLower.startsWith('delete')) {
            return this.handleDelete(sql, params);
        }
        
        throw new Error('Query não suportada');
    }
    
    handleSelect(sql, params) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        
        if (sql.includes('usuarios')) {
            if (sql.includes('email = ?')) {
                return usuarios.filter(user => user.email === params[0]);
            }
            return usuarios;
        }
        
        return [];
    }
    
    handleInsert(sql, params) {
        if (sql.includes('usuarios')) {
            const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
            const newUser = {
                id: Date.now(),
                nome: params[0],
                email: params[1],
                senha: params[2],
                telefone: params[3] || null,
                data_cadastro: new Date().toISOString()
            };
            usuarios.push(newUser);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            return { insertId: newUser.id, changes: 1 };
        }
        
        return { insertId: null, changes: 0 };
    }
    
    getInitialEvents() {
    return [
        {
            id: 1,
            nome: "Festa de Verão",
            descricao: "A melhor festa da estação com DJs renomados e ambiente incrível na praia.",
            dataEvento: "2025-07-15",
            data_evento: "2025-07-15",
            local: "Praia do Sol",
            cidade: "Rio de Janeiro",
            categoria: "festa",
            preco: 85.00,
            capacidade: 500,
            vendidos: 320,
            imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
            organizador: "Beach Events",
            destaque: true
        },
        {
            id: 2,
            nome: "Festival Rock Nacional",
            descricao: "O maior festival de rock do país com bandas nacionais renomadas.",
            dataEvento: "2025-08-20",
            data_evento: "2025-08-20",
            local: "Arena Central",
            cidade: "São Paulo",
            categoria: "show",
            preco: 120.00,
            capacidade: 2000,
            vendidos: 1650,
            imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=300&fit=crop",
            organizador: "Rock Productions",
            destaque: true
        },
        {
            id: 3,
            nome: "Balada Eletrônica",
            descricao: "Noite eletrônica com DJs internacionais em ambiente premium.",
            dataEvento: "2025-09-10",
            data_evento: "2025-09-10",
            local: "Clube Premium",
            cidade: "Belo Horizonte",
            categoria: "balada",
            preco: 65.00,
            capacidade: 800,
            vendidos: 450,
            imagem: "https://images.unsplash.com/photo-1571266028243-d220c9c3df8c?w=500&h=300&fit=crop",
            organizador: "Night Life",
            destaque: false
        },
        {
            id: 4,
            nome: "Show Sertanejo",
            descricao: "Os maiores hits do sertanejo com duplas consagradas.",
            dataEvento: "2025-07-25",
            data_evento: "2025-07-25",
            local: "Arena Country",
            cidade: "Goiânia",
            categoria: "show",
            preco: 95.00,
            capacidade: 1500,
            vendidos: 980,
            imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
            organizador: "Country Events",
            destaque: false
        }
    ];
}

}