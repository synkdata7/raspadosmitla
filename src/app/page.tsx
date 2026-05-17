'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
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
const BOTANAS_DISPONIBLES = [
  'Papas',
  'Chicharrones',
  'Hojuelas',
  'Cacahuates',
]

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 via-white to-yellow-50">
      {/* ============================== */}
      {/* HERO BANNER                    */}
      {/* ============================== */}
      <header className="relative w-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-16 -right-16 w-52 h-52 bg-yellow-300/20 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col items-center justify-center px-4 py-8 gap-4">
          {/* Logo */}
          <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
            <Image
              src="/logo.png"
              alt="Raspados Didxsay"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center drop-shadow-lg">
            Raspados Didxsay
          </h1>
          <p className="text-base md:text-lg font-medium text-white/90 text-center max-w-md">
            Raspados artesanales con los sabores más frescos de Oaxaca
          </p>

          {/* Badge domicilio */}
          <div className="mt-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full flex items-center gap-2 animate-pulse shadow-lg border border-white/30">
            <span className="text-xl">🛵</span>
            <span className="font-bold text-sm md:text-base tracking-wide">
              ¡Servicio a domicilio disponible!
            </span>
            <span className="text-xl">🛵</span>
          </div>
        </div>
      </header>

      {/* ============================== */}
      {/* CONTENIDO PRINCIPAL            */}
      {/* ============================== */}
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* ---- Raspados Clásicos ---- */}
        <Card className="overflow-hidden border-2 border-orange-200 shadow-lg">
          <div className="relative w-full h-48 bg-orange-100">
            <Image
              src="/raspado-clasico.png"
              alt="Raspado Clásico"
              fill
              className="object-cover"
            />
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-base font-bold shadow-md">
              ${PRECIOS.raspadoClasico}
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-orange-700">Raspados Clásicos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Elige tu sabor favorito entre nuestra gran variedad
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sabor selector */}
            <div className="space-y-2">
              <Label className="font-semibold">Sabor</Label>
              <Select value={saborClasico} onValueChange={setSaborClasico}>
                <SelectTrigger className="w-full">
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
            <div className="space-y-2">
              <Label className="font-semibold">Cantidad</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadClasico(Math.max(1, cantidadClasico - 1))}
                  disabled={cantidadClasico <= 1}
                >
                  −
                </Button>
                <span className="text-lg font-bold w-8 text-center">{cantidadClasico}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadClasico(cantidadClasico + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Extras checkboxes */}
            <div className="space-y-2">
              <Label className="font-semibold">Acompañamientos extra</Label>
              <div className="grid grid-cols-2 gap-2">
                {EXTRAS_DISPONIBLES.map((extra) => (
                  <label
                    key={extra.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                      extrasClasico.includes(extra.id)
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-orange-200'
                    }`}
                  >
                    <Checkbox
                      checked={extrasClasico.includes(extra.id)}
                      onCheckedChange={() => toggleExtra(extra.id)}
                    />
                    <span className="text-sm font-medium">{extra.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {saborClasico && (
              <div className="flex justify-end pt-1">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  Subtotal: ${totalClasico}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---- Las Glorias ---- */}
        <Card className="overflow-hidden border-2 border-yellow-300 shadow-lg">
          <div className="relative w-full h-48 bg-yellow-50">
            <Image
              src="/las-glorias.png"
              alt="Las Glorias"
              fill
              className="object-cover"
            />
            <Badge className="absolute top-3 right-3 bg-yellow-500 text-white text-base font-bold shadow-md">
              ${PRECIOS.lasGlorias}
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-yellow-700">🌟 Las Glorias</CardTitle>
            <p className="text-sm text-muted-foreground">Raspado gourmet premium</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              Una experiencia única: raspado de <strong>plátano fresco</strong> bañado en{' '}
              <strong>jarabe artesanal</strong>, espolvoreado con <strong>canela</strong> y
              coronado con <strong>doble leche</strong> condensada. ¡El favorito de la casa!
            </p>
            <div className="space-y-2">
              <Label className="font-semibold">Cantidad</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadGlorias(Math.max(1, cantidadGlorias - 1))}
                  disabled={cantidadGlorias <= 1}
                >
                  −
                </Button>
                <span className="text-lg font-bold w-8 text-center">{cantidadGlorias}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadGlorias(cantidadGlorias + 1)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Badge variant="secondary" className="text-base px-3 py-1">
                Subtotal: ${totalGlorias}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* ---- El Diablito ---- */}
        <Card className="overflow-hidden border-2 border-red-300 shadow-lg">
          <div className="relative w-full h-48 bg-red-50">
            <Image
              src="/el-diablito.png"
              alt="El Diablito"
              fill
              className="object-cover"
            />
            <Badge className="absolute top-3 right-3 bg-red-500 text-white text-base font-bold shadow-md">
              ${PRECIOS.elDiablito}
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-red-700">🌶️ El Diablito</CardTitle>
            <p className="text-sm text-muted-foreground">Para los amantes del picante</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed bg-red-50 rounded-lg p-3 border border-red-200">
              El raspado más atrevido: elige tu base de <strong>Tamarindo</strong> o{' '}
              <strong>Nanche</strong>, y lo cargamos con <strong>chamoy</strong>,{' '}
              <strong>salsa</strong> y un generoso toque de <strong>Tajín</strong>. ¡Pica pero
              sabe rico!
            </p>

            {/* Base selector */}
            <div className="space-y-2">
              <Label className="font-semibold">Base</Label>
              <Select value={baseDiablito} onValueChange={setBaseDiablito}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Elige tu base..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tamarindo">Tamarindo</SelectItem>
                  <SelectItem value="Nanche">Nanche</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cantidad */}
            <div className="space-y-2">
              <Label className="font-semibold">Cantidad</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadDiablito(Math.max(1, cantidadDiablito - 1))}
                  disabled={cantidadDiablito <= 1}
                >
                  −
                </Button>
                <span className="text-lg font-bold w-8 text-center">{cantidadDiablito}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadDiablito(cantidadDiablito + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {baseDiablito && (
              <div className="flex justify-end pt-1">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  Subtotal: ${totalDiablito}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---- Botanas y Antojos ---- */}
        <Card className="overflow-hidden border-2 border-green-300 shadow-lg">
          <div className="relative w-full h-48 bg-green-50">
            <Image
              src="/botanas.png"
              alt="Botanas y Antojos"
              fill
              className="object-cover"
            />
            <Badge className="absolute top-3 right-3 bg-green-600 text-white text-base font-bold shadow-md">
              ${PRECIOS.botanas}
            </Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-green-700">🍿 Botanas y Antojos</CardTitle>
            <p className="text-sm text-muted-foreground">Para acompañar tu raspado</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label className="font-semibold">Elige tu botana</Label>
              <Select value={botanaSeleccionada} onValueChange={setBotanaSeleccionada}>
                <SelectTrigger className="w-full">
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

            <div className="space-y-2">
              <Label className="font-semibold">Cantidad</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadBotana(Math.max(1, cantidadBotana - 1))}
                  disabled={cantidadBotana <= 1}
                >
                  −
                </Button>
                <span className="text-lg font-bold w-8 text-center">{cantidadBotana}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCantidadBotana(cantidadBotana + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {botanaSeleccionada && (
              <div className="flex justify-end pt-1">
                <Badge variant="secondary" className="text-base px-3 py-1">
                  Subtotal: ${totalBotana}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Separator className="my-2" />

        {/* ============================== */}
        {/* CONFIGURACIÓN DE ENTREGA       */}
        {/* ============================== */}
        <Card className="border-2 border-purple-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-purple-700">🚚 Tipo de Entrega</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Toggle */}
            <div className="flex items-center justify-between gap-4 bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex-1">
                <p className="font-semibold text-sm">Pasar a recoger</p>
                <p className="text-xs text-muted-foreground">Recoge tu pedido en el local</p>
              </div>
              <Switch
                checked={esDomicilio}
                onCheckedChange={setEsDomicilio}
                className="data-[state=checked]:bg-purple-600"
              />
              <div className="flex-1 text-right">
                <p className="font-semibold text-sm">A domicilio</p>
                <p className="text-xs text-muted-foreground">🛵 Te lo llevamos</p>
              </div>
            </div>

            {/* Campos de dirección (solo si es domicilio) */}
            {esDomicilio && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="direccion" className="font-semibold">
                    📍 Dirección Completa
                  </Label>
                  <Input
                    id="direccion"
                    placeholder="Calle, Número y Colonia..."
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="border-purple-200 focus:border-purple-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referencias" className="font-semibold">
                    🔍 Referencias para el repartidor
                  </Label>
                  <Textarea
                    id="referencias"
                    placeholder="Ej: Casa azul con reja blanca, frente al abarrotes..."
                    value={referencias}
                    onChange={(e) => setReferencias(e.target.value)}
                    className="border-purple-200 focus:border-purple-400 min-h-[80px]"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ============================== */}
        {/* CONTROL DE CAMBIO              */}
        {/* ============================== */}
        <Card className="border-2 border-emerald-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-emerald-700">💵 Control de Cambio</CardTitle>
            <p className="text-sm text-muted-foreground">
              Indica con cuánto vas a pagar para que llevemos el cambio exacto
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="pago" className="font-semibold">
                Pago con...
              </Label>
              <Input
                id="pago"
                placeholder="Ej: Billete de $200, $500, etc."
                value={pagoCon}
                onChange={(e) => setPagoCon(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
              />
            </div>
          </CardContent>
        </Card>

        <Separator className="my-2" />

        {/* ============================== */}
        {/* UBIQUICACIÓN                   */}
        {/* ============================== */}
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-blue-700">📍 Ubicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="font-semibold text-sm">Dirección del negocio:</p>
              <p className="text-base mt-1">Calle Primera Cerrada de Las Salinas #7</p>
              <p className="text-sm text-muted-foreground mt-1">
                Junto al campo de fútbol
              </p>
            </div>
            <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2" size="lg">
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
              </Button>
            </a>
          </CardContent>
        </Card>

        <Separator className="my-2" />

        {/* ============================== */}
        {/* RESUMEN Y ENVÍO                */}
        {/* ============================== */}
        <Card className="border-2 border-orange-300 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl text-orange-700 text-center">
              🧾 Resumen del Pedido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Detalle */}
            <div className="space-y-2 text-sm">
              {saborClasico && (
                <div className="flex justify-between items-center">
                  <span>
                    {cantidadClasico}x Raspado Clásico ({saborClasico})
                    {extrasClasico.length > 0 &&
                      ` + ${extrasClasico
                        .map((id) => EXTRAS_DISPONIBLES.find((e) => e.id === id)?.label)
                        .join(', ')}`}
                  </span>
                  <span className="font-bold">${totalClasico}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>{cantidadGlorias}x Las Glorias</span>
                <span className="font-bold">${totalGlorias}</span>
              </div>
              {baseDiablito && (
                <div className="flex justify-between items-center">
                  <span>{cantidadDiablito}x El Diablito ({baseDiablito})</span>
                  <span className="font-bold">${totalDiablito}</span>
                </div>
              )}
              {botanaSeleccionada && (
                <div className="flex justify-between items-center">
                  <span>{cantidadBotana}x Botana ({botanaSeleccionada})</span>
                  <span className="font-bold">${totalBotana}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-center text-lg font-extrabold">
              <span>Total</span>
              <span className="text-orange-600">${totalGeneral}</span>
            </div>

            {esDomicilio && direccion && (
              <div className="text-xs text-muted-foreground bg-purple-50 rounded p-2">
                🛵 Entrega a: {direccion}
                {referencias && <span> — {referencias}</span>}
              </div>
            )}
            {!esDomicilio && (
              <div className="text-xs text-muted-foreground bg-green-50 rounded p-2">
                🏪 Pasar a recoger al local
              </div>
            )}
            {pagoCon && (
              <div className="text-xs text-muted-foreground bg-emerald-50 rounded p-2">
                💵 Paga con: {pagoCon}
              </div>
            )}

            <Button
              onClick={enviarWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-lg font-bold py-6 gap-2 shadow-lg"
              size="lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Enviar Pedido por WhatsApp
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* ============================== */}
      {/* FOOTER                         */}
      {/* ============================== */}
      <footer className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 text-white py-6 px-4 text-center">
        <p className="font-bold text-lg">Raspados Didxsay</p>
        <p className="text-sm text-white/80 mt-1">
          Calle Primera Cerrada de Las Salinas #7
        </p>
        <p className="text-xs text-white/60 mt-2">
          Hecho con ❤️ en Oaxaca
        </p>
      </footer>
    </div>
  )
}
