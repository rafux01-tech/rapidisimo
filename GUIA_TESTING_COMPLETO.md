# 🧪 Guía de Testing Completo - Rapidisimo

Esta guía te ayuda a probar todos los flujos de la aplicación antes del lanzamiento.

---

## 📋 PREPARACIÓN

### Antes de empezar:

1. **Verifica que Supabase esté configurado**:
   - [ ] Todas las tablas creadas (ver `CHECKLIST_CRITICO.md`)
   - [ ] Storage configurado
   - [ ] Variables de entorno en Vercel configuradas

2. **Prepara datos de prueba**:
   - [ ] Tener acceso a Supabase Table Editor
   - [ ] Tener un email de prueba para recibir emails de recuperación
   - [ ] Tener un teléfono de prueba

3. **Herramientas útiles**:
   - [ ] Navegador con DevTools abierto (F12)
   - [ ] Acceso a Supabase Dashboard
   - [ ] Acceso a Vercel Dashboard (para ver logs si hay errores)

---

## 🧪 TESTING: FLUJO CLIENTE

### Test 1: Registro de Cliente

**Objetivo**: Verificar que los clientes se registren correctamente

**Pasos**:
1. Ve a `http://localhost:3000/registro` (o tu URL de producción)
2. Completa el formulario:
   - Nombre: "Juan Pérez"
   - Teléfono: "8095551234"
   - Dirección: "Calle Principal #123, Santo Domingo"
3. Haz clic en "Continuar al menú"

**Verificaciones**:
- [ ] ✅ Redirige a `/menu`
- [ ] ✅ En Supabase → `clientes` → Aparece el registro
- [ ] ✅ En localStorage del navegador → `cliente_id` está guardado
- [ ] ✅ En localStorage → `cliente_direccion` está guardado
- [ ] ✅ En localStorage → `cliente_telefono` está guardado

**Si falla**:
- Revisa la consola del navegador (F12 → Console)
- Revisa los logs de Vercel
- Verifica que la tabla `clientes` exista en Supabase

---

### Test 2: Ver Menú (sin productos)

**Objetivo**: Verificar que el menú muestre mensaje cuando no hay productos

**Pasos**:
1. Ve a `/menu` (sin haber activado ningún negocio)

**Verificaciones**:
- [ ] ✅ Muestra mensaje "Menú disponible próximamente"
- [ ] ✅ Muestra enlace a `/soy-negocio`
- [ ] ✅ No hay errores en consola

---

### Test 3: Ver Menú (con productos)

**Objetivo**: Verificar que el menú muestre productos cuando hay negocios activos

**Pre-requisito**: Debes tener al menos un negocio activo con productos (ver Test 8-9)

**Pasos**:
1. Ve a `/menu`

**Verificaciones**:
- [ ] ✅ Muestra productos disponibles
- [ ] ✅ Muestra categorías
- [ ] ✅ Muestra imágenes de productos (si tienen)
- [ ] ✅ Botón "Agregar" funciona
- [ ] ✅ Contador de carrito se actualiza

---

### Test 4: Carrito

**Objetivo**: Verificar funcionalidad del carrito

**Pasos**:
1. Agrega 2 productos diferentes al carrito
2. Agrega 3 unidades de un mismo producto
3. Ve a `/carrito`

**Verificaciones**:
- [ ] ✅ Muestra todos los productos agregados
- [ ] ✅ Muestra cantidades correctas
- [ ] ✅ Muestra subtotales correctos
- [ ] ✅ Muestra total correcto
- [ ] ✅ Cambiar cantidad funciona
- [ ] ✅ Eliminar producto funciona
- [ ] ✅ Botón "Continuar al checkout" funciona

---

### Test 5: Checkout y Creación de Pedido

**Objetivo**: Verificar que se creen pedidos reales en la base de datos

**Pasos**:
1. Con productos en el carrito, ve a `/checkout`
2. Verifica el resumen del pedido
3. Selecciona método de pago (prueba ambos: efectivo y tarjeta)
4. Haz clic en "Confirmar pedido"

**Verificaciones**:
- [ ] ✅ Muestra resumen correcto (items, subtotal, envío, total)
- [ ] ✅ Redirige a `/pedido/[numero-pedido]`
- [ ] ✅ En Supabase → `pedidos` → Aparece el pedido con:
  - [ ] Estado: "pendiente"
  - [ ] `leido_por_negocio`: false
  - [ ] Método de pago correcto
  - [ ] Total correcto
- [ ] ✅ En Supabase → `pedidos_items` → Aparecen los items del pedido
- [ ] ✅ El carrito se limpia después del pedido

**Si falla**:
- Verifica que todos los productos sean del mismo negocio
- Revisa logs de Vercel
- Verifica que las tablas `pedidos` y `pedidos_items` existan

---

### Test 6: Página de Seguimiento

**Objetivo**: Verificar que la página de seguimiento funcione

**Pasos**:
1. Después de crear un pedido, ve a `/pedido/[numero-pedido]`

**Verificaciones**:
- [ ] ✅ Muestra el número de pedido
- [ ] ✅ Muestra estados de seguimiento
- [ ] ⚠️ **Nota**: Actualmente muestra datos mock, pero el pedido está guardado

---

## 🧪 TESTING: FLUJO NEGOCIO

### Test 7: Registro de Negocio (Lead)

**Objetivo**: Verificar que los negocios puedan registrarse

**Pasos**:
1. Ve a `/soy-negocio`
2. Completa el formulario:
   - Nombre del negocio: "Restaurante Test"
   - Nombre de contacto: "María García"
   - Teléfono: "8095555678"
   - Dirección: "Av. Independencia #456"
   - Tipo de negocio: "Restaurante"
   - Horario: "Lun-Dom 9am-10pm"
3. Haz clic en "Enviar solicitud"

**Verificaciones**:
- [ ] ✅ Muestra mensaje de éxito
- [ ] ✅ En Supabase → `negocios_leads` → Aparece el lead con estado "nuevo"
- [ ] ✅ El formulario se limpia

---

### Test 8: Activación de Negocio (como Admin)

**Objetivo**: Verificar que el admin pueda activar negocios

**Pasos**:
1. Inicia sesión como admin en `/admin/login`
2. Ve a `/admin`
3. Encuentra el lead que creaste en Test 7
4. Haz clic en "Activar"
5. En el modal, ingresa:
   - Email: `test@restaurante.com`
   - Contraseña: `Test123456`
6. Haz clic en "Activar Negocio"

**Verificaciones**:
- [ ] ✅ Muestra mensaje de éxito
- [ ] ✅ En Supabase → `negocios` → Aparece el negocio con:
  - [ ] `activo`: true
  - [ ] `email`: el email que ingresaste
  - [ ] `password_hash`: hash bcrypt (empieza con $2b$)
- [ ] ✅ En Supabase → `negocios_leads` → El estado cambia a "activado"
- [ ] ✅ El botón "Activar" desaparece del lead

**Si falla**:
- Verifica que el email no esté en uso
- Revisa logs de Vercel
- Verifica que la tabla `negocios` tenga los campos de autenticación

---

### Test 9: Login de Negocio

**Objetivo**: Verificar que los negocios puedan iniciar sesión

**Pasos**:
1. Ve a `/negocio/login`
2. Ingresa:
   - Email: `test@restaurante.com`
   - Contraseña: `Test123456`
3. Haz clic en "Iniciar sesión"

**Verificaciones**:
- [ ] ✅ Redirige a `/negocio/panel`
- [ ] ✅ Muestra el nombre del negocio
- [ ] ✅ En localStorage → `negocio_id` está guardado
- [ ] ✅ En localStorage → `negocio_nombre` está guardado
- [ ] ✅ En Supabase → `negocios` → `ultimo_login` se actualiza

**Si falla**:
- Verifica que el negocio esté activo
- Verifica que la contraseña sea correcta
- Revisa la consola del navegador

---

### Test 10: Agregar Producto

**Objetivo**: Verificar que los negocios puedan agregar productos

**Pasos**:
1. En `/negocio/panel`, haz clic en "+ Agregar Producto"
2. Completa el formulario:
   - Nombre: "Pollo Frito Completo"
   - Precio: 250
   - Categoría: "Comida"
   - Descripción: "Pollo frito con tostones y ensalada"
   - Disponible: ✅ marcado
3. (Opcional) Sube una imagen
4. Haz clic en "Agregar Producto"

**Verificaciones**:
- [ ] ✅ Muestra mensaje de éxito
- [ ] ✅ El producto aparece en la tabla
- [ ] ✅ En Supabase → `productos` → Aparece el producto
- [ ] ✅ Si subiste imagen, la URL está guardada
- [ ] ✅ El formulario se cierra

**Si falla con imagen**:
- Verifica que el bucket `productos-imagenes` exista
- Verifica que el bucket sea público
- Revisa logs de Vercel

---

### Test 11: Editar Producto

**Objetivo**: Verificar que los negocios puedan editar productos

**Pasos**:
1. En la tabla de productos, haz clic en "Editar" de un producto
2. Cambia el precio a 275
3. Cambia la descripción
4. Haz clic en "Actualizar"

**Verificaciones**:
- [ ] ✅ Muestra mensaje de éxito
- [ ] ✅ Los cambios se reflejan en la tabla
- [ ] ✅ En Supabase → `productos` → Los cambios están guardados

---

### Test 12: Eliminar Producto

**Objetivo**: Verificar que los negocios puedan eliminar productos

**Pasos**:
1. En la tabla de productos, haz clic en "Eliminar"
2. Confirma la eliminación

**Verificaciones**:
- [ ] ✅ Muestra mensaje de éxito
- [ ] ✅ El producto desaparece de la tabla
- [ ] ✅ En Supabase → `productos` → El producto fue eliminado

---

### Test 13: Ver Pedidos y Notificaciones

**Objetivo**: Verificar que los negocios vean pedidos y notificaciones

**Pre-requisito**: Debes tener al menos un pedido creado (Test 5)

**Pasos**:
1. En `/negocio/panel`, ve a la sección "Pedidos"
2. Haz clic en "Ver pedidos"

**Verificaciones**:
- [ ] ✅ Muestra el pedido creado
- [ ] ✅ Muestra badge "Nuevo" si `leido_por_negocio` es false
- [ ] ✅ Muestra todos los detalles: items, total, dirección, teléfono
- [ ] ✅ El badge muestra el número correcto de pedidos no leídos

---

### Test 14: Marcar Pedido como Leído

**Objetivo**: Verificar que los pedidos se marquen como leídos

**Pasos**:
1. Con un pedido no leído visible, haz clic en el pedido

**Verificaciones**:
- [ ] ✅ El badge "Nuevo" desaparece
- [ ] ✅ El contador de pedidos no leídos disminuye
- [ ] ✅ En Supabase → `pedidos` → `leido_por_negocio` cambia a true

---

### Test 15: Actualizar Estado de Pedido

**Objetivo**: Verificar que los negocios puedan actualizar el estado

**Pasos**:
1. Con un pedido en estado "pendiente", haz clic en "Confirmar"
2. Verifica que el estado cambia
3. Haz clic en "En preparación"
4. Verifica que el estado cambia

**Verificaciones**:
- [ ] ✅ El estado cambia visualmente
- [ ] ✅ En Supabase → `pedidos` → El estado está actualizado
- [ ] ✅ Los botones de acción cambian según el estado

---

### Test 16: Cambiar Contraseña

**Objetivo**: Verificar que los negocios puedan cambiar su contraseña

**Pasos**:
1. En `/negocio/panel`, ve a "Configuración de cuenta"
2. Haz clic en "Cambiar contraseña"
3. Ingresa:
   - Contraseña actual: `Test123456`
   - Nueva contraseña: `NuevaPass123`
   - Confirmar: `NuevaPass123`
4. Haz clic en "Actualizar contraseña"

**Verificaciones**:
- [ ] ✅ Muestra mensaje de éxito
- [ ] ✅ El formulario se cierra
- [ ] ✅ Puedes hacer logout y login con la nueva contraseña
- [ ] ✅ La contraseña vieja ya no funciona

---

### Test 17: Recuperación de Contraseña

**Objetivo**: Verificar que la recuperación de contraseña funcione

**Pre-requisito**: Debes tener `RESEND_API_KEY` configurada

**Pasos**:
1. Ve a `/negocio/login`
2. Haz clic en "¿Olvidaste tu contraseña?"
3. Ingresa el email del negocio: `test@restaurante.com`
4. Haz clic en "Enviar enlace de recuperación"
5. Revisa tu email (y spam)
6. Haz clic en el enlace del email
7. Ingresa nueva contraseña: `Recuperada123`
8. Confirma la contraseña
9. Haz clic en "Restablecer contraseña"

**Verificaciones**:
- [ ] ✅ Muestra mensaje de confirmación al solicitar
- [ ] ✅ Recibes el email (revisa spam si no lo ves)
- [ ] ✅ El enlace te lleva a `/negocio/reset-password?token=...`
- [ ] ✅ Puedes ingresar nueva contraseña
- [ ] ✅ Muestra mensaje de éxito
- [ ] ✅ Puedes hacer login con la nueva contraseña
- [ ] ✅ En Supabase → `password_reset_tokens` → El token está marcado como usado

**Si falla**:
- Verifica que `RESEND_API_KEY` esté configurada
- Verifica que el dominio esté verificado en Resend (si usas dominio personalizado)
- Revisa logs de Resend en su dashboard

---

## 🧪 TESTING: ADMIN

### Test 18: Login Admin

**Objetivo**: Verificar que el admin pueda iniciar sesión

**Pasos**:
1. Ve a `/admin/login`
2. Ingresa credenciales admin (las configuradas en Vercel)

**Verificaciones**:
- [ ] ✅ Redirige a `/admin`
- [ ] ✅ Muestra el dashboard
- [ ] ✅ Las credenciales por defecto NO funcionan (si configuraste nuevas)

---

### Test 19: Vista de Leads

**Objetivo**: Verificar que el admin vea los leads

**Pasos**:
1. En `/admin`, ve a la sección "Negocios interesados"

**Verificaciones**:
- [ ] ✅ Muestra todos los leads
- [ ] ✅ Muestra información correcta
- [ ] ✅ Muestra botón "Activar" para leads no activados
- [ ] ✅ Muestra "✓ Activado" para leads activados

---

## 🧪 TESTING: RESPONSIVE Y NAVEGADORES

### Test 20: Responsive Design

**Pasos**:
1. Abre DevTools (F12)
2. Prueba diferentes tamaños:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**Verificaciones en cada página**:
- [ ] ✅ Landing page se ve bien
- [ ] ✅ Menú se ve bien
- [ ] ✅ Carrito se ve bien
- [ ] ✅ Checkout se ve bien
- [ ] ✅ Panel de negocio se ve bien
- [ ] ✅ Formularios son usables en móvil

---

### Test 21: Múltiples Navegadores

**Prueba en**:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (si tienes Mac)
- [ ] Navegador móvil (Chrome/Safari)

**Verificaciones**:
- [ ] ✅ Todo funciona igual en todos los navegadores
- [ ] ✅ No hay errores en consola
- [ ] ✅ Los estilos se ven correctamente

---

## 🧪 TESTING: SEGURIDAD

### Test 22: Autenticación

**Pasos**:
1. Intenta acceder a `/admin` sin estar logueado
2. Intenta acceder a `/negocio/panel` sin estar logueado

**Verificaciones**:
- [ ] ✅ Redirige a la página de login
- [ ] ✅ No muestra información sensible

---

### Test 23: Validación de Datos

**Pasos**:
1. Intenta crear pedido sin productos
2. Intenta crear producto sin nombre
3. Intenta login con credenciales incorrectas

**Verificaciones**:
- [ ] ✅ Muestra errores apropiados
- [ ] ✅ No permite acciones inválidas
- [ ] ✅ No hay errores en consola del servidor

---

## 📊 REPORTE DE TESTING

Después de completar todos los tests, completa este reporte:

### Resultados:
- **Tests pasados**: ___ / 23
- **Tests fallidos**: ___ / 23
- **Fecha de testing**: ___
- **Versión probada**: ___

### Problemas encontrados:
1. 
2. 
3. 

### Notas adicionales:


---

## ✅ CRITERIO DE APROBACIÓN

**La app está lista para beta si**:
- ✅ Al menos 20/23 tests pasan
- ✅ Todos los tests críticos pasan (Tests 1, 5, 8, 9, 10, 13)
- ✅ No hay errores críticos en consola
- ✅ Los datos se guardan correctamente en Supabase

---

**¿Necesitas ayuda con algún test específico?**
