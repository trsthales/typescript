/**
 * Classe de domínio: User (Usuário)
 * - Representa uma pessoa que usa o e-commerce
 * - Mantém dados mínimos para cadastro
 */
export class User {
  /**
   * Identificador único imutável do usuário.
   */
  public readonly id: string

  /**
   * Nome completo do usuário.
   */
  public name: string

  /**
   * E-mail do usuário (único no sistema, validado no serviço).
   */
  public email: string

  constructor(params: { id: string; name: string; email: string }) {
    this.id = params.id
    this.name = params.name
    this.email = params.email
  }
}

export interface RegisterUserInput {
  name: string
  email: string
}
