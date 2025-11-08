/**
 * Pedido (Order)
 * - Resultado do checkout de um carrinho.
 */
export class OrderItem {
    productId;
    quantity;
    price; // preço unitário no momento da compra
    constructor(params) {
        this.productId = params.productId;
        this.quantity = params.quantity;
        this.price = params.price;
    }
    subtotal() { return this.price * this.quantity; }
}
export class Order {
    id;
    userId;
    items;
    createdAt;
    total;
    constructor(params) {
        this.id = params.id;
        this.userId = params.userId;
        this.items = params.items;
        this.createdAt = params.createdAt ?? new Date();
        this.total = params.items.reduce((acc, it) => acc + it.subtotal(), 0);
    }
}
