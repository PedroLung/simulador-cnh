import temasJson from '../data/temas.json'
import autoraisJson from '../data/questoes-autorais.json'
import provasJson from '../data/questoes-provas.json'
import type { Questao, QuestaoAutoralJson, QuestaoProvaJson, Tema, TemaId } from './tipos'

/** Converte uma questão de prova: a correta vai para a posição 0 e guardamos o mapa das letras originais. */
export function normalizarProva(q: QuestaoProvaJson): Questao {
  const resto = q.alternativas.map((_, k) => k).filter((k) => k !== q.correta)
  const sequencia = [q.correta, ...resto]
  const posicoes = q.alternativas.map((_, k) => sequencia.indexOf(k))
  return {
    id: `p${q.prova}-${q.numero}`,
    tema: q.tema,
    enunciado: q.enunciado,
    alternativas: sequencia.map((k) => q.alternativas[k]),
    explicacao:
      q.nota ??
      (q.prova === 38
        ? 'Questão da prova geral, com o gabarito oficial.'
        : `Questão real da prova ${q.prova} (questão ${q.numero}), com o gabarito oficial conferido pela apostila atual.`),
    dificil: false,
    duplicada: Boolean(q.duplicada),
    real: {
      prova: q.prova,
      numero: q.numero,
      posicoes,
      correta: q.correta,
      gabaritoAntigo: q.gabaritoAntigo,
      temNota: Boolean(q.nota),
    },
  }
}

export function normalizarAutoral(q: QuestaoAutoralJson, i: number): Questao {
  return { id: `a${i}`, ...q, duplicada: false }
}

export function montarBanco(autorais: QuestaoAutoralJson[], provas: QuestaoProvaJson[]): Questao[] {
  return [...autorais.map(normalizarAutoral), ...provas.map(normalizarProva)]
}

export const TEMAS = temasJson as Tema[]
export const TEMA_POR_ID = Object.fromEntries(TEMAS.map((t) => [t.id, t])) as Record<TemaId, Tema>
export const BANCO = montarBanco(autoraisJson as QuestaoAutoralJson[], provasJson as QuestaoProvaJson[])
export const QUESTOES_UNICAS = BANCO.filter((q) => !q.duplicada)
export const PROVAS = [...new Set(BANCO.flatMap((q) => (q.real ? [q.real.prova] : [])))]
export const PROVA_GERAL = 38

export const nomeProva = (p: number) => (p === PROVA_GERAL ? 'Prova geral' : `Prova ${p}`)
