export class PaymentService {
    async pay(orderId, amount) {
        // Mock: pagamento aprova valores > 0 e < 10.000
        if (amount <= 0)
            return { status: 'failed', error: 'Valor inválido' };
        if (amount >= 10000)
            return { status: 'failed', error: 'Limite excedido' };
        return { status: 'paid', transactionId: `txn_${orderId}` };
    }
}
