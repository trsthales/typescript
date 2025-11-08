/** Repositório simples de cupons */
import { Coupon } from '../domain/Coupon.js'

export interface ICouponRepository {
  findByCode(code: string): Promise<Coupon | undefined>
  create(coupon: Coupon): Promise<void>
}

export class InMemoryCouponRepository implements ICouponRepository {
  private coupons = new Map<string, Coupon>()
  async findByCode(code: string): Promise<Coupon | undefined> { return this.coupons.get(code) }
  async create(coupon: Coupon): Promise<void> { this.coupons.set(coupon.code, coupon) }
}
