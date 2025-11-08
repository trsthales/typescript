/** Exemplo RUIM: God Object */
// Um único objeto centraliza toda a lógica do sistema.
// Problemas: difícil de testar, acoplamento forte, viola SRP.

export const God = {
  users: [] as any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  products: [] as any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  addUser(u: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.users.push(u)
    // Validação e persistência misturadas (e não existem aqui)
  },
  addProduct(p: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    this.products.push(p)
  },
  checkout(userId: string) {
    // Lógica de negócios, cálculo, efeitos colaterais tudo junto
    // (usa userId apenas para silenciar o compilador neste exemplo didático)
    return { ok: true, userId }
  }
}
