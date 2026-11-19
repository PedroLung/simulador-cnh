import { useLocalStorage } from './useLocalStorage'
import type { RegistroHistorico } from '../lib/tipos'

const MAX_HISTORICO = 50

/** Histórico de resultados, lista de erros e preferência de correção imediata. */
export function useProgresso() {
  const [historico, setHistorico, limparHistorico] = useLocalStorage<RegistroHistorico[]>('cnh:historico', [])
  const [erros, setErros, limparErros] = useLocalStorage<string[]>('cnh:erros', [])
  const [correcaoImediata, setCorrecaoImediata] = useLocalStorage('cnh:correcao-imediata', true)

  return {
    historico,
    erros,
    correcaoImediata,
    setCorrecaoImediata,
    setErros,
    registrar: (r: RegistroHistorico) => setHistorico((h) => [...h, r].slice(-MAX_HISTORICO)),
    apagarTudo: () => {
      limparHistorico()
      limparErros()
    },
  }
}

export type Progresso = ReturnType<typeof useProgresso>
