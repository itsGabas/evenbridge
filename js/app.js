// app.js - Versão Integrada
// Dados dos eventos (mantendo os seus eventos existentes)
const eventosData = [
    {
        id: 1,
        nome: "Festa de Verão",
        descricao: "A melhor festa da estação com DJs renomados e ambiente incrível na praia.",
        data: "2025-07-15",
        local: "Praia do Sol",
        cidade: "Rio de Janeiro",
        categoria: "festa",
        preco: 85.00,
        imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
        organizador: "Beach Events",
        capacidade: 500,
        vendidos: 320,
        destaque: true
    },
    {
        id: 2,
        nome: "Festival Rock Nacional",
        descricao: "O maior festival de rock do país com bandas nacionais renomadas.",
        data: "2025-08-20",
        local: "Arena Central",
        cidade: "São Paulo",
        categoria: "show",
        preco: 120.00,
        imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&h=300&fit=crop",
        organizador: "Rock Productions",
        capacidade: 2000,
        vendidos: 1650,
        destaque: true
    },
    {
        id: 3,
        nome: "Balada Eletrônica",
        descricao: "Noite eletrônica com DJs internacionais em ambiente premium.",
        data: "2025-09-10",
        local: "Clube Premium",
        cidade: "Belo Horizonte",
        categoria: "balada",
        preco: 65.00,
        imagem: "https://images.unsplash.com/photo-1571266028243-d220c9c3df8c?w=500&h=300&fit=crop",
        organizador: "Night Life",
        capacidade: 800,
        vendidos: 450,
        destaque: false
    },
    {
        id: 4,
        nome: "Show Sertanejo",
        descricao: "Os maiores hits do sertanejo com duplas consagradas.",
        data: "2025-07-25",
        local: "Arena Country",
        cidade: "Goiânia",
        categoria: "show",
        preco: 95.00,
        imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop",
        organizador: "Country Events",
        capacidade: 1500,
        vendidos: 980,
        destaque: false
    }
];

// Variáveis globais para sistemas
let authSystem;
let cartSystem;
let databaseManager;

// Estado da aplicação
let eventosCarregados = eventosData.slice(0, 6);
let filtroAtivo = 'todos';
let cidadeFiltro = '';
let dataFiltro = '';
let precoFiltro = '';
let termoBusca = '';

// Elementos DOM
const loadingScreen = document.getElementById('loading-screen');
const eventosGrid = document.getElementById('eventos-grid');
const loadMoreBtn = document.getElementById('load-more');
const modal = document.getElementById('evento-modal');
const modalBody = document.getElementById('modal-body');

// Inicialização principal
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    // Simular carregamento
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2000);

    // Inicializar sistemas na ordem correta
    await initializeSystems();
    
    // Inicializar componentes da interface
    initializeNavigation();
    initializeHeroAnimations();
    initializeEventFilters();
    initializeContactForm();
    initializeModal();
    initializeCounters();
    
    // Renderizar eventos
    renderEventos();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Verificar estado inicial do usuário
    updateUIAfterLogin();
}

// Inicializar sistemas integrados
async function initializeSystems() {
    try {
        // Inicializar database
        databaseManager = new DatabaseManager();
        
        eventManager = new EventManager();

        // Inicializar sistema de autenticação
        authSystem = new AuthSystem();
        
        // Inicializar sistema de carrinho
        cartSystem = new CartSystem();
        
        // Configurar comunicação entre sistemas
        setupSystemIntegration();
        
        console.log('Sistemas inicializados com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar sistemas:', error);
    }
}

// Configurar integração entre sistemas
function setupSystemIntegration() {
    // Listener para mudanças de login
    document.addEventListener('user-login-change', (event) => {
    updateUIAfterLogin();
    cartSystem.updateCartVisibility();
    });
    
    // Listener para mudanças no carrinho
    document.addEventListener('cart-updated', (event) => {
        updateCartUI();
    });
}

// Funções de navegação (mantidas do seu código original)
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

// Animações do Hero (mantidas)
function initializeHeroAnimations() {
    const searchInput = document.getElementById('search-events');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            termoBusca = e.target.value.toLowerCase();
            renderEventos();
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filtroAtivo = btn.dataset.filter;
            renderEventos();
        });
    });
}

// Filtros avançados
function initializeEventFilters() {
    const filterCidade = document.getElementById('filter-cidade');
    const filterData = document.getElementById('filter-data');
    const filterPreco = document.getElementById('filter-preco');

    if (filterCidade) {
        filterCidade.addEventListener('change', (e) => {
            cidadeFiltro = e.target.value;
            renderEventos();
        });
    }

    if (filterData) {
        filterData.addEventListener('change', (e) => {
            dataFiltro = e.target.value;
            renderEventos();
        });
    }

    if (filterPreco) {
        filterPreco.addEventListener('change', (e) => {
            precoFiltro = e.target.value;
            renderEventos();
        });
    }
}

// Renderizar eventos com integração de carrinho
function renderEventos() {
    if (!eventosGrid) return;

    let eventosFiltrados = eventosData.filter(evento => {
        if (filtroAtivo !== 'todos' && evento.categoria !== filtroAtivo) return false;
        if (cidadeFiltro && evento.cidade.toLowerCase() !== getCidadeNameById(cidadeFiltro)) return false;
        if (precoFiltro && !matchPrecoFilter(evento.preco, precoFiltro)) return false;
        if (termoBusca && !evento.nome.toLowerCase().includes(termoBusca) && 
            !evento.descricao.toLowerCase().includes(termoBusca)) return false;
        return true;
    });

    eventosGrid.innerHTML = '';

    if (eventosFiltrados.length === 0) {
        eventosGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>Nenhum evento encontrado</h3>
                <p>Tente ajustar os filtros para encontrar eventos incríveis!</p>
            </div>
        `;
        return;
    }

    eventosFiltrados.forEach(evento => {
        const porcentagemVendida = Math.round((evento.vendidos / evento.capacidade) * 100);
        const isUserLoggedIn = authSystem && authSystem.currentUser;
        
        const eventoCard = document.createElement('div');
        eventoCard.className = 'evento-card';
        eventoCard.innerHTML = `
            <img src="${evento.imagem}" alt="${evento.nome}" class="evento-image">
            <div class="evento-content">
                <span class="evento-badge">${getCategoriaLabel(evento.categoria)}</span>
                <h3 class="evento-title">${evento.nome}</h3>
                <div class="evento-info">
                    <span><i class="fas fa-calendar"></i> ${formatDate(evento.data)}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${evento.cidade}</span>
                </div>
                <p class="evento-description">${evento.descricao}</p>
                <div class="evento-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${porcentagemVendida}%"></div>
                    </div>
                    <span class="progress-text">${evento.vendidos}/${evento.capacidade} vendidos</span>
                </div>
                <div class="evento-footer">
                    <span class="evento-price">${evento.preco === 0 ? 'Gratuito' : `R$ ${evento.preco.toFixed(2)}`}</span>
                    <button class="btn btn-primary btn-cart" 
                            onclick="cartSystem.addToCart(${evento.id}, 1)" 
                            ${!isUserLoggedIn ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                        <i class="fas fa-shopping-cart"></i> Comprar
                    </button>
                </div>
            </div>
        `;

        eventoCard.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-cart')) {
                showEventModal(evento);
            }
        });

        eventosGrid.appendChild(eventoCard);
    });

    // Atualizar botões baseado no estado do login
    updateCartButtons();
}

// Função para adicionar ao carrinho (integrada)
function handleAddToCart(eventoId) {
    if (!authSystem || !authSystem.currentUser) {
        showToast('Faça login para comprar ingressos!', 'error');
        authSystem.openAuthModal();
        return;
    }

    if (cartSystem) {
        cartSystem.addToCart(eventoId, 1);
    }
}

// Atualizar botões do carrinho baseado no login
function updateCartButtons() {
    const cartButtons = document.querySelectorAll('.btn-cart');
    const isLoggedIn = authSystem && authSystem.currentUser;

    cartButtons.forEach(btn => {
        if (isLoggedIn) {
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

// Atualizar UI após login
function updateUIAfterLogin() {
    const isLoggedIn = authSystem && authSystem.currentUser;
    
    // Atualizar botões de login
    updateLoginButtons();
    
    // Atualizar carrinho
    updateCartVisibility();
    
    // Atualizar botões dos eventos
    updateCartButtons();
    
    // Adicionar/remover classe do body
    if (isLoggedIn) {
        document.body.classList.add('user-logged-in');
    } else {
        document.body.classList.remove('user-logged-in');
    }
}

// Atualizar botões de login
function updateLoginButtons() {
    const loginButtons = document.querySelectorAll('.auth-trigger');
    const isLoggedIn = authSystem && authSystem.currentUser;

    loginButtons.forEach(btn => {
        if (isLoggedIn) {
            btn.textContent = `Olá, ${authSystem.currentUser.nome.split(' ')[0]}`;
            btn.className = 'btn btn-outline auth-trigger user-logged';
            btn.onclick = (e) => {
                e.preventDefault();
                authSystem.showUserMenu();
            };
        } else {
            btn.textContent = 'Login';
            btn.className = 'btn btn-outline auth-trigger';
            btn.onclick = (e) => {
                e.preventDefault();
                authSystem.openAuthModal();
            };
        }
    });
}

// Atualizar visibilidade do carrinho
function updateCartVisibility() {
    const cartBtn = document.querySelector('.cart-btn');
    const isLoggedIn = authSystem && authSystem.currentUser;

    if (cartBtn) {
        if (isLoggedIn) {
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
}

// Funções auxiliares (mantidas do seu código)
function getCategoriaLabel(categoria) {
    const labels = {
        'festa': 'Festa',
        'show': 'Show',
        'balada': 'Balada',
        'festival': 'Festival'
    };
    return labels[categoria] || categoria;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function getCidadeNameById(cidadeId) {
    const cidades = {
        'rio': 'rio de janeiro',
        'sp': 'são paulo',
        'bh': 'belo horizonte',
        'goiania': 'goiânia'
    };
    return cidades[cidadeId] || cidadeId;
}

function matchPrecoFilter(preco, filtro) {
    switch (filtro) {
        case 'gratis': return preco === 0;
        case 'ate50': return preco > 0 && preco <= 50;
        case 'ate100': return preco > 50 && preco <= 100;
        case 'acima100': return preco > 100;
        default: return true;
    }
}

// Função para buscar evento por ID
function getEventById(id) {
    return eventosData.find(evento => evento.id === id);
}

// Modal e outras funções (mantidas)
function showEventModal(evento) {
    if (!modal || !modalBody) return;

    const porcentagemVendida = Math.round((evento.vendidos / evento.capacidade) * 100);
    const isUserLoggedIn = authSystem && authSystem.currentUser;

    modalBody.innerHTML = `
        <div class="modal-header">
            <img src="${evento.imagem}" alt="${evento.nome}" class="modal-image">
        </div>
        <div class="modal-content-inner">
            <div class="modal-badge">${getCategoriaLabel(evento.categoria)}</div>
            <h2 class="modal-title">${evento.nome}</h2>
            <div class="modal-info">
                <div class="info-item">
                    <i class="fas fa-calendar"></i>
                    <span>${formatDate(evento.data)}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${evento.local}, ${evento.cidade}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-user"></i>
                    <span>Por ${evento.organizador}</span>
                </div>
            </div>
            <p class="modal-description">${evento.descricao}</p>
            <div class="modal-progress">
                <div class="progress-info">
                    <span>Ingressos Vendidos</span>
                    <span>${evento.vendidos}/${evento.capacidade} (${porcentagemVendida}%)</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${porcentagemVendida}%"></div>
                </div>
            </div>
            <div class="modal-footer">
                <div class="modal-price">
                    ${evento.preco === 0 ? 'Gratuito' : `R$ ${evento.preco.toFixed(2)}`}
                </div>
                <button class="btn btn-primary btn-large" 
                        ${!isUserLoggedIn ? 'disabled title="Faça login para comprar ingressos"' : ''}
                        onclick="handleAddToCart(${evento.id})">
                    <i class="fas fa-cart-plus"></i> Comprar Ingresso
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function initializeModal() {
    if (!modal) return;

    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Funções de toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        hideToast(toast);
    });

    setTimeout(() => {
        hideToast(toast);
    }, 5000);
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Outras funções necessárias
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Mensagem enviada com sucesso!', 'success');
            contactForm.reset();
        });
    }
}

function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target') || counter.textContent);
        let current = 0;
        const increment = target / 100;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 50);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

function setupEventListeners() {
    // Listener para carrinho
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cartSystem) {
                cartSystem.showCart();
            }
        });
    }

    // Listeners para botões de login
    const loginBtns = document.querySelectorAll('.auth-trigger');
    loginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (authSystem) {
                if (authSystem.currentUser) {
                    authSystem.showUserMenu();
                } else {
                    authSystem.openAuthModal();
                }
            }
        });
    });
    
}

// Exportar para uso global
window.getEventById = getEventById;
window.showToast = showToast;
window.handleAddToCart = handleAddToCart;
AdvancedPerformanceMonitor.init();
