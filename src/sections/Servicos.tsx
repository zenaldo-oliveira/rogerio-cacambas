import { IconeCacamba, IconeCaminhao, IconeTroca } from '../components/Icones'

const SERVICOS = [
  {
    Icone: IconeCacamba,
    titulo: 'Locação de caçamba',
    texto: 'Entregamos a caçamba no endereço da obra ou reforma, pelo período combinado.',
  },
  {
    Icone: IconeCaminhao,
    titulo: 'Retirada de entulho',
    texto: 'Caçamba cheia? É só avisar. Retiramos e levamos o material embora.',
  },
  {
    Icone: IconeTroca,
    titulo: 'Troca de caçamba',
    texto: 'Em obras maiores, levamos a cheia e deixamos outra vazia no lugar.',
  },
]

export function Servicos() {
  return (
    <section id="servicos" aria-labelledby="titulo-servicos" className="border-t border-border">
      <div className="secao mx-auto max-w-6xl px-4 sm:px-6">
        <p className="rotulo">O que fazemos</p>
        <h2 id="titulo-servicos" className="titulo mt-3 text-4xl uppercase sm:text-5xl">
          Serviços
        </h2>
        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {SERVICOS.map(({ Icone, titulo, texto }) => (
            <li key={titulo} className="border-t border-border pt-6">
              <Icone className="size-7 text-foreground/80" />
              <h3 className="mt-4 text-xl font-bold">{titulo}</h3>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
