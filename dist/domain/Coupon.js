/** Cupom de desconto aplicado no checkout */
export class Coupon {
    code;
    percentage; // 0-100
    constructor(code, percentage) {
        if (percentage < 0 || percentage > 100)
            throw new Error('Percentual inválido');
        this.code = code;
        this.percentage = percentage;
    }
    apply(amount) {
        return amount * (1 - this.percentage / 100);
    }
}
