import { describe, expect, it } from 'vitest'
import { BANCO, PROVAS, QUESTOES_UNICAS, TEMAS, normalizarProva } from './banco'

// Integridade do banco de questões: roda no CI antes de cada deploy
describe('banco de questões', () => {
  const temas = new Set(TEMAS.map((t) => t.id))

  it('tem 1.254 questões únicas em 38 provas e 7 temas', () => {
    expect(QUESTOES_UNICAS).toHaveLength(1254)
    expect(PROVAS).toHaveLength(38)
    expect(TEMAS).toHaveLength(7)
  })

  it('não tem ids repetidos', () => {
    expect(new Set(BANCO.map((q) => q.id)).size).toBe(BANCO.length)
  })

  it.each(BANCO.map((q) => [q.id, q] as const))('%s é válida', (_, q) => {
    expect(temas.has(q.tema)).toBe(true)
    expect(q.enunciado.trim()).not.toBe('')
    expect(q.explicacao.trim()).not.toBe('')
    expect(q.alternativas).toHaveLength(4)
    expect(new Set(q.alternativas.map((a) => a.trim().toLowerCase())).size).toBe(4)
  })

  it('não repete questões autorais', () => {
    const chaves = BANCO.filter((q) => !q.real).map((q) => `${q.enunciado}|${q.alternativas[0]}`)
    expect(new Set(chaves).size).toBe(chaves.length)
  })
})

describe('normalizarProva', () => {
  const q = normalizarProva({
    prova: 5,
    numero: 12,
    tema: 'leg',
    enunciado: 'Pergunta?',
    alternativas: ['A0', 'B1', 'C2', 'D3'],
    correta: 2,
    gabaritoAntigo: 1,
  })

  it('coloca a alternativa correta na posição 0', () => {
    expect(q.alternativas[0]).toBe('C2')
    expect(q.id).toBe('p5-12')
  })

  it('guarda o mapa para reconstruir as letras originais', () => {
    expect(q.real!.posicoes.map((i) => q.alternativas[i])).toEqual(['A0', 'B1', 'C2', 'D3'])
  })

  it('usa texto padrão quando não há nota', () => {
    expect(q.explicacao).toContain('prova 5')
    expect(q.real!.temNota).toBe(false)
  })
})
