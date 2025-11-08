export class InMemoryCouponRepository {
    coupons = new Map();
    async findByCode(code) { return this.coupons.get(code); }
    async create(coupon) { this.coupons.set(coupon.code, coupon); }
}
