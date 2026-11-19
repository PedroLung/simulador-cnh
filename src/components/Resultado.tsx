import { useState } from 'react'
import { TEMA_POR_ID } from '../lib/banco'
import { acertou, corrigir, ehSimulado, minimoParaPassar } from '../lib/correcao'
import type { Sessao, TemaId } from '../lib/tipos'
import { Barra, Botao, Cartao, Chip, Eyebrow, Pill, Placa } from './ui'
import { ImagemPlaca } from './ImagemPlaca'
import { ThemeToggle } from './ThemeToggle'
import { Gabarito } from './Gabarito'
import { Footer } from './Footer'

export function Resultado({ sessao, onRefazer, onInicio }: { sessao: Sessao; onRefazer: () => void; onInicio: () => void }) {
  const [soErradas, setSoErradas] = useState(true)
  const r = corrigir(sessao)
  const simulado = ehSimulado(sessao.modo)
  const aprovado = simulado ? r.aprovado : r.percentual >= 70
  const minimo = minimoParaPassar(r.total)
  const lista = sessao.itens.map((it, k) => ({ it, k })).filter(({ it }) => !soErradas || !acertou(it))

  return (
    <>
      <header className="flex items-center gap-3.5">
        <Placa>!</Placa>
        <div className="min-w-0 flex-1">
          <Eyebrow>{simulado ? 'Resultado do simulado' : 'Resultado do treino'}</Eyebrow>
          <h1 className="text-[2rem] sm:text-[2.4rem]">{aprovado ? 'Aprovado' : 'Ainda não'}</h1>
        </div>
        <ThemeToggle />
      </header>

      <Cartao>
        <div className="flex flex-wrap items-baseline gap-3.5">
          <b className="font-display text-[3.2rem] leading-none tabular-nums sm:text-[4rem]">
            {r.acertos}/{r.total}
          </b>
          <Pill ok={aprovado}>{r.percentual}% de acertos</Pill>
        </div>
        <p className="text-muted">
          {simulado
            ? aprovado
              ? `Você atingiu o mínimo de ${minimo} acertos (70%).`
              : `Para passar você precisa de ${minimo} acertos (70%). Revise as questões abaixo e tente de novo.`
            : 'Meta: 70% ou mais em cada tema.'}{' '}
          As questões erradas foram para a sua lista de revisão.
        </p>
        <div className="flex flex-col gap-2">
          {(Object.entries(r.porTema) as [TemaId, { acertos: number; total: number }][]).map(([t, v]) => (
            <div
              key={t}
              className="grid grid-cols-[minmax(0,120px)_1fr_48px] items-center gap-2.5 text-[.95rem] sm:grid-cols-[minmax(0,170px)_1fr_56px]"
            >
              <span>{TEMA_POR_ID[t].nome}</span>
              <Barra valor={v.acertos / v.total} cor="bg-ok" rotulo={`Acertos em ${TEMA_POR_ID[t].nome}`} />
              <span className="text-right tabular-nums">
                {v.acertos}/{v.total}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Botao variante="primario" onClick={onRefazer}>
            {sessao.modo === 'prova' ? 'Refazer esta prova' : simulado ? 'Fazer outro simulado' : 'Treinar de novo'}
          </Botao>
          <Botao onClick={onInicio}>Voltar ao início</Botao>
        </div>
      </Cartao>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">Correção</h2>
          <Botao onClick={() => setSoErradas((v) => !v)}>{soErradas ? 'Mostrar todas' : 'Mostrar só as erradas'}</Botao>
        </div>
        <div className="flex flex-col gap-3">
          {lista.length ? (
            lista.map(({ it, k }) => {
              const ok = acertou(it)
              return (
                <div
                  key={it.questao.id}
                  className={`flex flex-col gap-2 rounded-[10px] border border-l-4 border-line bg-surface p-4 ${ok ? 'border-l-ok' : 'border-l-bad'}`}
                >
                  <Chip>
                    {it.questao.real && sessao.modo === 'prova' ? `Questão ${it.questao.real.numero}` : k + 1} ·{' '}
                    {TEMA_POR_ID[it.questao.tema].nome}
                  </Chip>
                  <p>
                    <strong>{it.questao.enunciado}</strong>
                  </p>
                  <ImagemPlaca enunciado={it.questao.enunciado} tamanho="size-20" />
                  <Gabarito item={it} />
                  {ok ? (
                    <p className="text-[.95rem] font-semibold text-ok">Sua resposta: {it.questao.alternativas[0]}</p>
                  ) : (
                    <>
                      <p className="text-[.95rem] font-semibold text-bad">
                        Sua resposta: {it.resposta === null ? 'em branco' : it.questao.alternativas[it.resposta]}
                      </p>
                      <p className="text-[.95rem] font-semibold text-ok">Correta: {it.questao.alternativas[0]}</p>
                    </>
                  )}
                  {(!it.questao.real || it.questao.real.temNota) && <p className="text-muted">{it.questao.explicacao}</p>}
                </div>
              )
            })
          ) : (
            <p className="text-muted">Nenhum erro. Gabaritou!</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
