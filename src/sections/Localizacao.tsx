import { MapPinIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { IconeInstagram } from '../components/Icones'
import { linkInstagram, linkMapa, linkMapaIncorporado } from '../config/contato'
import { empresa } from '../config/empresa'
import { useFocoTecladoIframe } from '../hooks/useFocoTecladoIframe'

/** Mesmo movimento e foco dos demais botões do site; com movimento reduzido, só a cor muda. */
const BOTAO =
  'h-auto min-h-12 w-full gap-2.5 px-5 text-base font-bold sm:w-auto [&_svg:not([class*=size-])]:size-5 transition-[translate,scale,background-color] duration-150 ease-out motion-safe:hover:-translate-y-px active:not-aria-[haspopup]:translate-y-0 motion-safe:active:scale-[0.97] motion-reduce:transition-colors focus-visible:ring-3 focus-visible:ring-ring'

/** Seção com o mapa da empresa (gerado das coordenadas em empresa.ts) e os botões de rota e Instagram. */
export function Localizacao() {
  const { ref: refMapa, focado: mapaFocado } = useFocoTecladoIframe()
  const mapa = linkMapaIncorporado()
  if (!mapa) return null

  const rota = linkMapa()
  const instagram = linkInstagram()
  const { endereco } = empresa.localizacao

  return (
    <section id="localizacao" aria-labelledby="titulo-localizacao" className="border-t border-border">
      <div className="secao mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-16">
          <div>
            <p className="rotulo">Onde estamos</p>
            <h2 id="titulo-localizacao" className="titulo mt-3 text-4xl uppercase sm:text-5xl">
              Localização
            </h2>
            {endereco && (
              <p className="mt-5 flex max-w-sm items-start gap-2 text-lg leading-relaxed">
                <MapPinIcon aria-hidden="true" className="mt-1 size-5 shrink-0 text-amarelo" />
                {endereco}
              </p>
            )}

            {(rota || instagram) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {rota && (
                  <Button asChild className={cn(BOTAO, 'hover:bg-verde-escuro')}>
                    <a href={rota} target="_blank" rel="noopener noreferrer">
                      <MapPinIcon data-icon="inline-start" />
                      Como chegar
                    </a>
                  </Button>
                )}
                {instagram && (
                  <Button asChild variant="secondary" className={BOTAO}>
                    <a href={instagram} target="_blank" rel="noopener noreferrer">
                      <IconeInstagram className="" data-icon="inline-start" />
                      Instagram
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Foco pelo teclado no mapa: anel amarelo na moldura (o iframe não mostra contorno próprio). */}
          <div
            className={cn(
              'overflow-hidden rounded-lg border border-border bg-marinho-claro',
              mapaFocado && 'ring-3 ring-ring ring-offset-2 ring-offset-background',
            )}
          >
            <iframe
              ref={refMapa}
              src={mapa}
              title={`Mapa com a localização da ${empresa.nome}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block aspect-[4/3] w-full border-0 sm:aspect-video"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
