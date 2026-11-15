import { useEffect, useRef, useState } from 'react'

/**
 * Indica quando um <iframe> de outro domínio recebeu foco pelo teclado.
 * O navegador não aplica :focus/:focus-within ao iframe nesse caso, então o anel
 * de foco precisa vir de estado: Tab seguido da janela perdendo o foco para o iframe.
 */
export function useFocoTecladoIframe() {
  const ref = useRef<HTMLIFrameElement>(null)
  const [focado, setFocado] = useState(false)

  useEffect(() => {
    let viaTeclado = false
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Tab') viaTeclado = true
    }
    const aoApontar = () => {
      viaTeclado = false
    }
    // activeElement só aponta para o iframe depois do blur: confere no próximo ciclo.
    const aoSairDaJanela = () => {
      window.setTimeout(() => setFocado(viaTeclado && document.activeElement === ref.current), 0)
    }
    const aoVoltar = () => setFocado(false)

    window.addEventListener('keydown', aoTeclar, true)
    window.addEventListener('pointerdown', aoApontar, true)
    window.addEventListener('blur', aoSairDaJanela)
    window.addEventListener('focus', aoVoltar)
    document.addEventListener('focusin', aoVoltar)
    return () => {
      window.removeEventListener('keydown', aoTeclar, true)
      window.removeEventListener('pointerdown', aoApontar, true)
      window.removeEventListener('blur', aoSairDaJanela)
      window.removeEventListener('focus', aoVoltar)
      document.removeEventListener('focusin', aoVoltar)
    }
  }, [])

  return { ref, focado }
}
