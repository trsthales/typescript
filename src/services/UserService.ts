/** Serviço de usuários
 * - Regras: email único, validação simples.
 */
import { randomUUID } from 'crypto'
import { User, RegisterUserInput } from '../domain/User.js'
import { IUserRepository } from '../repositories/InMemoryUserRepository.js'
import { Result, ok, err } from '../shared/result.js'

export type RegisterError = 'EMAIL_TAKEN' | 'INVALID_EMAIL'

export class UserService {
  constructor(private readonly repo: IUserRepository) {}

  async register(data: RegisterUserInput): Promise<Result<User, RegisterError>> {
    const existing = await this.repo.findByEmail(data.email)
    if (existing) return err('EMAIL_TAKEN')
    if (!isValidEmail(data.email)) return err('INVALID_EMAIL')
    const user = new User({ id: randomUUID(), name: data.name, email: data.email })
    await this.repo.create(user)
    return ok(user)
  }
}

// Exercício 2: Função utilitária de validação de email (simples)
export function isValidEmail(email: string): boolean {
  // Regex simplificada apenas para fins didáticos
  return /.+@.+\..+/.test(email)
}
