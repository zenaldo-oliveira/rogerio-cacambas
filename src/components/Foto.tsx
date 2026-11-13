import { useState } from 'react'
import type { Foto as FotoConfig } from '../config/empresa'

interface FotoProps {
  foto: FotoConfig
  /** Nome do campo em empresa.ts, mostrado na prévia. */
  chave: string
  /** Proporção recomendada, mostrada na prévia. Ex.: '4:3'. */
  proporcao?: string
  className?: string
  prioridade?: boolean
}

/**
 * Mostra a foto real ou, se não houver arquivo configurado (ou ele ainda não existir
 * em public/), um espaço de prévia identificado.
 * O tamanho vem do contêiner (use aspect-* no elemento pai).
 */
export function Foto({ foto, chave, proporcao = '4:3', className = '', prioridade = false }: FotoProps) {
  const [falhou, setFalhou] = useState(false)

  if (foto.src && !falhou) {
    return (
      <img
        src={foto.src}
        alt={foto.alt}
        loading={prioridade ? 'eager' : 'lazy'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFalhou(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  const destino = foto.src ? <code className="font-mono">public{foto.src}</code> : <code className="font-mono">{chave}</code>

  return (
    <div
      role="img"
      aria-label={`Espaço reservado para foto: ${foto.alt}`}
      className={`flex h-full w-full flex-col items-center justify-center gap-1.5 border-2 border-dashed border-grafite-suave/40 bg-papel bg-[repeating-linear-gradient(135deg,transparent_0_14px,rgb(28_35_49/0.04)_14px_28px)] p-4 text-center ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7 text-grafite-suave/70" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <circle cx="9" cy="10" r="1.75" />
        <path d="m4 18 5.5-5.5 4 4L16 14l4 4" />
      </svg>
      <p className="text-sm font-semibold text-grafite">Foto pendente · {proporcao}</p>
      <p className="max-w-[28ch] text-xs text-grafite-suave">{foto.alt}</p>
      <p className="text-xs text-grafite-suave">{foto.src ? <>Adicionar {destino}</> : <><code className="font-mono">public/fotos/</code> → {destino}</>}</p>
    </div>
  )
}
