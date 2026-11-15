import { empresa } from './empresa'

/** Celular brasileiro: 55 + DDD (2) + 9 dígitos, ou fixo com 8 dígitos. */
const WHATSAPP_VALIDO = /^55[1-9]{2}9?\d{8}$/
const INSTAGRAM_VALIDO = /^[A-Za-z0-9._]{1,30}$/

/** Só dígitos; adiciona o DDI 55 se vier apenas DDD + número. */
function normalizar(numero: string): string {
  const digitos = numero.replace(/\D/g, '')
  return digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : digitos
}

const SAUDACAO_ORCAMENTO = 'Olá, Rogério! Vim pelo site da Rogério Caçambas e gostaria de um orçamento.'

/** Campos que o cliente completa no WhatsApp, um por linha. */
const CAMPOS_ORCAMENTO = ['Bairro da entrega: ', 'Tipo de material: ', 'Data desejada: ']

/**
 * Mensagem de orçamento usada em todos os botões de WhatsApp.
 * Com `capacidade` (caçamba escolhida no seletor), acrescenta "Tamanho da caçamba: 4 m³"
 * como primeiro campo, logo após a saudação.
 */
export function mensagemOrcamento(capacidade?: string): string {
  const tamanho = capacidade ? [`Tamanho da caçamba: ${capacidade}`] : []
  return [SAUDACAO_ORCAMENTO, ...tamanho, ...CAMPOS_ORCAMENTO].join('\n')
}

const SAUDACAO_AJUDA_TAMANHO =
  'Olá, Rogério! Vim pelo site da Rogério Caçambas e preciso de ajuda para escolher o tamanho da caçamba.'

/** Mensagem do link "Não sei qual tamanho escolher": pede ajuda e traz os mesmos campos do orçamento. */
export function mensagemAjudaTamanho(): string {
  return [SAUDACAO_AJUDA_TAMANHO, ...CAMPOS_ORCAMENTO].join('\n')
}

interface OpcoesLinkWhatsApp {
  /** Caçamba escolhida (ex.: '4 m³'); entra na mensagem como "Tamanho da caçamba". */
  capacidade?: string
  /** Número com DDD (o 55 é opcional). Padrão: WhatsApp comercial de empresa.ts. */
  numero?: string
  /** Pede ajuda para escolher o tamanho em vez de orçar um tamanho definido (ignora `capacidade`). */
  ajudaTamanho?: boolean
}

/** Link do WhatsApp comercial com a mensagem já preenchida, ou null se o número for inválido. */
export function linkWhatsApp({ capacidade, numero = empresa.whatsapp, ajudaTamanho = false }: OpcoesLinkWhatsApp = {}): string | null {
  const digitos = normalizar(numero)
  if (!WHATSAPP_VALIDO.test(digitos)) return null
  const mensagem = ajudaTamanho ? mensagemAjudaTamanho() : mensagemOrcamento(capacidade)
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensagem)}`
}

const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

/** 400 → "R$ 400,00". */
export function formatarPreco(valor: number): string {
  return BRL.format(valor)
}

export function linkInstagram(usuario: string = empresa.instagram): string | null {
  const limpo = usuario.trim().replace(/^@/, '')
  if (!INSTAGRAM_VALIDO.test(limpo)) return null
  return `https://www.instagram.com/${limpo}/`
}

/** Formata 5511987654321 como (11) 98765-4321. */
export function formatarTelefone(numero: string = empresa.whatsapp): string | null {
  const d = normalizar(numero)
  if (!WHATSAPP_VALIDO.test(d)) return null
  const ddd = d.slice(2, 4)
  const resto = d.slice(4)
  const corte = resto.length - 4
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`
}

/** Domínios aceitos para o link do Google Maps (links de compartilhamento e de busca/rota). */
const MAPA_CURTO = 'maps.app.goo.gl'
const MAPA_GOOGLE = /^(www\.|maps\.)?google\.com(\.br)?$/

/** Link oficial do Google Maps validado (https e domínio do Google), ou null. */
export function linkMapa(url: string = empresa.localizacao.mapa): string | null {
  try {
    const u = new URL(url.trim())
    if (u.protocol !== 'https:') return null
    const oficial =
      u.hostname === MAPA_CURTO ||
      (u.hostname === 'goo.gl' && u.pathname.startsWith('/maps')) ||
      (MAPA_GOOGLE.test(u.hostname) && (u.hostname.startsWith('maps.') || u.pathname.startsWith('/maps')))
    return oficial ? u.toString() : null
  } catch {
    return null
  }
}

interface Coordenadas {
  latitude: number
  longitude: number
}

/**
 * Mapa incorporável (iframe) do Google Maps com o marcador nas coordenadas.
 * Não usa chave de API nem assinatura. Retorna null se as coordenadas forem inválidas.
 */
export function linkMapaIncorporado(
  { latitude, longitude }: Coordenadas = empresa.localizacao.coordenadas,
  zoom = 16,
): string | null {
  const valido =
    Number.isFinite(latitude) && Number.isFinite(longitude) && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
  if (!valido) return null
  const params = new URLSearchParams({ q: `${latitude},${longitude}`, z: String(zoom), output: 'embed' })
  return `https://maps.google.com/maps?${params.toString()}`
}

/** Fotos da galeria com arquivo cadastrado (as vazias não aparecem no site). */
export const fotosGaleria = empresa.fotos.galeria.filter((foto) => foto.src.trim() !== '')

/** A seção Galeria (e o item do menu) existe se houver destaque da frota ou fotos de materiais. */
export const temGaleria = fotosGaleria.length > 0 || empresa.fotos.destaqueFrota.src.trim() !== ''

/**
 * URL segura para arquivos de /public com espaços, acentos ou parênteses no nome
 * (ex.: "/fotos/Caçamba amarela com areia.png" → "/fotos/Ca%C3%A7amba%20amarela%20com%20areia.png").
 * Decodifica antes para não codificar duas vezes um caminho que já venha codificado.
 */
export function urlPublica(caminho: string): string {
  try {
    return encodeURI(decodeURI(caminho))
  } catch {
    return encodeURI(caminho)
  }
}
