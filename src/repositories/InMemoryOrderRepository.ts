/** Repositório em memória de pedidos (Orders). */
import { Order } from '../domain/Order.js'
import { MemoryRepo } from './MemoryRepo.js'

export interface IOrderRepository {
  create(order: Order): Promise<void>
  findById(id: string): Promise<Order | undefined>
  listByUser(userId: string): Promise<Order[]>
}

export class InMemoryOrderRepository extends MemoryRepo<Order> implements IOrderRepository {
  async create(order: Order): Promise<void> { return super.create(order) }
  async findById(id: string): Promise<Order | undefined> { return this.get(id) }
  async listByUser(userId: string): Promise<Order[]> {
    return (await this.list()).filter(o => o.userId === userId)
  }
}
