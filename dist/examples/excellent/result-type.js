export function ok(value) { return { ok: true, value }; }
export function err(error) { return { ok: false, error }; }
export function simulatePayment(amount) {
    if (amount <= 0)
        return err('INVALID');
    if (amount >= 10000)
        return err('LIMIT');
    return ok({ status: 'paid', transactionId: 't1' });
}
export function handlePayment(r) {
    if (!r.ok)
        return `Erro: ${r.error}`;
    switch (r.value.status) {
        case 'paid': return `Pago: ${r.value.transactionId}`;
        case 'failed': return `Falha: ${r.value.reason}`;
        case 'pending': return `Pendente via ${r.value.provider}`;
        default: {
            const _exhaustive = r.value;
            return _exhaustive;
        }
    }
}
