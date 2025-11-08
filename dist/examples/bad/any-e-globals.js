/** Exemplo RUIM: uso de any e estado global */
// Por que é ruim?
// - "any" desliga o compilador: você perde segurança de tipos.
// - Estado global é difícil de controlar e testar.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let GLOBAL_STATE = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setUser(u) {
    GLOBAL_STATE.user = u; // Pode ser qualquer coisa, sem validação
}
function getUser() {
    return GLOBAL_STATE.user; // Tipo desconhecido => bugs em runtime
}
setUser({ nome: 'SemEmail' });
const user = getUser();
// Uso mínimo para evitar erro de variável não utilizada (exemplo didático)
void user;
export {};
// console.log(user.email.toLowerCase()) // Crasha em runtime: email inexistente
