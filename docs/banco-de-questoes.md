# Banco de questões

São três arquivos em `src/data/`. `src/lib/banco.ts` junta tudo num único formato (`Questao`).

## Temas (`temas.json`)

| id    | Tema                        |
| ----- | --------------------------- |
| `leg` | Legislação de trânsito      |
| `sin` | Sinalização                 |
| `alc` | Álcool e crimes de trânsito |
| `dd`  | Direção defensiva           |
| `ps`  | Primeiros socorros          |
| `ma`  | Meio ambiente e cidadania   |
| `mec` | Mecânica básica             |

## Questões autorais (`questoes-autorais.json`)

A **primeira alternativa é sempre a correta**. A tela embaralha a ordem.

```json
{
  "tema": "leg",
  "enunciado": "Enunciado da questão:",
  "alternativas": ["correta", "errada 1", "errada 2", "errada 3"],
  "explicacao": "Explicação mostrada após a resposta.",
  "dificil": false
}
```

- `dificil: true` coloca a questão no **simulado difícil**.
- O id vem da posição no arquivo (`a0`, `a1`...). A lista de erros de cada usuário guarda esses ids, então **adicione questões novas no fim** do arquivo.

## Questões de provas reais (`questoes-provas.json`)

As alternativas ficam na ordem original da prova.

```json
{
  "prova": 3,
  "numero": 12,
  "tema": "sin",
  "enunciado": "A placa de nº R-1 regulamenta:",
  "alternativas": ["Parada obrigatória.", "Semáforo à frente.", "...", "..."],
  "correta": 0,
  "gabaritoAntigo": 2,
  "nota": "Explicação de por que a resposta mudou.",
  "duplicada": false
}
```

| Campo            | Obrigatório | Uso                                                                 |
| ---------------- | ----------- | ------------------------------------------------------------------- |
| `prova`, `numero` | sim        | id da questão (`p3-12`) e ordem dentro da prova                     |
| `correta`        | sim         | índice da resposta certa **pela lei atual**                         |
| `gabaritoAntigo` | não         | índice do gabarito original, quando a lei mudou                     |
| `nota`           | não         | explicação própria; sem ela, o app mostra a origem da questão       |
| `duplicada`      | não         | repetida em outra prova: fica fora dos sorteios                     |

A prova 38 é a "Prova geral".

### Normalização

`normalizarProva` move a correta para a posição 0 e guarda em `real.posicoes` o mapa de volta para as letras originais. Com isso o modo `prova` mostra as letras como no papel, e o `Gabarito` consegue mostrar ao mesmo tempo a letra do gabarito antigo e a de hoje.

## Placas

Se o enunciado citar o código de uma placa (`R-1`, `A-2a`...) e existir a imagem em `src/assets/placas/`, ela aparece na questão. Veja [placas.md](placas.md).

## Validação

`src/lib/banco.test.ts` tem um teste por questão: tema válido, 4 alternativas distintas, explicação presente e ids únicos. Rode `npm test` antes de cada commit. O CI roda os mesmos testes antes do deploy.
