const Kbd = ({ children }: { children: string }) => (
  <kbd className="rounded border border-b-2 border-line bg-chip px-1.5 font-sans text-xs font-semibold">{children}</kbd>
)

export function Footer() {
  return (
    <footer className="flex flex-col gap-2 border-t border-line pt-4 text-sm text-muted">
      <p>
        Projeto de estudo e portfólio. Não é um serviço oficial do Detran nem da Senatran. As regras seguem o CTB e a apostila oficial CNH
        do Brasil (dez/2025); confira sempre a legislação vigente.
      </p>
      <p>
        Atalhos no quiz: <Kbd>A</Kbd>–<Kbd>D</Kbd> ou <Kbd>1</Kbd>–<Kbd>4</Kbd> respondem, <Kbd>→</Kbd> ou <Kbd>Enter</Kbd> avança,{' '}
        <Kbd>←</Kbd> volta.
      </p>
    </footer>
  )
}
