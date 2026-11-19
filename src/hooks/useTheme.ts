import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Tema = 'light' | 'dark'

function temaDoSistema(): Tema {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

/** Tema claro/escuro. Na primeira visita segue o sistema; depois vale a escolha do usuário. */
export function useTheme() {
  const [salvo, setTema] = useLocalStorage<string>('cnh:tema', temaDoSistema())
  // Valores antigos (como "auto") viram o tema do sistema.
  const tema: Tema = salvo === 'light' || salvo === 'dark' ? salvo : temaDoSistema()
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tema)
  }, [tema])
  const alternar = () => setTema(tema === 'dark' ? 'light' : 'dark')
  return { tema, alternar }
}
