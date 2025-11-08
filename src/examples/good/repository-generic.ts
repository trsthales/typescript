/** Exemplo BOM: Repositório genérico tipado.
 * Vantagens:
 * - Reuso sem perder type safety.
 * - Métodos coerentes para qualquer entidade com id.
 */
export interface Entity { id: string }

export class MemoryRepo<T extends Entity> {
  private data = new Map<string, T>()
  create(entity: T): void { this.data.set(entity.id, entity) }
  get(id: string): T | undefined { return this.data.get(id) }
  list(): T[] { return [...this.data.values()] }
  update(id: string, partial: Partial<Omit<T, 'id'>>): T | undefined {
    const current = this.data.get(id)
    if (!current) return undefined
    const updated = { ...current, ...partial }
    this.data.set(id, updated)
    return updated
  }
  delete(id: string): boolean { return this.data.delete(id) }
}

// Uso
interface Product { id: string; title: string; price: number }
const repo = new MemoryRepo<Product>()
repo.create({ id: 'p1', title: 'Livro', price: 42 })
repo.update('p1', { price: 40 })
