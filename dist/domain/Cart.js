/**
 * Carrinho de compras
 * - Agrupa itens e pertence a um usuário (não obrigatório para navegar)
 */
import { CartItem } from './CartItem.js';
export class Cart {
    id;
    userId;
    items;
    constructor(params) {
        this.id = params.id;
        this.userId = params.userId;
        this.items = new Map((params.items ?? []).map(i => [i.productId, i]));
    }
    /** Lista os itens do carrinho (cópia defensiva). */
    listItems() {
        return Array.from(this.items.values()).map(i => new CartItem({ productId: i.productId, quantity: i.quantity }));
    }
    /** Adiciona quantidade de um produto ao carrinho. */
    addItem(productId, quantity = 1) {
        const existing = this.items.get(productId);
        if (existing)
            existing.quantity += quantity;
        else
            this.items.set(productId, new CartItem({ productId, quantity }));
    }
    /** Remove quantidade; se zerar, remove o item. */
    removeItem(productId, quantity = 1) {
        const existing = this.items.get(productId);
        if (!existing)
            return;
        existing.quantity -= quantity;
        if (existing.quantity <= 0)
            this.items.delete(productId);
    }
    /** Limpa o carrinho. */
    clear() {
        this.items.clear();
    }
}
