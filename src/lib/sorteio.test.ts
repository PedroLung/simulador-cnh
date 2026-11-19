import { describe, expect, it } from 'vitest'
import { BANCO } from './banco'
import { COMPOSICAO, criarSessao, embaralhar } from './sorteio'

/** Gerador determinístico (mulberry32) para testes reproduzíveis. */
function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('embaralhar', () => {
  it('mantém os mesmos elementos e não altera a lista original', () => {
    const original = [1, 2, 3, 4, 5, 6]
    const r = embaralhar(original, rng(1))
    expect([...r].sort()).toEqual(original)
    expect(original).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('é reproduzível com a mesma semente', () => {
    expect(embaralhar([1, 2, 3, 4, 5], rng(42))).toEqual(embaralhar([1, 2, 3, 4, 5], rng(42)))
  })
})

describe('criarSessao', () => {
  it.each(['simulado', 'dificil'] as const)('%s tem 30 questões na divisão da prova, sem repetir', (modo) => {
    const s = criarSessao(BANCO, modo, { rng: rng(7) })
    expect(s.itens).toHaveLength(30)
    expect(new Set(s.itens.map((i) => i.questao.id)).size).toBe(30)
    for (const [tema, n] of Object.entries(COMPOSICAO)) {
      expect(s.itens.filter((i) => i.questao.tema === tema)).toHaveLength(n)
    }
    expect(s.itens.every((i) => !i.questao.duplicada)).toBe(true)
  })

  it('simulado difícil prioriza questões com pegadinha', () => {
    const s = criarSessao(BANCO, 'dificil', { rng: rng(3) })
    expect(s.itens.filter((i) => i.questao.dificil).length).toBeGreaterThanOrEqual(25)
  })

  it('treino por tema traz 10 questões do tema', () => {
    const s = criarSessao(BANCO, 'tema', { tema: 'ps', rng: rng(5) })
    expect(s.itens).toHaveLength(10)
    expect(s.itens.every((i) => i.questao.tema === 'ps')).toBe(true)
  })

  it('revisão de erros só usa as questões erradas', () => {
    const erros = ['a0', 'a5', 'p3-1']
    const s = criarSessao(BANCO, 'erros', { erros, rng: rng(9) })
    expect(s.itens.map((i) => i.questao.id).sort()).toEqual([...erros].sort())
  })

  it('prova real mantém a ordem das questões e das letras originais', () => {
    const s = criarSessao(BANCO, 'prova', { prova: 1 })
    const numeros = s.itens.map((i) => i.questao.real!.numero)
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b))
    for (const item of s.itens) expect(item.ordem).toEqual(item.questao.real!.posicoes)
  })

  it('embaralha as alternativas como permutação de 0..3', () => {
    const s = criarSessao(BANCO, 'simulado', { rng: rng(11) })
    for (const item of s.itens) expect([...item.ordem].sort()).toEqual([0, 1, 2, 3])
  })
})
