import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { linkWhatsApp } from '../config/contato'
import { useOcultarPerto } from '../hooks/useOcultarPerto'
import { IconeWhatsApp } from './Icones'

const POSICAO =
  'fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex size-14 items-center justify-center rounded-full ring-4 ring-white/90 sm:right-6 sm:bottom-6'

/** No celular, some sobre Localização e rodapé: lá há botões próprios e o atalho cobriria links e o mapa. */
const AREAS_SEM_ATALHO = ['#localizacao', '#contato']
const CELULAR = '(max-width: 767px)'

/** Saída suave: desce e esmaece (com movimento reduzido, só esmaece) e deixa de receber toque. */
const OCULTO = 'pointer-events-none opacity-0 motion-safe:translate-y-4'

/**
 * Atalho fixo para o orçamento. Desativado até haver um número válido em empresa.ts.
 */
export function WhatsAppFlutuante() {
  const href = linkWhatsApp()
  const oculto = useOcultarPerto(AREAS_SEM_ATALHO, CELULAR)

  if (!href) {
    return (
      <span
        role="img"
        aria-label="WhatsApp ainda não configurado"
        title="WhatsApp ainda não configurado"
        aria-hidden={oculto || undefined}
        className={cn(POSICAO, 'cursor-not-allowed bg-verde-escuro text-white/75 saturate-50 transition-[opacity,translate] duration-200', oculto && OCULTO)}
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
        'transition-[scale,background-color,opacity,translate] duration-200 active:not-aria-[haspopup]:translate-y-0 motion-safe:active:scale-95',
        oculto && OCULTO,
        'focus-visible:ring-4 focus-visible:ring-ring',
      )}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Pedir orçamento pelo WhatsApp"
        aria-hidden={oculto || undefined}
        tabIndex={oculto ? -1 : undefined}
      >
        {/* Anel verde: anima 2 vezes ao carregar e some; o botão permanece parado. */}
        <span aria-hidden="true" className="anel-whatsapp" />
        <IconeWhatsApp className="" data-icon="inline-start" />
      </a>
    </Button>
  )
}
