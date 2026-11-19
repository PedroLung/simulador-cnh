# Desenvolvimento e deploy

Requer Node.js 20.19 ou superior (versão em `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Script               | O que faz                                                   |
| -------------------- | ----------------------------------------------------------- |
| `npm run dev`        | servidor de desenvolvimento com hot reload                  |
| `npm run build`      | checa os tipos e gera o build em `dist/`                    |
| `npm run preview`    | serve o build localmente (para testar o PWA offline)        |
| `npm test`           | roda os testes uma vez                                      |
| `npm run test:watch` | testes em modo contínuo                                     |
| `npm run typecheck`  | só a checagem de tipos                                      |
| `npm run lint`       | Oxlint                                                      |
| `npm run format`     | formata com Prettier                                        |
| `npm run check`      | lint + formatação + tipos + testes (o mesmo que o CI)       |

## Testes

Vitest + Testing Library + jsdom.

- `src/lib/*.test.ts`: sorteio, correção e validação de cada questão do banco.
- `src/App.test.tsx`: fluxo completo pela interface.

Os testes de sorteio usam um gerador aleatório com semente, então são reproduzíveis.

## CI

`.github/workflows/ci.yml` roda lint → formatação → tipos → testes → build e publica no GitHub Pages quando o push é na `main`.

## Deploy

O build usa caminhos relativos (`base: './'`), então o mesmo `dist/` funciona em qualquer hospedagem estática.

- **GitHub Pages**: em _Settings → Pages_, escolha _Source: GitHub Actions_.
- **Vercel**: importe o repositório; `vercel.json` já está configurado.
- **Netlify**: importe o repositório; `netlify.toml` já está configurado.

## PWA

`vite-plugin-pwa` (Workbox) faz o precache do app, incluindo as imagens das placas, e guarda em cache as fontes do Google Fonts. Use `npm run build && npm run preview` para testar o modo offline.
