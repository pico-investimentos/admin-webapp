# Pico Investimentos — Admin Webapp (Painel)

Painel administrativo da Pico Investimentos. Espelha o stack do `client-webapp`
com um tema/acento próprios ("Painel") e acesso restrito à equipe (assessor/admin).

## Stack

- React 19 e TypeScript
- Vite
- Tailwind CSS v4
- HeroUI v3
- TanStack Router com rotas baseadas em arquivos
- TanStack Query
- Motion
- Vitest e ESLint

## Requisitos

- Node.js 20.19 ou superior
- npm 10 ou superior
- A `api/` rodando (padrão em `http://localhost:3000`)

## Primeiros passos

```bash
cp .env.example .env
npm install
npm run dev
```

O servidor de desenvolvimento sobe na porta **5175**. Deixe `VITE_API_URL` vazio
no `.env`: o Vite encaminha `/api` para a API em `:3000`. Isso é necessário no
WSL — o browser do Windows não alcança `localhost:3000` da distro Linux.

Confirme o título da aba: **Painel Pico Investimentos** — se aparecer o app do
investidor, a porta está apontando para o processo errado.
Para autenticar em desenvolvimento, use o seed de staff da API
(`npm run db:seed-staff`): `admin@pico.test` / `assessor@pico.test`.
Para popular clientes de teste na consulta, rode também `npm run db:seed-clients`
na API (depois do seed de staff).

## Comandos

```bash
npm run dev        # servidor local (porta 5175)
npm run build      # build de produção + typecheck
npm run lint       # análise estática
npm run test       # testes automatizados
npm run preview    # prévia do build
```

## Estrutura

```text
src/
├── app/          # providers, router e configuração global
├── config/       # variáveis de ambiente validadas
├── features/     # módulos de negócio por funcionalidade (auth, clients, dashboard)
├── routes/       # rotas do TanStack Router
├── shared/       # componentes, utilitários e infraestrutura reutilizável
├── styles/       # tema e estilos globais
└── test/         # configuração de testes
```

## Segurança

- Sessão via cookie `HttpOnly` `pico_session` emitido pela API; sem
  `localStorage` e sem segredos em `VITE_*`.
- Autorização é do servidor. O guard de rota exige sessão **e** papel
  `assessor|admin`; um investidor autenticado vê a tela 403 dedicada.
- Nunca registre CPF, tokens, saldos ou documentos no browser.
