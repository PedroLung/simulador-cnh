import { useEffect, useState } from 'react'
import { TEMA_POR_ID, nomeProva } from '../lib/banco'
import { LETRAS, acertou, ehSimulado, letraCorreta } from '../lib/correcao'
import type { Sessao } from '../lib/tipos'
import { Barra, Botao, Chip, Eyebrow, Placa } from './ui'
import { ImagemPlaca } from './ImagemPlaca'
import { ThemeToggle } from './ThemeToggle'
import { Gabarito } from './Gabarito'

interface Props {
  sessao: Sessao
  correcaoImediata: boolean
  onResponder: (indice: number, resposta: number) => void
  onFinalizar: () => void
  onSair: () => void
}

function titulo(s: Sessao, numeroReal?: number) {
  switch (s.modo) {
    case 'prova':
      return `${nomeProva(s.prova!)} · questão ${numeroReal} da prova`
    case 'simulado':
      return 'Simulado completo'
    case 'dificil':
      return 'Simulado difícil'
    case 'erros':
      return 'Revisão de erros'
    case 'tema':
      return TEMA_POR_ID[s.tema!].nome
  }
}

export function Quiz({ sessao, correcaoImediata, onResponder, onFinalizar, onSair }: Props) {
  const [atual, setAtual] = useState(0)
  const [confirmar, setConfirmar] = useState(false)
  const n = sessao.itens.length
  const item = sessao.itens[atual]
  const simulado = ehSimulado(sessao.modo)
  // Treinos por tema e revisão sempre corrigem na hora; simulados seguem a preferência
  const imediata = !simulado || correcaoImediata
  const mostrarCorrecao = imediata && item.resposta !== null
  const respondidas = sessao.itens.filter((x) => x.resposta !== null).length
  const ultima = atual === n - 1
  const bloqueado = imediata && item.resposta === null

  const irPara = (i: number) => {
    setAtual(i)
    setConfirmar(false)
    window.scrollTo(0, 0)
  }
  const responder = (alternativa: number) => {
    if (!mostrarCorrecao) onResponder(atual, alternativa)
  }
  const finalizar = () => (respondidas < n ? setConfirmar(true) : onFinalizar())
  const avancar = () => {
    if (bloqueado) return
    if (ultima) finalizar()
    else irPara(atual + 1)
  }

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target instanceof HTMLInputElement) return
      const k = e.key.toLowerCase()
      const idx = Math.max('abcd'.indexOf(k), '1234'.indexOf(k))
      if (k.length === 1 && idx >= 0) {
        e.preventDefault()
        responder(item.ordem[idx])
      } else if (k === 'arrowright' || (k === 'enter' && !(e.target instanceof HTMLButtonElement))) {
        e.preventDefault()
        avancar()
      } else if (k === 'arrowleft' && atual > 0) {
        e.preventDefault()
        irPara(atual - 1)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Eyebrow>{titulo(sessao, item.questao.real?.numero)}</Eyebrow>
          <h2 className="text-2xl">
            Questão {atual + 1} de {n}
          </h2>
        </div>
        <div className="flex gap-2.5">
          <ThemeToggle />
          <Botao onClick={onSair}>Sair</Botao>
        </div>
      </div>
      <Barra valor={respondidas / n} rotulo="Questões respondidas" />

      <article className="flex flex-col gap-4.5 rounded-xl border border-line bg-surface p-5.5">
        <div className="flex items-start gap-3.5">
          <Placa>{atual + 1}</Placa>
          <div className="flex min-w-0 flex-col gap-1.5">
            <Chip>{TEMA_POR_ID[item.questao.tema].nome}</Chip>
            <p className="text-lg font-medium">{item.questao.enunciado}</p>
            <ImagemPlaca enunciado={item.questao.enunciado} />
          </div>
        </div>
        <fieldset className="m-0 flex min-w-0 flex-col gap-2.5 border-0 p-0">
          <legend className="sr-only">Alternativas</legend>
          {item.ordem.map((alt, k) => {
            const certa = mostrarCorrecao && alt === 0
            const errada = mostrarCorrecao && alt !== 0 && item.resposta === alt
            const marcada = !mostrarCorrecao && item.resposta === alt
            const caixa = certa
              ? 'border-ok bg-ok-bg'
              : errada
                ? 'border-bad bg-bad-bg'
                : marcada
                  ? 'border-ink bg-bg'
                  : 'border-transparent bg-bg hover:enabled:border-line'
            const letra = certa
              ? 'border-ok bg-ok text-white'
              : errada
                ? 'border-bad bg-bad text-white'
                : marcada
                  ? 'border-ink bg-ink text-bg'
                  : 'border-muted'
            return (
              <button
                key={alt}
                type="button"
                disabled={mostrarCorrecao}
                aria-pressed={item.resposta === alt}
                onClick={() => responder(alt)}
                className={`flex w-full items-start gap-3 rounded-[10px] border-2 px-3.5 py-3 text-left disabled:cursor-default ${caixa}`}
              >
                <span className={`grid size-6.5 flex-none place-items-center rounded-full border-[1.5px] font-display font-bold ${letra}`}>
                  {LETRAS[k]}
                </span>
                <span>{item.questao.alternativas[alt]}</span>
              </button>
            )
          })}
        </fieldset>
        <div aria-live="polite">
          {mostrarCorrecao && (
            <div className="flex flex-col gap-1 rounded-r-lg border-l-4 border-accent bg-bg px-3.5 py-2.5">
              <p className={`font-semibold ${acertou(item) ? 'text-ok' : 'text-bad'}`}>
                {acertou(item) ? 'Certo!' : `Errado. A resposta é ${letraCorreta(item)}.`}
              </p>
              <Gabarito item={item} />
              {!(item.questao.real && !item.questao.real.temNota && sessao.modo === 'prova') && <p>{item.questao.explicacao}</p>}
            </div>
          )}
        </div>
      </article>

      {confirmar && (
        <div className="flex flex-col gap-2.5 rounded-[10px] border border-bad bg-bad-bg p-3.5">
          <p>
            <strong>Ainda faltam {n - respondidas} questões sem resposta.</strong> Questões em branco contam como erro. Quer finalizar mesmo
            assim?
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Botao variante="primario" onClick={onFinalizar}>
              Finalizar e corrigir
            </Botao>
            <Botao onClick={() => irPara(sessao.itens.findIndex((x) => x.resposta === null))}>Continuar respondendo</Botao>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-2.5">
        <Botao disabled={atual === 0} onClick={() => irPara(atual - 1)}>
          Anterior
        </Botao>
        <Botao variante="primario" disabled={bloqueado} onClick={avancar}>
          {!ultima ? 'Próxima' : imediata ? 'Ver resultado' : 'Finalizar e corrigir'}
        </Botao>
      </div>

      {simulado && (
        <nav className="grid grid-cols-[repeat(auto-fill,minmax(38px,1fr))] gap-1.5" aria-label="Ir para questão">
          {sessao.itens.map((x, k) => (
            <button
              key={x.questao.id}
              type="button"
              onClick={() => irPara(k)}
              aria-label={`Ir para questão ${k + 1}`}
              aria-current={k === atual ? 'step' : undefined}
              className={`rounded-md border py-1.5 text-sm tabular-nums ${x.resposta !== null ? 'bg-chip font-semibold' : 'bg-surface'} ${k === atual ? 'border-2 border-ink' : 'border-line'}`}
            >
              {k + 1}
            </button>
          ))}
        </nav>
      )}
    </>
  )
}
