import { openDb } from '../db/sqlite.js'
import { SqliteUserRepository, SqliteProductRepository, SqliteOrderRepository } from '../repositories/SqliteRepositories.js'
import { User } from '../domain/User.js'
import { Product, asProductId } from '../domain/Product.js'
import { Order, OrderItem } from '../domain/Order.js'
import { randomUUID } from 'crypto'

describe('SQLite Repositories', () => {
  const db = openDb(':memory:')
  const userRepo = new SqliteUserRepository(db)
  const productRepo = new SqliteProductRepository(db)
  const orderRepo = new SqliteOrderRepository(db)

  it('creates and fetches user by email', async () => {
    const u = new User({ id: randomUUID(), name: 'Ana', email: 'ana@test.com' })
    await userRepo.create(u)
    const found = await userRepo.findByEmail('ana@test.com')
    expect(found?.id).toBe(u.id)
  })

  it('creates product and updates stock', async () => {
    const p = new Product({ id: asProductId('px'), title: 'Livro', description: 'TS', price: 100, stock: 2, weightKg: 0.5 })
    await productRepo.create(p)
    const got = await productRepo.findById(p.id)
    expect(got?.title).toBe('Livro')
    await productRepo.updateStock(p.id, 1)
    const after = await productRepo.findById(p.id)
    expect(after?.stock).toBe(1)
  })

  it('persists order with items', async () => {
    const p = new Product({ id: asProductId('py'), title: 'Mouse', description: 'Óptico', price: 50, stock: 5, weightKg: 0.2 })
    await productRepo.create(p)
    const u = new User({ id: randomUUID(), name: 'Bia', email: 'bia@test.com' })
    await userRepo.create(u)
    const items = [new OrderItem({ productId: p.id, quantity: 2, price: p.price })]
    const order = new Order({ id: randomUUID(), userId: u.id, items })
    await orderRepo.create(order)
    const loaded = await orderRepo.findById(order.id)
    expect(loaded?.items[0].quantity).toBe(2)
  })
})
