/** Exercício 26
 * Objetivo: Implementar LRUCache<K,V> com capacidade fixa.
 * Requisitos:
 * - get/set/has/size, e ejetar o menos recentemente usado quando cheio.
 * - Tipado com generics e sem any.
 * - Opcional: TTL por item.
 */
export class LRUCache<K, V> {
  // TODO: implementar com Map e lista de uso recente
  private map = new Map<K, V>()
  constructor(private capacity: number) {
    if (this.capacity <= 0) throw new Error('capacity must be > 0')
  }
  get(_key: K): V | undefined { return undefined }
  set(_key: K, _value: V): void { /* TODO */ }
  has(key: K): boolean { return this.map.has(key) }
  get size() { return this.map.size }
}
