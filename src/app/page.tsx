'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'

// ============================================================
// PRECIOS EDITABLES - Modifica estos valores para actualizar
// los precios en toda la página de forma instantánea.
// ============================================================
const PRECIOS = {
  raspadoClasico: 25,
  lasGlorias: 27,
  elDiablito: 27,
  botanas: 12,
} as const

// Configuración del negocio
const WHATSAPP_NUMBER = '9512645961'
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/Calle+Primera+Cerrada+de+Las+Salinas+7'

// ---- Catálogo de sabores con su ficha individual ----
interface Sabor {
  id: string
  nombre: string
  emoji: string
  imagen: string
  precio: number
  descripcion: string
  color: string
  esEspecial?: boolean
  esTemporada?: boolean
  bases?: string[]
}

const SABORES: Sabor[] = [
  {
    id: 'tamarindo',
    nombre: 'Tamarindo',
    emoji: '🟤',
    imagen: '/raspado-tamarindo.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'El clásico sabor a tamarindo con ese toque ácido que encanta.',
    color: '#8B4513',
  },
  {
    id: 'nanche',
    nombre: 'Nanche',
    emoji: '🟡',
    imagen: '/raspado-nanche.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'Dulce y tropical, el sabor dorado del nanche oaxaqueño.',
    color: '#DAA520',
  },
  {
    id: 'limon',
    nombre: 'Limón',
    emoji: '🍋',
    imagen: '/raspado-limon.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'Refrescante y cítrico, el favorito para el calor extremo.',
    color: '#6B8E23',
  },
  {
    id: 'chicle',
    nombre: 'Chicle',
    emoji: '🫧',
    imagen: '/raspado-chicle.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'Divertido sabor a chicle rosa, dulce y colorido.',
    color: '#FF69B4',
  },
  {
    id: 'durazno',
    nombre: 'Durazno',
    emoji: '🍑',
    imagen: '/raspado-durazno.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'Suave y dulce como un durazno maduro al sol.',
    color: '#FF8C00',
  },
  {
    id: 'fresa',
    nombre: 'Fresa',
    emoji: '🍓',
    imagen: '/raspado-fresa.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'Rojo intenso y dulce, irresistible como la fresa fresca.',
    color: '#DC143C',
  },
  {
    id: 'cachino',
    nombre: 'Cachino',
    emoji: '🍊',
    imagen: '/raspado-cachino.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'El sabor cítrico único del cachino, ácido y refrescante.',
    color: '#FF6347',
  },
  {
    id: 'diablito',
    nombre: 'El Diablito',
    emoji: '🌶️',
    imagen: '/el-diablito.png',
    precio: PRECIOS.elDiablito,
    descripcion: 'Clásico de Tamarindo, Nanche o Durazno, cargado con chamoy, salsa botanera y Tajín. ¡Pica pero sabe rico!',
    color: '#d63031',
    esEspecial: true,
    bases: ['Tamarindo', 'Nanche', 'Durazno'],
  },
  {
    id: 'las-glorias',
    nombre: 'Las Glorias',
    emoji: '🌟',
    imagen: '/las-glorias.png',
    precio: PRECIOS.lasGlorias,
    descripcion: 'Sabor de fresa con plátano, leche, lechera y ese toque especial. ¡El favorito de la casa!',
    color: '#ffa502',
    esEspecial: true,
  },
  {
    id: 'vainilla',
    nombre: 'Vainilla',
    emoji: '🍦',
    imagen: '/raspado-vainilla.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'Suave y cremoso, solo por temporada de calor.',
    color: '#F5DEB3',
    esTemporada: true,
  },
  {
    id: 'pina',
    nombre: 'Piña',
    emoji: '🍍',
    imagen: '/raspado-pina.png',
    precio: PRECIOS.raspadoClasico,
    descripcion: 'Tropical y refrescante, solo por temporada de calor.',
    color: '#FFD700',
    esTemporada: true,
  },
]

// Extras disponibles para raspados
const EXTRAS_DISPONIBLES = [
  { id: 'chamoy', label: 'Chamoy' },
  { id: 'salsa', label: 'Salsa Botanera' },
  { id: 'tajin', label: 'Tajín' },
  { id: 'lechera', label: 'Lechera' },
]

// Botanas disponibles
const BOTANAS_DISPONIBLES = ['Papas', 'Chicharrones', 'Hojuelas', 'Cacahuates']

export default function Home() {
  // ---- Estado dinámico por sabor ----
  const [cantidades, setCantidades] = useState<Record<string, number>>({})
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<Record<string, string[]>>({})
  const [basesSeleccionadas, setBasesSeleccionadas] = useState<Record<string, string>>({})

  // Botana
  const [botanaSeleccionada, setBotanaSeleccionada] = useState('')
  const [cantidadBotana, setCantidadBotana] = useState(1)

  // Entrega
  const [esDomicilio, setEsDomicilio] = useState(false)
  const [direccion, setDireccion] = useState('')
  const [referencias, setReferencias] = useState('')

  // Pago
  const [pagoCon, setPagoCon] = useState('')

  // ---- Helpers ----
  const getCantidad = (id: string) => cantidades[id] || 0
  const setCantidad = (id: string, val: number) => {
    setCantidades((prev) => ({ ...prev, [id]: Math.max(0, val) }))
  }
  const getExtras = (id: string) => extrasSeleccionados[id] || []
  const toggleExtra = (saborId: string, extraId: string) => {
    setExtrasSeleccionados((prev) => {
      const current = prev[saborId] || []
      return {
        ...prev,
        [saborId]: current.includes(extraId)
          ? current.filter((e) => e !== extraId)
          : [...current, extraId],
      }
    })
  }

  // Sabores filtrados por categoría
  const saboresRegulares = SABORES.filter((s) => !s.esEspecial && !s.esTemporada)
  const saboresEspeciales = SABORES.filter((s) => s.esEspecial)
  const saboresTemporada = SABORES.filter((s) => s.esTemporada)

  // ---- Cálculo del total ----
  const totalSabores = SABORES.reduce((acc, s) => {
    return acc + getCantidad(s.id) * s.precio
  }, 0)
  const totalBotana = botanaSeleccionada ? cantidadBotana * PRECIOS.botanas : 0
  const totalGeneral = totalSabores + totalBotana

  // ---- Construcción del mensaje WhatsApp ----
  const enviarWhatsApp = () => {
    const lineas: string[] = []
    lineas.push('¡Hola Raspados Didxsay! 👋 Me gustaría hacer el siguiente pedido:')

    // Sabores con cantidad > 0
    SABORES.forEach((s) => {
      const cant = getCantidad(s.id)
      if (cant > 0) {
        const extras = getExtras(s.id)
        const extrasTexto =
          extras.length > 0
            ? extras
                .map((id) => EXTRAS_DISPONIBLES.find((e) => e.id === id)?.label)
                .join(', ')
            : 'Sin extras'
        const baseTexto = s.bases ? ` (Base: ${basesSeleccionadas[s.id] || s.bases[0]})` : ''
        lineas.push(`- ${cant}x ${s.nombre}${baseTexto} con extras: ${extrasTexto}`)
      }
    })

    if (botanaSeleccionada) {
      lineas.push(`- ${cantidadBotana}x Botana: ${botanaSeleccionada}`)
    }

    lineas.push('')
    lineas.push(
      `🛵 TIPO DE ENTREGA: ${esDomicilio ? 'Envío a Domicilio' : 'Pasar a Recoger'}`
    )

    if (esDomicilio) {
      lineas.push(`📍 Dirección: ${direccion || 'No especificada'}`)
      lineas.push(`🔍 Referencias: ${referencias || 'Sin referencias'}`)
    }

    if (pagoCon) {
      lineas.push(`💵 Pago con: ${pagoCon}`)
    }

    lineas.push(`💰 Total estimado: $${totalGeneral}`)

    const mensaje = lineas.join('\n')
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`

    window.open(url, '_blank')
    toast({ title: 'Pedido enviado', description: 'Se abrió WhatsApp con tu pedido.' })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1f2f6' }}>
      {/* ============================== */}
      {/* HERO BANNER                    */}
      {/* ============================== */}
      <header
        className="relative w-full overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #d63031 0%, #e74c3c 40%, #ffa502 100%)' }}
      >
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(241,196,15,0.2)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 gap-4">
          <div className="w-28 h-28 md:w-36 md:h-36 relative rounded-full overflow-hidden shadow-2xl" style={{ border: '4px solid rgba(255,255,255,0.9)', backgroundColor: '#ffffff' }}>
            <Image src="/logo.png" alt="Raspados Didxsay" fill className="object-contain" priority />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center drop-shadow-lg" style={{ fontFamily: 'var(--font-fredoka)', color: '#ffffff' }}>
            Raspados Didxsay
          </h1>
          <p className="text-sm md:text-base font-medium text-center max-w-xs" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-inter)' }}>
            Raspados artesanales con los sabores más frescos de Oaxaca
          </p>
          <div className="mt-2 px-5 py-2.5 rounded-full flex items-center gap-2 animate-pulse" style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <span className="text-xl">🛵</span>
            <span className="font-bold text-sm md:text-base tracking-wide" style={{ color: '#ffffff', fontFamily: 'var(--font-fredoka)' }}>¡Servicio a domicilio disponible!</span>
            <span className="text-xl">🛵</span>
          </div>
        </div>
      </header>

      {/* ============================== */}
      {/* CONTENIDO PRINCIPAL            */}
      {/* ============================== */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* ---- Sección: Sabores Clásicos ---- */}
        <section>
          <h2 className="text-xl font-bold mb-4 px-1" style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}>
            🍧 Nuestros Sabores
          </h2>
          <div className="space-y-4">
            {saboresRegulares.map((sabor) => (
              <SaborCard
                key={sabor.id}
                sabor={sabor}
                cantidad={getCantidad(sabor.id)}
                onCantidadChange={(val) => setCantidad(sabor.id, val)}
                extras={getExtras(sabor.id)}
                onToggleExtra={(extraId) => toggleExtra(sabor.id, extraId)}
                baseSeleccionada={basesSeleccionadas[sabor.id] || ''}
                onBaseChange={(base) => setBasesSeleccionadas((prev) => ({ ...prev, [sabor.id]: base }))}
              />
            ))}
          </div>
        </section>

        {/* ---- Sección: Especiales ---- */}
        <section>
          <h2 className="text-xl font-bold mb-4 px-1" style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}>
            ⭐ Especiales
          </h2>
          <div className="space-y-4">
            {saboresEspeciales.map((sabor) => (
              <SaborCard
                key={sabor.id}
                sabor={sabor}
                cantidad={getCantidad(sabor.id)}
                onCantidadChange={(val) => setCantidad(sabor.id, val)}
                extras={getExtras(sabor.id)}
                onToggleExtra={(extraId) => toggleExtra(sabor.id, extraId)}
                baseSeleccionada={basesSeleccionadas[sabor.id] || ''}
                onBaseChange={(base) => setBasesSeleccionadas((prev) => ({ ...prev, [sabor.id]: base }))}
              />
            ))}
          </div>
        </section>

        {/* ---- Sección: Temporada ---- */}
        {saboresTemporada.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-2 px-1" style={{ color: '#ffa502', fontFamily: 'var(--font-fredoka)' }}>
              ☀️ Temporada de Calor
            </h2>
            <p className="text-xs mb-4 px-1" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
              Sabores disponibles solo por temporada — ¡no te los pierdas!
            </p>
            <div className="space-y-4">
              {saboresTemporada.map((sabor) => (
                <SaborCard
                  key={sabor.id}
                  sabor={sabor}
                  cantidad={getCantidad(sabor.id)}
                  onCantidadChange={(val) => setCantidad(sabor.id, val)}
                  extras={getExtras(sabor.id)}
                  onToggleExtra={(extraId) => toggleExtra(sabor.id, extraId)}
                  baseSeleccionada={basesSeleccionadas[sabor.id] || ''}
                  onBaseChange={(base) => setBasesSeleccionadas((prev) => ({ ...prev, [sabor.id]: base }))}
                />
              ))}
            </div>
          </section>
        )}

        {/* ---- Botanas y Antojos ---- */}
        <section>
          <h2 className="text-xl font-bold mb-4 px-1" style={{ color: '#ffa502', fontFamily: 'var(--font-fredoka)' }}>
            🍿 Botanas y Antojos
          </h2>
          <div
            className="overflow-hidden"
            style={{ borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #ffa502' }}
          >
            <div className="relative w-full h-44 bg-white">
              <Image src="/botanas.png" alt="Botanas y Antojos" fill className="object-cover" />
              <div className="absolute top-3 right-3 px-3 py-1 text-white font-bold text-lg shadow-lg" style={{ backgroundColor: '#ffa502', borderRadius: '50px', fontFamily: 'var(--font-fredoka)' }}>
                ${PRECIOS.botanas}
              </div>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                Para acompañar tu raspado
              </p>
              <div className="grid grid-cols-2 gap-2">
                {BOTANAS_DISPONIBLES.map((botana) => (
                  <button
                    key={botana}
                    onClick={() => setBotanaSeleccionada(botanaSeleccionada === botana ? '' : botana)}
                    className="py-3 px-3 text-sm font-semibold transition-all"
                    style={{
                      borderRadius: '12px',
                      border: botanaSeleccionada === botana ? '2px solid #ffa502' : '2px solid #e0e0e0',
                      backgroundColor: botanaSeleccionada === botana ? 'rgba(255,165,2,0.1)' : '#ffffff',
                      color: botanaSeleccionada === botana ? '#ffa502' : '#2d3436',
                      fontFamily: 'var(--font-inter)',
                    }}
                  >
                    {botana}
                  </button>
                ))}
              </div>
              {botanaSeleccionada && (
                <>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCantidadBotana(Math.max(1, cantidadBotana - 1))}
                      disabled={cantidadBotana <= 1}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ border: '2px solid #ffa502', color: '#ffa502', backgroundColor: cantidadBotana <= 1 ? '#f1f2f6' : '#fff', fontFamily: 'var(--font-fredoka)' }}
                    >−</button>
                    <span className="text-xl font-bold w-8 text-center" style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}>{cantidadBotana}</span>
                    <button
                      onClick={() => setCantidadBotana(cantidadBotana + 1)}
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ border: '2px solid #ffa502', color: '#ffffff', backgroundColor: '#ffa502', fontFamily: 'var(--font-fredoka)' }}
                    >+</button>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-base font-bold px-3 py-1" style={{ color: '#ffa502', backgroundColor: 'rgba(255,165,2,0.08)', borderRadius: '8px', fontFamily: 'var(--font-fredoka)' }}>
                      Subtotal: ${totalBotana}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* ============================== */}
        {/* CONFIGURACIÓN DE ENTREGA       */}
        {/* ============================== */}
        <section>
          <h2 className="text-xl font-bold mb-4 px-1" style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}>
            🚚 Entrega
          </h2>
          <div className="overflow-hidden" style={{ borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #d63031' }}>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between gap-4 p-4" style={{ backgroundColor: 'rgba(214,48,49,0.04)', borderRadius: '14px', border: '1px solid rgba(214,48,49,0.12)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}>Pasar a recoger</p>
                  <p className="text-xs" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>Recoge tu pedido</p>
                </div>
                <Switch checked={esDomicilio} onCheckedChange={setEsDomicilio} className="data-[state=checked]:bg-[#d63031]" />
                <div className="flex-1 text-right">
                  <p className="font-semibold text-sm" style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}>A domicilio</p>
                  <p className="text-xs" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>🛵 Te lo llevamos</p>
                </div>
              </div>

              {esDomicilio && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 p-4" style={{ backgroundColor: 'rgba(214,48,49,0.03)', borderRadius: '14px', border: '1px dashed rgba(214,48,49,0.2)' }}>
                  <div className="space-y-1.5">
                    <Label htmlFor="direccion" className="font-semibold text-sm" style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}>📍 Dirección Completa</Label>
                    <Input id="direccion" placeholder="Calle, Número y Colonia..." value={direccion} onChange={(e) => setDireccion(e.target.value)} style={{ borderRadius: '12px', borderColor: '#ddd', fontFamily: 'var(--font-inter)' }} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="referencias" className="font-semibold text-sm" style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}>🔍 Referencias para el repartidor</Label>
                    <Textarea id="referencias" placeholder="Ej: Casa azul con reja blanca..." value={referencias} onChange={(e) => setReferencias(e.target.value)} className="min-h-[80px]" style={{ borderRadius: '12px', borderColor: '#ddd', fontFamily: 'var(--font-inter)' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================== */}
        {/* CONTROL DE CAMBIO              */}
        {/* ============================== */}
        <div className="overflow-hidden" style={{ borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #ffa502' }}>
          <div className="p-5 space-y-3">
            <h2 className="text-xl font-bold" style={{ color: '#ffa502', fontFamily: 'var(--font-fredoka)' }}>💵 Control de Cambio</h2>
            <p className="text-sm" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>Indica con cuánto vas a pagar para que llevemos el cambio exacto</p>
            <div className="space-y-1.5">
              <Label htmlFor="pago" className="font-semibold text-sm" style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}>Pago con...</Label>
              <Input id="pago" placeholder="Ej: Billete de $200, $500, etc." value={pagoCon} onChange={(e) => setPagoCon(e.target.value)} style={{ borderRadius: '12px', borderColor: '#ddd', fontFamily: 'var(--font-inter)' }} />
            </div>
          </div>
        </div>

        {/* ============================== */}
        {/* UBICACIÓN                      */}
        {/* ============================== */}
        <div className="overflow-hidden" style={{ borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #d63031' }}>
          <div className="p-5 space-y-4">
            <h2 className="text-xl font-bold" style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}>📍 Ubicación</h2>
            <div className="p-4" style={{ backgroundColor: 'rgba(214,48,49,0.04)', borderRadius: '14px', border: '1px solid rgba(214,48,49,0.1)' }}>
              <p className="font-semibold text-sm" style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}>Dirección del negocio:</p>
              <p className="text-base mt-1 font-medium" style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}>Calle Primera Cerrada de Las Salinas #7</p>
              <p className="text-sm mt-1" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>Junto al campo de fútbol</p>
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              <button className="w-full py-3 px-6 flex items-center justify-center gap-2 text-white text-sm font-bold transition-all" style={{ backgroundColor: '#d63031', borderRadius: '14px', fontFamily: 'var(--font-inter)', boxShadow: '0 4px 14px rgba(214,48,49,0.3)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                Ver en Google Maps
              </button>
            </a>
          </div>
        </div>

        {/* ============================== */}
        {/* RESUMEN Y ENVÍO WHATSAPP       */}
        {/* ============================== */}
        <div className="overflow-hidden" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,242,246,0.95))', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '2px solid #d63031', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div className="p-5 space-y-4">
            <h2 className="text-2xl font-bold text-center" style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}>🧾 Resumen del Pedido</h2>

            <div className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
              {SABORES.map((s) => {
                const cant = getCantidad(s.id)
                if (cant === 0) return null
                const extras = getExtras(s.id)
                const baseTexto = s.bases ? ` (Base: ${basesSeleccionadas[s.id] || s.bases[0]})` : ''
                return (
                  <div key={s.id} className="flex justify-between items-center">
                    <span style={{ color: '#2d3436' }}>
                      {cant}x {s.nombre}{baseTexto}
                      {extras.length > 0 && ` + ${extras.map((id) => EXTRAS_DISPONIBLES.find((e) => e.id === id)?.label).join(', ')}`}
                    </span>
                    <span className="font-bold" style={{ color: s.esEspecial ? '#ffa502' : '#d63031' }}>${cant * s.precio}</span>
                  </div>
                )
              })}
              {botanaSeleccionada && (
                <div className="flex justify-between items-center">
                  <span style={{ color: '#2d3436' }}>{cantidadBotana}x Botana ({botanaSeleccionada})</span>
                  <span className="font-bold" style={{ color: '#ffa502' }}>${totalBotana}</span>
                </div>
              )}
            </div>

            <div style={{ height: '1px', backgroundColor: 'rgba(214,48,49,0.15)' }} />

            <div className="flex justify-between items-center">
              <span className="text-lg font-extrabold" style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}>Total</span>
              <span className="text-2xl font-extrabold" style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}>${totalGeneral}</span>
            </div>

            {esDomicilio && direccion && (
              <div className="text-xs p-2.5" style={{ color: '#636e72', backgroundColor: 'rgba(214,48,49,0.04)', borderRadius: '10px', fontFamily: 'var(--font-inter)' }}>
                🛵 Entrega a: {direccion}{referencias && <span> — {referencias}</span>}
              </div>
            )}
            {!esDomicilio && (
              <div className="text-xs p-2.5" style={{ color: '#636e72', backgroundColor: 'rgba(255,165,2,0.06)', borderRadius: '10px', fontFamily: 'var(--font-inter)' }}>
                🏪 Pasar a recoger al local
              </div>
            )}
            {pagoCon && (
              <div className="text-xs p-2.5" style={{ color: '#636e72', backgroundColor: 'rgba(255,165,2,0.06)', borderRadius: '10px', fontFamily: 'var(--font-inter)' }}>
                💵 Paga con: {pagoCon}
              </div>
            )}

            <button
              onClick={enviarWhatsApp}
              className="w-full py-5 px-6 flex items-center justify-center gap-3 text-white text-lg font-bold transition-all active:scale-[0.98]"
              style={{ backgroundColor: '#25D366', borderRadius: '16px', fontFamily: 'var(--font-fredoka)', boxShadow: '0 6px 24px rgba(37,211,102,0.4)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 text-center" style={{ background: 'linear-gradient(135deg, #d63031, #e74c3c 40%, #ffa502)', color: '#ffffff' }}>
        <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-fredoka)' }}>Raspados Didxsay</p>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-inter)' }}>Calle Primera Cerrada de Las Salinas #7</p>
        <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter)' }}>Hecho con ❤️ en Oaxaca</p>
      </footer>
    </div>
  )
}

// ================================================
// COMPONENTE: Ficha Individual de Sabor
// ================================================
function SaborCard({
  sabor,
  cantidad,
  onCantidadChange,
  extras,
  onToggleExtra,
  baseSeleccionada,
  onBaseChange,
}: {
  sabor: Sabor
  cantidad: number
  onCantidadChange: (val: number) => void
  extras: string[]
  onToggleExtra: (extraId: string) => void
  baseSeleccionada: string
  onBaseChange: (base: string) => void
}) {
  const estaSeleccionado = cantidad > 0

  return (
    <div
      className="overflow-hidden transition-all"
      style={{
        borderRadius: '16px',
        backgroundColor: '#ffffff',
        boxShadow: estaSeleccionado
          ? `0 6px 24px rgba(0,0,0,0.1)`
          : '0 2px 12px rgba(0,0,0,0.04)',
        border: `2px solid ${estaSeleccionado ? sabor.color : '#e8e8e8'}`,
      }}
    >
      {/* Photo + Title row */}
      <div className="flex">
        {/* Photo */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <Image
            src={sabor.imagen}
            alt={sabor.nombre}
            fill
            className="object-cover"
            style={{ borderRadius: '14px 0 0 0' }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base truncate" style={{ color: sabor.color, fontFamily: 'var(--font-fredoka)' }}>
                {sabor.emoji} {sabor.nombre}
              </h3>
              {sabor.esTemporada && (
                <span
                  className="text-[10px] font-bold px-2 py-0.5 flex-shrink-0"
                  style={{
                    backgroundColor: 'rgba(255,165,2,0.12)',
                    color: '#ffa502',
                    borderRadius: '50px',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  TEMPORADA
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5 line-clamp-2" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
              {sabor.descripcion}
            </p>
          </div>

          {/* Price + Quantity */}
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-lg" style={{ color: sabor.color, fontFamily: 'var(--font-fredoka)' }}>
              ${sabor.precio}
            </span>

            {/* Quantity controls */}
            {cantidad === 0 ? (
              <button
                onClick={() => onCantidadChange(1)}
                className="px-4 py-1.5 text-sm font-bold text-white transition-all"
                style={{
                  backgroundColor: sabor.color,
                  borderRadius: '50px',
                  fontFamily: 'var(--font-fredoka)',
                }}
              >
                Agregar
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCantidadChange(cantidad - 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ border: `2px solid ${sabor.color}`, color: sabor.color, backgroundColor: '#fff', fontFamily: 'var(--font-fredoka)' }}
                >
                  −
                </button>
                <span className="text-lg font-bold w-6 text-center" style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}>
                  {cantidad}
                </span>
                <button
                  onClick={() => onCantidadChange(cantidad + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ border: `2px solid ${sabor.color}`, color: '#ffffff', backgroundColor: sabor.color, fontFamily: 'var(--font-fredoka)' }}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extras (shown when selected) */}
      {estaSeleccionado && (
        <div
          className="px-4 pb-4 pt-2 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          {/* Base selector for Diablito */}
          {sabor.bases && sabor.bases.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                Elige la base:
              </p>
              <div className="flex flex-wrap gap-2">
                {sabor.bases.map((base) => (
                  <button
                    key={base}
                    onClick={() => onBaseChange(base)}
                    className="px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      borderRadius: '50px',
                      border: baseSeleccionada === base
                        ? `2px solid ${sabor.color}`
                        : '2px solid #e0e0e0',
                      backgroundColor: baseSeleccionada === base
                        ? `${sabor.color}18`
                        : '#fafafa',
                      color: baseSeleccionada === base ? sabor.color : '#636e72',
                      fontFamily: 'var(--font-inter)',
                    }}
                  >
                    {base}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs font-semibold" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
            Acompañamientos extra:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXTRAS_DISPONIBLES.map((extra) => (
              <label
                key={extra.id}
                className="flex items-center gap-1.5 px-2.5 py-1.5 cursor-pointer transition-all"
                style={{
                  borderRadius: '50px',
                  border: extras.includes(extra.id)
                    ? `1.5px solid ${sabor.color}`
                    : '1.5px solid #e0e0e0',
                  backgroundColor: extras.includes(extra.id)
                    ? `${sabor.color}10`
                    : '#fafafa',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                <Checkbox
                  checked={extras.includes(extra.id)}
                  onCheckedChange={() => onToggleExtra(extra.id)}
                  className="size-3.5 data-[state=checked]:bg-[var(--extra-color)] data-[state=checked]:border-[var(--extra-color)]"
                  style={{ '--extra-color': sabor.color } as React.CSSProperties}
                />
                <span
                  className="text-xs font-medium"
                  style={{ color: extras.includes(extra.id) ? sabor.color : '#636e72' }}
                >
                  {extra.label}
                </span>
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <span
              className="text-sm font-bold px-2.5 py-0.5"
              style={{
                color: sabor.color,
                backgroundColor: `${sabor.color}12`,
                borderRadius: '8px',
                fontFamily: 'var(--font-fredoka)',
              }}
            >
              Subtotal: ${cantidad * sabor.precio}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
