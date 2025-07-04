// Dados dos eventos (simulado - futuramente virá de API)
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
        destaque: true,
        galeria: [
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop",
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=250&fit=crop",
            "https://images.unsplash.com/photo-1564866657315-9a90a231b996?w=400&h=250&fit=crop"
        ]
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
        destaque: true,
        galeria: [
            "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=250&fit=crop",
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop"
        ]
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
        destaque: false,
        galeria: [
            "https://images.unsplash.com/photo-1571266028243-d220c9c3df8c?w=400&h=250&fit=crop"
        ]
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
        destaque: false,
        galeria: []
    }
];

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
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Simular carregamento
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);

    // Inicializar componentes
    initializeNavigation();
    initializeHeroAnimations();
    initializeEventFilters();
    initializeContactForm();
    renderEventos();
    initializeModal();
    initializeCounters();
    
    // Event listeners
    setupEventListeners();
});

// Navegação suave
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll suave para seções
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

    // Destacar link ativo baseado no scroll
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

// Animações do Hero
function initializeHeroAnimations() {
    const searchInput = document.getElementById('search-events');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Busca em tempo real
    searchInput.addEventListener('input', (e) => {
        termoBusca = e.target.value.toLowerCase();
        renderEventos();
    });

    // Filtros rápidos
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

    filterCidade.addEventListener('change', (e) => {
        cidadeFiltro = e.target.value;
        renderEventos();
    });

    filterData.addEventListener('change', (e) => {
        dataFiltro = e.target.value;
        renderEventos();
    });

    filterPreco.addEventListener('change', (e) => {
        precoFiltro = e.target.value;
        renderEventos();
    });
}

// Renderizar eventos
function renderEventos() {
    let eventosFiltrados = eventosData.filter(evento => {
        // Filtro por categoria
        if (filtroAtivo !== 'todos' && evento.categoria !== filtroAtivo) return false;
        
        // Filtro por cidade
        if (cidadeFiltro && evento.cidade.toLowerCase() !== getCidadeNameById(cidadeFiltro)) return false;
        
        // Filtro por preço
        if (precoFiltro && !matchPrecoFilter(evento.preco, precoFiltro)) return false;
        
        // Filtro por termo de busca
        if (termoBusca && !evento.nome.toLowerCase().includes(termoBusca) && 
            !evento.descricao.toLowerCase().includes(termoBusca)) return false;
        
        return true;
    });

    eventosGrid.innerHTML = '';
    
    if (eventosFiltrados.length === 0) {
        eventosGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>Nenhum evento encontrado</h3>
                <p>Tente ajustar os filtros para encontrar eventos incríveis!</p>
            </div>
        `;
        return;
    }

    eventosFiltrados.forEach(evento => {
        const eventoCard = createEventoCard(evento);
        eventosGrid.appendChild(eventoCard);
    });

    // Mostrar/ocultar botão "Carregar Mais"
    loadMoreBtn.style.display = eventosFiltrados.length > 6 ? 'block' : 'none';
}

// Criar card de evento
function createEventoCard(evento) {
    const card = document.createElement('div');
    card.className = 'evento-card';
    card.onclick = () => openEventoModal(evento);

    const porcentagemVendida = Math.round((evento.vendidos / evento.capacidade) * 100);
    const badgeText = evento.destaque ? 'Destaque' : 
                     porcentagemVendida > 80 ? 'Quase Esgotado' : 
                     evento.preco === 0 ? 'Gratuito' : 'Disponível';
    
    const badgeClass = evento.destaque ? 'evento-badge' : 
                      porcentagemVendida > 80 ? 'evento-badge-warning' : 
                      evento.preco === 0 ? 'evento-badge-success' : 'evento-badge';

    card.innerHTML = `
        <img src="${evento.imagem}" alt="${evento.nome}" class="evento-image">
        <div class="evento-content">
            <span class="${badgeClass}">${badgeText}</span>
            <h3 class="evento-title">${evento.nome}</h3>
            <div class="evento-info">
                <span><i class="fas fa-calendar"></i> ${formatDate(evento.data)}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${evento.cidade}</span>
            </div>
            <p class="evento-description">${evento.descricao}</p>
            <div class="evento-footer">
                <span class="evento-price">
                    ${evento.preco === 0 ? 'Gratuito' : `R$ ${evento.preco.toFixed(2)}`}
                </span>
                <button class="btn btn-primary" onclick="event.stopPropagation(); comprarIngresso(${evento.id})">
                    Comprar
                </button>
            </div>
        </div>
    `;

    return card;
}

// Modal de detalhes do evento
function openEventoModal(evento) {
    const porcentagemVendida = Math.round((evento.vendidos / evento.capacidade) * 100);
    
    modalBody.innerHTML = `
        <div class="modal-evento">
            <div class="modal-header" style="background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${evento.imagem}'); background-size: cover; background-position: center; color: white; padding: 3rem 2rem; text-align: center;">
                <h2 style="font-size: 2.5rem; margin-bottom: 1rem;">${evento.nome}</h2>
                <p style="font-size: 1.2rem; opacity: 0.9;">${evento.descricao}</p>
            </div>
            <div style="padding: 2rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">📅 Data e Local</h4>
                        <p><strong>${formatDate(evento.data)}</strong></p>
                        <p>${evento.local}, ${evento.cidade}</p>
                    </div>
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">🎟️ Ingressos</h4>
                        <p>${evento.vendidos}/${evento.capacidade} vendidos (${porcentagemVendida}%)</p>
                        <div style="background: var(--gray-200); height: 8px; border-radius: 4px; margin-top: 0.5rem;">
                            <div style="background: var(--primary-color); height: 100%; width: ${porcentagemVendida}%; border-radius: 4px;"></div>
                        </div>
                    </div>
                    <div>
                        <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">💰 Preço</h4>
                        <p style="font-size: 1.5rem; font-weight: 600; color: var(--primary-color);">
                            ${evento.preco === 0 ? 'Gratuito' : `R$ ${evento.preco.toFixed(2)}`}
                        </p>
                    </div>
                </div>
                
                ${evento.galeria && evento.galeria.length > 0 ? `
                    <div style="margin-bottom: 2rem;">
                        <h4 style="color: var(--primary-color); margin-bottom: 1rem;">📸 Galeria</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                            ${evento.galeria.map(img => `
                                <img src="${img}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px;" alt="Galeria">
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-large" onclick="comprarIngresso(${evento.id})">
                        <i class="fas fa-ticket-alt"></i> Comprar Ingresso
                    </button>
                    <button class="btn btn-outline" onclick="compartilharEvento(${evento.id})">
                        <i class="fas fa-share-alt"></i> Compartilhar
                    </button>
                    <button class="btn btn-outline" onclick="favoritarEvento(${evento.id})">
                        <i class="fas fa-heart"></i> Favoritar
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Inicializar modal
function initializeModal() {
    const modalClose = document.querySelector('.modal-close');
    
    modalClose.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
}

// Contadores animados
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const increment = target / 200;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            counter.textContent = Math.floor(current);
            
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            }
        }, 10);
    };
    
    // Observer para animar quando entrar na viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

// Formulário de contato
function initializeContactForm() {
    const form = document.getElementById('contato-form');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simular envio
        showToast('Mensagem enviada com sucesso! Retornaremos em breve.', 'success');
        form.reset();
    });
}

// Funções de ação
function comprarIngresso(eventoId) {
    // Simular processo de compra
    showToast('Redirecionando para pagamento...', 'info');
    
    // Aqui seria redirecionado para gateway de pagamento
    setTimeout(() => {
        showToast('Compra realizada com sucesso! Verifique seus e-mails.', 'success');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 2000);
}

function compartilharEvento(eventoId) {
    const evento = eventosData.find(e => e.id === eventoId);
    
    if (navigator.share) {
        navigator.share({
            title: evento.nome,
            text: evento.descricao,
            url: window.location.href
        });
    } else {
        // Fallback para compartilhamento manual
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Confira o evento "${evento.nome}" no EvenBridge!`);
        
        const whatsappUrl = `https://wa.me/?text=${text}%20${url}`;
        window.open(whatsappUrl, '_blank');
    }
}

function favoritarEvento(eventoId) {
    showToast('Evento adicionado aos favoritos!', 'success');
}

// Funções utilitárias
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function getCidadeNameById(id) {
    const cidades = {
        'sao-paulo': 'são paulo',
        'rio-janeiro': 'rio de janeiro',
        'belo-horizonte': 'belo horizonte'
    };
    return cidades[id] || '';
}

function matchPrecoFilter(preco, filter) {
    switch(filter) {
        case 'gratis': return preco === 0;
        case '0-50': return preco > 0 && preco <= 50;
        case '50-100': return preco > 50 && preco <= 100;
        case '100+': return preco > 100;
        default: return true;
    }
}

function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast show toast-${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = section.offsetTop - headerHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Event listeners adicionais
function setupEventListeners() {
    // Botão carregar mais
    loadMoreBtn.addEventListener('click', () => {
        showToast('Carregando mais eventos...', 'info');
        // Simular carregamento de mais eventos
        setTimeout(() => {
            showToast('Novos eventos carregados!', 'success');
        }, 1500);
    });

    // Botões de ação do header
    document.getElementById('login-btn').addEventListener('click', () => {
        showToast('Funcionalidade de login em desenvolvimento', 'info');
    });

    document.getElementById('cadastro-btn').addEventListener('click', () => {
        showToast('Funcionalidade de cadastro em desenvolvimento', 'info');
    });

    document.getElementById('criar-evento-btn').addEventListener('click', () => {
        showToast('Redirecionando para painel do organizador...', 'info');
    });

    // Fechar toast
    document.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
    });

    // Menu mobile (para implementação futura)
    document.getElementById('mobile-menu').addEventListener('click', () => {
        showToast('Menu mobile em desenvolvimento', 'info');
    });
}

// Preparação para integrações futuras
class EventBridgeAPI {
    static baseURL = 'https://api.evenbridge.com.br/v1';
    
    static async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    static async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Métodos para integração futura
    static async getEventos(filters = {}) {
        return this.get('/eventos?' + new URLSearchParams(filters));
    }
    
    static async comprarIngresso(eventoId, dadosCompra) {
        return this.post('/ingressos', { eventoId, ...dadosCompra });
    }
    
    static async criarEvento(dadosEvento) {
        return this.post('/eventos', dadosEvento);
    }
}

// Preparação para analytics
class EventBridgeAnalytics {
    static track(event, properties = {}) {
        // Integração futura com Google Analytics, Facebook Pixel, etc.
        console.log('Analytics:', event, properties);
        
        // Exemplo de integração com GA4
        if (typeof gtag !== 'undefined') {
            gtag('event', event, properties);
        }
    }
    
    static pageView(page) {
        this.track('page_view', { page });
    }
    
    static eventClick(eventId, eventName) {
        this.track('event_click', {
            event_id: eventId,
            event_name: eventName
        });
    }
    
    static purchase(eventoId, valor) {
        this.track('purchase', {
            event_id: eventoId,
            value: valor,
            currency: 'BRL'
        });
    }
}

// Performance monitoring
class PerformanceMonitor {
    static init() {
        // Monitorar Core Web Vitals
        this.measureCLS();
        this.measureFID();
        this.measureLCP();
    }
    
    static measureCLS() {
        let clsValue = 0;
        let clsEntries = [];
        
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    clsEntries.push(entry);
                }
            }
        });
        
        observer.observe({type: 'layout-shift', buffered: true});
    }
    
    static measureFID() {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        });
        
        observer.observe({type: 'first-input', buffered: true});
    }
    
    static measureLCP() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        });
        
        observer.observe({type: 'largest-contentful-paint', buffered: true});
    }
}

// Inicializar monitoring
PerformanceMonitor.init();

// Service Worker para PWA (preparação futura)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
// Melhorias de Performance e Transições Suaves
class EvenBridgeUI {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothTransitions();
        this.setupPageLoader();
        this.setupScrollEffects();
        this.setupFadeInAnimations();
        this.setupHeaderScroll();
        this.optimizePerformance();
    }

    // Sistema de loading para transições
    setupPageLoader() {
        // Criar elementos de loading para transições
        const pageOverlay = document.createElement('div');
        pageOverlay.className = 'page-overlay';
        pageOverlay.id = 'page-overlay';
        
        const pageLoader = document.createElement('div');
        pageLoader.className = 'page-transition-loader';
        pageLoader.id = 'page-loader';
        pageLoader.innerHTML = '<div class="page-transition-circle"></div>';
        
        document.body.appendChild(pageOverlay);
        document.body.appendChild(pageLoader);
    }

    // Mostrar loading durante transições
    showPageLoader() {
        const overlay = document.getElementById('page-overlay');
        const loader = document.getElementById('page-loader');
        
        overlay.style.display = 'block';
        loader.style.display = 'block';
        
        // Fade in suave
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            loader.style.opacity = '1';
        });
    }

    // Esconder loading
    hidePageLoader() {
        const overlay = document.getElementById('page-overlay');
        const loader = document.getElementById('page-loader');
        
        if (overlay && loader) {
            overlay.style.opacity = '0';
            loader.style.opacity = '0';
            
            setTimeout(() => {
                overlay.style.display = 'none';
                loader.style.display = 'none';
            }, 300);
        }
    }

    // Transições suaves para cliques
    setupSmoothTransitions() {
        // Interceptar todos os cliques importantes
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.btn, .nav-link, .evento-card');
            
            if (target) {
                // Mostrar loading para ações importantes
                if (target.classList.contains('btn-primary') || 
                    target.classList.contains('evento-card')) {
                    this.showPageLoader();
                    
                    // Simular delay de carregamento
                    setTimeout(() => {
                        this.hidePageLoader();
                    }, 800);
                }
                
                // Adicionar feedback visual
                target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    target.style.transform = '';
                }, 150);
            }
        });
    }

    // Efeitos no scroll
    setupScrollEffects() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
    }

    updateScrollEffects() {
        const scrolled = window.scrollY;
        const header = document.querySelector('.header');
        
        // Header com backdrop blur no scroll
        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Parallax sutil no hero
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroBackground = hero.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    }

    // Header com efeito de scroll
    setupHeaderScroll() {
        const header = document.querySelector('.header');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }

    // Animações de fade in baseadas no scroll
    setupFadeInAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        });

        // Observar elementos que devem animar
        const elementsToAnimate = document.querySelectorAll(
            '.evento-card, .feature-card, .section-header, .hero-stats .stat'
        );
        
        elementsToAnimate.forEach((el, index) => {
            el.classList.add(`delay-${Math.min(index % 3 + 1, 3)}`);
            observer.observe(el);
        });
    }

    // Otimizações de performance
    optimizePerformance() {
        // Lazy loading para imagens
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Preload para hover effects
        const cards = document.querySelectorAll('.evento-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.willChange = 'transform, box-shadow';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.willChange = 'auto';
            });
        });
    }
}

// Sistema de notificações aprimorado
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = this.createContainer();
    }

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 4000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
        return container;
    }

    show(message, type = 'success', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'}-color);
            color: white;
            padding: 1rem 1.5rem;
            margin-bottom: 1rem;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: var(--transition);
            pointer-events: auto;
            cursor: pointer;
            font-weight: 500;
            max-width: 350px;
            word-wrap: break-word;
        `;
        
        notification.textContent = message;
        this.container.appendChild(notification);
        
        // Mostrar com animação
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remover
        setTimeout(() => {
            this.remove(notification);
        }, duration);
        
        // Remover ao clicar
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
        
        return notification;
    }

    remove(notification) {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
}

// Inicializar melhorias
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de UI
    window.evenBridgeUI = new EvenBridgeUI();
    
    // Inicializar sistema de notificações
    window.notifications = new NotificationSystem();
    
    // Substituir função showToast existente
    window.showToast = (message, type = 'success') => {
        window.notifications.show(message, type);
    };
    
    // Melhorar função de compra existente
    const originalComprarIngresso = window.comprarIngresso;
    window.comprarIngresso = function(eventoId) {
        window.evenBridgeUI.showPageLoader();
        
        setTimeout(() => {
            window.evenBridgeUI.hidePageLoader();
            window.notifications.show('Redirecionando para pagamento seguro...', 'info');
            
            setTimeout(() => {
                window.notifications.show('Compra realizada com sucesso! 🎉', 'success');
                
                // Fechar modal se estiver aberto
                const modal = document.getElementById('evento-modal');
                if (modal && modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }, 2000);
        }, 1200);
    };
    
    // Animação inicial dos elementos
    setTimeout(() => {
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-search');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in');
            }, index * 200);
        });
    }, 500);
});

// Smooth scroll aprimorado para navegação
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const headerHeight = document.querySelector('.header').offsetHeight;
    const targetPosition = section.offsetTop - headerHeight - 20;
    
    // Mostrar loading durante scroll longo
    const scrollDistance = Math.abs(window.scrollY - targetPosition);
    if (scrollDistance > 1000) {
        window.evenBridgeUI.showPageLoader();
        setTimeout(() => {
            window.evenBridgeUI.hidePageLoader();
        }, 600);
    }
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Performance monitoring aprimorado
class AdvancedPerformanceMonitor {
    static init() {
        this.measurePageLoad();
        this.monitorLargestContentfulPaint();
        this.trackUserInteractions();
    }
    
    static measurePageLoad() {
        window.addEventListener('load', () => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (pageLoadTime > 3000) {
                console.warn('Page load time is slow:', pageLoadTime + 'ms');
            }
        });
    }
    
    static monitorLargestContentfulPaint() {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            if (lastEntry.startTime > 2500) {
                console.warn('LCP is slow:', lastEntry.startTime + 'ms');
            }
        });
        
        observer.observe({type: 'largest-contentful-paint', buffered: true});
    }
    
    static trackUserInteractions() {
        let interactionCount = 0;
        
        ['click', 'keydown', 'scroll'].forEach(eventType => {
            document.addEventListener(eventType, () => {
                interactionCount++;
            }, { passive: true });
        });
        
        // Report engagement after 30 seconds
        setTimeout(() => {
            console.log('User interactions in 30s:', interactionCount);
        }, 30000);
    }
}
// Sistema de Scroll Rápido e Suave
class AdvancedScrollSystem {
    constructor() {
        this.isScrolling = false;
        this.scrollProgress = null;
        this.fastScrollOverlay = null;
        this.currentSection = null;
        this.init();
    }

    init() {
        this.createScrollElements();
        this.setupNavigationScroll();
        this.setupSmoothScroll();
        this.setupScrollProgress();
        this.setupSectionHighlights();
        this.setupParallaxEffects();
    }

    createScrollElements() {
        // Criar overlay de scroll rápido
        this.fastScrollOverlay = document.createElement('div');
        this.fastScrollOverlay.className = 'fast-scroll-overlay';
        this.fastScrollOverlay.innerHTML = `
            <div class="fast-scroll-content">
                <div class="scroll-indicator"></div>
                <p>Navegando rapidamente...</p>
            </div>
            <div class="scroll-lines">
                <div class="scroll-line"></div>
                <div class="scroll-line"></div>
                <div class="scroll-line"></div>
                <div class="scroll-line"></div>
                <div class="scroll-line"></div>
            </div>
        `;
        document.body.appendChild(this.fastScrollOverlay);

        // Criar barra de progresso de scroll
        this.scrollProgress = document.createElement('div');
        this.scrollProgress.className = 'scroll-progress';
        document.body.appendChild(this.scrollProgress);
    }

    setupNavigationScroll() {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection && !this.isScrolling) {
                    this.fastScrollToSection(targetSection, link);
                }
            });
        });
    }

    fastScrollToSection(targetSection, clickedLink) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        const startPosition = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        const distance = Math.abs(targetPosition - startPosition);
        
        // Mostrar overlay apenas para scroll longo
        const showOverlay = distance > 500;
        
        if (showOverlay) {
            this.showFastScrollOverlay();
        }
        
        // Destacar link ativo
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('scrolling');
        });
        clickedLink.classList.add('scrolling');
        
        // Aplicar blur no conteúdo
        document.body.classList.add('fast-scrolling');
        
        // Calcular duração baseada na distância
        const duration = Math.min(Math.max(distance / 2, 800), 2000);
        
        // Scroll animado com easing personalizado
        this.animatedScroll(startPosition, targetPosition, duration, () => {
            this.isScrolling = false;
            
            if (showOverlay) {
                this.hideFastScrollOverlay();
            }
            
            // Remover blur
            document.body.classList.remove('fast-scrolling');
            
            // Remover destaque do link
            clickedLink.classList.remove('scrolling');
            
            // Destacar seção chegada
            this.highlightSection(targetSection);
        });
    }

    animatedScroll(start, target, duration, callback) {
        const startTime = performance.now();
        const distance = target - start;
        
        const easeOutCubic = (t) => {
            return 1 - Math.pow(1 - t, 3);
        };
        
        const scroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);
            
            const currentPosition = start + (distance * easeProgress);
            window.scrollTo(0, currentPosition);
            
            if (progress < 1) {
                requestAnimationFrame(scroll);
            } else {
                callback();
            }
        };
        
        requestAnimationFrame(scroll);
    }

    showFastScrollOverlay() {
        this.fastScrollOverlay.style.display = 'block';
        
        requestAnimationFrame(() => {
            this.fastScrollOverlay.style.opacity = '1';
        });
    }

    hideFastScrollOverlay() {
        this.fastScrollOverlay.style.opacity = '0';
        
        setTimeout(() => {
            this.fastScrollOverlay.style.display = 'none';
        }, 300);
    }

    setupSmoothScroll() {
        // Interceptar todos os scrolls normais
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    this.updateScrollEffects();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
        
        // Smooth scroll para elementos internos
        document.addEventListener('click', (e) => {
            const scrollElement = e.target.closest('[data-scroll-to]');
            if (scrollElement && !this.isScrolling) {
                e.preventDefault();
                const targetId = scrollElement.dataset.scrollTo;
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            }
        });
    }

    smoothScrollTo(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    setupScrollProgress() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            this.scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
        }, { passive: true });
    }

    setupSectionHighlights() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const navLink = document.querySelector(`a[href="#${entry.target.id}"]`);
                
                if (entry.isIntersecting) {
                    // Remover highlight de outras seções
                    document.querySelectorAll('.section-highlight').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Destacar seção atual
                    entry.target.classList.add('section-highlight', 'active');
                    this.currentSection = entry.target;
                    
                    // Atualizar navegação
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    if (navLink) {
                        navLink.classList.add('active');
                    }
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, {
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.1
        });

        sections.forEach(section => {
            section.classList.add('section-highlight');
            observer.observe(section);
        });
    }

    highlightSection(section) {
        // Remover animação anterior
        section.classList.remove('section-arrival');
        
        // Força reflow
        section.offsetHeight;
        
        // Adicionar animação de chegada
        section.classList.add('section-arrival');
        
        // Remover após animação
        setTimeout(() => {
            section.classList.remove('section-arrival');
        }, 800);
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax-element, .hero-background');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }

    updateScrollEffects() {
        const scrolled = window.pageYOffset;
        
        // Atualizar header
        const header = document.querySelector('.header');
        if (scrolled > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Efeito parallax no hero
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    }

    // Método público para scroll programático
    scrollToElement(elementId, options = {}) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const { 
            fast = false, 
            showOverlay = true,
            duration = 1000 
        } = options;
        
        if (fast) {
            const fakeLink = { classList: { add: () => {}, remove: () => {} } };
            this.fastScrollToSection(element, fakeLink);
        } else {
            this.smoothScrollTo(element);
        }
    }
}

// Sistema de Keyboard Navigation
class KeyboardNavigation {
    constructor() {
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        this.currentIndex = 0;
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            // Navegação com setas quando Ctrl estiver pressionado
            if (e.ctrlKey) {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateToNext();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateToPrevious();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.navigateToFirst();
                        break;
                    case 'End':
                        e.preventDefault();
                        this.navigateToLast();
                        break;
                }
            }
        });
    }

    navigateToNext() {
        this.currentIndex = Math.min(this.currentIndex + 1, this.sections.length - 1);
        this.navigateToSection(this.currentIndex);
    }

    navigateToPrevious() {
        this.currentIndex = Math.max(this.currentIndex - 1, 0);
        this.navigateToSection(this.currentIndex);
    }

    navigateToFirst() {
        this.currentIndex = 0;
        this.navigateToSection(this.currentIndex);
    }

    navigateToLast() {
        this.currentIndex = this.sections.length - 1;
        this.navigateToSection(this.currentIndex);
    }

    navigateToSection(index) {
        const section = this.sections[index];
        if (section) {
            window.scrollSystem.fastScrollToSection(section, { classList: { add: () => {}, remove: () => {} } });
        }
    }
}

// Inicializar sistemas
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar sistema de scroll
    window.scrollSystem = new AdvancedScrollSystem();
    
    // Inicializar navegação por teclado
    window.keyboardNav = new KeyboardNavigation();
    
    // Adicionar data attributes para scroll suave em elementos específicos
    const scrollToButtons = document.querySelectorAll('.btn[onclick*="scrollToSection"]');
    scrollToButtons.forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        const match = onclick.match(/scrollToSection\(['"]([^'"]+)['"]\)/);
        if (match) {
            btn.setAttribute('data-scroll-to', match[1]);
            btn.removeAttribute('onclick');
        }
    });
    
    // Melhorar função global scrollToSection
    window.scrollToSection = function(sectionId, options = {}) {
        window.scrollSystem.scrollToElement(sectionId, options);
    };
    
    console.log('✅ Sistema de scroll avançado inicializado');
    console.log('💡 Dicas:');
    console.log('   • Ctrl + ↑/↓ para navegar entre seções');
    console.log('   • Scroll suave automático ativado');
    console.log('   • Animação de scroll rápido nos menus');
});

// Função utilitária para desenvolvedores
window.EvenBridgeScroll = {
    scrollTo: (elementId, fast = false) => {
        window.scrollSystem.scrollToElement(elementId, { fast });
    },
    
    scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    scrollToBottom: () => {
        window.scrollTo({ 
            top: document.documentElement.scrollHeight, 
            behavior: 'smooth' 
        });
    }
};

// Inicializar monitoring
AdvancedPerformanceMonitor.init();
