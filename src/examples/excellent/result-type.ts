/** Exemplo EXCELENTE: Result<T, E> + unions discriminadas */
export type Ok<T> = { ok: true; value: T }
export type Err<E> = { ok: false; error: E }
export type Result<T, E> = Ok<T> | Err<E>

export function ok<T>(value: T): Ok<T> { return { ok: true, value } }
export function err<E>(error: E): Err<E> { return { ok: false, error } }

// Pagamento com estados discriminados
export type PaymentState =
  | { status: 'paid'; transactionId: string }
  | { status: 'failed'; reason: string }
  | { status: 'pending'; provider: 'pix' | 'card' }

export function simulatePayment(amount: number): Result<PaymentState, 'INVALID' | 'LIMIT'> {
  if (amount <= 0) return err('INVALID')
  if (amount >= 10000) return err('LIMIT')
  return ok({ status: 'paid', transactionId: 't1' })
}

export function handlePayment(r: Result<PaymentState, string>): string {
  if (!r.ok) return `Erro: ${r.error}`
  switch (r.value.status) {
    case 'paid': return `Pago: ${r.value.transactionId}`
    case 'failed': return `Falha: ${r.value.reason}`
    case 'pending': return `Pendente via ${r.value.provider}`
    default: {
      const _exhaustive: never = r.value
      return _exhaustive
    }
  }
}
