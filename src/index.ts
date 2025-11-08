/*
  E-commerce didático em TypeScript
  - Cadastro de usuário
  - Listagem de produtos
  - Adição ao carrinho
  - Pagamento (mock)
*/

import { InMemoryUserRepository } from './repositories/InMemoryUserRepository.js'
import { InMemoryProductRepository } from './repositories/InMemoryProductRepository.js'
import { InMemoryOrderRepository } from './repositories/InMemoryOrderRepository.js'
import { UserService } from './services/UserService.js'
import { ProductService } from './services/ProductService.js'
import { CartService } from './services/CartService.js'
import { PaymentService } from './services/PaymentService.js'
import { seedProducts } from './data/seed.js'
import { Coupon } from './domain/Coupon.js'
import { productTitles } from './utils/product.js'
import type { Product } from './domain/Product.js'

async function main() {
  const userRepo = new InMemoryUserRepository()
  const productRepo = new InMemoryProductRepository()
  const orderRepo = new InMemoryOrderRepository()

  const userService = new UserService(userRepo)
  const productService = new ProductService(productRepo)
  const cartService = new CartService(productRepo, orderRepo)
  const paymentService = new PaymentService()

  // Popular produtos de exemplo (await em função async)
  await seedProducts(productRepo)

  // 1) Cadastro de usuário
  const userResult = await userService.register({
    name: 'Maria Compradora',
    email: 'maria@example.com'
  })
  if (!userResult.ok) {
    console.log('Erro cadastro usuário:', userResult.error)
    return
  }
  const user = userResult.value
  console.log('Usuário cadastrado:', user)

  // 2) Listagem de produtos
  const products: Product[] = await productService.list()
  console.log('Produtos disponíveis:', products.map((p: Product) => `${p.title} - R$${p.price}`))
  console.log('Títulos apenas:', productTitles(products))

  // 3) Adicionar ao carrinho
  const cart = cartService.getOrCreateCart(user.id)
  cartService.addItem(cart.id, products[0].id, 2)
  cartService.addItem(cart.id, products[1].id, 1)
  console.log('Carrinho:', cartService.getCart(cart.id))

  // 4) Pagamento
  const coupon = new Coupon('PROMO10', 10)
  const orderResult = await cartService.checkout(cart.id, user.id, {
    coupon,
    shippingZip: '91234',
    shippingCtx: { weightKg: products.reduce((acc, p) => acc + p.weightKg, 0), distanceKm: 50 }
  })
  if (!orderResult.ok) {
    console.log('Erro no checkout:', orderResult.error)
    return
  }
  const order = orderResult.value
  const payment = await paymentService.pay(order.id, order.totals.grandTotal)
  console.log('Pedido:', order)
  console.log('Pagamento:', payment)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
