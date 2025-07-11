// js/auth.js
class AuthSystem {
    constructor() {
        this.currentUser = this.loadCurrentUser();
        this.db = new DatabaseManager();
        this.initializeAuthForms();
    }
    
    loadCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
    
    // Modificar função login
async login(email, senha) {
    try {
        this.showLoading('Fazendo login...');
        
        const users = await this.db.query(
            'SELECT * FROM usuarios WHERE email = ?', 
            [email]
        );
        
        if (users.length > 0 && users[0].senha === senha) {
            const user = users[0];
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            this.hideLoading();
            this.showToast('Login realizado com sucesso!', 'success');
            this.updateUIForLoggedUser();
            this.closeAuthModal();
            
            // Disparar evento de mudança de login
            document.dispatchEvent(new CustomEvent('user-login-change', { 
                detail: { loggedIn: true, user: user } 
            }));
            
            // Atualizar carrinho e eventos
            if (cartSystem) {
                cartSystem.updateCartVisibility();
            }
            renderEventos(); // Re-renderizar eventos com botões habilitados
            
            return true;
        } else {
            this.hideLoading();
            this.showToast('Email ou senha incorretos!', 'error');
            return false;
        }
    } catch (error) {
        this.hideLoading();
        console.error('Erro no login:', error);
        this.showToast('Erro ao fazer login. Tente novamente.', 'error');
        return false;
    }
}

logout() {
    console.log('=== INICIANDO LOGOUT ===');
    
    // 1. Limpar dados do usuário
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    document.body.classList.remove('user-logged-in');
    
    // 2. Fechar modais e menus
    const modals = document.querySelectorAll('.modal, .user-menu, .cart-modal');
    modals.forEach(modal => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });
    
    // 3. Restaurar overflow
    document.body.style.overflow = 'auto';
    
    // 4. Limpar carrinho
    if (cartSystem) {
        cartSystem.clearCart();
    }
    
    // 5. Resetar interface
    this.resetToInitialState();
    
    // 6. IMPORTANTE: Reconfigurar event listeners
    setTimeout(() => {
        this.setupInitialEventListeners();
        this.forceButtonSetup();
    }, 200);
    
    // 7. Mostrar notificação
    this.showToast('Logout realizado com sucesso!', 'success');
    
    // 8. Voltar ao topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    console.log('=== LOGOUT CONCLUÍDO ===');
}

// Nova função para forçar configuração dos botões
forceButtonSetup() {
    const loginBtns = document.querySelectorAll('.auth-trigger');
    
    if (loginBtns.length === 0) {
        console.error('ERRO: Nenhum botão de login encontrado após logout');
        return;
    }
    
    loginBtns.forEach((btn, index) => {
        // Garantir que o botão está no estado correto
        btn.textContent = 'Login';
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        
        // Forçar novo event listener
        btn.onclick = (e) => {
            e.preventDefault();
            console.log('Clique forçado detectado');
            this.openAuthModal();
        };
        
        console.log(`Botão ${index + 1} configurado forçadamente`);
    });
}

// Nova função para resetar ao estado inicial
resetToInitialState() {
    console.log('Resetando para estado inicial...');
    
    // 1. Resetar botões de autenticação
    this.resetAuthButtons();
    
    // 2. Ocultar carrinho
    this.forceHideCart();
    
    // 3. Resetar eventos (botões desabilitados)
    this.resetEventButtons();
    
    // 4. Limpar formulários
    this.clearAllForms();
    
    // 5. Resetar filtros
    this.resetFilters();
    
    // 6. Forçar re-renderização
    setTimeout(() => {
        if (typeof renderEventos === 'function') {
            renderEventos();
        }
    }, 100);
}

// Função corrigida para resetar botões de autenticação
resetAuthButtons() {
    const loginBtns = document.querySelectorAll('.auth-trigger');
    
    loginBtns.forEach((btn, index) => {
        console.log(`Resetando botão ${index + 1}:`, btn);
        
        // Resetar texto e estilos
        btn.textContent = 'Login';
        btn.innerHTML = 'Login';
        btn.className = 'btn btn-outline auth-trigger';
        btn.style.cssText = '';
        btn.disabled = false;
        btn.title = 'Fazer login ou cadastrar';
        
        // IMPORTANTE: Remover todos os event listeners antigos
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Adicionar novo event listener ao botão clonado
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Clique no botão de login detectado');
            
            if (this.openAuthModal) {
                this.openAuthModal();
            } else {
                console.error('Função openAuthModal não encontrada');
            }
        });
        
        console.log(`Botão ${index + 1} resetado com sucesso`);
    });
    
    console.log('Todos os botões de autenticação foram resetados');
}

// Função para resetar botões dos eventos
resetEventButtons() {
    const eventButtons = document.querySelectorAll('.btn-cart, .evento-actions button');
    
    eventButtons.forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.title = 'Faça login para comprar ingressos';
    });
    
    console.log('Botões dos eventos resetados');
}

// Função para limpar todos os formulários
clearAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.reset();
    });
    
    // Limpar campos específicos
    const inputs = document.querySelectorAll('input[type="email"], input[type="password"], input[type="text"], input[type="tel"]');
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('error', 'success');
    });
    
    console.log('Formulários limpos');
}

// Função para resetar filtros
resetFilters() {
    // Resetar filtros de busca
    const searchInput = document.querySelector('#search-input, .search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Resetar filtros de categoria
    const categoryFilters = document.querySelectorAll('.filter-btn');
    categoryFilters.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Resetar filtro "Todos"
    const allFilter = document.querySelector('.filter-btn[data-categoria="todos"]');
    if (allFilter) {
        allFilter.classList.add('active');
    }
    
    console.log('Filtros resetados');
}

// Função para forçar ocultação do carrinho
forceHideCart() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.display = 'none';
        cartBtn.style.visibility = 'hidden';
        cartBtn.style.opacity = '0';
        cartBtn.disabled = true;
    }
    
    // Remover contador do carrinho
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
        cartCounter.textContent = '0';
        cartCounter.style.display = 'none';
    }
    
    console.log('Carrinho ocultado');
}
    
    async register(userData) {
        try {
            this.showLoading('Criando conta...');
            
            // Verificar se email já existe
            const existingUsers = await this.db.query(
                'SELECT * FROM usuarios WHERE email = ?', 
                [userData.email]
            );
            
            if (existingUsers.length > 0) {
                this.hideLoading();
                this.showToast('Este email já está cadastrado!', 'error');
                return false;
            }
            
            // Inserir novo usuário
            const result = await this.db.query(
                'INSERT INTO usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)',
                [userData.nome, userData.email, userData.senha, userData.telefone]
            );
            
            if (result.changes > 0) {
                this.hideLoading();
                this.showToast('Cadastro realizado com sucesso!', 'success');
                return this.login(userData.email, userData.senha);
            }
            
        } catch (error) {
            this.hideLoading();
            console.error('Erro no cadastro:', error);
            this.showToast('Erro ao criar conta. Tente novamente.', 'error');
            return false;
        }
    }
    
    logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    
    // Fechar todos os modais abertos
    const modals = document.querySelectorAll('.modal, .user-menu');
    modals.forEach(modal => {
        modal.style.display = 'none';
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });
    
    // Restaurar overflow do body
    document.body.style.overflow = 'auto';
    
    // Atualizar interface
    this.updateUIForLoggedUser();
    
    // Mostrar notificação
    this.showToast('Logout realizado com sucesso!', 'success');
    
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

forceShowCart() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.display = 'block';
        cartBtn.style.visibility = 'visible';
        cartBtn.style.opacity = '1';
        cartBtn.disabled = false;
        console.log('Carrinho forçado a aparecer');
    }
}

forceHideCart() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.style.display = 'none';
        cartBtn.style.visibility = 'hidden';
        cartBtn.style.opacity = '0';
        cartBtn.disabled = true;
        console.log('Carrinho forçado a ocultar');
    }
}
    
  updateUIForLoggedUser() {
    console.log('Atualizando interface para usuário:', this.currentUser?.nome || 'não logado');
    
    const loginBtns = document.querySelectorAll('.auth-trigger');
    const cartBtn = document.querySelector('.cart-btn');
    
    // Controlar botões de login
    loginBtns.forEach(btn => {
        if (this.currentUser) {
            // Usuário logado
            btn.textContent = `Olá, ${this.currentUser.nome.split(' ')[0]}`;
            btn.className = 'btn btn-outline auth-trigger user-logged';
            btn.onclick = (e) => {
                e.preventDefault();
                this.showUserMenu();
            };
            btn.disabled = false;
            btn.title = 'Abrir menu do usuário';
        } else {
            // Usuário não logado - estado inicial
            btn.textContent = 'Login';
            btn.innerHTML = 'Login';
            btn.className = 'btn btn-outline auth-trigger';
            btn.onclick = (e) => {
                e.preventDefault();
                this.openAuthModal();
            };
            btn.disabled = false;
            btn.title = 'Fazer login ou cadastrar';
            btn.style.cssText = ''; // Limpar estilos inline
        }
    });
    
    // Controlar carrinho
    if (cartBtn) {
        if (this.currentUser) {
            cartBtn.style.display = 'block';
            cartBtn.style.visibility = 'visible';
            cartBtn.style.opacity = '1';
            cartBtn.disabled = false;
        } else {
            cartBtn.style.display = 'none';
            cartBtn.style.visibility = 'hidden';
            cartBtn.style.opacity = '0';
            cartBtn.disabled = true;
        }
    }
    
    // Atualizar botões dos eventos
    this.updateEventButtons();
}

// Nova função para atualizar botões dos eventos
updateEventButtons() {
    const eventButtons = document.querySelectorAll('.btn-cart, .evento-actions button');
    
    eventButtons.forEach(btn => {
        if (this.currentUser) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.title = '';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.title = 'Faça login para comprar ingressos';
        }
    });
}

// Nova função para atualizar botões nos eventos
updateCartButtons() {
    const addToCartBtns = document.querySelectorAll('.btn-cart, .evento-actions .btn-primary');
    
    addToCartBtns.forEach(btn => {
        if (this.currentUser) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.title = '';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.title = 'Faça login para comprar ingressos';
        }
    });
}

    showUserMenu() {
    // Remover menu existente se houver
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <div class="user-menu-content">
            <span class="user-menu-close">&times;</span>
            <h3>Olá, ${this.currentUser.nome}!</h3>
            <p>Email: ${this.currentUser.email}</p>
            <div class="user-menu-actions">
                <button class="btn btn-outline" onclick="authSystem.showMyTickets()">
                    <i class="icon-ticket"></i> Meus Tickets
                </button>
                <button class="btn btn-outline" onclick="authSystem.showCart()">
                    <i class="icon-cart"></i> Carrinho
                </button>
                <button class="btn btn-danger" onclick="authSystem.logout()">
                    <i class="icon-logout"></i> Sair
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(menu);
    
    // Configurar fechamento do menu
    const closeBtn = menu.querySelector('.user-menu-close');
    closeBtn.addEventListener('click', () => {
        menu.remove();
    });
    
    // Fechar menu ao clicar fora
    menu.addEventListener('click', (e) => {
        if (e.target === menu) {
            menu.remove();
        }
    });
}
    
    initializeAuthForms() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.querySelector('input[type="email"]').value;
      const senha = loginForm.querySelector('input[type="password"]').value;
      this.login(email, senha);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = registerForm.querySelector('input[type="text"]').value;
      const email = registerForm.querySelector('input[type="email"]').value;
      const senha = registerForm.querySelector('input[type="password"]').value;
      const telefone = registerForm.querySelector('input[type="tel"]').value;
      this.register({ nome, email, senha, telefone });
    });
  }
}

// Nova função para garantir que carrinho inicie oculto
hideCartOnLoad() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn && !this.currentUser) {
        cartBtn.style.display = 'none';
        cartBtn.style.visibility = 'hidden';
        cartBtn.style.opacity = '0';
        console.log('Carrinho forçado a ocultar no carregamento');
    }
}
    
    setupAuthModal() {
        // Configurar alternância entre abas
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.tab;
                
                // Remover active de todas as abas
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.add('hidden'));
                
                // Ativar aba selecionada
                tab.classList.add('active');
                document.getElementById(`${target}-form`).classList.remove('hidden');
            });
        });
        
        // Configurar fechamento do modal
        const closeBtn = document.querySelector('.modal-close');
        const modal = document.getElementById('auth-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeAuthModal();
            });
        }
        
        // Fechar modal ao clicar fora
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAuthModal();
                }
            });
        }
    }
    
    setupFormListeners() {
        // Listener para formulário de login
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('login-email').value;
                const senha = document.getElementById('login-password').value;
                
                if (!email || !senha) {
                    this.showToast('Preencha todos os campos!', 'error');
                    return;
                }
                
                await this.login(email, senha);
            });
        }
        
        // Listener para formulário de cadastro
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const userData = {
                    nome: document.getElementById('register-name').value,
                    email: document.getElementById('register-email').value,
                    telefone: document.getElementById('register-phone').value,
                    senha: document.getElementById('register-password').value
                };
                
                if (!userData.nome || !userData.email || !userData.senha) {
                    this.showToast('Preencha todos os campos obrigatórios!', 'error');
                    return;
                }
                
                if (!this.validateEmail(userData.email)) {
                    this.showToast('Email inválido!', 'error');
                    return;
                }
                
                if (userData.senha.length < 6) {
                    this.showToast('A senha deve ter pelo menos 6 caracteres!', 'error');
                    return;
                }
                
                await this.register(userData);
            });
        }
    }
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  } else {
    console.error('Modal de autenticação não encontrado');
  }
}

    closeAuthModal() {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    showUserMenu() {
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <div class="user-menu-content">
                <p>Olá, ${this.currentUser.nome}!</p>
                <button onclick="authSystem.logout()">Logout</button>
            </div>
        `;
        
        document.body.appendChild(userMenu);
        
        // Fechar menu ao clicar fora
        setTimeout(() => {
            userMenu.addEventListener('click', (e) => {
                if (e.target === userMenu) {
                    document.body.removeChild(userMenu);
                }
            });
        }, 100);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        // Limpar carrinho
        if (window.cartSystem) {
            window.cartSystem.clearCart();
        }
        
        // Atualizar UI
        if (window.updateUIAfterLogin) {
            window.updateUIAfterLogin();
        }
        
        // Remover menu se existir
        const userMenu = document.querySelector('.user-menu');
        if (userMenu) {
            document.body.removeChild(userMenu);
        }
        
        showToast('Logout realizado!', 'success');
    }
    
    clearForms() {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            if (form.tagName === 'FORM') {
                form.reset();
            }
        });
    }
    
    showLoading(message) {
        const loading = document.createElement('div');
        loading.id = 'auth-loading';
        loading.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loading);
    }
    
    hideLoading() {
        const loading = document.getElementById('auth-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Remover toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    showMyTickets() {
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    const userTickets = tickets.filter(ticket => ticket.usuarioId === this.currentUser.id);
    
    const modal = document.createElement('div');
    modal.id = 'tickets-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content tickets-modal-content">
            <div class="modal-header">
                <h2>Meus Tickets</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="tickets-content">
                ${this.renderTickets(userTickets)}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Configurar fechamento
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

    renderTickets(tickets) {
        if (tickets.length === 0) {
            return `
                <div class="tickets-empty">
                    <p>Você ainda não possui tickets.</p>
                    <button class="btn btn-primary" onclick="document.getElementById('tickets-modal').remove(); document.body.style.overflow = 'auto';">
                        Explorar Eventos
                    </button>
                </div>
            `;
        }
        
        return tickets.map(ticket => `
            <div class="ticket-card">
                <div class="ticket-header">
                    <h3>${ticket.evento.nome}</h3>
                    <span class="ticket-status status-${ticket.status}">${ticket.status.toUpperCase()}</span>
                </div>
                <div class="ticket-details">
                    <div class="ticket-info">
                        <p><strong>📅 Data:</strong> ${new Date(ticket.evento.dataEvento).toLocaleDateString('pt-BR')}</p>
                        <p><strong>📍 Local:</strong> ${ticket.evento.local}, ${ticket.evento.cidade}</p>
                        <p><strong>🎫 Quantidade:</strong> ${ticket.quantidade} ingresso(s)</p>
                        <p><strong>💰 Valor:</strong> R$ ${ticket.valorTotal.toFixed(2)}</p>
                        <p><strong>🛒 Compra:</strong> ${new Date(ticket.dataCompra).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div class="ticket-qr">
                        <div class="qr-code">
                            <div class="qr-placeholder">📱</div>
                            <p>Código: ${ticket.codigoTicket}</p>
                        </div>
                    </div>
                </div>
                <div class="ticket-actions">
                    <button class="btn btn-outline" onclick="authSystem.downloadTicket('${ticket.id}')">
                        📥 Baixar Ticket
                    </button>
                    <button class="btn btn-outline" onclick="authSystem.shareTicket('${ticket.id}')">
                        📤 Compartilhar
                    </button>
                </div>
            </div>
        `).join('');
    }

    downloadTicket(ticketId) {
        // Simular download do ticket
        this.showToast('Funcionalidade de download em desenvolvimento!', 'info');
    }

    shareTicket(ticketId) {
        // Simular compartilhamento
        this.showToast('Funcionalidade de compartilhamento em desenvolvimento!', 'info');
    }
    showCart() {
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        userMenu.remove();
    }
    
    if (cartSystem) {
        cartSystem.showCart();
    }
}
// Nova função para garantir que event listeners funcionem
setupInitialEventListeners() {
    console.log('Configurando event listeners iniciais...');
    
    // Aguardar um pouco para garantir que DOM está pronto
    setTimeout(() => {
        const loginBtns = document.querySelectorAll('.auth-trigger');
        
        if (loginBtns.length === 0) {
            console.warn('Nenhum botão de login encontrado');
            return;
        }
        
        loginBtns.forEach((btn, index) => {
            // Remover listeners antigos clonando o elemento
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            // Configurar novo listener
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log(`Login button ${index + 1} clicked`);
                
                if (authSystem && authSystem.currentUser) {
                    authSystem.showUserMenu();
                } else {
                    authSystem.openAuthModal();
                }
            });
            
            console.log(`Event listener configurado para botão ${index + 1}`);
        });
        
        console.log('Event listeners iniciais configurados com sucesso');
    }, 100);
}

}
