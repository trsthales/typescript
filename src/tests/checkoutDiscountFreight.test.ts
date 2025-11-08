import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository.js'
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository.js'
import { CartService } from '../services/CartService.js'
import { Product, asProductId } from '../domain/Product.js'
import { Coupon } from '../domain/Coupon.js'

function makeRepos() {
  const productRepo = new InMemoryProductRepository()
  productRepo.create(new Product({ id: asProductId('p1'), title: 'Item', description: 'Teste', price: 100, stock: 10, weightKg: 1 }))
  const orderRepo = new InMemoryOrderRepository()
  return { productRepo, orderRepo }
}

describe('Checkout com desconto e frete', () => {
  it('aplica desconto e frete corretamente', async () => {
    const { productRepo, orderRepo } = makeRepos()
    const cartService = new CartService(productRepo, orderRepo)
    const cart = cartService.getOrCreateCart('u1')
    cartService.addItem(cart.id, 'p1', 2) // total itens = 200
    const coupon = new Coupon('PROMO10', 10) // desconto 10% => 20
    const result = await cartService.checkout(cart.id, 'u1', {
      coupon,
  shippingZip: '91234', // express => base 25 + 50*0.35 = 42.5 (peso ignorado nesta estratégia)
  shippingCtx: { weightKg: 2, distanceKm: 50 }
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      const t = result.value.totals
      expect(t.itemsTotal).toBe(200)
      expect(t.discountTotal).toBe(20)
  expect(t.freightTotal).toBeCloseTo(42.5, 5)
  expect(t.grandTotal).toBeCloseTo(200 - 20 + 42.5, 5)
    }
  })
})
