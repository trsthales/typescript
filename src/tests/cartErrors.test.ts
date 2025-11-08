import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository.js'
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository.js'
import { CartService } from '../services/CartService.js'
import { Product, asProductId } from '../domain/Product.js'

describe('CartService errors', () => {
  it('PRODUCT_NOT_FOUND', async () => {
    const productRepo = new InMemoryProductRepository()
    const orderRepo = new InMemoryOrderRepository()
    const cartService = new CartService(productRepo, orderRepo)
    const cart = cartService.getOrCreateCart('u1')
    cartService.addItem(cart.id, 'nope', 1)
    const res = await cartService.checkout(cart.id, 'u1')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('PRODUCT_NOT_FOUND')
  })

  it('OUT_OF_STOCK', async () => {
    const productRepo = new InMemoryProductRepository()
    await productRepo.create(new Product({ id: asProductId('p1'), title: 'Item', description: 'Teste', price: 100, stock: 1 }))
    const orderRepo = new InMemoryOrderRepository()
    const cartService = new CartService(productRepo, orderRepo)
    const cart = cartService.getOrCreateCart('u1')
    cartService.addItem(cart.id, 'p1', 2)
    const res = await cartService.checkout(cart.id, 'u1')
    expect(res.ok).toBe(false)
    if (!res.ok) expect(res.error).toBe('OUT_OF_STOCK')
  })
})
