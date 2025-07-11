class TicketSystem {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
        this.tickets = JSON.parse(localStorage.getItem('tickets') || '[]');
    }
    
    // Adicionar ao carrinho
    addToCart(eventoId, quantidade = 1) {
        const evento = eventManager.getEventById(eventoId);
        if (!evento) return false;
        
        if (evento.vendidos + quantidade > evento.capacidade) {
            this.showToast('Não há ingressos suficientes disponíveis!', 'error');
            return false;
        }
        
        const cartItem = {
            id: Date.now(),
            eventoId: eventoId,
            evento: evento,
            quantidade: quantidade,
            valorUnitario: evento.preco,
            valorTotal: evento.preco * quantidade
        };
        
        this.cart.push(cartItem);
        this.saveCart();
        this.updateCartUI();
        this.showToast(`${quantidade} ingresso(s) adicionado(s) ao carrinho!`, 'success');
        return true;
    }
    
    // Finalizar compra
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
            // Processar cada item do carrinho
            for (const item of this.cart) {
                const ticket = {
                    id: Date.now() + Math.random(),
                    eventoId: item.eventoId,
                    usuarioId: authSystem.currentUser.id,
                    quantidade: item.quantidade,
                    valorTotal: item.valorTotal,
                    dataCompra: new Date().toISOString(),
                    status: 'ativo',
                    codigoQR: this.generateQRCode()
                };
                
                this.tickets.push(ticket);
                
                // Atualizar vendidos do evento
                const evento = eventManager.getEventById(item.eventoId);
                evento.vendidos += item.quantidade;
            }
            
            await this.saveTickets();
            await eventManager.saveEvents();
            
            this.clearCart();
            this.showToast('Compra realizada com sucesso!', 'success');
            this.showPurchaseConfirmation();
            return true;
            
        } catch (error) {
            this.showToast('Erro ao processar compra. Tente novamente.', 'error');
            return false;
        }
    }
    
    // Gerar código QR para entrada
    generateQRCode() {
        return 'QR' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}
