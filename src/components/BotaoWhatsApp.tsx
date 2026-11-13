import { useId } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { linkWhatsApp } from '../config/contato'
import { IconeWhatsApp } from './Icones'

interface BotaoWhatsAppProps {
  texto?: string
  /** Caçamba escolhida (ex.: '4 m³'): entra na mensagem como "Tamanho da caçamba". */
  capacidade?: string
  /** `card`: largura total, para botões dentro de cards. */
  tamanho?: 'normal' | 'compacto' | 'card'
  /** Mostra abaixo do botão o aviso de configuração quando o número estiver ausente. */
  mostrarAviso?: boolean
  /** Cor do fundo onde o botão está, para o aviso manter contraste. */
  fundo?: 'claro' | 'escuro'
}

/** Tamanhos próprios do site sobre o Button do shadcn (h-auto anula a altura fixa padrão). */
const TAMANHOS = {
  normal: 'h-auto min-h-14 w-full whitespace-normal px-5 py-3 text-base text-balance sm:w-auto sm:px-7 sm:text-lg',
  compacto: 'h-auto min-h-11 px-4 text-sm',
  card: 'h-auto min-h-12 w-full px-3 text-[0.9375rem] xl:gap-2 xl:px-2 xl:text-sm',
} as const

/**
 * Transição curta: sobe 1px no hover (só em dispositivos com mouse, regra do Tailwind v4)
 * e encolhe ao toque/clique. Com movimento reduzido, fica só a troca de cor.
 */
const MOVIMENTO =
  'transition-[translate,scale,background-color,box-shadow] duration-150 ease-out motion-safe:hover:-translate-y-px active:not-aria-[haspopup]:translate-y-0 motion-safe:active:scale-[0.97] active:duration-75 motion-reduce:transition-colors'

/** Foco de teclado em amarelo pleno (o padrão do shadcn usa o anel a 50%). */
const FOCO = 'focus-visible:ring-3 focus-visible:ring-ring'

const LARGURA_CONTEINER = {
  normal: 'flex w-full sm:inline-flex sm:w-auto',
  compacto: 'inline-flex',
  card: 'flex w-full',
} as const

export function BotaoWhatsApp({
  texto = 'Pedir orçamento pelo WhatsApp',
  capacidade,
  tamanho = 'normal',
  mostrarAviso = false,
  fundo = 'claro',
}: BotaoWhatsAppProps) {
  const avisoId = useId()
  const href = linkWhatsApp({ capacidade })
  const base = cn('gap-2.5 font-bold [&_svg:not([class*=size-])]:size-5', TAMANHOS[tamanho], FOCO)

  if (href) {
    return (
      <Button
        asChild
        className={cn(base, MOVIMENTO, 'hover:bg-verde-escuro')}
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          <IconeWhatsApp className="" data-icon="inline-start" />
          {texto}
        </a>
      </Button>
    )
  }

  const corAviso = fundo === 'escuro' ? 'text-white/70' : 'text-muted-foreground'

  return (
    <div className={cn('flex-col items-start gap-2', LARGURA_CONTEINER[tamanho])}>
      <Button
        disabled
        aria-describedby={mostrarAviso ? avisoId : undefined}
        title="WhatsApp ainda não configurado"
        // Cor sólida (sem opacidade) para não misturar com fundos coloridos, como o rodapé vermelho.
        className={cn(base, 'bg-verde-escuro text-white/75 saturate-50 disabled:opacity-100')}
      >
        <IconeWhatsApp className="" data-icon="inline-start" />
        {texto}
      </Button>
      {mostrarAviso && (
        <p id={avisoId} className={cn('text-xs', corAviso)}>
          Botão desativado até configurar <code className="font-mono">whatsapp</code> em{' '}
          <code className="font-mono">src/config/empresa.ts</code>.
        </p>
      )}
    </div>
  )
}
