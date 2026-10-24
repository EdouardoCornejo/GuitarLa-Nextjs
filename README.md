# GuitarLA — Frontend (Next.js)

Frontend de **GuitarLA**, una **tienda de guitarras con blog y carrito de compras**, hecho con **Next.js 13** (Pages Router) y **React 18**. Consume la API REST del backend en **Strapi** (repositorio `GuitarLa-Strapi`) para mostrar guitarras, entradas del blog y un curso destacado, combinando **generación estática (SSG)** y **renderizado en servidor (SSR)**. El carrito se guarda en **localStorage**.

![Tech](https://img.shields.io/badge/Next.js-13.0.2-black)
![Tech](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Tech](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![Tech](https://img.shields.io/badge/CSS-Modules-1572B6)
![Tech](https://img.shields.io/badge/Backend-Strapi-4945FF)

---

## Tabla de contenidos

- [GuitarLA — Frontend (Next.js)](#guitarla--frontend-nextjs)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos previos](#requisitos-previos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
    - [Scripts disponibles](#scripts-disponibles)
  - [Páginas](#páginas)
  - [Cómo funciona](#cómo-funciona)
    - [1. `pages/_app.js` — estado del carrito](#1-pages_appjs--estado-del-carrito)
    - [2. Obtención de datos](#2-obtención-de-datos)
    - [3. `components/`](#3-components)
    - [4. `pages/_document.js` y estilos](#4-pages_documentjs-y-estilos)
    - [Flujo de la app](#flujo-de-la-app)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Configuración](#configuración)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **Inicio** con la colección de guitarras, el curso destacado (con su imagen de fondo) y las entradas del blog.
- **Tienda** con todas las guitarras y **página de detalle** por guitarra (`/guitarras/[url]`).
- **Blog** con listado de posts y **página de cada post** (`/blog/[url]`) con fecha de publicación formateada en español.
- **Carrito de compras**:
  - agregar una guitarra eligiendo cantidad (1–5) desde su detalle;
  - si ya estaba en el carrito, se actualiza la cantidad;
  - cambiar la cantidad o eliminar productos desde `/carrito`;
  - subtotal por producto y total a pagar;
  - persistencia en `localStorage` (clave `carrito`).
- **Navegación** con enlace activo resaltado según la ruta (`useRouter`).
- **Página 404** personalizada.
- **Imágenes optimizadas** con `next/image` servidas desde Cloudinary (formatos AVIF y WebP).

---

## Cómo ejecutar el proyecto

### Requisitos previos

- **Node.js** (compatible con Next.js 13) y **npm** (el repo incluye `package-lock.json`).
- El backend **GuitarLa-Strapi** en ejecución, con contenido publicado y permisos públicos de lectura (`find` / `findOne`) para Guitarra, Post y Curso.

### Instalación

```bash
git clone <url-del-repositorio>
cd GuitarLa-Nextjs
npm install
```

### Variables de entorno

Copia la plantilla `.env.example` a `.env` en la raíz y ajusta la URL base del backend (sin `/api` ni barra final):

```bash
cp .env.example .env
```

```env
API_URL=http://localhost:1337
```

El archivo `.env` está en `.gitignore`. La variable no lleva el prefijo `NEXT_PUBLIC_` porque solo se usa en el servidor, así que no llega al navegador.

| Variable  | Uso                                                                                 |
| --------- | ----------------------------------------------------------------------------------- |
| `API_URL` | URL base de Strapi. Solo se lee en el servidor (`getStaticProps`, `getStaticPaths`, `getServerSideProps`) |

### Ejecutar en desarrollo

```bash
npm run dev
```

Abre `http://localhost:3000`.

> Las páginas con `getStaticProps` / `getStaticPaths` (inicio, blog y detalle de guitarra) se generan en `npm run build`, así que el backend debe estar disponible también al compilar. Las guitarras nuevas no tendrán página de detalle hasta volver a compilar (`fallback: false`).

### Scripts disponibles

| Script          | Comando      | Descripción                        |
| --------------- | ------------ | ---------------------------------- |
| `npm run dev`   | `next dev`   | Servidor de desarrollo             |
| `npm run build` | `next build` | Compilación de producción          |
| `npm start`     | `next start` | Sirve la compilación de producción |
| `npm run lint`  | `next lint`  | ESLint (`next/core-web-vitals`)    |

---

## Páginas

| Ruta                | Archivo                     | Renderizado                       | Datos de Strapi                                     |
| ------------------- | --------------------------- | --------------------------------- | --------------------------------------------------- |
| `/`                 | `pages/index.js`            | SSG (`getStaticProps`)            | `/api/guitarras`, `/api/posts`, `/api/curso` (`?populate=imagen`) |
| `/tienda`           | `pages/tienda.js`           | SSR (`getServerSideProps`)        | `/api/guitarras?populate=imagen`                    |
| `/guitarras/[url]`  | `pages/guitarras/[url].js`  | SSG (`getStaticPaths` + `getStaticProps`) | `/api/guitarras?filters[url]=<url>&populate=imagen` |
| `/blog`             | `pages/blog.js`             | SSG (`getStaticProps`)            | `/api/posts?populate=imagen`                        |
| `/blog/[url]`       | `pages/blog/[url].js`       | SSR (`getServerSideProps`)        | `/api/posts?filters[url]=<url>&populate=imagen`     |
| `/nosotros`         | `pages/nosotros.js`         | Estática                          | —                                                   |
| `/carrito`          | `pages/carrito.js`          | Cliente (estado + localStorage)   | —                                                   |
| 404                 | `pages/404.js`              | Estática                          | —                                                   |

---

## Cómo funciona

### 1. `pages/_app.js` — estado del carrito

- Inicializa `carrito` leyendo `localStorage.getItem('carrito')` (solo en el navegador) y lo vuelve a guardar en cada cambio con un `useEffect`.
- `paginaLista` evita renderizar hasta que el componente se monta en el cliente, para no generar diferencias de hidratación con `localStorage`.
- Expone a todas las páginas, vía props, `carrito`, `agregarCarrito`, `eliminarProducto` y `actualizarCantidad`.

### 2. Obtención de datos

- Todas las peticiones usan `` fetch(`${process.env.API_URL}/api/...`) `` y leen la propiedad `data` de la respuesta de Strapi; los componentes usan `attributes` de cada elemento.
- `pages/guitarras/[url].js`: `getStaticPaths` genera una ruta por cada `attributes.url`; `handleSubmit` valida la cantidad, arma `guitarraSeleccionada` (`id`, `nombre`, `precio`, `cantidad`, `imagen`) y llama a `agregarCarrito`.
- `pages/carrito.js`: calcula `total` con `reduce` (`cantidad × precio`) cada vez que cambia el carrito.

### 3. `components/`

- `layout.js` — `<Head>` con título `GuitarLA - {title}` y descripción, más `Header` y `Footer`.
- `header.js` — logotipo, navegación con clase activa según `router.pathname` e icono del carrito.
- `footer.js` — navegación y copyright con el año actual.
- `guitarra.js` — tarjeta de guitarra (imagen `formats.medium`, descripción, precio, enlace "Ver Producto").
- `post.js` — tarjeta de post con fecha (`formatearFecha`) y enlace "Leer Post".
- `curso.js` — sección del curso con la imagen de Strapi como fondo (`<style jsx>`).
- `utils/helpers.js` — `formatearFecha`, fecha larga en español con `toLocaleDateString`.

### 4. `pages/_document.js` y estilos

- Fija `lang="es"`, carga la fuente **Outfit** de Google Fonts y **normalize.css**, y define la meta descripción global, el `theme-color`, el favicon (SVG + ICO) y el `apple-touch-icon`.
- `styles/globals.css` define variables (`--primary: #e99401`, `--black`, `--white`, `--fuente-principal`) y clases globales (`contenedor`, `heading`…); cada sección tiene su **CSS Module** (`guitarras.module.css`, `blog.module.css`, `carrito.module.css`, etc.).

### Flujo de la app

```
Strapi (API_URL)
   ↓  build / request
getStaticProps · getStaticPaths · getServerSideProps
   ↓  props (data[].attributes)
MyApp (_app.js)
  ├─ carrito ⇄ localStorage('carrito')
  └─ <Component carrito agregarCarrito eliminarProducto actualizarCantidad />
        ├─ /                → <Guitarra>[], <Curso>, <Post>[]
        ├─ /tienda          → <Guitarra>[]
        ├─ /guitarras/[url] → form cantidad → agregarCarrito()
        ├─ /blog, /blog/[url]
        └─ /carrito         → actualizarCantidad() / eliminarProducto() → total
```

---

## Tecnologías

- **Next.js 13.0.2** (Pages Router) — SSG, SSR, `next/image`, `next/link`, `next/head`.
- **React 18.2.0** — hooks `useState` y `useEffect`.
- **CSS Modules** + CSS global con variables, `normalize.css` y Google Fonts (Outfit).
- **Strapi** (API REST) como fuente de datos y **Cloudinary** como origen de imágenes.
- **localStorage** — persistencia del carrito.
- **ESLint** con `eslint-config-next`.

---

## Estructura del proyecto

```
GuitarLa-Nextjs/
├── components/
│   ├── curso.js                 # Sección del curso destacado
│   ├── footer.js
│   ├── guitarra.js              # Tarjeta de guitarra
│   ├── header.js                # Navegación + carrito
│   ├── layout.js                # Head + Header + Footer
│   └── post.js                  # Tarjeta de post
├── pages/
│   ├── _app.js                  # Estado global del carrito
│   ├── _document.js             # lang, favicon, fuentes, normalize.css
│   ├── 404.js
│   ├── index.js                 # Inicio (SSG)
│   ├── tienda.js                # Tienda (SSR)
│   ├── blog.js                  # Blog (SSG)
│   ├── nosotros.js
│   ├── carrito.js
│   ├── blog/
│   │   └── [url].js             # Detalle de post (SSR)
│   └── guitarras/
│       └── [url].js             # Detalle de guitarra (SSG)
├── public/
│   ├── favicon.svg              # Favicon (+ favicon.ico de respaldo)
│   ├── favicon.ico
│   ├── apple-touch-icon.png     # Icono de inicio en iOS
│   └── img/                     # logo.svg, header.jpg, nosotros.jpg, carrito.png
├── styles/
│   ├── globals.css
│   └── *.module.css             # blog, carrito, curso, footer, grid, guitarras, header, nosotros
├── utils/
│   └── helpers.js               # formatearFecha
├── .env.example                 # Plantilla de API_URL
├── next.config.js
└── package.json
```

---

## Configuración

| Dónde                              | Qué                                   | Valor actual                     |
| ---------------------------------- | ------------------------------------- | -------------------------------- |
| `.env` → `API_URL`                 | URL base del backend Strapi           | p. ej. `http://localhost:1337`   |
| `next.config.js` → `images.domains` | Dominios permitidos para `next/image` | `res.cloudinary.com`             |
| `next.config.js` → `images.formats` | Formatos de imagen generados         | `image/avif`, `image/webp`       |
| `next.config.js`                   | Modo estricto de React                | `reactStrictMode: true`          |
| `styles/globals.css` → `:root`     | Color principal y fuente              | `#e99401`, `'Outfit'`            |
| `pages/guitarras/[url].js`, `pages/carrito.js` | Cantidades seleccionables | `1` a `5`                        |

> Si sirves las imágenes desde otro origen (por ejemplo, el almacenamiento local de Strapi), agrega ese dominio a `images.domains`.

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
