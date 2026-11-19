import { useState } from 'react'
import { BANCO, PROVAS, PROVA_GERAL, QUESTOES_UNICAS, TEMAS, TEMA_POR_ID, nomeProva } from '../lib/banco'
import { ehSimulado, passou } from '../lib/correcao'
import type { Progresso } from '../hooks/useProgresso'
import type { Modo, RegistroHistorico, TemaId } from '../lib/tipos'
import { Botao, Cartao, Eyebrow, Pill, Placa } from './ui'
import { ThemeToggle } from './ThemeToggle'
import { Footer } from './Footer'

export interface Iniciar {
  (modo: Modo, alvo?: { tema?: TemaId; prova?: number }): void
}

const TOTAL_DIFICEIS = BANCO.filter((q) => q.dificil).length
const POR_TEMA = Object.fromEntries(TEMAS.map((t) => [t.id, QUESTOES_UNICAS.filter((q) => q.tema === t.id).length]))
const POR_PROVA = Object.fromEntries(PROVAS.map((p) => [p, BANCO.filter((q) => q.real?.prova === p).length]))

function nomeRegistro(h: RegistroHistorico) {
  switch (h.modo) {
    case 'prova':
      return nomeProva(h.prova!)
    case 'simulado':
      return 'Simulado'
    case 'dificil':
      return 'Simulado difícil'
    case 'erros':
      return 'Revisão de erros'
    case 'tema':
      return TEMA_POR_ID[h.tema!].nome
  }
}

export function Home({ progresso, iniciar }: { progresso: Progresso; iniciar: Iniciar }) {
  const { historico, erros, correcaoImediata, setCorrecaoImediata, apagarTudo } = progresso
  const [confirmarApagar, setConfirmarApagar] = useState(false)
  const simulados = historico.filter((h) => h.modo === 'simulado' || h.modo === 'dificil')
  const melhor = simulados.length ? Math.max(...simulados.map((h) => h.acertos)) : null

  return (
    <>
      <header className="flex items-center gap-3.5">
        <Placa>!</Placa>
        <div className="min-w-0 flex-1">
          <Eyebrow>Prova teórica do Detran</Eyebrow>
          <h1 className="text-[2rem] sm:text-[2.4rem]">Simulador Prova CNH</h1>
        </div>
        <ThemeToggle />
      </header>

      <Cartao>
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl">Simulado completo</h2>
          <p className="text-muted">
            30 questões sorteadas de todos os temas, misturando questões autorais com as de provas reais, na mesma divisão da prova:
            legislação (com sinalização, álcool e crimes), direção defensiva, primeiros socorros, meio ambiente e mecânica. Para passar,
            acerte pelo menos 21 (70%).
          </p>
          <p className="text-muted">
            O <strong>simulado difícil</strong> sorteia só entre as {TOTAL_DIFICEIS} questões com pegadinhas, atualizadas pela apostila
            oficial CNH do Brasil (Senatran, dez/2025).
          </p>
        </div>
        <dl className="flex flex-wrap gap-6">
          {[
            [QUESTOES_UNICAS.length.toLocaleString('pt-BR'), 'questões no banco'],
            [simulados.length, 'simulados feitos'],
            [melhor === null ? '–' : `${melhor}/30`, 'melhor nota'],
          ].map(([valor, rotulo]) => (
            <div key={rotulo} className="flex flex-col-reverse">
              <dt className="text-sm text-muted">{rotulo}</dt>
              <dd className="font-display text-3xl leading-none font-bold tabular-nums">{valor}</dd>
            </div>
          ))}
        </dl>
        <label className="flex items-start gap-2.5 text-[.95rem] leading-snug">
          <input
            type="checkbox"
            className="mt-0.5 size-5 flex-none accent-accent"
            checked={correcaoImediata}
            onChange={(e) => setCorrecaoImediata(e.target.checked)}
          />
          Mostrar se acertei e a explicação logo após cada questão (vale para simulados e provas reais). Desmarque para treinar como no dia
          da prova, com a correção só no final.
        </label>
        <div className="flex flex-wrap gap-2.5">
          <Botao variante="primario" onClick={() => iniciar('simulado')}>
            Começar simulado
          </Botao>
          <Botao onClick={() => iniciar('dificil')}>Simulado difícil (pegadinhas)</Botao>
          {erros.length > 0 && <Botao onClick={() => iniciar('erros')}>Revisar meus erros ({erros.length})</Botao>}
        </div>
      </Cartao>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl">Treino por tema</h2>
          <p className="text-muted">10 questões do tema escolhido, com a resposta e a explicação logo após cada uma.</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5">
          {TEMAS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => iniciar('tema', { tema: t.id })}
              className="flex flex-col gap-1 rounded-[10px] border border-line bg-surface p-3.5 text-left hover:border-ink"
            >
              <strong className="font-display text-lg">{t.nome}</strong>
              <small className="text-muted">{t.descricao}</small>
              <small className="text-muted">{POR_TEMA[t.id]} questões</small>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl">Provas reais</h2>
          <p className="text-muted">
            {PROVAS.length} provas antigas com as questões na ordem original e o gabarito oficial, conferido com a apostila oficial CNH do
            Brasil (dez/2025). Onde a lei mudou, aparece o gabarito antigo e a resposta de hoje com a explicação. Ficaram de fora as
            questões que dependem de figura, as que vieram quebradas no PDF e as que ficaram sem alternativa certa pela lei atual.
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2">
          {PROVAS.map((p) => {
            const ultima = historico.findLast((h) => h.modo === 'prova' && h.prova === p)
            return (
              <button
                key={p}
                type="button"
                onClick={() => iniciar('prova', { prova: p })}
                aria-label={nomeProva(p)}
                className="flex flex-col items-start gap-0.5 rounded-[10px] border border-line bg-surface p-2.5 text-left hover:border-ink"
              >
                <strong className="font-display text-lg">{p === PROVA_GERAL ? 'Geral' : p}</strong>
                <small className="text-muted">{POR_PROVA[p]} questões</small>
                {ultima && (
                  <small className={`font-semibold ${passou(ultima) ? 'text-ok' : 'text-bad'}`}>
                    última: {ultima.acertos}/{ultima.total}
                  </small>
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl">Seus resultados</h2>
          {(historico.length > 0 || erros.length > 0) && (
            <Botao
              pequeno
              variante={confirmarApagar ? 'perigo' : 'padrao'}
              onClick={() => {
                if (confirmarApagar) {
                  apagarTudo()
                  setConfirmarApagar(false)
                } else setConfirmarApagar(true)
              }}
            >
              {confirmarApagar ? 'Clique de novo para confirmar' : 'Apagar meu progresso'}
            </Botao>
          )}
        </div>
        {historico.length ? (
          <ul className="flex flex-col">
            {historico
              .slice(-8)
              .reverse()
              .map((h) => (
                <li key={h.data} className="flex justify-between gap-3 border-b border-line py-2 tabular-nums">
                  <span>
                    {nomeRegistro(h)} <span className="text-muted">· {new Date(h.data).toLocaleDateString('pt-BR')}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    {h.acertos}/{h.total}
                    {ehSimulado(h.modo) && <Pill ok={passou(h)}>{passou(h) ? 'Aprovado' : 'Reprovado'}</Pill>}
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-muted">
            Nenhum resultado ainda. Faça o primeiro simulado e sua nota aparece aqui. Os resultados ficam salvos só neste navegador.
          </p>
        )}
      </section>
      <Footer />
    </>
  )
}
