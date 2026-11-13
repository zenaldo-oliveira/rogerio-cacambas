/**
 * Dados comerciais da Rogério Caçambas.
 *
 * Tudo o que aparece no site e depende do cliente fica AQUI.
 * Campos vazios ('' ou []) fazem o site mostrar um espaço de prévia
 * indicando o que falta preencher.
 */

export type Foto = {
  /** Caminho a partir de /public. Ex.: '/fotos/caminhoes.jpg'. Vazio = prévia. */
  src: string
  /** Descrição da foto (acessibilidade e SEO). */
  alt: string
}

export type FotoGaleria = Foto & {
  /** Nome exibido abaixo da imagem. Ex.: 'Areia'. */
  material: string
  /**
   * Versão leve usada na grade (WebP com transparência). O `src` (original) abre na ampliação.
   * Pode conter espaços/acentos no `src`: o site codifica o caminho ao montar a URL.
   */
  miniatura?: string
  /** Mostra a legenda "Imagem ilustrativa". */
  ilustrativa?: boolean
}

export type Cacamba = {
  /** Capacidade como aparece no site. Ex.: '3 m³'. */
  capacidade: string
  /** Descrição curta para o card (uma linha, até ~45 caracteres). */
  descricao: string
  /** Preço em reais. Ex.: 400 → "R$ 400,00". */
  preco: number
  /**
   * Mude para true depois de conferir o preço com o Rogério.
   * Enquanto for false, o card mostra o valor com o selo "a confirmar".
   */
  precoConfirmado: boolean
  /** Materiais aceitos. Só aparece no card quando a lista não estiver vazia. */
  materiais: string[]
  /**
   * Foto real do modelo em public/fotos/. Basta colocar o arquivo com esse nome:
   * enquanto ele não existir, o card mostra a ilustração com a legenda "Imagem ilustrativa".
   */
  foto: string
  /** Ilustração usada enquanto falta a foto real (gerada por `npm run ilustracoes`). */
  ilustracao: string
}

export const empresa = {
  nome: 'Rogério Caçambas',

  /**
   * Logo do cabeçalho (fundo transparente). Vazio = nome em texto.
   * Versão otimizada (288×96, 19 KB) de "Logótipo industrial Rogério Caçambas.png".
   */
  logo: '/fotos/logo-rogerio-cacambas.webp',

  /**
   * WhatsApp comercial: 55 + DDD + número, só dígitos. Confirmado pelo cliente
   * (é o mesmo "65 99212-4161" pintado nas caçambas). Vazio ou inválido = botões desativados.
   */
  whatsapp: '5565992124161',

  /**
   * Usuário do Instagram sem @. Ex.: 'rogeriocacambas'.
   * ATENÇÃO: o perfil da arte de referência precisa ser confirmado com o cliente.
   */
  instagram: '',

  /** Telefone fixo opcional, como deve aparecer no site. Ex.: '(11) 4000-0000'. */
  telefoneFixo: '',

  /** Horário de atendimento. Ex.: 'Seg. a sáb., das 7h às 18h'. */
  horario: '',

  regiao: {
    /** Cidade(s) ou região principal. Ex.: 'Zona Leste de São Paulo'. */
    principal: '',
    /** Bairros ou cidades atendidos. Ex.: ['Tatuapé', 'Mooca', 'Penha']. */
    bairros: [] as string[],
  },

  localizacao: {
    /**
     * Link oficial do Google Maps (botão "Compartilhar" no Maps).
     * Ex.: 'https://maps.app.goo.gl/AbC123'. Enquanto estiver vazio ou inválido,
     * o bloco de localização e o botão "Traçar rota" não aparecem.
     */
    mapa: '',
    /** Endereço exibido junto ao botão. Ex.: 'Rua Exemplo, 123 – Bairro, Cidade'. */
    endereco: '',
  },

  /**
   * Modelos de caçamba. Capacidades e preços vêm da arte de referência:
   * CONFERIR COM O ROGÉRIO antes de publicar e marcar `precoConfirmado: true`.
   */
  cacambas: [
    {
      capacidade: '3 m³',
      descricao: 'Reformas pequenas: banheiro, cozinha, quintal.',
      preco: 400,
      precoConfirmado: false,
      materiais: [],
      foto: '/fotos/cacamba-3m3.jpg',
      ilustracao: '/ilustracoes/cacamba-3m3.svg',
    },
    {
      capacidade: '4 m³',
      descricao: 'Reforma de cômodos e pequenas demolições.',
      preco: 430,
      precoConfirmado: false,
      materiais: [],
      foto: '/fotos/cacamba-4m3.jpg',
      ilustracao: '/ilustracoes/cacamba-4m3.svg',
    },
    {
      capacidade: '5 m³',
      descricao: 'Reformas maiores e obras em andamento.',
      preco: 480,
      precoConfirmado: false,
      materiais: [],
      foto: '/fotos/cacamba-5m3.jpg',
      ilustracao: '/ilustracoes/cacamba-5m3.svg',
    },
    {
      capacidade: '6 m³',
      descricao: 'Construções e grande volume de entulho.',
      preco: 550,
      precoConfirmado: false,
      materiais: [],
      foto: '/fotos/cacamba-6m3.jpg',
      ilustracao: '/ilustracoes/cacamba-6m3.svg',
    },
  ] satisfies Cacamba[],

  /** Formas de pagamento: a linha só aparece no site com `confirmado: true`. */
  pagamentos: {
    texto: 'Aceitamos Pix, débito e crédito',
    confirmado: false,
  },

  /** Fotos reais. Coloque os arquivos em public/fotos/ e informe o caminho. */
  fotos: {
    /**
     * Foto da primeira tela: os caminhões. Proporção 2:1 (1774×887), igual à moldura em Inicio.tsx.
     * Versão leve da mesma foto: '/fotos/fundo-galeria-caminhao.webp' (177 KB em vez de 2,3 MB).
     */
    principal: {
      src: '/fotos/background-caminhao.png',
      alt: 'Caminhões vermelho e azul da Rogério Caçambas',
    } satisfies Foto,
    /**
     * Foto real da caçamba 42: destaque geral da seção Caçambas. O 42 é o número da
     * unidade, não a capacidade: não vincular a um card até a capacidade ser confirmada.
     * Versão otimizada (1200×900, 4:3) de "Contentor amarelo 42 em fundo cinzento.png".
     */
    destaqueCacambas: {
      src: '/fotos/cacamba-42.webp',
      alt: 'Caçamba amarela número 42 da Rogério Caçambas',
    } satisfies Foto,
    /**
     * Fundo da seção Galeria (decorativo, sem texto alternativo).
     * Versões otimizadas de "background-caminhao.png": a de 900 px é usada no celular.
     */
    fundoGaleria: {
      src: '/fotos/fundo-galeria-caminhao.webp',
      srcCelular: '/fotos/fundo-galeria-caminhao-900.webp',
    },
    /** Destaque da frota no topo da Galeria (foto real, sem transparência). */
    destaqueFrota: {
      src: '/fotos/cacamba-42.webp',
      alt: 'Caçamba amarela número 42 da Rogério Caçambas',
    } satisfies Foto,
    /**
     * Galeria de materiais (PNGs com fundo transparente, 4:3), nesta ordem.
     * `src` = arquivo original; `miniatura` = cópia leve gerada a partir dele.
     * Só as que têm `src` aparecem no site.
     */
    galeria: [
      {
        material: 'Entulho de obra',
        src: '/fotos/Contentor amarelo com entulho de obra.png',
        miniatura: '/fotos/galeria-entulho.webp',
        alt: 'Caçamba amarela cheia de entulho de obra',
        ilustrativa: true,
      },
      {
        material: 'Areia',
        src: '/fotos/Caçamba amarela com areia.png',
        miniatura: '/fotos/galeria-areia.webp',
        alt: 'Caçamba amarela cheia de areia',
        ilustrativa: true,
      },
      {
        material: 'Brita',
        src: '/fotos/Contentor amarelo cheio de brita (1).png',
        miniatura: '/fotos/galeria-brita.webp',
        alt: 'Caçamba amarela cheia de brita',
        ilustrativa: true,
      },
      {
        material: 'Pedras',
        src: '/fotos/Contentor amarelo cheio de pedras.png',
        miniatura: '/fotos/galeria-pedras.webp',
        alt: 'Caçamba amarela cheia de pedras',
        ilustrativa: true,
      },
    ] satisfies FotoGaleria[],
  },
}

/* A mensagem de orçamento do WhatsApp é montada em src/config/contato.ts (mensagemOrcamento). */
