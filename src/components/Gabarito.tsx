import { PROVA_GERAL } from '../lib/banco'
import { letraDaProva } from '../lib/correcao'
import type { ItemSessao } from '../lib/tipos'
import { Pill } from './ui'

/** Linha com a origem da questão real e o gabarito (antigo x atual quando a lei mudou). */
export function Gabarito({ item }: { item: ItemSessao }) {
  const real = item.questao.real
  if (!real) return null
  const fonte = real.prova === PROVA_GERAL ? 'Prova geral' : `Prova ${real.prova}, questão ${real.numero}`
  if (real.gabaritoAntigo !== undefined)
    return (
      <p className="flex flex-wrap items-center gap-2 text-[.95rem]">
        <Pill ok={false}>Gabarito antigo: {letraDaProva(item, real.gabaritoAntigo)}</Pill>
        <Pill ok>Resposta atual: {letraDaProva(item, real.correta)}</Pill>
        <span className="text-muted">{fonte}</span>
      </p>
    )
  return (
    <p className="text-muted">
      {fonte} · gabarito oficial: {letraDaProva(item, real.correta)}
    </p>
  )
}
