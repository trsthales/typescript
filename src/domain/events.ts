export type OrderCreatedEvent = { type: 'ORDER_CREATED'; orderId: string; userId: string }
export type DomainEvent = OrderCreatedEvent

export type EventHandler<E extends DomainEvent = DomainEvent> = (event: E) => void | Promise<void>

export class DomainEvents {
  private static handlers: { [K in DomainEvent['type']]?: EventHandler[] } = {}
  static subscribe<T extends DomainEvent>(type: T['type'], handler: EventHandler<T>) {
    if (!this.handlers[type]) this.handlers[type] = []
    this.handlers[type]!.push(handler as EventHandler)
  }
  static async publish(event: DomainEvent) {
    const list = this.handlers[event.type] ?? []
    for (const h of list) await h(event)
  }
  static clear() { this.handlers = {} }
}
