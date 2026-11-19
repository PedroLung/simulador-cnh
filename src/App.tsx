import { useState } from 'react'
import { BANCO } from './lib/banco'
import { atualizarErros, corrigir } from './lib/correcao'
import { criarSessao } from './lib/sorteio'
import type { Modo, Sessao, TemaId } from './lib/tipos'
import { useProgresso } from './hooks/useProgresso'
import { Home } from './components/Home'
import { Quiz } from './components/Quiz'
import { Resultado } from './components/Resultado'

type Tela = { nome: 'inicio' } | { nome: 'quiz'; sessao: Sessao } | { nome: 'resultado'; sessao: Sessao }

export default function App() {
  const progresso = useProgresso()
  const [tela, setTela] = useState<Tela>({ nome: 'inicio' })

  const iniciar = (modo: Modo, alvo: { tema?: TemaId; prova?: number } = {}) => {
    const sessao = criarSessao(BANCO, modo, { ...alvo, erros: progresso.erros })
    if (!sessao.itens.length) return
    setTela({ nome: 'quiz', sessao })
    window.scrollTo(0, 0)
  }

  const responder = (indice: number, resposta: number) =>
    setTela((t) => {
      if (t.nome !== 'quiz') return t
      const itens = t.sessao.itens.map((it, i) => (i === indice ? { ...it, resposta } : it))
      return { ...t, sessao: { ...t.sessao, itens } }
    })

  const finalizar = (sessao: Sessao) => {
    const r = corrigir(sessao)
    progresso.setErros((e) => atualizarErros(e, sessao.itens))
    progresso.registrar({ data: Date.now(), modo: sessao.modo, tema: sessao.tema, prova: sessao.prova, acertos: r.acertos, total: r.total })
    setTela({ nome: 'resultado', sessao })
    window.scrollTo(0, 0)
  }

  const inicio = () => setTela({ nome: 'inicio' })

  return (
    <main className="mx-auto flex max-w-180 flex-col gap-6 px-4 pt-6 pb-12">
      {tela.nome === 'inicio' && <Home progresso={progresso} iniciar={iniciar} />}
      {tela.nome === 'quiz' && (
        <Quiz
          key={tela.sessao.itens.map((i) => i.questao.id).join()}
          sessao={tela.sessao}
          correcaoImediata={progresso.correcaoImediata}
          onResponder={responder}
          onFinalizar={() => finalizar(tela.sessao)}
          onSair={inicio}
        />
      )}
      {tela.nome === 'resultado' && (
        <Resultado sessao={tela.sessao} onRefazer={() => iniciar(tela.sessao.modo, tela.sessao)} onInicio={inicio} />
      )}
    </main>
  )
}
