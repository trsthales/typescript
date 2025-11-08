/** Cupom de desconto aplicado no checkout */
export class Coupon {
  public readonly code: string
  public readonly percentage: number // 0-100
  constructor(code: string, percentage: number) {
    if (percentage < 0 || percentage > 100) throw new Error('Percentual inválido')
    this.code = code
    this.percentage = percentage
  }
  apply(amount: number): number {
    return amount * (1 - this.percentage / 100)
  }
}
