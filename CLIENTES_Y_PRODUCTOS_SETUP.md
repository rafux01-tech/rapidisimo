# Guía: Cómo tener clientes e items reales en Rapidisimo

Esta guía explica cómo activar negocios y agregar productos para que aparezcan en el menú.

## Paso 1: Crear las tablas en Supabase

1. Ve a tu proyecto en Supabase → **SQL Editor**
2. Ejecuta el script `supabase-schema-productos.sql` (igual que hiciste con `supabase-schema.sql`)
3. Verifica que se crearon las tablas:
   - `negocios`
   - `productos`
   - `clientes`

## Paso 2: Activar un negocio desde un lead

Cuando un negocio se registra desde `/soy-negocio`, aparece como "lead" en el panel admin. Para activarlo:

1. Ve a `/admin` (necesitas estar logueado)
2. En la tabla "Negocios interesados", encuentra el lead que quieres activar
3. Por ahora, necesitas activarlo manualmente desde Supabase o crear un botón en el admin (próximamente)

**Opción manual (Supabase):**
1. Ve a Supabase → **Table Editor** → `negocios_leads`
2. Copia los datos del lead que quieres activar
3. Ve a **Table Editor** → `negocios`
4. Crea un nuevo registro con esos datos y marca `activo = true`
5. Actualiza el estado del lead a "activado" en `negocios_leads`

**O usar la API (desde el código):**
```javascript
POST /api/negocios/activar
{
  "leadId": "uuid-del-lead"
}
```

## Paso 3: Agregar productos a un negocio

Una vez que un negocio está activo, puedes agregar productos:

1. Ve a Supabase → **Table Editor** → `productos`
2. Haz clic en **"Insert row"**
3. Completa:
   - `negocio_id`: El ID del negocio activo (de la tabla `negocios`)
   - `nombre`: Nombre del producto (ej: "Pollo Frito")
   - `precio`: Precio en decimal (ej: 250.00)
   - `categoria`: Categoría (ej: "Comida", "Bebidas", "Postres")
   - `disponible`: true
4. Guarda

**Ejemplo de producto:**
```json
{
  "negocio_id": "uuid-del-negocio",
  "nombre": "Pollo Frito Completo",
  "precio": 250.00,
  "categoria": "Comida",
  "disponible": true
}
```

## Paso 4: Ver productos en el menú

1. Los productos aparecerán automáticamente en `/menu` cuando:
   - El negocio está activo (`activo = true`)
   - El producto está disponible (`disponible = true`)

2. Las categorías se generan automáticamente desde los productos

## Paso 5: Clientes se registran automáticamente

Cuando un usuario completa el formulario en `/registro`:
- Se guarda automáticamente en la tabla `clientes`
- El ID se guarda en localStorage del navegador
- Puede hacer pedidos normalmente

## Próximos pasos (mejoras futuras)

- Panel para que negocios agreguen sus propios productos
- Botón "Activar" en el panel admin para activar leads
- Sistema de pedidos completo que guarde en base de datos
- Dashboard para negocios ver sus productos y pedidos

## Verificar que funciona

1. **Clientes:**
   - Ve a `/registro` y completa el formulario
   - Verifica en Supabase → `clientes` que apareció el registro

2. **Productos:**
   - Activa un negocio
   - Agrega productos a ese negocio
   - Ve a `/menu` y deberías ver los productos

3. **Categorías:**
   - Las categorías aparecen automáticamente según los productos que agregues
