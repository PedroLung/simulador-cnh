import { describe, expect, it } from 'vitest'
import { normalizarProva } from './banco'
import { atualizarErros, corrigir, letraCorreta, letraDaProva, minimoParaPassar } from './correcao'
import type { ItemSessao, Questao, Sessao } from './tipos'

const q = (id: string, tema: Questao['tema'] = 'leg'): Questao => ({
  id,
  tema,
  enunciado: id,
  alternativas: ['certa', 'b', 'c', 'd'],
  explicacao: '',
  dificil: false,
  duplicada: false,
})
const item = (id: string, resposta: number | null, tema?: Questao['tema']): ItemSessao => ({
  questao: q(id, tema),
  ordem: [0, 1, 2, 3],
  resposta,
})

describe('correção', () => {
  it('exige 70% para passar', () => {
    expect(minimoParaPassar(30)).toBe(21)
    expect(minimoParaPassar(10)).toBe(7)
  })

  it('conta acertos, percentual e desempenho por tema', () => {
    const sessao: Sessao = { modo: 'simulado', itens: [item('1', 0), item('2', 1), item('3', null, 'dd'), item('4', 0, 'dd')] }
    const r = corrigir(sessao)
    expect(r).toMatchObject({ acertos: 2, total: 4, percentual: 50, aprovado: false })
    expect(r.porTema).toEqual({ leg: { acertos: 1, total: 2 }, dd: { acertos: 1, total: 2 } })
  })

  it('adiciona erros e remove acertos da lista de revisão', () => {
    expect(atualizarErros(['1', 'x'], [item('1', 0), item('2', 3), item('3', null)]).sort()).toEqual(['2', '3', 'x'])
  })

  it('mostra a letra correta na ordem embaralhada', () => {
    expect(letraCorreta({ ...item('1', null), ordem: [2, 3, 0, 1] })).toBe('C')
  })

  it('converte gabarito antigo e atual da prova para as letras exibidas', () => {
    const questao = normalizarProva({
      prova: 1,
      numero: 1,
      tema: 'leg',
      enunciado: '?',
      alternativas: ['a', 'b', 'c', 'd'],
      correta: 3,
      gabaritoAntigo: 0,
    })
    const itemProva: ItemSessao = { questao, ordem: questao.real!.posicoes, resposta: null }
    expect(letraDaProva(itemProva, questao.real!.correta)).toBe('D')
    expect(letraDaProva(itemProva, questao.real!.gabaritoAntigo!)).toBe('A')
    expect(letraCorreta(itemProva)).toBe('D')
  })
})
