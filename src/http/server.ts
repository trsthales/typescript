import Fastify from 'fastify'
import { z } from 'zod'
import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository.js'
import { InMemoryProductRepository } from '../repositories/InMemoryProductRepository.js'
import { InMemoryOrderRepository } from '../repositories/InMemoryOrderRepository.js'
import { SqliteUserRepository, SqliteProductRepository, SqliteOrderRepository } from '../repositories/SqliteRepositories.js'
import { openDb } from '../db/sqlite.js'
import { UserService } from '../services/UserService.js'
import { ProductService } from '../services/ProductService.js'
import { CartService } from '../services/CartService.js'
import { seedProducts } from '../data/seed.js'
import { Coupon } from '../domain/Coupon.js'

const app = Fastify()

// Escolha de persistência via ENV: PERSISTENCE=sqlite para usar banco
const persistence = process.env.PERSISTENCE
let userRepo: InMemoryUserRepository | SqliteUserRepository
let productRepo: InMemoryProductRepository | SqliteProductRepository
let orderRepo: InMemoryOrderRepository | SqliteOrderRepository

if (persistence === 'sqlite') {
  const dbFile = process.env.DB_FILE || ':memory:'
  const db = openDb(dbFile)
  userRepo = new SqliteUserRepository(db)
  productRepo = new SqliteProductRepository(db)
  orderRepo = new SqliteOrderRepository(db)
  console.log('[persist] usando SQLite', dbFile)
} else {
  userRepo = new InMemoryUserRepository()
  productRepo = new InMemoryProductRepository()
  orderRepo = new InMemoryOrderRepository()
  console.log('[persist] usando memória')
}
const userService = new UserService(userRepo)
const productService = new ProductService(productRepo)
const cartService = new CartService(productRepo, orderRepo)

// seed inicial
await seedProducts(productRepo)

// Schemas (DTOs)
const registerSchema = z.object({ name: z.string().min(1), email: z.string().email() })
const addItemSchema = z.object({ productId: z.string().min(1), quantity: z.number().int().positive() })
const checkoutSchema = z.object({
  userId: z.string().min(1),
  cartId: z.string().min(1),
  coupon: z.string().optional(),
  shippingZip: z.string().length(5).optional(),
  distanceKm: z.number().nonnegative().optional(),
  weightKg: z.number().nonnegative().optional()
})

// Rotas
app.post('/users', async (req, reply) => {
  const body = registerSchema.parse(req.body)
  const result = await userService.register(body)
  if (!result.ok) return reply.code(400).send({ error: result.error })
  return reply.code(201).send(result.value)
})

app.get('/products', async (_req, _reply) => {
  const items = await productService.list()
  return items
})

app.post('/cart/:userId/items', async (req, reply) => {
  const params = z.object({ userId: z.string() }).parse(req.params)
  const body = addItemSchema.parse(req.body)
  const cart = cartService.getOrCreateCart(params.userId)
  cartService.addItem(cart.id, body.productId, body.quantity)
  return reply.code(200).send(cartService.getCart(cart.id))
})

app.post('/checkout', async (req, reply) => {
  const { userId, cartId, coupon, shippingZip, distanceKm, weightKg } = checkoutSchema.parse(req.body)
  const opts: any = {}
  if (coupon) opts.coupon = new Coupon(coupon, 10)
  if (shippingZip && distanceKm !== undefined && weightKg !== undefined) {
    opts.shippingZip = shippingZip
    opts.shippingCtx = { distanceKm, weightKg }
  }
  const result = await cartService.checkout(cartId, userId, opts)
  if (!result.ok) return reply.code(400).send({ error: result.error })
  return reply.code(201).send(result.value)
})

const port = Number(process.env.PORT ?? 3333)
app.listen({ port, host: '0.0.0.0' }).then(() => {
  console.log(`HTTP server on http://localhost:${port}`)
})
