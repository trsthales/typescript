/** Repositório em memória de produtos. */
import { Product } from '../domain/Product.js'
import { MemoryRepo } from './MemoryRepo.js'

export interface IProductRepository {
  create(product: Product): Promise<void>
  findById(id: string): Promise<Product | undefined>
  list(): Promise<Product[]>
  updateStock(id: string, stock: number): Promise<void>
}

export class InMemoryProductRepository extends MemoryRepo<Product> implements IProductRepository {
  async create(product: Product): Promise<void> { return super.create(product) }
  async findById(id: string): Promise<Product | undefined> { return this.get(id) }
  async list(): Promise<Product[]> { return super.list() }
  async updateStock(id: string, stock: number): Promise<void> {
    const p = await this.get(id)
    if (!p) return
    p.stock = stock
    await this.update(id, { stock })
  }
}
