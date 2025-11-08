/** Serviço de produtos
 * - Apenas leitura e ajuste de estoque (ex: após compra)
 */
import { IProductRepository } from '../repositories/InMemoryProductRepository.js'
import { Product } from '../domain/Product.js'

export class ProductService {
  constructor(private readonly repo: IProductRepository) {}

  async list(): Promise<Product[]> {
    return this.repo.list()
  }

  async get(id: string): Promise<Product | undefined> {
    return this.repo.findById(id)
  }
}
