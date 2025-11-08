export class MemoryRepo {
    data = new Map();
    create(entity) { this.data.set(entity.id, entity); }
    get(id) { return this.data.get(id); }
    list() { return [...this.data.values()]; }
    update(id, partial) {
        const current = this.data.get(id);
        if (!current)
            return undefined;
        const updated = { ...current, ...partial };
        this.data.set(id, updated);
        return updated;
    }
    delete(id) { return this.data.delete(id); }
}
const repo = new MemoryRepo();
repo.create({ id: 'p1', title: 'Livro', price: 42 });
repo.update('p1', { price: 40 });
