import { useEffect, useState } from 'react'

function ler<T>(chave: string, padrao: T): T {
  try {
    const v = localStorage.getItem(chave)
    return v === null ? padrao : (JSON.parse(v) as T)
  } catch {
    return padrao
  }
}

/** useState persistido no localStorage. Falha em silêncio (modo privado, armazenamento cheio). */
export function useLocalStorage<T>(chave: string, padrao: T) {
  const [valor, setValor] = useState<T>(() => ler(chave, padrao))

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor))
    } catch {
      /* sem armazenamento: segue só em memória */
    }
  }, [chave, valor])

  const remover = () => {
    try {
      localStorage.removeItem(chave)
    } catch {
      /* ignora */
    }
    setValor(padrao)
  }

  return [valor, setValor, remover] as const
}
