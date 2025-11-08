/** Repositório em memória de usuários.
 * Responsável apenas por persistir/recuperar User.
 * Não faz validações de negócio (delegadas ao serviço).
 */
import { User } from '../domain/User.js'
import { MemoryRepo } from './MemoryRepo.js'

export interface IUserRepository {
  create(user: User): Promise<void>
  findByEmail(email: string): Promise<User | undefined>
  findById(id: string): Promise<User | undefined>
  list(): Promise<User[]>
}

export class InMemoryUserRepository extends MemoryRepo<User> implements IUserRepository {
  async create(user: User): Promise<void> { return super.create(user) }
  async findByEmail(email: string): Promise<User | undefined> {
    return (await this.list()).find(u => u.email === email)
  }
  async findById(id: string): Promise<User | undefined> { return this.get(id) }
  async list(): Promise<User[]> { return super.list() }
}
