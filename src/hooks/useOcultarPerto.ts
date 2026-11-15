import { useEffect, useState } from 'react'

/**
 * true enquanto algum dos elementos (por seletor) estiver visível na tela,
 * apenas quando a mídia `consulta` for atendida (ex.: só no celular).
 */
export function useOcultarPerto(seletores: string[], consulta: string): boolean {
  const [ocultar, setOcultar] = useState(false)
  const chave = seletores.join(',')

  useEffect(() => {
    const midia = window.matchMedia(consulta)
    const alvos = chave
      .split(',')
      .map((s) => document.querySelector(s))
      .filter((el): el is Element => el !== null)
    const visiveis = new Set<Element>()

    const observador = new IntersectionObserver((entradas) => {
      for (const e of entradas) {
        if (e.isIntersecting) visiveis.add(e.target)
        else visiveis.delete(e.target)
      }
      setOcultar(midia.matches && visiveis.size > 0)
    })
    alvos.forEach((el) => observador.observe(el))

    const aoMudarMidia = () => setOcultar(midia.matches && visiveis.size > 0)
    midia.addEventListener('change', aoMudarMidia)

    return () => {
      observador.disconnect()
      midia.removeEventListener('change', aoMudarMidia)
    }
  }, [chave, consulta])

  return ocultar
}
