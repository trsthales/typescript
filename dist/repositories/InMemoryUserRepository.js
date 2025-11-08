import { MemoryRepo } from './MemoryRepo.js';
export class InMemoryUserRepository extends MemoryRepo {
    async create(user) { return super.create(user); }
    async findByEmail(email) {
        return (await this.list()).find(u => u.email === email);
    }
    async findById(id) { return this.get(id); }
    async list() { return super.list(); }
}
