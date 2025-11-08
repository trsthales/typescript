export class MemoryRepo {
    data = new Map();
    async create(entity) { this.data.set(entity.id, entity); }
    async get(id) { return this.data.get(id); }
    async list() { return [...this.data.values()]; }
    async update(id, partial) {
        const current = this.data.get(id);
        if (!current)
            return undefined;
        const updated = { ...current, ...partial };
        this.data.set(id, updated);
        return updated;
    }
    async delete(id) { return this.data.delete(id); }
}
