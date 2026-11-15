import { useCallback, useEffect, useRef, type PointerEvent } from 'react'
import { podeSeguirPonteiro } from '@/lib/movimento'

/**
 * Desloca uma camada (via variáveis CSS, sem re-render) conforme o mouse se move na área.
 * Para não revelar as bordas, a camada ganha escala só o suficiente para cobrir o deslocamento
 * e volta ao centro, em escala 1, quando o ponteiro sai. Toque e movimento reduzido: nada muda.
 */
export function useDeslocamentoPonteiro<T extends HTMLElement>(maxPx: number) {
  const camada = useRef<T>(null)
  const quadro = useRef(0)

  const aplicar = useCallback((x: number, y: number, escala: number) => {
    cancelAnimationFrame(quadro.current)
    quadro.current = requestAnimationFrame(() => {
      const el = camada.current
      if (!el) return
      el.style.setProperty('--desloc-x', `${x.toFixed(2)}px`)
      el.style.setProperty('--desloc-y', `${y.toFixed(2)}px`)
      el.style.setProperty('--desloc-escala', escala.toFixed(4))
    })
  }, [])

  useEffect(() => () => cancelAnimationFrame(quadro.current), [])

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const el = camada.current
      if (e.pointerType !== 'mouse' || !el || !podeSeguirPonteiro()) return
      const area = e.currentTarget.getBoundingClientRect()
      const px = Math.min(Math.max((e.clientX - area.left) / area.width - 0.5, -0.5), 0.5)
      const py = Math.min(Math.max((e.clientY - area.top) / area.height - 0.5, -0.5), 0.5)
      const moldura = el.parentElement?.getBoundingClientRect()
      const menorLado = moldura ? Math.min(moldura.width, moldura.height) : 0
      // Cobre maxPx de cada lado (+1 px de folga contra arredondamento).
      const escala = menorLado > 0 ? 1 + (2 * (maxPx + 1)) / menorLado : 1
      aplicar(px * 2 * maxPx, py * 2 * maxPx, escala)
    },
    [aplicar, maxPx],
  )

  const onPointerLeave = useCallback(() => aplicar(0, 0, 1), [aplicar])

  return { camada, onPointerMove, onPointerLeave }
}
