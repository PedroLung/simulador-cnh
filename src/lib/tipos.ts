export type TemaId = 'leg' | 'sin' | 'alc' | 'dd' | 'ps' | 'ma' | 'mec'

export interface Tema {
  id: TemaId
  nome: string
  descricao: string
}

/** Formato da questão autoral no JSON. A primeira alternativa é a correta. */
export interface QuestaoAutoralJson {
  tema: TemaId
  enunciado: string
  alternativas: string[]
  explicacao: string
  dificil: boolean
}

/** Formato da questão de prova real no JSON, com as alternativas na ordem original. */
export interface QuestaoProvaJson {
  prova: number
  numero: number
  tema: TemaId
  enunciado: string
  alternativas: string[]
  /** Índice da alternativa correta pela lei atual. */
  correta: number
  /** Índice do gabarito original, quando a lei mudou e ele ficou desatualizado. */
  gabaritoAntigo?: number
  /** Explicação própria (quando a resposta mudou ou precisa de contexto). */
  nota?: string
  /** Repetida em outra prova: fica fora dos sorteios. */
  duplicada?: boolean
}

export interface OrigemProva {
  prova: number
  numero: number
  /** posicoes[k] = índice em `alternativas` da letra k da prova original. */
  posicoes: number[]
  /** Letra (0-3) da prova original com a resposta atual. */
  correta: number
  gabaritoAntigo?: number
  temNota: boolean
}

/** Questão normalizada. `alternativas[0]` é sempre a correta; a tela embaralha a ordem. */
export interface Questao {
  id: string
  tema: TemaId
  enunciado: string
  alternativas: string[]
  explicacao: string
  dificil: boolean
  duplicada: boolean
  real?: OrigemProva
}

export type Modo = 'simulado' | 'dificil' | 'tema' | 'erros' | 'prova'

export interface ItemSessao {
  questao: Questao
  /** ordem[k] = índice em `questao.alternativas` exibido na letra k. */
  ordem: number[]
  /** Índice em `questao.alternativas` escolhido (0 = acertou), ou null. */
  resposta: number | null
}

export interface Sessao {
  modo: Modo
  tema?: TemaId
  prova?: number
  itens: ItemSessao[]
}

export interface RegistroHistorico {
  data: number
  modo: Modo
  tema?: TemaId
  prova?: number
  acertos: number
  total: number
}
