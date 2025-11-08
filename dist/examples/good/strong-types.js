function toEmail(raw) {
    if (!raw.includes('@'))
        throw new Error('email inválido');
    return raw;
}
function createUser(id, name, email) {
    return { id: id, name, email: toEmail(email) };
}
const demoUser = createUser('u1', 'Ana', 'ana@example.com');
// Exemplo de uso: acessando campos com segurança de tipos
void demoUser.name;
export {};
// u.email = 'x' // Erro de intenção se tivéssemos imutabilidade rigorosa
