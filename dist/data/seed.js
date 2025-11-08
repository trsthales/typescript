import { Product, asProductId } from '../domain/Product.js';
/**
 * Exercício 4: tornar seed assíncrona corretamente usando await.
 * Retorna Promise<void> e garante que todos os inserts concluíram.
 */
export async function seedProducts(repo) {
    const items = [
        new Product({ id: asProductId('p1'), title: 'Camisa Básica', description: 'Algodão premium', price: 59.9, stock: 10, weightKg: 0.3 }),
        new Product({ id: asProductId('p2'), title: 'Tênis Confort', description: 'Corrida leve', price: 299.0, stock: 5, weightKg: 1.0 }),
        new Product({ id: asProductId('p3'), title: 'Mochila Pro', description: 'Para viagens', price: 199.9, stock: 8, weightKg: 0.8 })
    ];
    for (const p of items) {
        await repo.create(p);
    }
}
