import { MemoryRepo } from './MemoryRepo.js';
export class InMemoryOrderRepository extends MemoryRepo {
    async create(order) { return super.create(order); }
    async findById(id) { return this.get(id); }
    async listByUser(userId) {
        return (await this.list()).filter(o => o.userId === userId);
    }
}
