// js/cart.js
class CartSystem {
    // Adicionar no início da classe CartSystem
constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.updateCartCounter();
    this.initializeCartSecurity(); // Nova função
}

// Nova função para controlar segurança do carrinho
initializeCartSecurity() {
    // Verificar login a cada mudança de estado
    document.addEventListener('user-login-change', () => {
        this.updateCartVisibility();
    });
    
    // Verificar periodicamente se usuário ainda está logado
    setInterval(() => {
        this.validateUserSession();
    }, 30000); // A cada 30 segundos
}

// Função para validar se usuário ainda está logado
validateUserSession() {
    if (!authSystem.currentUser && this.cart.length > 0) {
        // Se usuário deslogou mas tem itens no carrinho, limpar carrinho
        this.clearCart();
        this.showToast('Sessão expirada. Carrinho foi limpo.', 'warning');
    }
}

// Atualizar visibilidade do carrinho
updateCartVisibility() {
    const cartBtn = document.querySelector('.cart-btn');
    const addToCartBtns = document.querySelectorAll('.btn-cart, .evento-actions .btn-primary');
    
    if (cartBtn) {
        if (authSystem.currentUser) {
            cartBtn.style.display = 'block';
            cartBtn.disabled = false;
        } else {
            cartBtn.style.display = 'none';
            cartBtn.disabled = true;
        }
    }
    
    addToCartBtns.forEach(btn => {
        if (authSystem.currentUser) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        } else {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
    });
}
    
    addToCart(eventoId, quantidade = 1) {
        // Verificação de login
        if (!authSystem || !authSystem.currentUser) {
            this.showLoginRequired();
            return false;
        }
        
        const evento = getEventById(eventoId);
        if (!evento) {
            this.showToast('Evento não encontrado!', 'error');
            return false;
        }
        
        // Verificar disponibilidade
        if (evento.vendidos + quantidade > evento.capacidade) {
            this.showToast('Não há ingressos suficientes disponíveis!', 'error');
            return false;
        }
    
    // Verificar se o item já existe no carrinho
    const existingItem = this.cart.find(item => item.eventoId === eventoId);
    
    if (existingItem) {
        existingItem.quantidade += quantidade;
        existingItem.valorTotal = existingItem.quantidade * existingItem.valorUnitario;
    } else {
        const cartItem = {
            id: Date.now(),
            eventoId: eventoId,
            evento: evento,
            userId: authSystem.currentUser.id, // Vincular ao usuário
            quantidade: quantidade,
            valorUnitario: evento.preco,
            valorTotal: evento.preco * quantidade,
            dataAdicao: new Date().toISOString()
        };
        this.cart.push(cartItem);
    }
    
    this.saveCart();
    this.updateCartCounter();
    this.showToast(`${quantidade} ingresso(s) adicionado(s) ao carrinho!`, 'success');
    return true;
}

// Nova função para mostrar necessidade de login
showLoginRequired() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🔐 Login Necessário</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="login-required-content">
                <p>Para adicionar itens ao carrinho e comprar ingressos, você precisa fazer login.</p>
                <div class="login-required-actions">
                    <button class="btn btn-primary" onclick="authSystem.openAuthModal(); document.querySelector('.modal').remove();">
                        Fazer Login
                    </button>
                    <button class="btn btn-outline" onclick="document.querySelector('.modal').remove();">
                        Continuar Navegando
                    </button>
                </div>
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

// Modificar showCart para verificar login
showCart() {
    if (!authSystem || !authSystem.currentUser) {
        this.showLoginRequired();
        return;
    }
    const existingModal = document.getElementById('cart-modal');
    if (existingModal) {
        existingModal.remove(); // Remove o anterior antes de criar outro
    }

    const modal = document.createElement('div');
    modal.id = 'cart-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content cart-modal-content">
            <div class="modal-header">
                <h2>Meu Carrinho</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="cart-content">
                ${this.renderCartItems()}
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <h3>Total: R$ ${this.getCartTotal().toFixed(2)}</h3>
                </div>
                <div class="cart-actions">
                    <button class="btn btn-outline" onclick="cartSystem.clearCart(); document.getElementById('cart-modal')?.remove(); document.body.style.overflow = 'auto';">
                        Limpar Carrinho
                    </button>
                    <button class="btn btn-primary" onclick="cartSystem.checkout()" ${this.cart.length === 0 ? 'disabled' : ''}>
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    modal.querySelector('.modal-close').onclick = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
        modal.remove();
        document.body.style.overflow = 'auto';
    };
}

updateCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.innerHTML = this.renderCartModalContent(); // Função que monta o HTML do carrinho
    // Re-adicione os event listeners dos botões de remover, se necessário
  }
}
    
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCounter();
        this.showToast('Item removido do carrinho!', 'success');
        this.updateCartModal();
            if (cartModal) {
                cartModal.remove();
                document.body.style.overflow = 'auto';
            }
    }
    
    updateQuantity(itemId, novaQuantidade) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (novaQuantidade <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantidade = novaQuantidade;
                item.valorTotal = item.quantidade * item.valorUnitario;
                this.saveCart();
                this.updateCartCounter();
            }
        }
    }
    
    getCartTotal() {
        return this.cart.reduce((total, item) => total + item.valorTotal, 0);
    }
    
    getCartItemsCount() {
        return this.cart.reduce((count, item) => count + item.quantidade, 0);
    }
    
    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCounter();
        
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    updateCartCounter() {
        const cartCounters = document.querySelectorAll('.cart-counter');
        const itemCount = this.getCartItemsCount();
        
        cartCounters.forEach(counter => {
            counter.textContent = itemCount;
            counter.style.display = itemCount > 0 ? 'block' : 'none';
        });
    }
    
    showCart() {
                // Evita múltiplos modais
        const oldModal = document.getElementById('cart-modal');
        if (oldModal) oldModal.remove();

        const modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content cart-modal-content">
                <div class="modal-header">
                    <h2>Meu Carrinho</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="cart-content">
                    ${this.renderCartItems()}
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <h3>Total: R$ ${this.getCartTotal().toFixed(2)}</h3>
                    </div>
                    <div class="cart-actions">
                        <button class="btn btn-outline" onclick="cartSystem.clearCart(); document.getElementById('cart-modal')?.remove(); document.body.style.overflow = 'auto';">
                            Limpar Carrinho
                        </button>
                        <button class="btn btn-primary" onclick="cartSystem.checkout()" ${this.cart.length === 0 ? 'disabled' : ''}>
                            Finalizar Compra
                        </button>
                    </div>
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
    
    renderCartItems() {
        if (this.cart.length === 0) {
            return '<div class="cart-empty">Seu carrinho está vazio</div>';
        }
        
        return this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.evento.nome}</h4>
                    <p>📅 ${new Date(item.evento.dataEvento).toLocaleDateString('pt-BR')}</p>
                    <p>📍 ${item.evento.local}, ${item.evento.cidade}</p>
                    <p class="cart-item-price">R$ ${item.valorUnitario.toFixed(2)} cada</p>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button onclick="cartSystem.updateQuantity(${item.id}, ${item.quantidade - 1})">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="cartSystem.updateQuantity(${item.id}, ${item.quantidade + 1})">+</button>
                    </div>
                    <div class="cart-item-total">R$ ${item.valorTotal.toFixed(2)}</div>
                    <button class="btn-remove" onclick="cartSystem.removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `).join('');
    }
    
    async checkout() {
    if (!authSystem.currentUser) {
        this.showToast('Faça login para comprar ingressos!', 'error');
        return false;
    }

    if (this.cart.length === 0) {
        this.showToast('Carrinho vazio!', 'error');
        return false;
    }

    try {
        // Aqui entraria a lógica real de compra — mas vamos simular:
        // Ex: salvar tickets no localStorage, aumentar contador "vendidos" etc.
        for (const item of this.cart) {
            const evento = eventManager.getEventById(item.eventoId);
            if (evento) {
                evento.vendidos += item.quantidade;
            }
        }

        await eventManager.saveEvents();

        this.clearCart();

        // Fechar modal do carrinho
        const modal = document.getElementById('cart-modal');
        if (modal) modal.remove();
        document.body.style.overflow = 'auto';

        // Mensagem de sucesso
        this.showToast('Compra realizada com sucesso!', 'success');

        // Opcional: re-renderizar eventos (para atualizar "vendidos")
        if (typeof renderEventos === 'function') {
            renderEventos();
        }

        return true;
    } catch (error) {
        console.error('Erro no checkout:', error);
        this.showToast('Erro ao processar compra. Tente novamente.', 'error');
        return false;
    }
}
    
    generateQRCode() {
        return 'QR' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    generateTicketCode() {
        return 'TICKET-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
    
    showPurchaseConfirmation(tickets) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>✅ Compra Confirmada!</h2>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="purchase-confirmation">
                    <p>Parabéns! Sua compra foi realizada com sucesso.</p>
                    <p>Você comprou ${tickets.length} ingresso(s) para:</p>
                    <ul>
                        ${tickets.map(ticket => `
                            <li>${ticket.evento.nome} - ${ticket.quantidade}x ingressos</li>
                        `).join('')}
                    </ul>
                    <p>Seus tickets foram salvos na seção "Meus Tickets".</p>
                    <div class="confirmation-actions">
                        <button class="btn btn-primary" onclick="authSystem.showMyTickets(); this.closest('.modal').remove();">
                            Ver Meus Tickets
                        </button>
                        <button class="btn btn-outline" onclick="this.closest('.modal').remove();">
                            Continuar Navegando
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Configurar fechamento
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        });
    }
    
    showLoading(message) {
        const loading = document.createElement('div');
        loading.id = 'cart-loading';
        loading.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loading);
    }
    
    hideLoading() {
        const loading = document.getElementById('cart-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    showToast(message, type = 'info') {
        // Reutilizar a função do authSystem ou criar uma própria
        if (authSystem && authSystem.showToast) {
            authSystem.showToast(message, type);
        } else {
            alert(message);
        }
    }

    renderCartItems() {
    if (this.cart.length === 0) {
        return `<p>Seu carrinho está vazio.</p>`;
    }

    return this.cart.map(item => `
        <div class="cart-item">
            <strong>${item.evento.nome}</strong><br>
            Quantidade: ${item.quantidade}<br>
            Preço unitário: R$ ${item.valorUnitario.toFixed(2)}<br>
            Total: R$ ${item.valorTotal.toFixed(2)}<br>
            <button class="btn btn-outline" onclick="cartSystem.removeFromCart(${item.id})">Remover</button>
            <hr>
        </div>
    `).join('');
}

}
