/** Serviço de pagamento (mock)
 * - Simula uma cobrança e retorna um resultado.
 */
export interface PaymentResult {
  status: 'paid' | 'failed'
  transactionId?: string
  error?: string
}

export class PaymentService {
  async pay(orderId: string, amount: number): Promise<PaymentResult> {
    // Mock: pagamento aprova valores > 0 e < 10.000
    if (amount <= 0) return { status: 'failed', error: 'Valor inválido' }
    if (amount >= 10000) return { status: 'failed', error: 'Limite excedido' }
    return { status: 'paid', transactionId: `txn_${orderId}` }
  }
}
