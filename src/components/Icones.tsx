interface IconeProps {
  className?: string
}

const BASE = {
  'aria-hidden': true,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export function IconeCacamba({ className }: IconeProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M2.5 8h19l-2.2 10H4.7L2.5 8Z" />
      <path d="M6 8V6h12v2M7 12h10" />
      <circle cx="7" cy="19.5" r="1" />
      <circle cx="17" cy="19.5" r="1" />
    </svg>
  )
}

export function IconeCaminhao({ className }: IconeProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M2 6h11v10H2zM13 9h4.5l3.5 3.5V16h-8" />
      <circle cx="6" cy="17.5" r="1.8" />
      <circle cx="17" cy="17.5" r="1.8" />
    </svg>
  )
}

export function IconeTroca({ className }: IconeProps) {
  return (
    <svg {...BASE} className={className}>
      <path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5" />
    </svg>
  )
}

/** Ícone do WhatsApp. Dentro de um Button, passe `className=""` e `data-icon`: o Button define o tamanho. */
export function IconeWhatsApp({
  className = 'size-5 shrink-0',
  'data-icon': dataIcon,
}: IconeProps & { 'data-icon'?: 'inline-start' | 'inline-end' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className || undefined} data-icon={dataIcon} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3Z" />
    </svg>
  )
}

export function IconeMenu({ aberto, className }: IconeProps & { aberto: boolean }) {
  return (
    <svg {...BASE} strokeWidth={2} className={className}>
      {aberto ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
    </svg>
  )
}

/** Ícone do Instagram (contorno). Dentro de um Button, passe `className=""` e `data-icon`. */
export function IconeInstagram({
  className = 'size-5 shrink-0',
  'data-icon': dataIcon,
}: IconeProps & { 'data-icon'?: 'inline-start' | 'inline-end' }) {
  return (
    <svg {...BASE} className={className || undefined} data-icon={dataIcon}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

/** Símbolo do Pix (losangos entrelaçados, simplificado), na cor do texto. */
export function IconePix({ className = 'size-4 shrink-0' }: IconeProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.6 17.3a2.9 2.9 0 0 1-2.1-.9l-3-3a.6.6 0 0 0-.8 0l-3 3a2.9 2.9 0 0 1-2.1.9H6l3.8 3.8a3 3 0 0 0 4.3 0l3.9-3.8h-.4ZM6.6 6.7c.8 0 1.5.3 2.1.9l3 3c.2.2.6.2.8 0l3-3a2.9 2.9 0 0 1 2.1-.9h.4l-3.9-3.8a3 3 0 0 0-4.3 0L6 6.7h.6Z" />
      <path d="m21.1 9.9-2.3-2.3h-1.2c-.5 0-1 .2-1.4.6l-3 3a1.7 1.7 0 0 1-2.4 0l-3-3a2 2 0 0 0-1.4-.6H5.1L2.9 9.9a3 3 0 0 0 0 4.3l2.2 2.2h1.3c.5 0 1-.2 1.4-.6l3-3a1.8 1.8 0 0 1 2.4 0l3 3c.4.4.9.6 1.4.6h1.2l2.3-2.3a3 3 0 0 0 0-4.2Z" />
    </svg>
  )
}
