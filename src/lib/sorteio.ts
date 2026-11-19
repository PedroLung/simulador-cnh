import type { ItemSessao, Modo, Questao, Sessao, TemaId } from './tipos'

export type Rng = () => number

/** Fisher–Yates. Recebe o gerador para os testes serem determinísticos. */
export function embaralhar<T>(lista: readonly T[], rng: Rng = Math.random): T[] {
  const a = lista.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** Divisão das 30 questões por tema, igual à prova do Detran. */
export const COMPOSICAO: Record<TemaId, number> = { leg: 7, sin: 3, alc: 2, dd: 10, ps: 3, ma: 3, mec: 2 }
export const QUESTOES_POR_TREINO = 10
export const QUESTOES_POR_REVISAO = 15

export interface OpcoesSessao {
  tema?: TemaId
  prova?: number
  erros?: string[]
  rng?: Rng
}

export function selecionarQuestoes(banco: Questao[], modo: Modo, op: OpcoesSessao = {}): Questao[] {
  const rng = op.rng ?? Math.random
  const unicas = banco.filter((q) => !q.duplicada)
  switch (modo) {
    case 'simulado':
    case 'dificil': {
      const escolhidas = (Object.keys(COMPOSICAO) as TemaId[]).flatMap((tema) => {
        const n = COMPOSICAO[tema]
        const pool = unicas.filter((q) => q.tema === tema)
        let pick = embaralhar(modo === 'dificil' ? pool.filter((q) => q.dificil) : pool, rng).slice(0, n)
        // Se faltar questão difícil no tema, completa com as normais
        if (pick.length < n)
          pick = pick.concat(
            embaralhar(
              pool.filter((q) => !pick.includes(q)),
              rng,
            ).slice(0, n - pick.length),
          )
        return pick
      })
      return embaralhar(escolhidas, rng)
    }
    case 'tema':
      return embaralhar(
        unicas.filter((q) => q.tema === op.tema),
        rng,
      ).slice(0, QUESTOES_POR_TREINO)
    case 'erros': {
      const ids = new Set(op.erros ?? [])
      return embaralhar(
        banco.filter((q) => ids.has(q.id)),
        rng,
      ).slice(0, QUESTOES_POR_REVISAO)
    }
    case 'prova':
      return banco.filter((q) => q.real?.prova === op.prova).sort((a, b) => a.real!.numero - b.real!.numero)
  }
}

export function criarSessao(banco: Questao[], modo: Modo, op: OpcoesSessao = {}): Sessao {
  const rng = op.rng ?? Math.random
  const itens: ItemSessao[] = selecionarQuestoes(banco, modo, op).map((questao) => ({
    questao,
    // Nas provas reais a ordem das letras é a original; nos demais modos é embaralhada
    ordem: modo === 'prova' && questao.real ? questao.real.posicoes.slice() : embaralhar([0, 1, 2, 3], rng),
    resposta: null,
  }))
  return { modo, tema: op.tema, prova: op.prova, itens }
}
