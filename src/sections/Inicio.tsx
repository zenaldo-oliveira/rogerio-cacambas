import { BotaoWhatsApp } from '../components/BotaoWhatsApp'
import { Foto } from '../components/Foto'
import { empresa } from '../config/empresa'
import { useDeslocamentoPonteiro } from '../hooks/useDeslocamentoPonteiro'

/** Deslocamento máximo da foto dos caminhões ao mover o mouse, por eixo. */
const DESLOCAMENTO_MAX_PX = 8

export function Inicio() {
  const { principal } = empresa.regiao
  const { camada: camadaFoto, onPointerMove, onPointerLeave } = useDeslocamentoPonteiro<HTMLDivElement>(DESLOCAMENTO_MAX_PX)

  return (
    <section
      id="inicio"
      aria-labelledby="titulo-inicio"
      className="fundo-inicio relative isolate overflow-hidden"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {/* Rampa diagonal na base: faixa vermelha + filete amarelo, sob os caminhões.
          .entrada-faixa: desliza da direita até a posição final na primeira visita. */}
      <div
        aria-hidden="true"
        className="entrada-faixa absolute right-0 bottom-0 -z-10 h-28 w-full sm:h-36 lg:h-48"
      >
        <div className="absolute inset-0 bg-amarelo [clip-path:polygon(0_74%,100%_10%,100%_17%,0_81%)]" />
        <div className="absolute inset-0 bg-vermelho [clip-path:polygon(0_92%,100%_28%,100%_100%,0_100%)]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-12 pb-24 sm:px-6 sm:pb-32 lg:grid-cols-[5fr_6fr] lg:gap-6 lg:pt-24 lg:pb-36">
        <div className="relative z-10">
          <h1 id="titulo-inicio" className="titulo text-[3.25rem] uppercase sm:text-7xl lg:text-[4.25rem] xl:text-[5.25rem]">
            Aluguel de <span className="block text-amarelo">Caçambas</span>
          </h1>
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-muted-foreground">
            Entrega e retirada de entulho para obras e reformas
            {principal ? (
              <>
                {' '}
                em <strong className="font-semibold text-foreground">{principal}</strong>.
              </>
            ) : (
              '.'
            )}
          </p>
          <div className="mt-10">
            <BotaoWhatsApp mostrarAviso fundo="escuro" />
          </div>
        </div>

        {/* Foto sem moldura, integrada ao fundo: bordas esmaecidas pela máscara (.foto-integrada),
            que só alcança o espaço vazio da foto — os caminhões (3–96% da largura, 21–79% da altura)
            ficam inteiros. Abaixo do botão no celular (sangrando até as bordas da tela);
            à direita do título no desktop. .entrada-foto: revelada da direita para a esquerda. */}
        <div className="entrada-foto foto-integrada -mx-4 aspect-[2/1] overflow-hidden sm:-mx-6 lg:mx-0 lg:w-[112%]">
          {/* Só esta camada se move com o mouse (.foto-paralaxe); título e botão ficam fixos. */}
          <div ref={camadaFoto} className="foto-paralaxe h-full w-full">
            <Foto foto={empresa.fotos.principal} chave="fotos.principal" proporcao="2:1" prioridade />
          </div>
        </div>
      </div>
    </section>
  )
}
