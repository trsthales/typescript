/** Exercício 21
 * Objetivo: Adicionar versionamento otimista a Product.
 * Tarefas:
 * 1. Adicionar campo `version: number` em Product (inicial 0).
 * 2. Criar método em repositório: `updateIfVersion(id, expectedVersion, changes)`.
 * 3. Se versão divergir, retornar falha (`Result` ou lançar erro).
 * 4. Escrever teste simulando concorrência: duas atualizações, segunda falha.
 * Dica: Incrementar version no sucesso.
 */
export interface ProductVersionUpdate { stock?: number; price?: number }
export function placeholderExercise21() { /* implementação futura */ }
