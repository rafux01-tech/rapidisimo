# ✅ Checklist Crítico Pre-Lanzamiento

Este documento te guía paso a paso para completar los 4 aspectos críticos antes del lanzamiento.

---

## 1️⃣ CONFIGURACIÓN DE SUPABASE

### Paso 1.1: Verificar que Supabase esté configurado

1. Ve a tu proyecto en Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Verifica que tengas un proyecto creado
3. Si no tienes proyecto, créalo siguiendo `SUPABASE_SETUP.md`

### Paso 1.2: Ejecutar Scripts SQL (en orden)

**IMPORTANTE**: Ejecuta los scripts en este orden exacto:

#### Script 1: `supabase-schema.sql`
- **Qué hace**: Crea tabla `negocios_leads`
- **Cómo ejecutar**:
  1. Ve a Supabase → **SQL Editor**
  2. Copia TODO el contenido de `supabase-schema.sql`
  3. Pega en el editor
  4. Haz clic en **"Run"** o presiona `Ctrl+Enter`
  5. Verifica: Deberías ver "Success. No rows returned"
- **Verificar**: Ve a **Table Editor** → Deberías ver la tabla `negocios_leads`

#### Script 2: `supabase-schema-productos.sql`
- **Qué hace**: Crea tablas `negocios`, `productos`, `clientes`
- **Cómo ejecutar**: Igual que el anterior
- **Verificar**: Deberías ver 3 nuevas tablas en **Table Editor**

#### Script 3: `supabase-schema-negocios-auth.sql`
- **Qué hace**: Agrega campos de autenticación a `negocios` (email, password_hash, ultimo_login)
- **Cómo ejecutar**: Igual que el anterior
- **Verificar**: Ve a **Table Editor** → `negocios` → Deberías ver las columnas `email`, `password_hash`, `ultimo_login`

#### Script 4: `supabase-schema-pedidos.sql`
- **Qué hace**: Crea tablas `pedidos` y `pedidos_items`
- **Cómo ejecutar**: Igual que el anterior
- **Verificar**: Deberías ver 2 nuevas tablas

#### Script 5: `supabase-schema-password-reset.sql`
- **Qué hace**: Crea tabla `password_reset_tokens`
- **Cómo ejecutar**: Igual que el anterior
- **Verificar**: Deberías ver la tabla `password_reset_tokens`

### Paso 1.3: Configurar Supabase Storage

1. Ve a Supabase → **Storage**
2. Haz clic en **"New bucket"**
3. Configura:
   - **Name**: `productos-imagenes` (exactamente este nombre)
   - **Public bucket**: ✅ **Marca esta opción**
   - **File size limit**: `5242880` (5MB)
4. Haz clic en **"Create bucket"**
5. Ve a la pestaña **"Policies"**
6. Crea estas políticas (ver `SUPABASE_STORAGE_SETUP.md` para detalles):
   - **SELECT**: Permite lectura pública
   - **INSERT**: Permite inserción (puedes restringir a autenticados después)

### Paso 1.4: Verificar Variables de Entorno en Vercel

1. Ve a Vercel → Tu proyecto → **Settings** → **Environment Variables**
2. Verifica que existan:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Si no existen, agrégalas siguiendo `SUPABASE_SETUP.md`

### ✅ Checklist Supabase:
- [ ] Script 1 ejecutado y verificado
- [ ] Script 2 ejecutado y verificado
- [ ] Script 3 ejecutado y verificado
- [ ] Script 4 ejecutado y verificado
- [ ] Script 5 ejecutado y verificado
- [ ] Bucket `productos-imagenes` creado y configurado
- [ ] Variables de entorno en Vercel configuradas
- [ ] Probado: Crear un lead desde `/soy-negocio` y verificar en Supabase

---

## 2️⃣ CAMBIAR CREDENCIALES ADMIN

### Paso 2.1: Configurar Variables de Entorno

1. Ve a Vercel → Tu proyecto → **Settings** → **Environment Variables**
2. Agrega estas variables:

   **ADMIN_USER**:
   - **Name**: `ADMIN_USER`
   - **Value**: Elige un usuario seguro (ej: `admin_rapidisimo` o tu email)
   - Marca para: Production, Preview, Development

   **ADMIN_PASSWORD**:
   - **Name**: `ADMIN_PASSWORD`
   - **Value**: **Elige una contraseña MUY segura** (mínimo 16 caracteres, mezcla mayúsculas, minúsculas, números, símbolos)
   - Marca para: Production, Preview, Development
   - ⚠️ **GUARDA ESTA CONTRASEÑA EN UN LUGAR SEGURO**

3. Haz clic en **Save**

### Paso 2.2: Mejorar Seguridad del Admin (Opcional pero recomendado)

Vamos a eliminar los defaults hardcodeados para mayor seguridad.

### Paso 2.3: Verificar

1. Haz redeploy en Vercel (o espera al próximo push)
2. Ve a `/admin/login`
3. Intenta login con las credenciales viejas → Debe fallar
4. Intenta login con las nuevas credenciales → Debe funcionar

### ✅ Checklist Admin:
- [ ] `ADMIN_USER` configurado en Vercel
- [ ] `ADMIN_PASSWORD` configurado en Vercel (contraseña segura)
- [ ] Contraseña guardada en lugar seguro
- [ ] Redeploy realizado
- [ ] Login probado con nuevas credenciales
- [ ] Login con credenciales viejas falla (verificado)

---

## 3️⃣ PROBAR FLUJO COMPLETO

### Flujo 1: Cliente Completo

#### Paso 3.1: Registro de Cliente
- [ ] Ve a `/registro`
- [ ] Completa el formulario (nombre, teléfono, dirección)
- [ ] Haz clic en "Continuar al menú"
- [ ] **Verificar**: Deberías ser redirigido a `/menu`
- [ ] **Verificar en Supabase**: Ve a `clientes` → Deberías ver tu registro

#### Paso 3.2: Ver Menú
- [ ] En `/menu`, verifica que veas productos (si hay negocios activos)
- [ ] Si no hay productos, primero activa un negocio y agrega productos
- [ ] Prueba cambiar de categoría
- [ ] Prueba agregar productos al carrito

#### Paso 3.3: Carrito
- [ ] Ve a `/carrito`
- [ ] Verifica que veas los productos agregados
- [ ] Prueba cambiar cantidades
- [ ] Prueba eliminar productos
- [ ] Verifica que el total se calcule correctamente

#### Paso 3.4: Checkout
- [ ] Haz clic en "Continuar al checkout"
- [ ] Verifica que veas el resumen del pedido
- [ ] Selecciona método de pago (efectivo o tarjeta)
- [ ] Haz clic en "Confirmar pedido"
- [ ] **Verificar**: Deberías ser redirigido a `/pedido/[numero]`
- [ ] **Verificar en Supabase**: Ve a `pedidos` → Deberías ver el pedido creado
- [ ] **Verificar en Supabase**: Ve a `pedidos_items` → Deberías ver los items

#### Paso 3.5: Seguimiento de Pedido
- [ ] En `/pedido/[numero]`, verifica que veas información del pedido
- [ ] ⚠️ **Nota**: Esta página aún muestra datos mock, pero el pedido está guardado

### Flujo 2: Negocio Completo

#### Paso 3.6: Registro de Negocio
- [ ] Ve a `/soy-negocio`
- [ ] Completa el formulario
- [ ] Envía el formulario
- [ ] **Verificar en Supabase**: Ve a `negocios_leads` → Deberías ver el lead

#### Paso 3.7: Activar Negocio (como Admin)
- [ ] Ve a `/admin/login`
- [ ] Inicia sesión con credenciales admin
- [ ] Ve a `/admin`
- [ ] Encuentra el lead que creaste
- [ ] Haz clic en "Activar"
- [ ] En el modal, ingresa:
   - Email: `test@negocio.com` (o el que prefieras)
   - Contraseña: `test123456` (o la que prefieras)
- [ ] Haz clic en "Activar Negocio"
- [ ] **Verificar en Supabase**: 
   - Ve a `negocios` → Deberías ver el negocio activo
   - Ve a `negocios_leads` → El estado debería ser "activado"

#### Paso 3.8: Login de Negocio
- [ ] Ve a `/negocio/login`
- [ ] Inicia sesión con el email y contraseña que configuraste
- [ ] **Verificar**: Deberías ser redirigido a `/negocio/panel`

#### Paso 3.9: Panel de Negocio - Productos
- [ ] En `/negocio/panel`, ve a la sección "Mis Productos"
- [ ] Haz clic en "+ Agregar Producto"
- [ ] Completa el formulario:
   - Nombre: "Pollo Frito Completo"
   - Precio: 250
   - Categoría: "Comida"
   - Descripción: "Pollo frito con tostones"
   - (Opcional) Sube una imagen
- [ ] Haz clic en "Agregar Producto"
- [ ] **Verificar**: El producto debería aparecer en la tabla
- [ ] **Verificar en Supabase**: Ve a `productos` → Deberías ver el producto
- [ ] **Verificar en Menú**: Ve a `/menu` → Deberías ver el producto

#### Paso 3.10: Panel de Negocio - Pedidos
- [ ] Primero, crea un pedido como cliente (Flujo 1)
- [ ] En `/negocio/panel`, ve a la sección "Pedidos"
- [ ] Haz clic en "Ver pedidos"
- [ ] **Verificar**: Deberías ver el pedido con badge "Nuevo"
- [ ] Haz clic en el pedido
- [ ] **Verificar**: El badge "Nuevo" debería desaparecer
- [ ] Prueba cambiar el estado:
   - Haz clic en "Confirmar"
   - **Verificar**: El estado cambia a "Confirmado"
   - Haz clic en "En preparación"
   - **Verificar**: El estado cambia a "En preparación"

#### Paso 3.11: Recuperación de Contraseña
- [ ] Ve a `/negocio/login`
- [ ] Haz clic en "¿Olvidaste tu contraseña?"
- [ ] Ingresa el email del negocio
- [ ] Haz clic en "Enviar enlace de recuperación"
- [ ] **Verificar**: Deberías ver mensaje de confirmación
- [ ] **Verificar email**: Revisa tu bandeja de entrada (y spam)
- [ ] Haz clic en el enlace del email
- [ ] **Verificar**: Deberías ser redirigido a `/negocio/reset-password?token=...`
- [ ] Ingresa nueva contraseña
- [ ] Confirma la contraseña
- [ ] Haz clic en "Restablecer contraseña"
- [ ] **Verificar**: Deberías ver mensaje de éxito
- [ ] Prueba login con la nueva contraseña

### Flujo 3: Responsive y Navegadores

- [ ] Prueba en **Chrome** (desktop)
- [ ] Prueba en **Safari** (si tienes Mac)
- [ ] Prueba en **Firefox**
- [ ] Prueba en **móvil** (Chrome/Safari)
- [ ] Verifica que todo se vea bien en diferentes tamaños de pantalla

### ✅ Checklist Testing:
- [ ] Flujo cliente completo probado
- [ ] Flujo negocio completo probado
- [ ] Recuperación de contraseña probada
- [ ] Responsive probado
- [ ] Múltiples navegadores probados
- [ ] Todos los datos se guardan correctamente en Supabase

---

## 4️⃣ TÉRMINOS LEGALES BÁSICOS

Vamos a crear páginas básicas de términos legales que puedas personalizar después.

### ✅ Checklist Legal:
- [ ] Términos y Condiciones creados
- [ ] Política de Privacidad creada
- [ ] Enlaces agregados en footer
- [ ] Revisados por abogado (recomendado antes de lanzamiento público)

---

## 🎯 RESUMEN

Una vez completes estos 4 aspectos:

1. ✅ **Supabase configurado** → Datos persisten correctamente
2. ✅ **Admin seguro** → Credenciales cambiadas
3. ✅ **Flujos probados** → Todo funciona end-to-end
4. ✅ **Legal básico** → Protección legal mínima

**→ Estarás listo para lanzar BETA** 🚀

---

**¿Empezamos con el punto 1 (Supabase)?**
