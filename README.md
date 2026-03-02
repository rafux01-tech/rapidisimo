# Rapidisimo — Delivery con garantía (República Dominicana)

App de delivery enfocada en **confianza y seguridad** para el mercado dominicano. Español dominicano por defecto; opción en inglés para usuarios extranjeros.

## Características

- **Posicionamiento:** "La opción más segura" — precio claro, repartidores verificados, garantía de reembolso.
- **Idiomas:** Español (default) y English (selector en el header).
- **Flujo:** Landing → Onboarding → Menú → Carrito → Checkout → Seguimiento del pedido.
- **Elementos de confianza:** Badges "Pago Seguro", "Protección al Comprador", "Repartidor verificado", copy de garantía y soporte accesible.

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/app/` — Páginas (Next.js App Router).
- `src/components/` — Header, badges de seguridad, banner de garantía.
- `src/lib/` — i18n (es/en), carrito, datos mock.

## Build

```bash
npm run build
npm start
```
