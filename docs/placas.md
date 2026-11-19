# Imagens das placas

Quando o enunciado cita uma placa pelo código do CTB, a imagem dela aparece abaixo do texto, como na prova do Detran.

> A placa de nº **R-1** regulamenta: → mostra `src/assets/placas/R-1.svg`

## Como funciona

- `src/lib/placas.ts` carrega todos os SVGs de `src/assets/placas/` com `import.meta.glob`. O nome do arquivo é o código da placa.
- `placaDoEnunciado(enunciado)` procura códigos no formato `R-1`, `R-24b`, `A-2a` e devolve o primeiro que tem imagem.
- `ImagemPlaca` renderiza a imagem no **Quiz** e, menor, na correção do **Resultado**. Se não houver imagem, não mostra nada.
- O Vite embute as imagens pequenas no bundle e copia as maiores para `dist/assets`. As duas formas funcionam offline no PWA.

Só os códigos citados no **enunciado** são considerados. Questões que falam de placa sem dar o código não recebem imagem.

## Origem e licença

As imagens vêm da categoria _SVG regulatory/warning road signs of Brazil_ do [Wikimedia Commons](https://commons.wikimedia.org/). A sinalização oficial brasileira é de domínio público.

Mapeamentos especiais (em `scripts/baixar-placas.sh`):

| Código no enunciado | Arquivo no Commons     | Motivo                                       |
| ------------------- | ---------------------- | -------------------------------------------- |
| `R-19`              | `Brasil R-19 (80).svg` | a placa tem um número; usamos 80 km/h        |
| `A-6a`              | `Brasil A-6.svg`       | código como aparece na prova; o oficial é A-6 |

## Baixar as placas que faltam

```bash
bash scripts/baixar-placas.sh
```

O script lê os enunciados, descobre os códigos citados e baixa só os arquivos que ainda não existem. Se o Wikimedia limitar os downloads (erro 429), espere um pouco e rode de novo.

## Adicionar uma placa manualmente

1. Salve o SVG em `src/assets/placas/` com o código como nome, por exemplo `R-25a.svg`.
2. Confira que o arquivo não tem `<script>` nem atributos `on...=`.
3. Pronto: qualquer enunciado que cite `R-25a` passa a mostrar a imagem.
