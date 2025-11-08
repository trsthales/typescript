/**
 * Item do Carrinho: relaciona produto e quantidade.
 */
export class CartItem {
    productId;
    quantity;
    constructor(params) {
        this.productId = params.productId;
        this.quantity = params.quantity;
    }
}
