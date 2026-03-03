# Sistema de Pedidos y Notificaciones - Guía de Configuración

## Resumen

Se ha implementado un sistema completo de pedidos con notificaciones en tiempo real para que los negocios sean notificados cuando reciben nuevos pedidos.

## Características

✅ **Pedidos reales**: Los clientes crean pedidos reales que se guardan en la base de datos
✅ **Notificaciones**: Los negocios reciben notificaciones de nuevos pedidos no leídos
✅ **Polling en tiempo real**: El sistema verifica nuevos pedidos cada 30 segundos
✅ **Gestión de estado**: Los negocios pueden actualizar el estado de los pedidos
✅ **Marcar como leído**: Los pedidos se marcan automáticamente como leídos al abrirlos

## Paso 1: Crear las tablas en Supabase

1. Ve a tu proyecto en Supabase → **SQL Editor**
2. Ejecuta el script `supabase-schema-pedidos.sql`
3. Verifica que se crearon las tablas:
   - `pedidos`
   - `pedidos_items`

## Paso 2: Flujo de Pedidos

### Para Clientes:

1. **Registro**: El cliente se registra en `/registro` (se guarda en `clientes`)
2. **Agregar productos**: El cliente agrega productos al carrito desde `/menu`
3. **Checkout**: El cliente va a `/checkout` y confirma el pedido
4. **Creación del pedido**: El sistema crea un pedido en la base de datos con:
   - Información del cliente
   - Items del pedido
   - Método de pago
   - Dirección de entrega
   - Estado inicial: "pendiente"
   - `leido_por_negocio: false` (para notificaciones)

### Para Negocios:

1. **Notificación**: Cuando hay un nuevo pedido, aparece un badge rojo con el número de pedidos no leídos
2. **Ver pedidos**: El negocio hace clic en "Ver pedidos" en el panel
3. **Marcar como leído**: Al hacer clic en un pedido nuevo, se marca automáticamente como leído
4. **Actualizar estado**: El negocio puede cambiar el estado del pedido:
   - Pendiente → Confirmado
   - Confirmado → En preparación
   - En preparación → Listo
   - También puede cancelar pedidos pendientes

## Paso 3: Estados de Pedidos

Los pedidos pueden tener los siguientes estados:

- **pendiente**: Pedido recién creado, esperando confirmación
- **confirmado**: Negocio confirmó el pedido
- **en_preparacion**: El negocio está preparando el pedido
- **listo**: El pedido está listo para entrega
- **en_camino**: El repartidor está en camino
- **entregado**: Pedido entregado exitosamente
- **cancelado**: Pedido cancelado

## Paso 4: Notificaciones

### Cómo funcionan:

1. **Polling automático**: El panel de negocios verifica nuevos pedidos cada 30 segundos
2. **Badge de notificación**: Muestra el número de pedidos no leídos
3. **Marcado automático**: Al hacer clic en un pedido, se marca como leído
4. **Actualización en tiempo real**: Los pedidos se actualizan automáticamente

### Personalización:

Puedes cambiar el intervalo de polling modificando el valor en `src/app/negocio/panel/page.tsx`:

```typescript
// Polling cada 30 segundos (cambiar a tu preferencia)
const interval = setInterval(cargarPedidos, 30000);
```

## Estructura de Datos

### Tabla `pedidos`:
- `id`: UUID del pedido
- `cliente_id`: Referencia al cliente
- `negocio_id`: Referencia al negocio
- `numero_pedido`: Número único del pedido (ej: PED-1234567890-ABC123)
- `estado`: Estado actual del pedido
- `metodo_pago`: "efectivo" o "tarjeta"
- `subtotal`: Subtotal del pedido
- `costo_envio`: Costo de envío (49.00 RD$)
- `total`: Total del pedido
- `direccion_entrega`: Dirección donde entregar
- `telefono_cliente`: Teléfono del cliente
- `notas`: Notas adicionales del cliente
- `leido_por_negocio`: Boolean para notificaciones
- `creado_en`: Timestamp de creación
- `actualizado_en`: Timestamp de última actualización

### Tabla `pedidos_items`:
- `id`: UUID del item
- `pedido_id`: Referencia al pedido
- `producto_id`: Referencia al producto (puede ser null si se elimina)
- `nombre_producto`: Nombre del producto (guardado por si se elimina)
- `precio_unitario`: Precio unitario al momento del pedido
- `cantidad`: Cantidad del producto
- `subtotal`: Subtotal del item
- `creado_en`: Timestamp de creación

## APIs Creadas

### `/api/pedidos` (POST)
- Crea un nuevo pedido
- Requiere: `clienteId`, `items`, `metodoPago`, `direccionEntrega`
- Retorna: `pedido.id` y `pedido.numeroPedido`

### `/api/negocios/pedidos` (GET)
- Obtiene pedidos de un negocio
- Query params: `negocioId`, `soloNoLeidos` (opcional)
- Retorna: Array de pedidos con sus items

### `/api/negocios/pedidos/[id]/marcar-leido` (PUT)
- Marca un pedido como leído
- Query params: `negocioId`
- Retorna: `success: true`

### `/api/negocios/pedidos/[id]/actualizar-estado` (PUT)
- Actualiza el estado de un pedido
- Body: `negocioId`, `estado`
- Retorna: `success: true`

## Próximos Pasos Sugeridos

- [ ] Agregar notificaciones push (web push notifications)
- [ ] Agregar historial de pedidos para clientes
- [ ] Implementar sistema de repartidores
- [ ] Agregar estimación de tiempo de entrega
- [ ] Implementar pagos en línea
- [ ] Agregar sistema de calificaciones
