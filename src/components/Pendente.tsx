interface PendenteProps {
  /** O que falta, ex.: "bairros atendidos". */
  campo: string
  /** Chave em src/config/empresa.ts, ex.: "regiao.bairros". */
  chave: string
}

/** Marcador de prévia: indica um dado comercial que ainda precisa ser preenchido. */
export function Pendente({ campo, chave }: PendenteProps) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1.5 rounded-sm border border-dashed border-grafite-suave/50 bg-superficie px-2 py-0.5 text-sm text-grafite-suave">
      <span className="font-semibold text-grafite">Prévia:</span>
      <span>
        {campo} — preencher <code className="font-mono text-xs">{chave}</code> em{' '}
        <code className="font-mono text-xs">src/config/empresa.ts</code>
      </span>
    </span>
  )
}
