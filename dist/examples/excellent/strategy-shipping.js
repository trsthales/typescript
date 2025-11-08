export class NormalShipping {
    name = 'normal';
    calc(ctx) { return 10 + ctx.distanceKm * 0.2; }
}
export class ExpressShipping {
    name = 'express';
    calc(ctx) { return 25 + ctx.distanceKm * 0.35; }
}
export class PickupShipping {
    name = 'pickup';
    calc(_ctx) { return 0; }
}
export function selectStrategy(zip) {
    if (zip.startsWith('9'))
        return new ExpressShipping();
    if (zip.startsWith('1'))
        return new PickupShipping();
    return new NormalShipping();
}
export function estimateCost(zip, ctx) {
    const strategy = selectStrategy(zip);
    return strategy.calc(ctx);
}
