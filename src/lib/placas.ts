// Imagens das placas do CTB (domínio público, via Wikimedia Commons), nomeadas pelo código: R-1.svg, A-2a.svg...
const ARQUIVOS = import.meta.glob<string>('../assets/placas/*.svg', { eager: true, query: '?url', import: 'default' })

const URL_POR_CODIGO = Object.fromEntries(
  Object.entries(ARQUIVOS).map(([caminho, url]) => [caminho.slice(caminho.lastIndexOf('/') + 1, -4), url]),
)

/** Código da placa citado no enunciado ("A placa R-1 indica..."), se houver imagem para ele. */
export function placaDoEnunciado(enunciado: string): { codigo: string; url: string } | null {
  for (const [codigo] of enunciado.matchAll(/\b[RA]-\d+[a-z]?\b/g)) {
    const url = URL_POR_CODIGO[codigo]
    if (url) return { codigo, url }
  }
  return null
}
