/**
 * Classe de domínio: User (Usuário)
 * - Representa uma pessoa que usa o e-commerce
 * - Mantém dados mínimos para cadastro
 */
export class User {
    /**
     * Identificador único imutável do usuário.
     */
    id;
    /**
     * Nome completo do usuário.
     */
    name;
    /**
     * E-mail do usuário (único no sistema, validado no serviço).
     */
    email;
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.email = params.email;
    }
}
