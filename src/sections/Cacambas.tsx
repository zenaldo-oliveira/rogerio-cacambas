import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from 'react'
import { CreditCardIcon, ImageOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Foto } from '../components/Foto'
import { IconePix } from '../components/Icones'
import { formatarPreco, urlPublica } from '../config/contato'
import { empresa, type Cacamba } from '../config/empresa'

/** Inclinação máxima da ilustração, em graus (discreta). */
const INCLINACAO_MAX = { x: 3, y: 4 }

/** Fotos que falharam ao carregar: evita tentar de novo (e piscar) a cada troca de tamanho. */
const SEM_FOTO = new Set<string>()

/** Camadas geradas por `npm run ilustracoes` ao lado da ilustração completa. */
function camadasIlustracao(ilustracao: string) {
  return {
    recorte: ilustracao.replace(/\.svg$/, '-recorte.svg'),
    sombra: ilustracao.replace(/\.svg$/, '-sombra.svg'),
  }
}

/** Inclinação só no desktop com mouse e sem preferência por movimento reduzido. */
function podeInclinar(): boolean {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function definirInclinacao(camada: HTMLElement | null, x: number, y: number) {
  camada?.style.setProperty('--incl-x', `${x}deg`)
  camada?.style.setProperty('--incl-y', `${y}deg`)
}

/** Carrega antes a imagem de cada tamanho (foto ou, sem foto, a ilustração), para a troca ser imediata. */
function usePreCarregarImagens(cacambas: Cacamba[]) {
  useEffect(() => {
    for (const cacamba of cacambas) {
      if (!cacamba.foto) {
        const { recorte, sombra } = camadasIlustracao(cacamba.ilustracao)
        for (const src of [recorte, sombra]) new Image().src = src
      } else if (!SEM_FOTO.has(cacamba.foto)) {
        const teste = new Image()
        teste.onerror = () => SEM_FOTO.add(cacamba.foto)
        teste.src = urlPublica(cacamba.foto)
      }
    }
  }, [cacambas])
}

/** Aviso discreto no lugar da foto que não carregou (sem ícone de imagem quebrada). */
function FotoIndisponivel() {
  return (
    <div role="img" aria-label="Foto indisponível" className="flex h-full w-full flex-col items-center justify-center gap-2 bg-marinho-claro text-sm text-white/60">
      <ImageOffIcon aria-hidden="true" className="size-6" />
      Foto indisponível
    </div>
  )
}

interface ImagemModeloProps {
  cacamba: Cacamba
  refInclinacao: RefObject<HTMLDivElement | null>
}

/**
 * Foto do modelo (`foto` em empresa.ts). Se ela falhar ao carregar, mostra "Foto indisponível".
 * Sem `foto` cadastrada, mostra a ilustração em camadas:
 *   fundo (fixo) → inclinação (mouse) → sombra (reage) + flutuação (só a caçamba).
 */
function ImagemModelo({ cacamba, refInclinacao }: ImagemModeloProps) {
  const [falhou, setFalhou] = useState(SEM_FOTO.has(cacamba.foto))

  if (cacamba.foto && falhou) return <FotoIndisponivel />

  if (cacamba.foto) {
    return (
      <figure className="relative h-full w-full overflow-hidden bg-[#e6e8eb]">
        <img
          src={urlPublica(cacamba.foto)}
          alt={`Caçamba de ${cacamba.capacidade}`}
          width={800}
          height={600}
          decoding="async"
          onError={() => {
            SEM_FOTO.add(cacamba.foto)
            setFalhou(true)
          }}
          // zoom-entrada: zoom leve quando o painel entra na tela (só a imagem).
          className="zoom-entrada h-full w-full object-cover"
        />
      </figure>
    )
  }

  const camadas = camadasIlustracao(cacamba.ilustracao)

  return (
    <figure className="fundo-ilustracao relative h-full w-full overflow-hidden">
      <div ref={refInclinacao} className="camada-inclinacao absolute inset-0">
        <img src={camadas.sombra} alt="" aria-hidden="true" width={800} height={600} className="camada-sombra absolute inset-0 h-full w-full" />
        <div className="camada-flutuacao absolute inset-0">
          <img
            src={camadas.recorte}
            alt={`Ilustração de caçamba de ${cacamba.capacidade}`}
            width={800}
            height={600}
            decoding="async"
            className="h-full w-full"
          />
        </div>
      </div>
      <figcaption className="absolute bottom-2 left-2 rounded-sm bg-marinho/80 px-2 py-1 text-[0.6875rem] font-semibold tracking-wide text-white">
        Imagem ilustrativa
      </figcaption>
    </figure>
  )
}

/** Navegação de abas por teclado: setas, Home e End (ativação automática). */
function proximoIndice(tecla: string, atual: number, total: number): number | null {
  switch (tecla) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (atual + 1) % total
    case 'ArrowLeft':
    case 'ArrowUp':
      return (atual - 1 + total) % total
    case 'Home':
      return 0
    case 'End':
      return total - 1
    default:
      return null
  }
}

/** Quadrinho de forma de pagamento (Pix, bandeira ou cartão genérico). */
const SELO_PAGAMENTO = 'inline-flex h-7 items-center gap-1.5 rounded-sm border border-white/15 bg-white/5 px-2 text-xs font-semibold text-white/85'

/** "Aceitamos Pix e cartões" + Pix e bandeiras; sem bandeiras confirmadas, um ícone genérico de cartão. */
function Pagamentos() {
  const { texto, bandeiras } = empresa.pagamentos

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
      <p className="text-sm text-muted-foreground">{texto}</p>
      <ul className="flex flex-wrap gap-1.5" aria-label="Formas de pagamento">
        <li className={SELO_PAGAMENTO}>
          <IconePix className="size-3.5 shrink-0 text-[#32bcad]" />
          Pix
        </li>
        {bandeiras.length > 0 ? (
          bandeiras.map((bandeira) => (
            <li key={bandeira} className={SELO_PAGAMENTO}>
              {bandeira}
            </li>
          ))
        ) : (
          <li className={SELO_PAGAMENTO}>
            <CreditCardIcon aria-hidden="true" className="size-3.5 shrink-0" />
            Cartão
          </li>
        )}
      </ul>
    </div>
  )
}

/** Seletor de tamanho (abas) + painel do tamanho ativo. */
function SeletorCacambas({ cacambas }: { cacambas: Cacamba[] }) {
  const [ativo, setAtivo] = useState(0)
  const abas = useRef<(HTMLButtonElement | null)[]>([])
  const refInclinacao = useRef<HTMLDivElement>(null)
  const cacamba = cacambas[ativo]
  usePreCarregarImagens(cacambas)

  const aoTeclar = (e: KeyboardEvent<HTMLDivElement>) => {
    const novo = proximoIndice(e.key, ativo, cacambas.length)
    if (novo === null) return
    e.preventDefault()
    setAtivo(novo)
    abas.current[novo]?.focus()
  }

  const inclinar = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !refInclinacao.current || !podeInclinar()) return
    const area = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - area.left) / area.width - 0.5
    const py = (e.clientY - area.top) / area.height - 0.5
    definirInclinacao(refInclinacao.current, -py * 2 * INCLINACAO_MAX.x, px * 2 * INCLINACAO_MAX.y)
  }

  return (
    <Card data-revelar="subir" className="gap-0 overflow-hidden rounded-lg py-0">
      {/* Abas: tamanho ativo em amarelo. */}
      <div role="tablist" aria-label="Tamanho da caçamba" onKeyDown={aoTeclar} className="grid grid-cols-4 gap-2 border-b border-border p-3 sm:p-4">
        {cacambas.map((c, i) => {
          const selecionado = i === ativo
          return (
            <Button
              key={c.capacidade}
              ref={(el) => {
                abas.current[i] = el
              }}
              role="tab"
              id={`aba-${i}`}
              aria-selected={selecionado}
              aria-controls="painel-cacamba"
              tabIndex={selecionado ? 0 : -1}
              variant="outline"
              onClick={() => setAtivo(i)}
              className={cn(
                'h-12 text-lg font-extrabold tabular-nums transition-[background-color,color,border-color,scale] duration-150 active:not-aria-[haspopup]:translate-y-0 motion-safe:active:scale-[0.96] focus-visible:ring-3 focus-visible:ring-ring sm:h-14 sm:text-xl',
                selecionado
                  ? 'border-accent bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:border-accent dark:bg-accent dark:hover:bg-accent'
                  : 'bg-transparent text-foreground hover:border-accent/60',
              )}
            >
              {c.capacidade}
            </Button>
          )
        })}
      </div>

      <div role="tabpanel" id="painel-cacamba" aria-labelledby={`aba-${ativo}`} className="grid md:grid-cols-[6fr_5fr]">
        {/* Só a imagem anima na troca (key → remonta com .troca-imagem). */}
        <div className="relative aspect-[4/3] overflow-hidden" onPointerMove={inclinar} onPointerLeave={() => definirInclinacao(refInclinacao.current, 0, 0)}>
          <div key={cacamba.capacidade} className="troca-imagem absolute inset-0">
            <ImagemModelo cacamba={cacamba} refInclinacao={refInclinacao} />
          </div>
        </div>

        {/* Informações do tamanho ativo; no celular ficam abaixo da foto. */}
        <div className="flex flex-col gap-5 p-5 sm:p-6 md:justify-center lg:p-8">
          <div>
            <h3 className="titulo text-3xl sm:text-4xl">
              Caçamba de <span className="text-accent tabular-nums">{cacamba.capacidade}</span>
            </h3>
            <p className="mt-2 text-xl font-extrabold tracking-tight tabular-nums">
              {cacamba.precoConfirmado ? formatarPreco(cacamba.preco) : 'Consulte o valor'}
            </p>
          </div>
          <p className="min-h-[3.25rem] text-base leading-relaxed text-muted-foreground">{cacamba.descricao}</p>
          {cacamba.materiais.length > 0 && (
            <ul className="flex flex-wrap gap-1.5" aria-label="Materiais aceitos">
              {cacamba.materiais.map((material) => (
                <li key={material} className="rounded-sm bg-white/10 px-2 py-1 text-xs">
                  {material}
                </li>
              ))}
            </ul>
          )}
          <div>
            <BotaoWhatsApp texto={`Pedir orçamento de ${cacamba.capacidade}`} capacidade={cacamba.capacidade} tamanho="card" />
            <Pagamentos />
          </div>
        </div>
      </div>
    </Card>
  )
}

export function Cacambas() {
  return (
    <section id="cacambas" aria-labelledby="titulo-cacambas" className="border-t border-border">
      <div className="secao mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
          <div>
            <p className="rotulo">Tamanhos e valores</p>
            <h2 id="titulo-cacambas" className="titulo mt-3 text-4xl uppercase sm:text-5xl">
              Nossas Caçambas
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
              Escolha pelo volume de entulho. Na dúvida, chame no WhatsApp.
            </p>
          </div>
          {/* 4:3 = proporção da foto da caçamba 42, para mostrá-la inteira sem cortes. */}
          <div data-revelar="zoom" className="aspect-[4/3] overflow-hidden rounded-lg ring-1 ring-white/10">
            <Foto foto={empresa.fotos.destaqueCacambas} chave="fotos.destaqueCacambas" proporcao="4:3" />
          </div>
        </div>

        <div className="mt-14">
          <SeletorCacambas cacambas={empresa.cacambas} />
        </div>

      </div>
    </section>
  )
}
