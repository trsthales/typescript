export class ProductService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async list() {
        return this.repo.list();
    }
    async get(id) {
        return this.repo.findById(id);
    }
}
