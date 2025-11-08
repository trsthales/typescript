/** Serviço de usuários
 * - Regras: email único, validação simples.
 */
import { randomUUID } from 'crypto';
import { User } from '../domain/User.js';
import { ok, err } from '../shared/result.js';
export class UserService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async register(data) {
        const existing = await this.repo.findByEmail(data.email);
        if (existing)
            return err('EMAIL_TAKEN');
        if (!isValidEmail(data.email))
            return err('INVALID_EMAIL');
        const user = new User({ id: randomUUID(), name: data.name, email: data.email });
        await this.repo.create(user);
        return ok(user);
    }
}
// Exercício 2: Função utilitária de validação de email (simples)
export function isValidEmail(email) {
    // Regex simplificada apenas para fins didáticos
    return /.+@.+\..+/.test(email);
}
