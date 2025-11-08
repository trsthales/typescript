import { InMemoryUserRepository } from '../repositories/InMemoryUserRepository.js';
import { UserService, isValidEmail } from '../services/UserService.js';
describe('UserService', () => {
    it('deve cadastrar usuário válido', async () => {
        const repo = new InMemoryUserRepository();
        const service = new UserService(repo);
        const result = await service.register({ name: 'Ana', email: 'ana@example.com' });
        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.email).toBe('ana@example.com');
        }
    });
    it('deve recusar email inválido', async () => {
        const repo = new InMemoryUserRepository();
        const service = new UserService(repo);
        const result = await service.register({ name: 'Ana', email: 'invalid' });
        expect(result.ok).toBe(false);
    });
    it('validador simples de email', () => {
        expect(isValidEmail('a@b.com')).toBe(true);
        expect(isValidEmail('x')).toBe(false);
    });
});
