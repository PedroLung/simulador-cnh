# Tema claro e escuro

## Cores

As cores são variáveis CSS em `src/index.css`, mapeadas para tokens do Tailwind (`bg-surface`, `text-muted`, `border-line`...). Os componentes não usam `dark:`: trocar o tema é só trocar o valor das variáveis.

| Variável       | Uso                                    |
| -------------- | -------------------------------------- |
| `--bg`         | fundo da página                        |
| `--surface`    | cartões e botões                       |
| `--ink`        | texto principal                        |
| `--muted`      | texto secundário                       |
| `--line`       | bordas                                 |
| `--accent`     | amarelo da placa de advertência        |
| `--ok`, `--bad` | acerto e erro (com `-bg` para fundos) |
| `--chip`       | etiquetas                              |

O tema escuro vale quando `<html data-theme="dark">`. Antes de o JavaScript carregar, o CSS segue `prefers-color-scheme`, o que evita um flash de tema errado.

## Botão de tema

`ThemeToggle` alterna entre **claro** e **escuro**. O ícone mostra o tema para o qual o botão leva: lua no claro, sol no escuro.

`useTheme`:

- na primeira visita usa o tema do sistema;
- depois salva a escolha em `cnh:tema` (`light` ou `dark`);
- valores antigos, como `auto` de versões anteriores, são tratados como o tema do sistema.
