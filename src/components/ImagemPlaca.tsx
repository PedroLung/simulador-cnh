import { placaDoEnunciado } from '../lib/placas'

/** Mostra a placa citada no enunciado, como na prova do Detran. Não renderiza nada se não houver. */
export function ImagemPlaca({ enunciado, tamanho = 'size-28' }: { enunciado: string; tamanho?: string }) {
  const placa = placaDoEnunciado(enunciado)
  if (!placa) return null
  return <img src={placa.url} alt={`Placa ${placa.codigo}`} className={`${tamanho} object-contain`} loading="lazy" />
}
