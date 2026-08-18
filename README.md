# 💻 WebStore Frontend (Angular)

Aplicación web frontend moderna para la plataforma **Web Store**, desarrollada con **Angular 21 (Standalone Components)**, **Tailwind CSS**, **RxJS** y **Vitest**.

---

## 📌 Características Principales

- ⚡ **Angular 21 Standalone Components:** Componentes modulares, livianos y desacoplados sin necesidad de `NgModule`.
- 🎨 **Diseño Moderno con Tailwind CSS:** Interfaz limpia, responsiva, adaptada a dispositivos móviles y escritorios.
- 🛍 **Catálogo Dinámico de Productos:** Visualización de tarjetas de producto con precios, tallas, imágenes y navegación detallada.
- 💳 **Integración de Checkout con PayPal:** Experiencia fluida para redirigir y manejar respuestas de pago exitosas (`/checkout/success`) o canceladas (`/checkout/cancel`).
- 👕 **Integración con Productos de Printful:** Consumo de servicios REST backend para mostrar productos sincronizados y calcular opciones de compra.
- 🧪 **Testing con Vitest:** Pruebas unitarias ultrarrápidas configuradas mediante `@analogjs/vite-plugin-angular`.

---

## 📂 Estructura de la Aplicación (`/src/app`)

```bash
src/app/
├── interfaces/            # Modelos e interfaces de TypeScript (Product, Cart, Order)
├── mappers/               # Mapeadores y transformadores de datos API a vista
├── pages/
│   ├── components/        # Componentes UI reutilizables (Header, Footer, Product Cards)
│   ├── home/              # Página de inicio / Hero section
│   ├── layout/            # Layout principal (StoreLayout) y vistas de Checkout (Success, Cancel)
│   ├── printful/          # Vistas de productos de Printful
│   ├── products/          # Catálogo general de productos
│   └── store/             # Vista detallada de producto individual (`product/:id`)
├── services/              # Servicios HTTP inyectables (Products, PayPal, Printful)
├── app.component.ts       # Componente raíz
├── app.config.ts          # Configuración global de Angular (ProvideRouter, ProvideHttpClient)
└── app.routes.ts          # Rutas principales y lazy loading de componentes
```

---

## 🚀 Comandos de Desarrollo

### Iniciar Servidor Local de Desarrollo
```bash
pnpm start
# o
ng serve
```
Navega a `http://localhost:4200/` en tu navegador. La aplicación se recargará automáticamente al guardar cambios.

### Compilar para Producción
```bash
pnpm build
# o
ng build
```
Los archivos optimizados se generarán en la carpeta `dist/frontend`.

### Ejecutar Pruebas Unitarias (Vitest)
```bash
pnpm test
```

---

## 🗺 Enrutamiento (`app.routes.ts`)

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/` | `HomeComponent` | Página principal de bienvenida con banners y productos destacados |
| `/products` | `ProductsLayoutComponent` | Listado general y filtrable del catálogo |
| `/product/:id` | `StoreComponent` (Lazy) | Detalle de producto, selección de talla/color y botón de compra |
| `/checkout/success` | `SuccessComponent` (Lazy) | Confirmación de pago exitoso de PayPal |
| `/checkout/cancel` | `CancelComponent` (Lazy) | Notificación de cancelación de pago |
| `**` | Redirección a `/` | Comportamiento fallback para rutas desconocidas |

---

## ⚙️ Integración con Backend API

Los servicios en `src/app/services/` se comunican con los endpoints del backend:
- `webPageProducts.service.ts` ➔ `/api/products`
- `webPagePayPal.service.ts` ➔ `/api/paypal/create-order`
- `webPagePrintful.service.ts` ➔ `/api/printful/products`

---

## 🎨 Referencias de Diseño e Inspiración

- [Mobbin Merch](https://merch.mobbin.com/)
- [FAINE Clothing Store](https://www.behance.net/gallery/236634801/FAINE-clothing-store)
- [MOTH Brand Store](https://www.behance.net/gallery/236483277/MOTH-Brand-Store)
- [Klane Framer Template](https://klane.framer.website/)