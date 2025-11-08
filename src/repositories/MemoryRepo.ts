/** Repositório genérico em memória para produção (não apenas exemplo).
 * Fornece CRUD básico com type safety.
 */
export interface Entity { id: string }

export class MemoryRepo<T extends Entity> {
  protected data = new Map<string, T>()
  async create(entity: T): Promise<void> { this.data.set(entity.id, entity) }
  async get(id: string): Promise<T | undefined> { return this.data.get(id) }
  async list(): Promise<T[]> { return [...this.data.values()] }
  async update(id: string, partial: Partial<Omit<T, 'id'>>): Promise<T | undefined> {
    const current = this.data.get(id)
    if (!current) return undefined
    const updated = { ...current, ...partial } as T
    this.data.set(id, updated)
    return updated
  }
  async delete(id: string): Promise<boolean> { return this.data.delete(id) }
}
