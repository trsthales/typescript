import { OrderItem } from '../domain/Order.js'
import type { Coupon } from '../domain/Coupon.js'
import { estimateCost, ShippingContext } from '../shipping/strategy.js'

export interface PriceComponentsInput {
  items: OrderItem[]
  coupon?: Coupon
  shippingZip?: string
  shippingCtx?: ShippingContext
}

export interface PriceComponentsResult {
  itemsTotal: number
  discountTotal: number
  freightTotal: number
  grandTotal: number
}

export class PriceCalculator {
  static compute(input: PriceComponentsInput): PriceComponentsResult {
    const itemsTotal = input.items.reduce((acc, it) => acc + it.subtotal(), 0)
    const discountTotal = input.coupon ? itemsTotal - input.coupon.apply(itemsTotal) : 0
    const freightTotal = input.shippingZip && input.shippingCtx ? estimateCost(input.shippingZip, input.shippingCtx) : 0
    return {
      itemsTotal,
      discountTotal,
      freightTotal,
      grandTotal: itemsTotal - discountTotal + freightTotal
    }
  }
}
