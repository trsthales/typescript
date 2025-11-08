# Projeto Didático TypeScript - E-commerce

Aprenda TypeScript construindo e analisando um mini e-commerce. O foco é entender tipos, boas práticas, armadilhas e padrões avançados.

## Sumário
1. Conceitos Fundamentais
2. Domínio do E-commerce
3. Exemplos Bons x Ruins x Excelentes
4. Exercícios (Básico, Intermediário, Avançado)
5. Padrões e Estratégias
6. Próximos Passos / Ideias de Expansão

---
## 1. Conceitos Fundamentais
- Tipagem Estrita: `strict` no `tsconfig.json` evita erros silenciosos.
- Tipos vs Interfaces: ambos descrevem forma; prefira `type` para composições (unions/intersections) e `interface` para objetos extensíveis.
- Generics: permitem reuso mantendo segurança de tipos.
- Structural Typing: compatibilidade por forma, não por nome.
- Narrowing: o compilador refina o tipo com `if`, `switch`, `in`, `instanceof`, `typeof`.

## 2. Domínio (Arquitetura Simples)
Entidades em `src/domain`: `User`, `Product`, `Cart`, `CartItem`, `Order`.
Serviços em `src/services`: regras de negócio (cadastro, listagem, carrinho, pagamento).
Repositórios em memória: isolam persistência.

## 3. Exemplos
Veja diretório `src/examples`.
### Bom
- `good/repository-generic.ts`: generic repositório reutilizável.
- `good/strong-types.ts`: branded types evitam confusão entre strings.

### Ruim
- `bad/any-e-globals.ts`: uso de `any` + estado global -> difícil testar e manter.
- `bad/god-object.ts`: "God Object" mistura responsabilidades (viola SRP).

### Excelente
- `excellent/result-type.ts`: `Result<T,E>` + unions discriminadas + narrowing.
- `excellent/strategy-shipping.ts`: Strategy Pattern com tipos fortes.

#### Por que é BOM?
- Tipos explícitos, funções puras, responsabilidades únicas.
#### Por que é RUIM?
- `any` desliga verificação, acoplamento, efeitos colaterais.
#### Por que é EXCELENTE?
- Padrões que reduzem estados inválidos, compõem-se bem, escaláveis.

## 4. Exercícios
### Básico
1. Crie um `type ProductId = string & { readonly brand: unique symbol }` e aplique em `Product`.
2. Adicione validação de email no `UserService` usando uma função utilitária.
3. Escreva uma função que recebe `Product[]` e retorna apenas títulos (`string[]`) com tipos inferidos.
4. Transforme a função de seed para retornar `Promise<void>` aguardando cada insert corretamente.
5. Adicione um enum `UserRole` e use no cadastro.

### Intermediário
6. Adicione cupom de desconto: `Coupon { code: string; percentage: number }` e aplique no checkout.
7. Use `zod` para validar criação de `Product` (preço >= 0, estoque >= 0).
8. Refatore `CartService.checkout` para retornar `Result<Order, CheckoutError>` onde `CheckoutError` é union discriminada.
9. Implemente um cache simples para `ProductService.list()` com TTL (generic `Cache<T>`).
10. Adicione logger com interface e duas implementações (console / memoria) injetadas em serviços.

### Avançado
11. Repositório genérico: `MemoryRepo<T extends { id: string }>` e reescreva repositórios atuais.
12. Implementar estratégia de frete (já há exemplo) integrada ao checkout: some custo no total.
13. Modele pagamento dividido (Pix + Cartão): somas devem bater com `order.total`.
14. Implemente eventos de domínio: ao criar pedido, emitir `{ type: 'ORDER_CREATED', orderId }` e criar um dispatcher tipado.
15. Crie um "aggregate" para carrinho que aplique invariantes de quantidade máxima por item.

### Desafios Extras
16. Concorrência: simule dois checkouts simultâneos e proteja estoque (lock otimista simples com versão).
17. Adicione `ReadOnly` views para produtos exportando `readonly` arrays.
18. Gere tipos API (contratos) derivando de entidades mas omitindo campos sensíveis (ex: `Omit<User, 'email'>`).
19. Introduza uma camada de DTO + mapeadores puros.
20. Experimente `satisfies` para validar objetos literais sem perder literal types.

### Ultra / Profissional (21–40)
21. Adapte repositórios para suportar versão otimista: adicione `version` em `Product` e método `updateIfVersion(id, expectedVersion, changes)`.
22. Faça um batch de atualização de estoque atômico (transação em SQLite) e simule falha para testar rollback.
23. Crie um mapeador de DTO: `toOrderDTO(order)` que omite items grandes e normaliza datas (string ISO), usando `Pick` / `Omit`.
24. Gere tipos de resposta de API automaticamente a partir de schemas zod (`z.infer`). Substitua tipos manuais nas rotas.
25. Introduza `ReadonlyArray<Product>` na listagem e tente mutar (deve falhar na compilação) — explique no comentário.
26. Implemente um cache LRU genérico (<K,V>) com limite de capacidade e política de ejeção; use em `ProductService.list()`.
27. Acrescente contadores de métricas (número de checkouts, falhas) com uma interface `Metrics` e uma implementação in-memory e outra "no-op".
28. Adicione suporte a eventos assíncronos (listeners que retornam Promise) e aguarde todos com `Promise.allSettled`.
29. Escreva um type guard `isOrder(obj: unknown): obj is Order` robusto e use antes de converter JSON externo.
30. Modele erro rico: `CheckoutFailure` objeto com `code`, `message`, `recoverable: boolean` em vez de string union.
31. Use `never` para garantir tratamento exaustivo em um `switch` sobre estratégias de frete.
32. Adicione serializer determinístico de Order (ordenar items, fixar numero de casas decimais) — teste snapshot.
33. Crie um módulo `money.ts` com branded type `Money` e funções `add`, `subtract`, `format` evitando flutuação binária (usar inteiros em centavos).
34. Introduza parsing seguro de env (`parseEnv`) usando zod com fallback e tests.
35. Faça um wrapper de transação: `withTransaction(db, fn)` tipado para retornar o tipo de `fn` e garantir rollback em erro.
36. Utilize `const enum` para códigos de erro (demonstrar trade-offs no build).
37. Modele um processo de reembolso (refund) com eventos adicionais e invariantes (não reembolsar duas vezes). Teste fluxo.
38. Crie benchmark simples (`node --loader tsx benchmarks/priceCalc.ts`) comparando versão atual do `PriceCalculator` com uma alternativa.
39. Adicione teste de carga fake para checkout (loop de 1000 ordens) e medir tempo total — relatar resultado em comentário.
40. Experimente tipos condicionais avançados: `DeepReadonly<T>` e aplique em Order retornada a partir da API.

## 5. Padrões e Estratégias
- Strategy (frete): variar comportamento sem `if` gigante.
- Result / Either: fluxo explícito de erro (evita exceptions não tratadas).
- Branded Types: evita misturar IDs.
- Discriminated Unions: força tratamento exaustivo.
- Repository Pattern: abstrai persistência.

## 6. Próximos Passos
- Adicionar testes (Jest) para `UserService`, `CartService`, `PaymentService`.
- Adicionar camada HTTP (Express / Fastify) ou CLI de interação.
- Persistência real (SQLite / Postgres) com interface igual.
- Autenticação e autorização (JWT) usando tipos para context.

## Guia Rápido de Comandos
```bash
npm run dev        # desenvolvimento com tsx watch
npm run build      # compila para dist
npm start          # roda build compilado
npm test           # executa testes (adicionar depois)
npm run typecheck  # checagem de tipos sem emitir JS
npm run serve      # inicia servidor HTTP (Fastify)
```

## API HTTP (Fastify)
Camada HTTP simples para exercitar DTOs, validação e integração com serviços.

### Executar
- In-memory (padrão):
	- `npm run serve`
- SQLite:
	- `PERSISTENCE=sqlite DB_FILE=./dev.db npm run serve`

Servidor inicia em `http://localhost:3333` (use `PORT=xxxx` para alterar).

### Endpoints

- POST /users
	- Body: `{ name: string, email: string }`
	- 201: `User`
	- 400: `{ error: 'INVALID_EMAIL' | 'EMAIL_TAKEN' }`

- GET /products
	- 200: `Product[]`

- POST /cart/:userId/items
	- Body: `{ productId: string, quantity: number }`
	- 200: `Cart` (estado atual)

- POST /checkout
	- Body:
		- `{ userId: string, cartId: string, coupon?: string, shippingZip?: string, distanceKm?: number, weightKg?: number }`
	- Notas:
		- Para calcular frete, envie juntos `shippingZip`, `distanceKm` e `weightKg` (strategy baseada em peso/distância).
		- `coupon` aplica desconto percentual (ex: 10%).
	- 201: `Order` com `totals: { itemsTotal, discountTotal, freightTotal, grandTotal }`
	- 400: `{ error: 'CART_NOT_FOUND' | 'EMPTY_CART' | 'PRODUCT_NOT_FOUND' | 'OUT_OF_STOCK' }`

### Exemplos (curl)

```bash
# criar usuário
curl -s -X POST http://localhost:3333/users \
	-H 'content-type: application/json' \
	-d '{"name":"Ana","email":"ana@test.com"}' | jq

# listar produtos
curl -s http://localhost:3333/products | jq

# adicionar item no carrinho (use o userId como cartId para simplificar)
curl -s -X POST http://localhost:3333/cart/<USER_ID>/items \
	-H 'content-type: application/json' \
	-d '{"productId":"p1","quantity":2}' | jq

# checkout (com cupom e frete)
curl -s -X POST http://localhost:3333/checkout \
	-H 'content-type: application/json' \
	-d '{
		"userId":"<USER_ID>",
		"cartId":"<USER_ID>",
		"coupon":"PROMO10",
		"shippingZip":"12345",
		"distanceKm": 12,
		"weightKg": 1.5
	}' | jq
```

## Dicas de Estudo
- Refaça um exercício sem olhar solução e compare.
- Introduza intencionalmente um erro de tipo e veja a mensagem.
- A cada refatoração, pergunte: "o compilador me protegeu de quê?".

Bom estudo! Expanda, quebre, experimente — o compilador é seu aliado.
