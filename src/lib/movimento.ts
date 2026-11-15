/** Efeitos que seguem o mouse: só com mouse de verdade e sem preferência por movimento reduzido. */
export function podeSeguirPonteiro(): boolean {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
