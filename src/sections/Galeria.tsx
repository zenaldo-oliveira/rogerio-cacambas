import { useState } from "react";
import { XIcon, ZoomInIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { fotosGaleria, urlPublica } from "../config/contato";
import { empresa, type FotoGaleria } from "../config/empresa";

function FundoGaleria() {
  const { src, srcCelular } = empresa.fotos.fundoGaleria;

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <img
        src={src}
        srcSet={`${srcCelular} 900w, ${src} 1774w`}
        sizes="100vw"
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-[50%_40%]"
      />
      <div className="absolute inset-0 bg-linear-to-b from-marinho via-marinho/85 to-marinho" />
    </div>
  );
}

interface ImagemAmpliavelProps {
  grade: string;
  ampliada: string;
  alt: string;
  titulo: string;
  nota?: string;
  aoFalhar: () => void;
}

function ImagemAmpliavel({
  grade,
  ampliada,
  alt,
  titulo,
  nota,
  aoFalhar,
}: ImagemAmpliavelProps) {
  const [pronta, setPronta] = useState(false);
  const [originalPronto, setOriginalPronto] = useState(false);

  return (
    <Dialog
      onOpenChange={(aberto) => {
        if (!aberto) setOriginalPronto(false);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={!pronta}
          aria-label={`Ampliar imagem: ${titulo}`}
          className="group relative block h-full w-full cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:cursor-default"
        >
          <img
            src={urlPublica(grade)}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setPronta(true)}
            onError={aoFalhar}
            className="h-full w-full object-contain motion-safe:transition-[scale] motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.03]"
          />
          {pronta && (
            <span className="absolute right-2 bottom-2 inline-flex size-9 items-center justify-center rounded-full bg-marinho/75 text-white">
              <ZoomInIcon aria-hidden="true" className="size-5" />
            </span>
          )}
        </button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        {...(nota ? {} : { "aria-describedby": undefined })}
        className="w-[min(92vw,72rem)] max-w-none gap-3 p-3 sm:max-w-none sm:p-4"
      >
        <DialogHeader className="flex-row items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5 text-left">
            <DialogTitle className="text-base font-semibold">
              {titulo}
            </DialogTitle>
            {nota && (
              <DialogDescription className="text-xs">{nota}</DialogDescription>
            )}
          </div>

          <DialogClose asChild>
            <Button
              variant="secondary"
              className="h-11 shrink-0 gap-1.5 px-4 text-sm font-semibold focus-visible:ring-3 focus-visible:ring-ring"
            >
              <XIcon aria-hidden="true" data-icon="inline-start" />
              Fechar
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="relative">
          <img
            src={urlPublica(grade)}
            alt={alt}
            className="max-h-[78vh] w-full rounded-md object-contain"
          />
          {ampliada !== grade && (
            <img
              src={urlPublica(ampliada)}
              alt=""
              aria-hidden="true"
              decoding="async"
              onLoad={() => setOriginalPronto(true)}
              className={cn(
                "absolute inset-0 h-full w-full rounded-md object-contain motion-safe:transition-opacity motion-safe:duration-200",
                originalPronto ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ItemMaterial({ foto }: { foto: FotoGaleria }) {
  const [falhou, setFalhou] = useState(false);
  if (falhou) return null;

  return (
    <li data-revelar="aparecer">
      <figure>
        <div className="aspect-[4/3] overflow-hidden rounded-lg bg-card ring-1 ring-white/10">
          <ImagemAmpliavel
            grade={foto.miniatura ?? foto.src}
            ampliada={foto.src}
            alt={foto.alt}
            titulo={foto.material}
            nota={foto.ilustrativa ? "Imagem ilustrativa" : undefined}
            aoFalhar={() => setFalhou(true)}
          />
        </div>
        <figcaption className="mt-3 flex items-baseline justify-between gap-3">
          <span className="text-lg font-bold">{foto.material}</span>
          {foto.ilustrativa && (
            <span className="text-xs text-muted-foreground">
              Imagem ilustrativa
            </span>
          )}
        </figcaption>
      </figure>
    </li>
  );
}

export function Galeria() {
  if (fotosGaleria.length === 0) return null;

  return (
    <section
      id="galeria"
      aria-labelledby="titulo-galeria"
      className="relative isolate overflow-hidden border-t border-border"
    >
      <FundoGaleria />

      <div className="secao mx-auto max-w-6xl px-4 sm:px-6">
        <p className="rotulo">Nosso trabalho</p>
        <h2
          id="titulo-galeria"
          className="titulo mt-3 text-4xl text-white uppercase sm:text-5xl"
        >
          Galeria
        </h2>

        <h3 className="mt-6 text-xl font-bold">Tipos de material</h3>
        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
          {fotosGaleria.map((foto) => (
            <ItemMaterial key={foto.src} foto={foto} />
          ))}
        </ul>
      </div>
    </section>
  );
}
