/** Exercício 3: Função que recebe Product[] e retorna títulos
 * Demonstra inferência e tipos explícitos.
 */
import type { Product } from '../domain/Product.js'

export function productTitles(products: Product[]): string[] {
  return products.map((p: Product) => p.title)
}
