export function asProductId(id) { return id; }
export class Product {
    id;
    title;
    description;
    price;
    stock;
    weightKg;
    constructor(params) {
        if (params.price < 0)
            throw new Error('Preço não pode ser negativo');
        if (params.stock < 0)
            throw new Error('Estoque não pode ser negativo');
        this.id = params.id;
        this.title = params.title;
        this.description = params.description;
        this.price = params.price;
        this.stock = params.stock;
        this.weightKg = params.weightKg ?? 0.5;
    }
}
