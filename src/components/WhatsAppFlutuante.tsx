import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { linkWhatsApp } from '../config/contato'
import { IconeWhatsApp } from './Icones'

const POSICAO =
  'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full ring-4 ring-white/90 sm:right-6 sm:bottom-6'

/** Atalho fixo para o orçamento. Desativado até haver um número válido em empresa.ts. */
export function WhatsAppFlutuante() {
  const href = linkWhatsApp()

  if (!href) {
    return (
      <span
        role="img"
        aria-label="WhatsApp ainda não configurado"
        title="WhatsApp ainda não configurado"
        className={cn(POSICAO, 'cursor-not-allowed bg-verde-escuro text-white/75 saturate-50')}
      >
        <IconeWhatsApp className="size-7" />
      </span>
    )
  }

  return (
    <Button
      asChild
      className={cn(
        POSICAO,
        'border-0 p-0 shadow-[0_6px_16px_-6px_rgb(0_0_0/0.35)] hover:bg-verde-escuro [&_svg:not([class*=size-])]:size-7',
        'transition-[scale,background-color] duration-150 active:not-aria-[haspopup]:translate-y-0 motion-safe:active:scale-95',
        'focus-visible:ring-4 focus-visible:ring-ring',
      )}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Pedir orçamento pelo WhatsApp">
        {/* Anel verde: anima 2 vezes ao carregar e some; o botão permanece parado. */}
        <span aria-hidden="true" className="anel-whatsapp" />
        <IconeWhatsApp className="" data-icon="inline-start" />
      </a>
    </Button>
  )
}
