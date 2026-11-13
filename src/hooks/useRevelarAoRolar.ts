import { useEffect } from 'react'

/** Fração do elemento que precisa estar na tela para disparar a entrada. */
const LIMIAR_VISIVEL = 0.15
/** Intervalo entre elementos que entram na tela ao mesmo tempo (ex.: 4 cards lado a lado). */
const ATRASO_SEQUENCIA_MS = 120

/**
 * Marca com `data-visivel` cada elemento `[data-revelar]` quando ele entra na tela,
 * uma única vez. Elementos que entram juntos recebem `--atraso-entrada` em sequência;
 * quem entra sozinho (ex.: cards empilhados no celular) anima na hora.
 *
 * O CSS só esconde/anima esses elementos quando o <html> tem a classe `animar-entrada`
 * (primeira abertura da aba, sem movimento reduzido — ver index.html).
 */
export function useRevelarAoRolar() {
  useEffect(() => {
    const alvos = document.querySelectorAll<HTMLElement>('[data-revelar]')
    const animar = document.documentElement.classList.contains('animar-entrada')

    if (!animar || !('IntersectionObserver' in window)) {
      alvos.forEach((el) => el.setAttribute('data-visivel', ''))
      return
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        const visiveis = entradas.filter((e) => e.isIntersecting)
        visiveis.forEach((entrada, ordem) => {
          const el = entrada.target as HTMLElement
          el.style.setProperty('--atraso-entrada', `${ordem * ATRASO_SEQUENCIA_MS}ms`)
          el.setAttribute('data-visivel', '')
          observador.unobserve(el)
        })
      },
      { threshold: LIMIAR_VISIVEL },
    )

    alvos.forEach((el) => observador.observe(el))
    return () => observador.disconnect()
  }, [])
}
