import type { ItemSessao, Modo, RegistroHistorico, Sessao, TemaId } from './tipos'

export const NOTA_MINIMA = 0.7
export const LETRAS = ['A', 'B', 'C', 'D'] as const

export const ehSimulado = (m: Modo) => m === 'simulado' || m === 'dificil' || m === 'prova'
export const minimoParaPassar = (total: number) => Math.ceil(total * NOTA_MINIMA)
export const acertou = (item: ItemSessao) => item.resposta === 0
export const passou = (r: Pick<RegistroHistorico, 'acertos' | 'total'>) => r.acertos >= minimoParaPassar(r.total)

export interface Resultado {
  acertos: number
  total: number
  percentual: number
  aprovado: boolean
  porTema: Partial<Record<TemaId, { acertos: number; total: number }>>
}

export function corrigir(sessao: Sessao): Resultado {
  const total = sessao.itens.length
  const acertos = sessao.itens.filter(acertou).length
  const porTema: Resultado['porTema'] = {}
  for (const it of sessao.itens) {
    const t = (porTema[it.questao.tema] ??= { acertos: 0, total: 0 })
    t.total++
    if (acertou(it)) t.acertos++
  }
  return {
    acertos,
    total,
    percentual: total ? Math.round((acertos / total) * 100) : 0,
    aprovado: total > 0 && passou({ acertos, total }),
    porTema,
  }
}

/** Questões erradas entram na lista de revisão; as que acertou saem. */
export function atualizarErros(erros: string[], itens: ItemSessao[]): string[] {
  const set = new Set(erros)
  for (const it of itens) {
    if (acertou(it)) set.delete(it.questao.id)
    else set.add(it.questao.id)
  }
  return [...set]
}

/** Letra exibida para um índice da prova original (gabarito oficial ou antigo). */
export function letraDaProva(item: ItemSessao, letraOriginal: number): string {
  const real = item.questao.real
  if (!real) return ''
  return LETRAS[item.ordem.indexOf(real.posicoes[letraOriginal])]
}

export const letraCorreta = (item: ItemSessao) => LETRAS[item.ordem.indexOf(0)]
