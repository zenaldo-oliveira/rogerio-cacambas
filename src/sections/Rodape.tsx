import type { ReactNode } from 'react'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Logo } from '../components/Logo'
import { Pendente } from '../components/Pendente'
import { formatarTelefone, linkInstagram, linkWhatsApp } from '../config/contato'
import { empresa } from '../config/empresa'

function Item({ rotulo, children, largo = false }: { rotulo: string; children: ReactNode; largo?: boolean }) {
  return (
    <div className={largo ? 'sm:col-span-2' : undefined}>
      <dt className="text-xs font-bold tracking-widest text-white uppercase">{rotulo}</dt>
      <dd className="mt-2 text-lg">{children}</dd>
    </div>
  )
}

/** Marca d'água: onda larga em vinho, mais alta à esquerda, atrás do conteúdo. */
function Onda() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-52 w-full sm:h-72 lg:h-[26rem]"
    >
      <path
        className="fill-vinho"
        fillOpacity="0.32"
        d="M0 40C260 30 470 120 740 210c250 84 480 106 700 70V400H0Z"
      />
    </svg>
  )
}

/** inline-flex + min-h-11: área de toque de 44px sem mudar o visual do link. */
const LINK =
  'inline-flex min-h-11 items-center font-semibold underline decoration-amarelo decoration-2 underline-offset-4 hover:text-amarelo'

export function Rodape() {
  const whatsapp = linkWhatsApp()
  const telefone = formatarTelefone()
  const instagram = linkInstagram()
  const usuarioInstagram = empresa.instagram.trim().replace(/^@/, '')
  const { principal, bairros } = empresa.regiao

  return (
    <footer id="contato" aria-labelledby="titulo-contato" className="relative isolate overflow-hidden bg-vermelho text-white">
      <Onda />
      {/* pb extra: área livre para o botão flutuante parar sem cobrir os contatos. */}
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-28 sm:px-6 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <h2 id="titulo-contato" className="titulo text-4xl uppercase sm:text-5xl">
              Peça seu orçamento
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-white">
              Mande o bairro, o material e a data. A mensagem já vai pronta.
            </p>
            <div className="mt-8">
              <BotaoWhatsApp mostrarAviso fundo="escuro" />
            </div>
          </div>

          <dl className="grid gap-8 sm:grid-cols-2">
            <Item rotulo="WhatsApp">
              {whatsapp && telefone ? (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={LINK}>
                  {telefone}
                </a>
              ) : (
                <Pendente campo="número (confirmar o da arte)" chave="whatsapp" />
              )}
            </Item>
            <Item rotulo="Instagram">
              {instagram ? (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className={LINK}>
                  @{usuarioInstagram}
                </a>
              ) : (
                <Pendente campo="perfil (confirmar o da arte)" chave="instagram" />
              )}
            </Item>
            <Item rotulo="Horário">
              {empresa.horario ||
                (whatsapp ? (
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={LINK}>
                    Consulte os horários pelo WhatsApp
                  </a>
                ) : (
                  'Consulte os horários pelo WhatsApp'
                ))}
            </Item>
            <Item rotulo="Região atendida">
              {principal && <span className="block">{principal}</span>}
              {bairros.length > 0 && <span className="mt-1 block text-base text-white">{bairros.join(' · ')}</span>}
              <span className="mt-1 block text-base text-white">Consulte a disponibilidade de entrega no seu bairro.</span>
            </Item>
            {empresa.telefoneFixo && <Item rotulo="Telefone">{empresa.telefoneFixo}</Item>}
          </dl>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/25 pt-6 text-sm text-white sm:flex-row sm:items-center sm:justify-between">
          <Logo className="text-lg" sobreVermelho />
          <p>
            © {new Date().getFullYear()} {empresa.nome}
          </p>
        </div>
      </div>
    </footer>
  )
}
