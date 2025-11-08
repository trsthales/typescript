/** Serviço de carrinho e checkout
 * - Mantém carrinhos simples em memória.
 */
import { Cart } from '../domain/Cart.js';
import { Order, OrderItem } from '../domain/Order.js';
import { randomUUID } from 'crypto';
import { ok, err } from '../shared/result.js';
import { estimateCost } from '../examples/excellent/strategy-shipping.js';
export class CartService {
    products;
    orders;
    carts = new Map();
    constructor(products, orders) {
        this.products = products;
        this.orders = orders;
    }
    /** Cria (se necessário) e retorna o carrinho do usuário */
    getOrCreateCart(userId) {
        const id = userId ?? randomUUID();
        let cart = this.carts.get(id);
        if (!cart) {
            cart = new Cart({ id, userId });
            this.carts.set(id, cart);
        }
        return cart;
    }
    /** Retorna o carrinho por id */
    getCart(cartId) {
        return this.carts.get(cartId);
    }
    /** Adiciona produto ao carrinho */
    addItem(cartId, productId, quantity = 1) {
        const cart = this.carts.get(cartId);
        if (!cart)
            throw new Error('Carrinho não encontrado');
        if (quantity <= 0)
            throw new Error('Quantidade inválida');
        cart.addItem(productId, quantity);
    }
    /** Remove produto do carrinho */
    removeItem(cartId, productId, quantity = 1) {
        const cart = this.carts.get(cartId);
        if (!cart)
            throw new Error('Carrinho não encontrado');
        cart.removeItem(productId, quantity);
    }
    /** Checkout: valida estoque, cria order e abate estoque */
    async checkout(cartId, userId, opts) {
        const cart = this.carts.get(cartId);
        if (!cart)
            return err('CART_NOT_FOUND');
        const items = cart.listItems();
        if (items.length === 0)
            return err('EMPTY_CART');
        const orderItems = [];
        for (const it of items) {
            const product = await this.products.findById(it.productId);
            if (!product)
                return err('PRODUCT_NOT_FOUND');
            if (product.stock < it.quantity)
                return err('OUT_OF_STOCK');
            orderItems.push(new OrderItem({ productId: product.id, quantity: it.quantity, price: product.price }));
            await this.products.updateStock(product.id, product.stock - it.quantity);
        }
        let order = new Order({ id: randomUUID(), userId, items: orderItems });
        // Aplicar cupom (se houver)
        if (opts?.coupon) {
            const discountedTotal = opts.coupon.apply(order.total);
            order = new Order({ id: order.id, userId, items: orderItems, createdAt: order.createdAt });
            order.total = discountedTotal;
        }
        // Calcular frete via Strategy
        if (opts?.shippingZip && opts?.shippingCtx) {
            const freight = estimateCost(opts.shippingZip, opts.shippingCtx);
            order.total = order.total + freight;
        }
        await this.orders.create(order);
        cart.clear();
        return ok(order);
    }
}
