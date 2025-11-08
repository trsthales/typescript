/** Serviço de carrinho e checkout
 * - Mantém carrinhos simples em memória.
 */
import { Cart } from '../domain/Cart.js'
import { IProductRepository } from '../repositories/InMemoryProductRepository.js'
import { IOrderRepository } from '../repositories/InMemoryOrderRepository.js'
import { Order, OrderItem } from '../domain/Order.js'
import { DomainEvents } from '../domain/events.js'
import { randomUUID } from 'crypto'
import { Result, ok, err } from '../shared/result.js'
import type { Coupon } from '../domain/Coupon.js'
import type { ShippingContext } from '../shipping/strategy.js'
import { PriceCalculator } from '../pricing/PriceCalculator.js'

export type CheckoutError = 'CART_NOT_FOUND' | 'EMPTY_CART' | 'PRODUCT_NOT_FOUND' | 'OUT_OF_STOCK'

export class CartService {
  private carts = new Map<string, Cart>()
  constructor(
    private readonly products: IProductRepository,
    private readonly orders: IOrderRepository
  ) {}

  /** Cria (se necessário) e retorna o carrinho do usuário */
  getOrCreateCart(userId?: string): Cart {
    const id = userId ?? randomUUID()
    let cart = this.carts.get(id)
    if (!cart) {
      cart = new Cart({ id, userId })
      this.carts.set(id, cart)
    }
    return cart
  }

  /** Retorna o carrinho por id */
  getCart(cartId: string): Cart | undefined {
    return this.carts.get(cartId)
  }

  /** Adiciona produto ao carrinho */
  addItem(cartId: string, productId: string, quantity: number = 1) {
    const cart = this.carts.get(cartId)
    if (!cart) throw new Error('Carrinho não encontrado')
    if (quantity <= 0) throw new Error('Quantidade inválida')
    cart.addItem(productId, quantity)
  }

  /** Remove produto do carrinho */
  removeItem(cartId: string, productId: string, quantity: number = 1) {
    const cart = this.carts.get(cartId)
    if (!cart) throw new Error('Carrinho não encontrado')
    cart.removeItem(productId, quantity)
  }

  /** Checkout: valida estoque, cria order e abate estoque */
  async checkout(
    cartId: string,
    userId: string,
    opts?: { coupon?: Coupon; shippingZip?: string; shippingCtx?: ShippingContext }
  ): Promise<Result<Order, CheckoutError>> {
    const cart = this.carts.get(cartId)
    if (!cart) return err('CART_NOT_FOUND')

    const items = cart.listItems()
    if (items.length === 0) return err('EMPTY_CART')

    const orderItems: OrderItem[] = []

    for (const it of items) {
      const product = await this.products.findById(it.productId)
      if (!product) return err('PRODUCT_NOT_FOUND')
      if (product.stock < it.quantity) return err('OUT_OF_STOCK')
      orderItems.push(new OrderItem({ productId: product.id, quantity: it.quantity, price: product.price }))
      await this.products.updateStock(product.id, product.stock - it.quantity)
    }

      const totals = PriceCalculator.compute({ items: orderItems, coupon: opts?.coupon, shippingZip: opts?.shippingZip, shippingCtx: opts?.shippingCtx })

      const order = new Order({
        id: randomUUID(),
        userId,
        items: orderItems,
        discountTotal: totals.discountTotal,
        freightTotal: totals.freightTotal
      })
    await this.orders.create(order)
      await DomainEvents.publish({ type: 'ORDER_CREATED', orderId: order.id, userId })
    cart.clear()
    return ok(order)
  }
}
