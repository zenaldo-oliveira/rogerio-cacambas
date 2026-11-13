/**
 * Nome da empresa em texto (usado no rodapé e como reserva do cabeçalho
 * quando `empresa.logo` estiver vazio).
 */
export function Logo({ className = '', sobreVermelho = false }: { className?: string; sobreVermelho?: boolean }) {
  return (
    <span className={`titulo flex items-center gap-2 text-xl text-white ${className}`}>
      <span aria-hidden="true" className="flex h-5 w-6 skew-x-[-14deg] overflow-hidden">
        <span className="w-1/2 bg-amarelo" />
        <span className={`w-1/2 ${sobreVermelho ? 'bg-white' : 'bg-vermelho'}`} />
      </span>
      <span>
        Rogério <span className="text-amarelo">Caçambas</span>
      </span>
    </span>
  )
}
