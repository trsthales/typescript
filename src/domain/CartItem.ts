/**
 * Item do Carrinho: relaciona produto e quantidade.
 */
export class CartItem {
  public readonly productId: string
  public quantity: number

  constructor(params: { productId: string; quantity: number }) {
    this.productId = params.productId
    this.quantity = params.quantity
  }
}
