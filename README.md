# Rentx

**Visão Geral**

- **Descrição:** Exemplo minimal de arquitetura limpa para um serviço de aluguel, usando TypeScript e Prisma.

**Instalação**

1. Instale dependências:

```bash
npm install
```

2. Gere o cliente do Prisma (após configurar `DATABASE_URL`):

Crie um arquivo `.env` com `DATABASE_URL` antes de rodar comandos do Prisma ou a aplicação.


```bash
npx prisma generate
```

3. Rode migrações:

```bash
npx prisma migrate deploy
# ou durante desenvolvimento
npx prisma migrate dev
```

**Uso**

- Rodar testes (usa `vitest`):

```bash
npm run test
```

- Executar o adaptador CLI:

```bash
npm run cli
```

**Estrutura do projeto (visão geral)**

- `src/adapters`: adaptadores/entrypoints (CLI, HTTP, etc.).
- `src/application/useCases`: casos de uso e DTOs.
- `src/domain`: entidades e interfaces de repositório.
- `src/infra`: container de DI e repositórios (in-memory e Prisma).