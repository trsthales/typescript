import type { IUserRepository } from './InMemoryUserRepository.js'
import type { IProductRepository } from './InMemoryProductRepository.js'
import type { IOrderRepository } from './InMemoryOrderRepository.js'
import { User } from '../domain/User.js'
import { Product, asProductId } from '../domain/Product.js'
import { Order, OrderItem } from '../domain/Order.js'
import type { openDb } from '../db/sqlite.js'
type DB = ReturnType<typeof openDb>

export class SqliteUserRepository implements IUserRepository {
  constructor(private db: DB) {}
  async create(user: User): Promise<void> {
    this.db.prepare('insert into users (id,name,email) values (?,?,?)').run(user.id, user.name, user.email)
  }
  async findByEmail(email: string): Promise<User | undefined> {
    const row = this.db.prepare('select * from users where email = ?').get(email) as any
    if (!row) return undefined
    return new User({ id: row.id, name: row.name, email: row.email })
  }
  async findById(id: string): Promise<User | undefined> {
    const row = this.db.prepare('select * from users where id = ?').get(id) as any
    if (!row) return undefined
    return new User({ id: row.id, name: row.name, email: row.email })
  }
  async list(): Promise<User[]> {
    const rows = this.db.prepare('select * from users').all() as any[]
    return rows.map(r => new User({ id: r.id, name: r.name, email: r.email }))
  }
}

export class SqliteProductRepository implements IProductRepository {
  constructor(private db: DB) {}
  async create(product: Product): Promise<void> {
    this.db.prepare('insert into products (id,title,description,price,stock,weightKg) values (?,?,?,?,?,?)')
      .run(product.id, product.title, product.description, product.price, product.stock, product.weightKg)
  }
  async findById(id: string): Promise<Product | undefined> {
    const row = this.db.prepare('select * from products where id = ?').get(id) as any
    if (!row) return undefined
    return new Product({ id: asProductId(row.id), title: row.title, description: row.description, price: row.price, stock: row.stock, weightKg: row.weightKg })
  }
  async list(): Promise<Product[]> {
    const rows = this.db.prepare('select * from products').all() as any[]
    return rows.map(r => new Product({ id: asProductId(r.id), title: r.title, description: r.description, price: r.price, stock: r.stock, weightKg: r.weightKg }))
  }
  async updateStock(id: string, stock: number): Promise<void> {
    this.db.prepare('update products set stock = ? where id = ?').run(stock, id)
  }
}

export class SqliteOrderRepository implements IOrderRepository {
  constructor(private db: DB) {}
  async create(order: Order): Promise<void> {
    this.db.prepare('insert into orders (id,userId,createdAt,itemsTotal,discountTotal,freightTotal,grandTotal) values (?,?,?,?,?,?,?)')
      .run(order.id, order.userId, order.createdAt.toISOString(), order.totals.itemsTotal, order.totals.discountTotal, order.totals.freightTotal, order.totals.grandTotal)
    const stmt = this.db.prepare('insert into order_items (orderId,productId,quantity,price) values (?,?,?,?)')
    for (const it of order.items) {
      stmt.run(order.id, it.productId, it.quantity, it.price)
    }
  }
  async findById(id: string): Promise<Order | undefined> {
    const row = this.db.prepare('select * from orders where id = ?').get(id) as any
    if (!row) return undefined
    const itemsRows = this.db.prepare('select * from order_items where orderId = ?').all(id) as any[]
    const items = itemsRows.map(r => new OrderItem({ productId: r.productId, quantity: r.quantity, price: r.price }))
    return new Order({ id: row.id, userId: row.userId, items, createdAt: new Date(row.createdAt), discountTotal: row.discountTotal, freightTotal: row.freightTotal })
  }
  async listByUser(userId: string): Promise<Order[]> {
    const rows = this.db.prepare('select * from orders where userId = ?').all(userId) as any[]
    return rows.map(r => new Order({ id: r.id, userId: r.userId, items: [], createdAt: new Date(r.createdAt), discountTotal: r.discountTotal, freightTotal: r.freightTotal }))
  }
}
