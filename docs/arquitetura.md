# Arquitetura

Aplicação 100% no navegador: React 19 + TypeScript, sem backend. Os dados do usuário ficam no `localStorage`.

## Pastas

```
src/
├── assets/placas/           # SVGs das placas citadas nas questões (R-1.svg, A-2a.svg...)
├── data/                    # banco de questões em JSON
│   ├── temas.json
│   ├── questoes-autorais.json
│   └── questoes-provas.json
├── lib/                     # regras de negócio puras e testadas
│   ├── tipos.ts             # tipos do domínio (Questao, Sessao, Modo...)
│   ├── banco.ts             # normaliza os JSON e monta o banco
│   ├── sorteio.ts           # sorteio dos simulados (Fisher–Yates com RNG injetável)
│   ├── correcao.ts          # nota, aprovação, lista de erros, letras do gabarito
│   └── placas.ts            # acha a placa citada no enunciado
├── hooks/                   # useLocalStorage, useTheme, useProgresso
├── components/              # Home, Quiz, Resultado, Gabarito, ImagemPlaca, ThemeToggle, ui
├── App.tsx                  # máquina de estados das telas
└── main.tsx
scripts/
└── baixar-placas.sh         # baixa do Wikimedia Commons as placas que faltam
```

## Fluxo das telas

`App.tsx` guarda uma única variável de estado `tela`:

```
inicio ──iniciar(modo)──▶ quiz ──finalizar──▶ resultado
   ▲                       │                     │
   └────────── sair ───────┘◀──── refazer ───────┘
```

- **iniciar**: monta a sessão com `criarSessao` e abre o quiz. Se a sessão vier vazia (por exemplo, revisão sem erros), nada acontece.
- **finalizar**: corrige com `corrigir`, atualiza a lista de erros e grava o resultado no histórico.

## Modos de estudo

| Modo       | Questões                                                             | Ordem das letras |
| ---------- | -------------------------------------------------------------------- | ---------------- |
| `simulado` | 30, na divisão da prova: leg 7, sin 3, alc 2, dd 10, ps 3, ma 3, mec 2 | embaralhada      |
| `dificil`  | mesma divisão, só questões com pegadinha (completa com normais se faltar) | embaralhada |
| `tema`     | 10 de um tema                                                        | embaralhada      |
| `erros`    | até 15 da lista de revisão                                           | embaralhada      |
| `prova`    | todas as questões de uma prova real, na ordem original               | original         |

Questões marcadas como `duplicada` ficam fora dos sorteios, mas continuam na prova de onde vieram.

Aprovação: pelo menos 70% de acertos (`Math.ceil(total * 0.7)`, ou seja, 21 de 30).

## Dados salvos no navegador

| Chave                    | Conteúdo                                         |
| ------------------------ | ------------------------------------------------ |
| `cnh:historico`          | últimos 50 resultados                            |
| `cnh:erros`              | ids das questões erradas (lista de revisão)      |
| `cnh:correcao-imediata`  | mostrar correção logo após cada questão          |
| `cnh:tema`               | `light` ou `dark`                                |

`useLocalStorage` falha em silêncio quando o armazenamento não está disponível (modo privado, cota cheia). O app continua funcionando, só sem salvar.

## Decisões

- **Lógica separada da interface.** Nota, sorteio e gabarito ficam em `src/lib` como funções puras. Os componentes só renderizam e disparam ações.
- **Sorteio testável.** `embaralhar` e `criarSessao` recebem o gerador aleatório por parâmetro. Os testes usam um gerador com semente.
- **Correta sempre na posição 0.** No banco normalizado, `alternativas[0]` é a correta. A tela exibe as letras na ordem de `item.ordem`.
- **Bundle dividido.** O banco de questões vai num chunk próprio, então o cache do navegador sobrevive a mudanças só no código.
