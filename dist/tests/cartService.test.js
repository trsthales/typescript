import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository.js';
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository.js';
import { CartService } from '../services/CartService.js';
import { Product, asProductId } from '../domain/Product.js';
function makeProductRepo() {
    const repo = new InMemoryProductRepository();
    repo.create(new Product({ id: asProductId('p1'), title: 'Item', description: 'Teste', price: 100, stock: 5, weightKg: 0.5 }));
    return repo;
}
describe('CartService', () => {
    it('checkout simples', async () => {
        const productRepo = makeProductRepo();
        const orderRepo = new InMemoryOrderRepository();
        const cartService = new CartService(productRepo, orderRepo);
        const cart = cartService.getOrCreateCart('u1');
        cartService.addItem(cart.id, 'p1', 2);
        const result = await cartService.checkout(cart.id, 'u1');
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.total).toBe(200);
        }
    });
    it('erro por carrinho vazio', async () => {
        const productRepo = makeProductRepo();
        const orderRepo = new InMemoryOrderRepository();
        const cartService = new CartService(productRepo, orderRepo);
        const cart = cartService.getOrCreateCart('u2');
        const result = await cartService.checkout(cart.id, 'u2');
        expect(result.ok).toBe(false);
        if (!result.ok)
            expect(result.error).toBe('EMPTY_CART');
    });
});
