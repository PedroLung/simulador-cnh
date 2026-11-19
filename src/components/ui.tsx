import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'padrao' | 'primario' | 'perigo'

const estilos: Record<Variante, string> = {
  padrao: 'border-line bg-surface hover:border-ink',
  primario: 'border-accent bg-accent text-accent-ink hover:brightness-105',
  perigo: 'border-bad bg-bad-bg text-bad',
}

export function Botao({
  variante = 'padrao',
  pequeno = false,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; pequeno?: boolean }) {
  return (
    <button
      type="button"
      className={`rounded-lg border font-semibold transition disabled:cursor-not-allowed disabled:opacity-45 ${pequeno ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5'} ${estilos[variante]} ${className}`}
      {...props}
    />
  )
}

/** Losango amarelo de placa de advertência. */
export function Placa({ children }: { children: ReactNode }) {
  return (
    <div className="relative size-10 flex-none" aria-hidden="true">
      <div className="absolute inset-1.5 rotate-45 rounded-[3px] border-2 border-accent-ink bg-accent" />
      <span className="absolute inset-0 grid place-items-center font-display font-bold text-accent-ink">{children}</span>
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="font-display text-sm font-semibold tracking-[.08em] text-muted uppercase">{children}</p>
}

export function Chip({ children }: { children: ReactNode }) {
  return <span className="self-start rounded-md bg-chip px-2 py-0.5 text-xs font-semibold text-muted">{children}</span>
}

export function Pill({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ok ? 'bg-ok-bg text-ok' : 'bg-bad-bg text-bad'}`}>{children}</span>
  )
}

export function Barra({ valor, cor = 'bg-accent', rotulo }: { valor: number; cor?: string; rotulo?: string }) {
  return (
    <div
      className="h-1.5 overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(valor * 100)}
    >
      <i className={`block h-full transition-[width] duration-200 ${cor}`} style={{ width: `${valor * 100}%` }} />
    </div>
  )
}

export const Cartao = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <section className={`flex flex-col gap-4 rounded-xl border border-line bg-surface p-6 ${className}`}>{children}</section>
)
