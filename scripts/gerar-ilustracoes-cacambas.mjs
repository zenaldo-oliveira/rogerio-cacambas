/**
 * Gera as ilustrações das caçambas em public/ilustracoes/.
 *
 *   npm run ilustracoes
 *
 * Para cada modelo gera 3 arquivos com o mesmo viewBox:
 *   cacamba-Xm3.svg          imagem completa (fundo + sombra + caçamba)
 *   cacamba-Xm3-recorte.svg  só a caçamba (camada que flutua no site)
 *   cacamba-Xm3-sombra.svg   só a sombra oval (camada que reage à flutuação)
 *
 * Todas usam a mesma câmera e a mesma escala, então a diferença de tamanho
 * entre os modelos é visível. As medidas abaixo são APROXIMADAS (em metros):
 * quando o Rogério confirmar as dimensões reais, ajuste e rode de novo.
 *
 *   comprimento = comprimento na borda de cima
 *   recuo       = quanto cada cabeceira avança para dentro no fundo (caixa trapezoidal)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const MODELOS = [
  { arquivo: 'cacamba-3m3.svg', capacidade: '3 m³', comprimento: 2.5, largura: 1.45, altura: 0.95, recuo: 0.35 },
  { arquivo: 'cacamba-4m3.svg', capacidade: '4 m³', comprimento: 2.85, largura: 1.55, altura: 1.0, recuo: 0.35 },
  { arquivo: 'cacamba-5m3.svg', capacidade: '5 m³', comprimento: 3.15, largura: 1.65, altura: 1.08, recuo: 0.35 },
  { arquivo: 'cacamba-6m3.svg', capacidade: '6 m³', comprimento: 3.45, largura: 1.7, altura: 1.12, recuo: 0.35 },
]

const LARGURA_TELA = 800
const ALTURA_TELA = 600
const ESCALA = 158 // px por metro, igual para todos
const PATIM = 0.1 // altura dos patins sob a caçamba

// Projeção em três quartos: comprimento para a direita, profundidade para a esquerda/cima.
const EIXO_X = [0.86, 0.2]
const EIXO_Y = [-0.5, 0.38]

function projetar([x, y, z], origem) {
  return [
    origem[0] + ESCALA * (x * EIXO_X[0] + y * EIXO_Y[0]),
    origem[1] - ESCALA * (z + x * EIXO_X[1] + y * EIXO_Y[1]),
  ]
}

const fmt = (n) => Math.round(n * 10) / 10

function caminho(pontos, origem) {
  return pontos.map((p, i) => `${i ? 'L' : 'M'}${projetar(p, origem).map(fmt).join(' ')}`).join('') + 'Z'
}

function svgCacamba({ capacidade, comprimento: L, largura: W, altura, recuo: s }) {
  const H = altura + PATIM
  const zb = PATIM

  // Centraliza a caixa (incluindo patins) no quadro.
  const cantos = []
  for (const x of [0, L]) for (const y of [0, W]) for (const z of [0, H]) cantos.push(projetar([x, y, z], [0, 0]))
  const xs = cantos.map((c) => c[0])
  const ys = cantos.map((c) => c[1])
  const origem = [
    LARGURA_TELA / 2 - (Math.min(...xs) + Math.max(...xs)) / 2,
    ALTURA_TELA / 2 + 24 - (Math.min(...ys) + Math.max(...ys)) / 2,
  ]
  const P = (pts) => caminho(pts, origem)

  const lateral = P([[0, 0, H], [L, 0, H], [L - s, 0, zb], [s, 0, zb]])
  const cabeceira = P([[0, 0, H], [0, W, H], [s, W, zb], [s, 0, zb]])
  const boca = P([[0, 0, H], [L, 0, H], [L, W, H], [0, W, H]])
  const fundo = P([[s, 0, zb], [L - s, 0, zb], [L - s, W, zb], [s, W, zb]])
  const paredeFundo = P([[0, W, H], [L, W, H], [L - s, W, zb], [s, W, zb]])
  const cabeceiraInterna = P([[L, 0, H], [L, W, H], [L - s, W, zb], [L - s, 0, zb]])

  // Nervuras verticais na lateral, acompanhando a inclinação das cabeceiras.
  const nervuras = []
  const qtd = Math.max(4, Math.round(L / 0.55))
  for (let i = 1; i < qtd; i++) {
    const t = i / qtd
    const xt = t * L
    const xb = s + t * (L - 2 * s)
    const d = 0.035
    nervuras.push(
      `<path d="${P([[xt - d, 0, H - 0.06], [xt + d, 0, H - 0.06], [xb + d, 0, zb + 0.04], [xb - d, 0, zb + 0.04]])}" fill="url(#nervura)"/>`,
      `<path d="${P([[xt + d, 0, H - 0.06], [xb + d, 0, zb + 0.04]])}" stroke="#b07c00" stroke-width="1.6" fill="none"/>`,
    )
  }

  // Patins (trilhos) e olhais de içamento.
  const patim = (y) => P([[s, y, 0], [L - s, y, 0], [L - s, y, zb], [s, y, zb]])
  const olhal = (x) => {
    const [cx, cy] = projetar([x, 0, H - 0.2], origem)
    return `<ellipse cx="${fmt(cx)}" cy="${fmt(cy)}" rx="9" ry="11" fill="none" stroke="#3a3f47" stroke-width="5"/>`
  }


  const [bx1, by1] = projetar([0, 0, H], origem)
  const [bx2, by2] = projetar([L, 0, H], origem)

  // Sombra oval no chão, centrada sob a caçamba.
  const [sx, sy] = projetar([L / 2, W / 2, 0], origem)
  const sombraRx = 0.5 * ESCALA * ((L - 2 * s) * EIXO_X[0] + W * -EIXO_Y[0]) + 30
  const sombraRy = sombraRx * 0.17

  const defsCena = `
    <linearGradient id="fundoCena" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3f4f6"/>
      <stop offset="0.62" stop-color="#e6e8eb"/>
      <stop offset="1" stop-color="#d9dce0"/>
    </linearGradient>
    <radialGradient id="luz" cx="0.32" cy="0.18" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>`
  const defsSombra = `
    <filter id="desfoque" x="-30%" y="-150%" width="160%" height="400%">
      <feGaussianBlur stdDeviation="12"/>
    </filter>`
  const defsCacamba = `
    <linearGradient id="lateral" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffc21a"/>
      <stop offset="1" stop-color="#d99a00"/>
    </linearGradient>
    <linearGradient id="cabeceira" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffd54d"/>
      <stop offset="1" stop-color="#e9ac00"/>
    </linearGradient>
    <linearGradient id="nervura" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffd14a"/>
      <stop offset="1" stop-color="#e5a500"/>
    </linearGradient>
    <linearGradient id="interno" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#a87b00"/>
      <stop offset="1" stop-color="#5e4400"/>
    </linearGradient>
    <linearGradient id="brilho" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="recorteBoca"><path d="${boca}"/></clipPath>`

  const cena = `
  <rect width="${LARGURA_TELA}" height="${ALTURA_TELA}" fill="url(#fundoCena)"/>
  <rect width="${LARGURA_TELA}" height="${ALTURA_TELA}" fill="url(#luz)"/>`
  const sombraOval = `
  <ellipse cx="${fmt(sx)}" cy="${fmt(sy)}" rx="${fmt(sombraRx)}" ry="${fmt(sombraRy)}" fill="#1c2331" opacity="0.34" filter="url(#desfoque)"/>`
  const cacamba = `
  <path d="${patim(W - 0.18)}" fill="#2b2f36"/>
  <path d="${patim(0.18)}" fill="#3a3f47"/>

  <path d="${lateral}" fill="url(#lateral)"/>
  ${nervuras.join('\n  ')}
  <path d="${lateral}" fill="url(#brilho)"/>
  <path d="${cabeceira}" fill="url(#cabeceira)"/>
  <path d="${P([[0, W / 2 - 0.04, H - 0.06], [0, W / 2 + 0.04, H - 0.06], [s, W / 2 + 0.04, zb + 0.04], [s, W / 2 - 0.04, zb + 0.04]])}" fill="#f2b400"/>

  <path d="${boca}" fill="#3d2d00"/>
  <g clip-path="url(#recorteBoca)">
    <path d="${fundo}" fill="#4a3600"/>
    <path d="${paredeFundo}" fill="url(#interno)"/>
    <path d="${cabeceiraInterna}" fill="#7a5800"/>
  </g>
  <path d="${boca}" fill="none" stroke="#c48a00" stroke-width="7" stroke-linejoin="round"/>
  <path d="M${fmt(bx1)} ${fmt(by1)}L${fmt(bx2)} ${fmt(by2)}" stroke="#ffe07a" stroke-width="2.5"/>

  ${olhal(0.32)}
  ${olhal(L - 0.32)}`

  const svg = (titulo, defs, corpo) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LARGURA_TELA} ${ALTURA_TELA}" width="${LARGURA_TELA}" height="${ALTURA_TELA}" role="img">
  <title>${titulo}</title>
  <defs>${defs}
  </defs>${corpo}
</svg>
`

  return {
    // Imagem completa (fundo + sombra + caçamba), para uso isolado.
    completo: svg(`Imagem ilustrativa: caçamba estacionária de ${capacidade}`, defsCena + defsSombra + defsCacamba, cena + sombraOval + cacamba),
    // Camadas para animação no site: mesmo viewBox, sobrepostas.
    recorte: svg(`Imagem ilustrativa: caçamba estacionária de ${capacidade}`, defsCacamba, cacamba),
    sombra: svg('Sombra', defsSombra, sombraOval),
    // Centro da sombra em % do quadro: origem da escala da sombra no CSS.
    centroSombra: [(sx / LARGURA_TELA) * 100, (sy / ALTURA_TELA) * 100],
  }
}

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..')
const destino = join(raiz, 'public', 'ilustracoes')
mkdirSync(destino, { recursive: true })
for (const modelo of MODELOS) {
  const { completo, recorte, sombra, centroSombra } = svgCacamba(modelo)
  const base = modelo.arquivo.replace(/\.svg$/, '')
  writeFileSync(join(destino, `${base}.svg`), completo)
  writeFileSync(join(destino, `${base}-recorte.svg`), recorte)
  writeFileSync(join(destino, `${base}-sombra.svg`), sombra)
  console.log(`public/ilustracoes/${base}{,-recorte,-sombra}.svg  centro da sombra: ${centroSombra.map((n) => n.toFixed(1) + '%').join(' ')}`)
}
