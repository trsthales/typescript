/** Exemplo BOM: Tipos fortes explicitos */
export type UserId = string & { readonly brand: unique symbol }
export type Email = string & { readonly brandEmail: unique symbol }

function toEmail(raw: string): Email {
  if (!raw.includes('@')) throw new Error('email inválido')
  return raw as Email
}

interface User { id: UserId; name: string; email: Email }

function createUser(id: string, name: string, email: string): User {
  return { id: id as UserId, name, email: toEmail(email) }
}

const demoUser = createUser('u1', 'Ana', 'ana@example.com')
// Exemplo de uso: acessando campos com segurança de tipos
void demoUser.name
// u.email = 'x' // Erro de intenção se tivéssemos imutabilidade rigorosa
