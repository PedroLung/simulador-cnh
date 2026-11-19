import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { BANCO } from './lib/banco'

/** Clica na alternativa correta (ou numa errada) da questão exibida, consultando o banco real. */
async function responder(user: ReturnType<typeof userEvent.setup>, certa: boolean) {
  const grupo = screen.getByRole('group', { name: 'Alternativas' })
  const botoes = within(grupo).getAllByRole('button')
  const textos = botoes.map((b) => b.lastElementChild!.textContent!)
  const enunciado = document.querySelector('article p.text-lg')!.textContent!
  // Há enunciados repetidos entre provas, então a questão é identificada pelo enunciado + alternativas
  const questao = BANCO.find((q) => q.enunciado === enunciado && q.alternativas.every((a) => textos.includes(a)))!
  const alvo = botoes[textos.findIndex((t) => (t === questao.alternativas[0]) === certa)]
  await user.click(alvo)
}

describe('App', { timeout: 20_000 }, () => {
  it('faz um treino por tema completo e salva o resultado', async () => {
    const user = userEvent.setup()
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Simulador Prova CNH' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Primeiros socorros/ }))
    for (let i = 0; i < 10; i++) {
      expect(screen.getByRole('heading', { name: `Questão ${i + 1} de 10` })).toBeInTheDocument()
      await responder(user, i < 8)
      expect(screen.getByText(i < 8 ? 'Certo!' : /Errado/)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: i < 9 ? 'Próxima' : 'Ver resultado' }))
    }

    expect(screen.getByRole('heading', { name: 'Aprovado' })).toBeInTheDocument()
    expect(screen.getByText('80% de acertos')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Voltar ao início' }))
    expect(screen.getByRole('button', { name: 'Revisar meus erros (2)' })).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('cnh:historico')!)).toHaveLength(1)
  })

  it('responde pelo teclado', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Começar simulado' }))
    await user.keyboard('b')
    expect(document.querySelector('[aria-live] p')).not.toBeNull()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('heading', { name: 'Questão 2 de 30' })).toBeInTheDocument()
  })

  it('pede confirmação ao finalizar com questões em branco (correção no final)', async () => {
    const user = userEvent.setup()
    localStorage.setItem('cnh:correcao-imediata', 'false')
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Prova 1' }))
    const nav = screen.getByRole('navigation', { name: 'Ir para questão' })
    const numeros = within(nav).getAllByRole('button')
    await user.click(numeros[numeros.length - 1])
    await user.click(screen.getByRole('button', { name: 'Finalizar e corrigir' }))
    expect(screen.getByText(/questões sem resposta/)).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: 'Finalizar e corrigir' })[0])
    expect(screen.getByRole('heading', { name: 'Ainda não' })).toBeInTheDocument()
  })
})
