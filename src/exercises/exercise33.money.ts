/** Exercício 33
 * Objetivo: Modelo seguro de valores monetários.
 * Estratégia: armazenar centavos como integer para evitar floating errors.
 * Tarefas:
 * 1. Branded type `MoneyCents = number & { readonly brand: unique symbol }`.
 * 2. Funções: `fromFloat(n: number): MoneyCents`, `toFloat(c: MoneyCents): number`, `add(a,b)`, `subtract(a,b)`.
 * 3. format: retorna string `R$xx,yy`.
 */
export type MoneyCents = number & { readonly brand: unique symbol }
export function asMoneyCents(n: number): MoneyCents { return Math.round(n) as MoneyCents }
export function fromFloat(n: number): MoneyCents { return asMoneyCents(Math.round(n * 100)) }
export function toFloat(c: MoneyCents): number { return c / 100 }
export function add(a: MoneyCents, b: MoneyCents): MoneyCents { return asMoneyCents(a + b) }
export function subtract(a: MoneyCents, b: MoneyCents): MoneyCents { return asMoneyCents(a - b) }
export function format(c: MoneyCents): string { const v = toFloat(c); return 'R$' + v.toFixed(2).replace('.', ',') }
