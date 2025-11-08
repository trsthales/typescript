/** Exercício 30
 * Objetivo: Modelar erro rico para checkout.
 * Tarefas:
 * - Criar tipo `CheckoutFailure` { code: string; message: string; recoverable: boolean }
 * - Substituir union string em CartService pelo novo tipo.
 * - Atualizar testes validando campos.
 */
export interface CheckoutFailure { code: string; message: string; recoverable: boolean }
export function placeholderExercise30() { /* implementação futura */ }
