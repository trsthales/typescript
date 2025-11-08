import { MemoryRepo } from './MemoryRepo.js';
export class InMemoryProductRepository extends MemoryRepo {
    async create(product) { return super.create(product); }
    async findById(id) { return this.get(id); }
    async list() { return super.list(); }
    async updateStock(id, stock) {
        const p = await this.get(id);
        if (!p)
            return;
        p.stock = stock;
        await this.update(id, { stock });
    }
}
