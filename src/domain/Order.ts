/**
 * Pedido (Order)
 * - Resultado do checkout de um carrinho.
 */
export class OrderItem {
  public readonly productId: string
  public readonly quantity: number
  public readonly price: number // preço unitário no momento da compra
  constructor(params: { productId: string; quantity: number; price: number }) {
    this.productId = params.productId
    this.quantity = params.quantity
    this.price = params.price
  }
  subtotal(): number { return this.price * this.quantity }
}

export interface OrderTotalsBreakdown {
  itemsTotal: number
  discountTotal: number
  freightTotal: number
  grandTotal: number
}

export class Order {
  public readonly id: string
  public readonly userId: string
  public readonly items: OrderItem[]
  public readonly createdAt: Date
  public readonly totals: OrderTotalsBreakdown

  constructor(params: {
    id: string
    userId: string
    items: OrderItem[]
    createdAt?: Date
    discountTotal?: number
    freightTotal?: number
  }) {
    this.id = params.id
    this.userId = params.userId
    this.items = params.items
    this.createdAt = params.createdAt ?? new Date()
    const itemsTotal = params.items.reduce((acc, it) => acc + it.subtotal(), 0)
    const discountTotal = params.discountTotal ?? 0
    const freightTotal = params.freightTotal ?? 0
    this.totals = {
      itemsTotal,
      discountTotal,
      freightTotal,
      grandTotal: itemsTotal - discountTotal + freightTotal
    }
  }
}
