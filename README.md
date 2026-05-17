# 🧊 Raspados Didxsay

Landing page móvil-first para el negocio de raspados artesanales **Raspados Didxsay**, ubicado en San Pablo Villa de Mitla, Oaxaca. Incluye catálogo de sabores, configuración de pedido, integración con WhatsApp y Google Maps.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## 📋 Contenido

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos previos](#-requisitos-previos)
- [Instalación local](#-instalación-local)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Personalización](#-personalización)
- [Despliegue en producción](#-despliegue-en-producción)
  - [Opción 1: Vercel (Recomendado)](#opción-1-vercel-recomendado)
  - [Opción 2: Servidor propio (VPS)](#opción-2-servidor-propio-vps)
  - [Opción 3: Railway / Render](#opción-3-railway--render)
- [Licencia](#-licencia)

---

## ✨ Características

- **Hero banner** con logo grande, nombre del negocio y badge de servicio a domicilio
- **Catálogo de sabores** con fichas individuales por cada sabor:
  - ⭐ **Especiales**: El Diablito y Las Glorias (tarjetas grandes, primero en la lista)
  - 🍧 **Sabores clásicos**: Tamarindo, Nanche, Limón, Chicle, Durazno, Fresa, Cachino
  - ☀️ **Temporada**: Vainilla y Piña (solo en calor)
- **Selector de base** para El Diablito (Tamarindo, Nanche o Durazno)
- **Extras configurables**: Chamoy, Salsa Botanera, Tajín, Lechera
- **Sección de Botanas**: Papas, Chicharrones, Hojuelas, Cacahuates
- **Toggle de entrega**: Recoger en local o envío a domicilio con campos de dirección y referencias
- **Control de cambio**: Campo para indicar con cuánto se paga
- **Ubicación**: Link a Google Maps (Campo de Fútbol, San Pablo Villa de Mitla)
- **Pedido por WhatsApp**: Genera mensaje formateado y abre WhatsApp al número configurado
- **Precios editables**: Cambia los precios en un solo lugar y se actualizan en toda la página
- **Diseño mobile-first** con paleta de colores Rojo Chamoy, Amarillo Mango, Blanco Hielo y Verde WhatsApp

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 16 | Framework React con App Router |
| React | 19 | Interfaz de usuario |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Estilos utility-first |
| shadcn/ui | — | Componentes UI (Switch, Checkbox, Input, etc.) |
| Google Fonts | — | Fredoka (títulos) + Inter (cuerpo) |

---

## 📦 Requisitos previos

- **Node.js** 18.17 o superior (se recomienda 20+)
- **Bun** (gestor de paquetes) o **npm**
- **Git** para control de versiones

---

## 🚀 Instalación local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU-USUARIO/raspados-didxsay.git
cd raspados-didxsay

# 2. Instalar dependencias
bun install

# 3. Iniciar en modo desarrollo
bun run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 📁 Estructura del proyecto

```
raspados-didxsay/
├── public/                     # Archivos estáticos
│   ├── logo.png               # Logo del negocio
│   ├── logo.svg               # Logo en SVG
│   ├── raspado-tamarindo.png  # Fotos de sabores
│   ├── raspado-nanche.png
│   ├── raspado-limon.png
│   ├── raspado-chicle.png
│   ├── raspado-durazno.png
│   ├── raspado-fresa.png
│   ├── raspado-cachino.png
│   ├── el-diablito.png
│   ├── las-glorias.png
│   ├── raspado-vainilla.png
│   ├── raspado-pina.png
│   └── botanas.png
├── src/
│   ├── app/
│   │   ├── page.tsx           # Página principal (toda la lógica)
│   │   ├── layout.tsx         # Layout raíz (fuentes, metadata)
│   │   ├── globals.css        # Estilos globales y Tailwind
│   │   └── api/               # API routes
│   ├── components/ui/         # Componentes shadcn/ui
│   └── hooks/                 # Custom hooks
├── Caddyfile                   # Configuración de Caddy (producción)
├── next.config.ts              # Configuración de Next.js
├── package.json
└── README.md
```

---

## ⚙️ Personalización

### Cambiar precios

Edita el objeto `PRECIOS` al inicio de `src/app/page.tsx`:

```typescript
const PRECIOS = {
  raspadoClasico: 25,   // Precio de sabores clásicos
  lasGlorias: 27,       // Precio de Las Glorias
  elDiablito: 27,       // Precio de El Diablito
  botanas: 12,          // Precio de botanas
} as const
```

### Cambiar número de WhatsApp

Edita la constante `WHATSAPP_NUMBER`:

```typescript
const WHATSAPP_NUMBER = '9512645961'  // Tu número de WhatsApp
```

### Cambiar ubicación

Edita la constante `GOOGLE_MAPS_URL`:

```typescript
const GOOGLE_MAPS_URL =
  'https://www.google.com/maps/search/Campo+de+Futbol+San+Pablo+Villa+de+Mitla+Oaxaca'
```

### Agregar o modificar sabores

Edita el arreglo `SABORES` en `src/app/page.tsx`. Cada sabor tiene esta estructura:

```typescript
{
  id: 'tamarindo',           // Identificador único (sin espacios)
  nombre: 'Tamarindo',       // Nombre visible
  emoji: '🟤',               // Emoji decorativo
  imagen: '/raspado-tamarindo.png',  // Ruta de la imagen en /public
  precio: PRECIOS.raspadoClasico,    // Precio (referencia a PRECIOS)
  descripcion: 'El clásico...',      // Descripción corta
  color: '#8B4513',                  // Color del tema de la tarjeta
  esEspecial?: true,                 // Opcional: marca como especial
  esTemporada?: true,                // Opcional: marca como temporada
  bases?: ['Tamarindo', 'Nanche'],   // Opcional: selector de base
}
```

### Cambiar logo

Reemplaza el archivo `public/logo.png` con tu nuevo logo. Se recomienda una imagen cuadrada de al menos 512x512px con fondo transparente o blanco.

### Cambiar imágenes de sabores

Reemplaza los archivos PNG en `public/` con el mismo nombre. Se recomiendan imágenes de 400x400px mínimo con fondo blanco o transparente.

---

## 🌍 Despliegue en producción

### Opción 1: Vercel (Recomendado)

La forma más fácil y gratuita de publicar tu landing page.

**Paso 1: Subir el código a GitHub**

```bash
cd /home/z/my-project
git init
git add .
git commit -m "Raspados Didxsay - landing page"
```

Ve a [github.com/new](https://github.com/new) y crea un repositorio llamado `raspados-didxsay`, luego:

```bash
git remote add origin https://github.com/TU-USUARIO/raspados-didxsay.git
git branch -M main
git push -u origin main
```

**Paso 2: Conectar con Vercel**

1. Ve a [vercel.com](https://vercel.com) y regístrate con tu cuenta de GitHub
2. Haz clic en **"Add New" > "Project"**
3. Selecciona el repositorio `raspados-didxsay`
4. Deja la configuración por defecto (Next.js se detecta automáticamente)
5. Haz clic en **"Deploy"**
6. Espera 1-2 minutos y listo

**Paso 3: Obtener tu URL**

Vercel te asigna una URL como: `raspados-didxsay.vercel.app`

**Paso 4 (Opcional): Conectar dominio personalizado**

1. En el dashboard de Vercel, ve a **Settings > Domains**
2. Agrega tu dominio (ej: `raspadosdidxsay.com`)
3. En tu proveedor de dominios, apunta los DNS:
   - Tipo: `CNAME`
   - Nombre: `www`
   - Valor: `cname.vercel-dns.com`
   - Tipo: `A`
   - Nombre: `@`
   - Valor: `76.76.21.21`

**Ventajas de Vercel:**
- Plan gratuito suficiente para tu landing
- SSL/HTTPS automático
- CDN global (carga rápido desde cualquier lugar)
- Auto-deploy: cada `git push` publica los cambios automáticamente
- Dominio personalizado sin costo extra

---

### Opción 2: Servidor propio (VPS)

Si prefieres tener control total con tu propio servidor (DigitalOcean, Hostinger, AWS, etc.).

**Paso 1: Preparar el servidor**

```bash
# Instalar Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Bun
curl -fsSL https://bun.sh/install | bash

# Instalar Caddy (proxy reverso con SSL automático)
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

**Paso 2: Subir el código al servidor**

```bash
# Desde tu máquina local
scp -r /home/z/my-project/* usuario@TU-SERVIDOR:/var/www/raspados-didxsay/

# O clonar desde GitHub
ssh usuario@TU-SERVIDOR
cd /var/www
git clone https://github.com/TU-USUARIO/raspados-didxsay.git
cd raspados-didxsay
```

**Paso 3: Construir y ejecutar**

```bash
bun install
bun run build

# Ejecutar en background con systemd o pm2
# Opción A: Con pm2
npm install -g pm2
pm2 start bun --name "raspados" -- run start
pm2 save
pm2 startup

# Opción B: Con systemd (crear archivo /etc/systemd/system/raspados.service)
```

**Paso 4: Configurar Caddy**

Edita `/etc/caddy/Caddyfile`:

```
raspadosdidxsay.com {
    reverse_proxy localhost:3000 {
        header_up Host {host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
        header_up X-Real-IP {remote_host}
    }
}
```

```bash
sudo systemctl reload caddy
```

Caddy generará automáticamente el certificado SSL y tu sitio estará en `https://raspadosdidxsay.com`.

---

### Opción 3: Railway / Render

Alternativas similares a Vercel con deploy desde GitHub.

**Railway:**
1. Ve a [railway.app](https://railway.app) y regístrate con GitHub
2. Clic en **"New Project" > "Deploy from GitHub repo"**
3. Selecciona tu repositorio
4. Railway detecta Next.js y despliega automáticamente
5. Te asigna una URL como `raspados-didxsay.up.railway.app`

**Render:**
1. Ve a [render.com](https://render.com) y regístrate con GitHub
2. Clic en **"New" > "Web Service"**
3. Conecta tu repositorio
4. Configura:
   - Build Command: `bun install && bun run build`
   - Start Command: `bun run start`
5. Clic en **"Create Web Service"**

---

## 🔄 Actualizar la página (después de cambios)

Si usas **Vercel**, simplemente haz push a GitHub y se publica automáticamente:

```bash
git add .
git commit -m "Actualizar precios o sabores"
git push
```

Si usas **servidor propio**, reconstruye después de cada cambio:

```bash
cd /var/www/raspados-didxsay
git pull
bun install
bun run build
pm2 restart raspados
```

---

## 📞 Soporte

Desarrollado por **Synkdata** para Raspados Didxsay.

Para cualquier cambio o problema, contacta al desarrollador.

---

*Powered by Synkdata*
