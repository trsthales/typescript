/**
 * Classe de domínio: Product (Produto)
 * - Define atributos essenciais para exibição e venda
 * Exercício 1: Uso de branded type para ProductId evitando confundir com outros ids.
 */
export type ProductId = string & { readonly __brandProductId: unique symbol }
export function asProductId(id: string): ProductId { return id as ProductId }

export class Product {
  public readonly id: ProductId
  public title: string
  public description: string
  public price: number
  public stock: number
  public weightKg: number

  constructor(params: { id: ProductId; title: string; description: string; price: number; stock: number; weightKg?: number }) {
    if (params.price < 0) throw new Error('Preço não pode ser negativo')
    if (params.stock < 0) throw new Error('Estoque não pode ser negativo')
    this.id = params.id
    this.title = params.title
    this.description = params.description
    this.price = params.price
    this.stock = params.stock
    this.weightKg = params.weightKg ?? 0.5
  }
}
