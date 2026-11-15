import { useEffect, useState } from 'react'
import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { IconeMenu } from '../components/Icones'
import { Logo } from '../components/Logo'
import { temGaleria } from '../config/contato'
import { empresa } from '../config/empresa'

/** "Galeria" só entra no menu quando a seção existe (há fotos cadastradas). */
const LINKS = [
  { href: '#inicio', rotulo: 'Início' },
  { href: '#servicos', rotulo: 'Serviços' },
  { href: '#cacambas', rotulo: 'Caçambas' },
  ...(temGaleria ? [{ href: '#galeria', rotulo: 'Galeria' }] : []),
  { href: '#localizacao', rotulo: 'Localização' },
  { href: '#contato', rotulo: 'Contato' },
]

export function Topo() {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    if (!aberto) return
    const fecharComEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(false)
    }
    window.addEventListener('keydown', fecharComEsc)
    return () => window.removeEventListener('keydown', fecharComEsc)
  }, [aberto])

  const fechar = () => setAberto(false)

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-marinho/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* min-h-11: área de toque de 44px em volta do logo. */}
        <a href="#inicio" onClick={fechar} className="inline-flex min-h-11 shrink-0 items-center rounded-sm">

          {empresa.logo ? (
            <img src={empresa.logo} alt="Rogério Caçambas" width={288} height={96} className="h-6 w-auto sm:h-8" />
          ) : (
            <Logo />
          )}
        </a>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-[0.9375rem] font-medium">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-flex min-h-11 items-center px-1 text-white/75 transition-colors hover:text-white">
                  {link.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <BotaoWhatsApp texto="Orçamento" tamanho="compacto" />
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-white hover:bg-white/10 lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto((v) => !v)}
        >
          <IconeMenu aberto={aberto} className="size-6" />
        </button>
      </div>

      <nav id="menu-movel" aria-label="Principal" hidden={!aberto} className="border-t border-white/10 bg-marinho lg:hidden">
        <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={fechar}
                className="flex min-h-12 items-center border-b border-white/10 text-lg font-medium text-white/90 hover:text-amarelo"
              >
                {link.rotulo}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
