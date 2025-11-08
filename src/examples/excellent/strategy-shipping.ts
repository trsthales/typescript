/** Exemplo EXCELENTE: Strategy Pattern com tipos fortes */
export interface ShippingContext { weightKg: number; distanceKm: number }
export interface ShippingStrategy {
  name: string
  calc(ctx: ShippingContext): number
}

export class NormalShipping implements ShippingStrategy {
  name = 'normal'
  calc(ctx: ShippingContext): number { return 10 + ctx.distanceKm * 0.2 }
}
export class ExpressShipping implements ShippingStrategy {
  name = 'express'
  calc(ctx: ShippingContext): number { return 25 + ctx.distanceKm * 0.35 }
}
export class PickupShipping implements ShippingStrategy {
  name = 'pickup'
  calc(_ctx: ShippingContext): number { return 0 }
}

export function selectStrategy(zip: string): ShippingStrategy {
  if (zip.startsWith('9')) return new ExpressShipping()
  if (zip.startsWith('1')) return new PickupShipping()
  return new NormalShipping()
}

export function estimateCost(zip: string, ctx: ShippingContext): number {
  const strategy = selectStrategy(zip)
  return strategy.calc(ctx)
}
