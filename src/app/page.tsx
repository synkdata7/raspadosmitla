'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

// Catálogo de sabores clásicos
const SABORES_CLASICOS = [
  'Mango',
  'Limón',
  'Fresa',
  'Tamarindo',
  'Piña',
  'Uva',
  'Nanche',
  'Zarzamora',
  'Coco',
  'Melón',
  'Sandía',
  'Durazno',
]

// Extras disponibles para raspados
const EXTRAS_DISPONIBLES = [
  { id: 'chamoy', label: 'Chamoy' },
  { id: 'salsa', label: 'Salsa' },
  { id: 'tajin', label: 'Tajín' },
  { id: 'lechera', label: 'Lechera' },
]

// Botanas disponibles
const BOTANAS_DISPONIBLES = ['Papas', 'Chicharrones', 'Hojuelas', 'Cacahuates']

export default function Home() {
  // ---- Estado del pedido ----
  const [saborClasico, setSaborClasico] = useState('')
  const [cantidadClasico, setCantidadClasico] = useState(1)
  const [extrasClasico, setExtrasClasico] = useState<string[]>([])

  const [cantidadGlorias, setCantidadGlorias] = useState(1)

  const [baseDiablito, setBaseDiablito] = useState('')
  const [cantidadDiablito, setCantidadDiablito] = useState(1)

  const [botanaSeleccionada, setBotanaSeleccionada] = useState('')
  const [cantidadBotana, setCantidadBotana] = useState(1)

  // Entrega
  const [esDomicilio, setEsDomicilio] = useState(false)
  const [direccion, setDireccion] = useState('')
  const [referencias, setReferencias] = useState('')

  // Pago
  const [pagoCon, setPagoCon] = useState('')

  // ---- Handlers ----
  const toggleExtra = useCallback((extraId: string) => {
    setExtrasClasico((prev) =>
      prev.includes(extraId)
        ? prev.filter((e) => e !== extraId)
        : [...prev, extraId]
    )
  }, [])

  // ---- Cálculo del total ----
  const totalClasico = saborClasico ? cantidadClasico * PRECIOS.raspadoClasico : 0
  const totalGlorias = cantidadGlorias * PRECIOS.lasGlorias
  const totalDiablito = baseDiablito ? cantidadDiablito * PRECIOS.elDiablito : 0
  const totalBotana = botanaSeleccionada ? cantidadBotana * PRECIOS.botanas : 0
  const totalGeneral = totalClasico + totalGlorias + totalDiablito + totalBotana

  // ---- Construcción del mensaje WhatsApp ----
  const enviarWhatsApp = useCallback(() => {
    const lineas: string[] = []

    lineas.push('¡Hola Raspados Didxsay! 👋 Me gustaría hacer el siguiente pedido:')

    if (saborClasico) {
      const extrasTexto =
        extrasClasico.length > 0
          ? extrasClasico
              .map((id) => EXTRAS_DISPONIBLES.find((e) => e.id === id)?.label)
              .join(', ')
          : 'Sin extras'
      lineas.push(
        `- ${cantidadClasico}x Raspado Clásico de ${saborClasico} con extras: ${extrasTexto}`
      )
    }

    if (cantidadGlorias > 0) {
      lineas.push(`- ${cantidadGlorias}x Las Glorias (Plátano, Jarabe, Canela y Doble Leche)`)
    }

    if (baseDiablito) {
      lineas.push(
        `- ${cantidadDiablito}x El Diablito (Base: ${baseDiablito}, Chamoy, Salsa y Tajín)`
      )
    }

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

    toast({
      title: 'Pedido enviado',
      description: 'Se abrió WhatsApp con tu pedido.',
    })
  }, [
    saborClasico,
    cantidadClasico,
    extrasClasico,
    cantidadGlorias,
    baseDiablito,
    cantidadDiablito,
    botanaSeleccionada,
    cantidadBotana,
    esDomicilio,
    direccion,
    referencias,
    pagoCon,
    totalGeneral,
  ])

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f1f2f6' }}>
      {/* ============================== */}
      {/* HERO BANNER                    */}
      {/* ============================== */}
      <header
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #d63031 0%, #e74c3c 40%, #ffa502 100%)',
        }}
      >
        {/* Decorative frost circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(241,196,15,0.2)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 gap-4">
          {/* Logo */}
          <div
            className="w-28 h-28 md:w-36 md:h-36 relative rounded-full overflow-hidden shadow-2xl"
            style={{
              border: '4px solid rgba(255,255,255,0.9)',
              backgroundColor: '#ffffff',
            }}
          >
            <Image
              src="/logo.png"
              alt="Raspados Didxsay"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight text-center drop-shadow-lg"
            style={{ fontFamily: 'var(--font-fredoka)', color: '#ffffff' }}
          >
            Raspados Didxsay
          </h1>
          <p
            className="text-sm md:text-base font-medium text-center max-w-xs"
            style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-inter)' }}
          >
            Raspados artesanales con los sabores más frescos de Oaxaca
          </p>

          {/* Badge domicilio - glassmorphism */}
          <div
            className="mt-2 px-5 py-2.5 rounded-full flex items-center gap-2 animate-pulse"
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            }}
          >
            <span className="text-xl">🛵</span>
            <span
              className="font-bold text-sm md:text-base tracking-wide"
              style={{ color: '#ffffff', fontFamily: 'var(--font-fredoka)' }}
            >
              ¡Servicio a domicilio disponible!
            </span>
            <span className="text-xl">🛵</span>
          </div>
        </div>
      </header>

      {/* ============================== */}
      {/* CONTENIDO PRINCIPAL            */}
      {/* ============================== */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* ---- Raspados Clásicos ---- */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #d63031',
          }}
        >
          {/* Photo */}
          <div className="relative w-full h-52 bg-white">
            <Image
              src="/raspado-clasico.png"
              alt="Raspado Clásico"
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
            />
            <div
              className="absolute top-3 right-3 px-3 py-1 text-white font-bold text-lg shadow-lg"
              style={{
                backgroundColor: '#d63031',
                borderRadius: '50px',
                fontFamily: 'var(--font-fredoka)',
              }}
            >
              ${PRECIOS.raspadoClasico}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}
              >
                Raspados Clásicos
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                Elige tu sabor favorito entre nuestra gran variedad
              </p>
            </div>

            {/* Sabor selector */}
            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Sabor
              </Label>
              <Select value={saborClasico} onValueChange={setSaborClasico}>
                <SelectTrigger
                  className="w-full h-10"
                  style={{
                    borderRadius: '12px',
                    borderColor: '#ddd',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  <SelectValue placeholder="Selecciona un sabor..." />
                </SelectTrigger>
                <SelectContent>
                  {SABORES_CLASICOS.map((sabor) => (
                    <SelectItem key={sabor} value={sabor}>
                      {sabor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Cantidad
              </Label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidadClasico(Math.max(1, cantidadClasico - 1))}
                  disabled={cantidadClasico <= 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #d63031',
                    color: '#d63031',
                    backgroundColor: cantidadClasico <= 1 ? '#f1f2f6' : '#fff',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  −
                </button>
                <span
                  className="text-xl font-bold w-8 text-center"
                  style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}
                >
                  {cantidadClasico}
                </span>
                <button
                  onClick={() => setCantidadClasico(cantidadClasico + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #d63031',
                    color: '#ffffff',
                    backgroundColor: '#d63031',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Extras checkboxes */}
            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Acompañamientos extra
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {EXTRAS_DISPONIBLES.map((extra) => (
                  <label
                    key={extra.id}
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-all"
                    style={{
                      borderRadius: '12px',
                      border: extrasClasico.includes(extra.id)
                        ? '2px solid #d63031'
                        : '2px solid #e0e0e0',
                      backgroundColor: extrasClasico.includes(extra.id)
                        ? 'rgba(214,48,49,0.06)'
                        : '#ffffff',
                      fontFamily: 'var(--font-inter)',
                    }}
                  >
                    <Checkbox
                      checked={extrasClasico.includes(extra.id)}
                      onCheckedChange={() => toggleExtra(extra.id)}
                      className="data-[state=checked]:bg-[#d63031] data-[state=checked]:border-[#d63031]"
                    />
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: extrasClasico.includes(extra.id) ? '#d63031' : '#2d3436',
                      }}
                    >
                      {extra.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {saborClasico && (
              <div className="flex justify-end">
                <span
                  className="text-base font-bold px-3 py-1"
                  style={{
                    color: '#d63031',
                    backgroundColor: 'rgba(214,48,49,0.08)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  Subtotal: ${totalClasico}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---- Las Glorias ---- */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #ffa502',
          }}
        >
          {/* Photo */}
          <div className="relative w-full h-52 bg-white">
            <Image
              src="/las-glorias.png"
              alt="Las Glorias"
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
            />
            <div
              className="absolute top-3 right-3 px-3 py-1 text-white font-bold text-lg shadow-lg"
              style={{
                backgroundColor: '#ffa502',
                borderRadius: '50px',
                fontFamily: 'var(--font-fredoka)',
              }}
            >
              ${PRECIOS.lasGlorias}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: '#ffa502', fontFamily: 'var(--font-fredoka)' }}
              >
                🌟 Las Glorias
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                Raspado gourmet premium
              </p>
            </div>

            <p
              className="text-sm leading-relaxed p-3"
              style={{
                backgroundColor: 'rgba(255,165,2,0.06)',
                borderRadius: '12px',
                border: '1px solid rgba(255,165,2,0.15)',
                color: '#2d3436',
                fontFamily: 'var(--font-inter)',
              }}
            >
              Una experiencia única: raspado de <strong>plátano fresco</strong> bañado en{' '}
              <strong>jarabe artesanal</strong>, espolvoreado con <strong>canela</strong> y
              coronado con <strong>doble leche</strong> condensada. ¡El favorito de la casa!
            </p>

            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Cantidad
              </Label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidadGlorias(Math.max(1, cantidadGlorias - 1))}
                  disabled={cantidadGlorias <= 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #ffa502',
                    color: '#ffa502',
                    backgroundColor: cantidadGlorias <= 1 ? '#f1f2f6' : '#fff',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  −
                </button>
                <span
                  className="text-xl font-bold w-8 text-center"
                  style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}
                >
                  {cantidadGlorias}
                </span>
                <button
                  onClick={() => setCantidadGlorias(cantidadGlorias + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #ffa502',
                    color: '#ffffff',
                    backgroundColor: '#ffa502',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <span
                className="text-base font-bold px-3 py-1"
                style={{
                  color: '#ffa502',
                  backgroundColor: 'rgba(255,165,2,0.08)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-fredoka)',
                }}
              >
                Subtotal: ${totalGlorias}
              </span>
            </div>
          </div>
        </div>

        {/* ---- El Diablito ---- */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #d63031',
          }}
        >
          {/* Photo */}
          <div className="relative w-full h-52 bg-white">
            <Image
              src="/el-diablito.png"
              alt="El Diablito"
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
            />
            <div
              className="absolute top-3 right-3 px-3 py-1 text-white font-bold text-lg shadow-lg"
              style={{
                backgroundColor: '#d63031',
                borderRadius: '50px',
                fontFamily: 'var(--font-fredoka)',
              }}
            >
              ${PRECIOS.elDiablito}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}
              >
                🌶️ El Diablito
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                Para los amantes del picante
              </p>
            </div>

            <p
              className="text-sm leading-relaxed p-3"
              style={{
                backgroundColor: 'rgba(214,48,49,0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(214,48,49,0.12)',
                color: '#2d3436',
                fontFamily: 'var(--font-inter)',
              }}
            >
              El raspado más atrevido: elige tu base de <strong>Tamarindo</strong> o{' '}
              <strong>Nanche</strong>, y lo cargamos con <strong>chamoy</strong>,{' '}
              <strong>salsa</strong> y un generoso toque de <strong>Tajín</strong>. ¡Pica pero
              sabe rico!
            </p>

            {/* Base selector */}
            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Base
              </Label>
              <Select value={baseDiablito} onValueChange={setBaseDiablito}>
                <SelectTrigger
                  className="w-full h-10"
                  style={{
                    borderRadius: '12px',
                    borderColor: '#ddd',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  <SelectValue placeholder="Elige tu base..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tamarindo">Tamarindo 🍋</SelectItem>
                  <SelectItem value="Nanche">Nanche 🟡</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Cantidad
              </Label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidadDiablito(Math.max(1, cantidadDiablito - 1))}
                  disabled={cantidadDiablito <= 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #d63031',
                    color: '#d63031',
                    backgroundColor: cantidadDiablito <= 1 ? '#f1f2f6' : '#fff',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  −
                </button>
                <span
                  className="text-xl font-bold w-8 text-center"
                  style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}
                >
                  {cantidadDiablito}
                </span>
                <button
                  onClick={() => setCantidadDiablito(cantidadDiablito + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #d63031',
                    color: '#ffffff',
                    backgroundColor: '#d63031',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {baseDiablito && (
              <div className="flex justify-end">
                <span
                  className="text-base font-bold px-3 py-1"
                  style={{
                    color: '#d63031',
                    backgroundColor: 'rgba(214,48,49,0.08)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  Subtotal: ${totalDiablito}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ---- Botanas y Antojos ---- */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #ffa502',
          }}
        >
          {/* Photo */}
          <div className="relative w-full h-52 bg-white">
            <Image
              src="/botanas.png"
              alt="Botanas y Antojos"
              fill
              className="object-cover"
              style={{ objectPosition: 'center' }}
            />
            <div
              className="absolute top-3 right-3 px-3 py-1 text-white font-bold text-lg shadow-lg"
              style={{
                backgroundColor: '#ffa502',
                borderRadius: '50px',
                fontFamily: 'var(--font-fredoka)',
              }}
            >
              ${PRECIOS.botanas}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: '#ffa502', fontFamily: 'var(--font-fredoka)' }}
              >
                🍿 Botanas y Antojos
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                Para acompañar tu raspado
              </p>
            </div>

            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Elige tu botana
              </Label>
              <Select value={botanaSeleccionada} onValueChange={setBotanaSeleccionada}>
                <SelectTrigger
                  className="w-full h-10"
                  style={{
                    borderRadius: '12px',
                    borderColor: '#ddd',
                    fontFamily: 'var(--font-inter)',
                  }}
                >
                  <SelectValue placeholder="Selecciona una botana..." />
                </SelectTrigger>
                <SelectContent>
                  {BOTANAS_DISPONIBLES.map((botana) => (
                    <SelectItem key={botana} value={botana}>
                      {botana}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Cantidad
              </Label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidadBotana(Math.max(1, cantidadBotana - 1))}
                  disabled={cantidadBotana <= 1}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #ffa502',
                    color: '#ffa502',
                    backgroundColor: cantidadBotana <= 1 ? '#f1f2f6' : '#fff',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  −
                </button>
                <span
                  className="text-xl font-bold w-8 text-center"
                  style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}
                >
                  {cantidadBotana}
                </span>
                <button
                  onClick={() => setCantidadBotana(cantidadBotana + 1)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold transition-all"
                  style={{
                    border: '2px solid #ffa502',
                    color: '#ffffff',
                    backgroundColor: '#ffa502',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {botanaSeleccionada && (
              <div className="flex justify-end">
                <span
                  className="text-base font-bold px-3 py-1"
                  style={{
                    color: '#ffa502',
                    backgroundColor: 'rgba(255,165,2,0.08)',
                    borderRadius: '8px',
                    fontFamily: 'var(--font-fredoka)',
                  }}
                >
                  Subtotal: ${totalBotana}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ============================== */}
        {/* CONFIGURACIÓN DE ENTREGA       */}
        {/* ============================== */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #d63031',
          }}
        >
          <div className="p-5 space-y-4">
            <h2
              className="text-xl font-bold"
              style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}
            >
              🚚 Tipo de Entrega
            </h2>

            {/* Toggle - glassmorphism */}
            <div
              className="flex items-center justify-between gap-4 p-4"
              style={{
                backgroundColor: 'rgba(214,48,49,0.04)',
                borderRadius: '14px',
                border: '1px solid rgba(214,48,49,0.12)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex-1">
                <p
                  className="font-semibold text-sm"
                  style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
                >
                  Pasar a recoger
                </p>
                <p className="text-xs" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                  Recoge tu pedido en el local
                </p>
              </div>
              <Switch
                checked={esDomicilio}
                onCheckedChange={setEsDomicilio}
                className="data-[state=checked]:bg-[#d63031]"
              />
              <div className="flex-1 text-right">
                <p
                  className="font-semibold text-sm"
                  style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
                >
                  A domicilio
                </p>
                <p className="text-xs" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
                  🛵 Te lo llevamos
                </p>
              </div>
            </div>

            {/* Campos de dirección (solo si es domicilio) */}
            {esDomicilio && (
              <div
                className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 p-4"
                style={{
                  backgroundColor: 'rgba(214,48,49,0.03)',
                  borderRadius: '14px',
                  border: '1px dashed rgba(214,48,49,0.2)',
                }}
              >
                <div className="space-y-1.5">
                  <Label
                    htmlFor="direccion"
                    className="font-semibold text-sm"
                    style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
                  >
                    📍 Dirección Completa
                  </Label>
                  <Input
                    id="direccion"
                    placeholder="Calle, Número y Colonia..."
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      borderColor: '#ddd',
                      fontFamily: 'var(--font-inter)',
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="referencias"
                    className="font-semibold text-sm"
                    style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
                  >
                    🔍 Referencias para el repartidor
                  </Label>
                  <Textarea
                    id="referencias"
                    placeholder="Ej: Casa azul con reja blanca, frente al abarrotes..."
                    value={referencias}
                    onChange={(e) => setReferencias(e.target.value)}
                    className="min-h-[80px]"
                    style={{
                      borderRadius: '12px',
                      borderColor: '#ddd',
                      fontFamily: 'var(--font-inter)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================== */}
        {/* CONTROL DE CAMBIO              */}
        {/* ============================== */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #ffa502',
          }}
        >
          <div className="p-5 space-y-3">
            <h2
              className="text-xl font-bold"
              style={{ color: '#ffa502', fontFamily: 'var(--font-fredoka)' }}
            >
              💵 Control de Cambio
            </h2>
            <p className="text-sm" style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}>
              Indica con cuánto vas a pagar para que llevemos el cambio exacto
            </p>
            <div className="space-y-1.5">
              <Label
                htmlFor="pago"
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Pago con...
              </Label>
              <Input
                id="pago"
                placeholder="Ej: Billete de $200, $500, etc."
                value={pagoCon}
                onChange={(e) => setPagoCon(e.target.value)}
                style={{
                  borderRadius: '12px',
                  borderColor: '#ddd',
                  fontFamily: 'var(--font-inter)',
                }}
              />
            </div>
          </div>
        </div>

        {/* ============================== */}
        {/* UBICACIÓN                      */}
        {/* ============================== */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #d63031',
          }}
        >
          <div className="p-5 space-y-4">
            <h2
              className="text-xl font-bold"
              style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}
            >
              📍 Ubicación
            </h2>

            <div
              className="p-4"
              style={{
                backgroundColor: 'rgba(214,48,49,0.04)',
                borderRadius: '14px',
                border: '1px solid rgba(214,48,49,0.1)',
              }}
            >
              <p
                className="font-semibold text-sm"
                style={{ color: '#2d3436', fontFamily: 'var(--font-inter)' }}
              >
                Dirección del negocio:
              </p>
              <p
                className="text-base mt-1 font-medium"
                style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}
              >
                Calle Primera Cerrada de Las Salinas #7
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: '#636e72', fontFamily: 'var(--font-inter)' }}
              >
                Junto al campo de fútbol
              </p>
            </div>

            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              <button
                className="w-full py-3 px-6 flex items-center justify-center gap-2 text-white text-sm font-bold transition-all"
                style={{
                  backgroundColor: '#d63031',
                  borderRadius: '14px',
                  fontFamily: 'var(--font-inter)',
                  boxShadow: '0 4px 14px rgba(214,48,49,0.3)',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Ver en Google Maps
              </button>
            </a>
          </div>
        </div>

        {/* ============================== */}
        {/* RESUMEN Y ENVÍO WHATSAPP       */}
        {/* ============================== */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(241,242,246,0.95))',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '2px solid #d63031',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <div className="p-5 space-y-4">
            <h2
              className="text-2xl font-bold text-center"
              style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}
            >
              🧾 Resumen del Pedido
            </h2>

            {/* Detalle */}
            <div className="space-y-2 text-sm" style={{ fontFamily: 'var(--font-inter)' }}>
              {saborClasico && (
                <div className="flex justify-between items-center">
                  <span style={{ color: '#2d3436' }}>
                    {cantidadClasico}x Raspado Clásico ({saborClasico})
                    {extrasClasico.length > 0 &&
                      ` + ${extrasClasico
                        .map((id) => EXTRAS_DISPONIBLES.find((e) => e.id === id)?.label)
                        .join(', ')}`}
                  </span>
                  <span className="font-bold" style={{ color: '#d63031' }}>${totalClasico}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span style={{ color: '#2d3436' }}>{cantidadGlorias}x Las Glorias</span>
                <span className="font-bold" style={{ color: '#ffa502' }}>${totalGlorias}</span>
              </div>
              {baseDiablito && (
                <div className="flex justify-between items-center">
                  <span style={{ color: '#2d3436' }}>{cantidadDiablito}x El Diablito ({baseDiablito})</span>
                  <span className="font-bold" style={{ color: '#d63031' }}>${totalDiablito}</span>
                </div>
              )}
              {botanaSeleccionada && (
                <div className="flex justify-between items-center">
                  <span style={{ color: '#2d3436' }}>{cantidadBotana}x Botana ({botanaSeleccionada})</span>
                  <span className="font-bold" style={{ color: '#ffa502' }}>${totalBotana}</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', backgroundColor: 'rgba(214,48,49,0.15)' }} />

            {/* Total */}
            <div className="flex justify-between items-center">
              <span
                className="text-lg font-extrabold"
                style={{ color: '#2d3436', fontFamily: 'var(--font-fredoka)' }}
              >
                Total
              </span>
              <span
                className="text-2xl font-extrabold"
                style={{ color: '#d63031', fontFamily: 'var(--font-fredoka)' }}
              >
                ${totalGeneral}
              </span>
            </div>

            {/* Info badges */}
            {esDomicilio && direccion && (
              <div
                className="text-xs p-2.5"
                style={{
                  color: '#636e72',
                  backgroundColor: 'rgba(214,48,49,0.04)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                🛵 Entrega a: {direccion}
                {referencias && <span> — {referencias}</span>}
              </div>
            )}
            {!esDomicilio && (
              <div
                className="text-xs p-2.5"
                style={{
                  color: '#636e72',
                  backgroundColor: 'rgba(255,165,2,0.06)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                🏪 Pasar a recoger al local
              </div>
            )}
            {pagoCon && (
              <div
                className="text-xs p-2.5"
                style={{
                  color: '#636e72',
                  backgroundColor: 'rgba(255,165,2,0.06)',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-inter)',
                }}
              >
                💵 Paga con: {pagoCon}
              </div>
            )}

            {/* WhatsApp button - VERDE BRILLANTE */}
            <button
              onClick={enviarWhatsApp}
              className="w-full py-5 px-6 flex items-center justify-center gap-3 text-white text-lg font-bold transition-all active:scale-[0.98]"
              style={{
                backgroundColor: '#25D366',
                borderRadius: '16px',
                fontFamily: 'var(--font-fredoka)',
                boxShadow: '0 6px 24px rgba(37,211,102,0.4)',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Pedir por WhatsApp
            </button>
          </div>
        </div>
      </main>

      {/* ============================== */}
      {/* FOOTER                         */}
      {/* ============================== */}
      <footer
        className="py-6 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #d63031, #e74c3c 40%, #ffa502)',
          color: '#ffffff',
        }}
      >
        <p
          className="font-bold text-lg"
          style={{ fontFamily: 'var(--font-fredoka)' }}
        >
          Raspados Didxsay
        </p>
        <p
          className="text-sm mt-1"
          style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-inter)' }}
        >
          Calle Primera Cerrada de Las Salinas #7
        </p>
        <p
          className="text-xs mt-2"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-inter)' }}
        >
          Hecho con ❤️ en Oaxaca
        </p>
      </footer>
    </div>
  )
}
