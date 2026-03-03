# 🗄️ Guía Paso a Paso: Ejecutar Scripts SQL en Supabase

Esta guía te lleva paso a paso para ejecutar todos los scripts SQL necesarios.

---

## 📋 PREPARACIÓN

### Antes de empezar:

1. **Tener cuenta en Supabase**: [https://supabase.com](https://supabase.com)
2. **Tener proyecto creado**: Si no tienes, créalo siguiendo `SUPABASE_SETUP.md`
3. **Acceso al SQL Editor**: Necesitas poder ejecutar queries

---

## 🎯 ORDEN DE EJECUCIÓN

**IMPORTANTE**: Ejecuta los scripts en este orden exacto:

1. ✅ `supabase-schema.sql` (Primero)
2. ✅ `supabase-schema-productos.sql` (Segundo)
3. ✅ `supabase-schema-negocios-auth.sql` (Tercero)
4. ✅ `supabase-schema-pedidos.sql` (Cuarto)
5. ✅ `supabase-schema-password-reset.sql` (Quinto)

---

## 📝 SCRIPT 1: `supabase-schema.sql`

**Qué crea**: Tabla `negocios_leads` (leads de negocios interesados)

### Pasos:

1. Ve a tu proyecto en Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. En el menú lateral, haz clic en **"SQL Editor"**
3. Haz clic en **"New query"** (botón verde)
4. Abre el archivo `supabase-schema.sql` en tu editor de código
5. **Copia TODO el contenido** del archivo (Ctrl+A, Ctrl+C)
6. **Pega** en el SQL Editor de Supabase (Ctrl+V)
7. Haz clic en **"Run"** (botón en la esquina inferior derecha) o presiona `Ctrl+Enter`
8. **Espera** a que termine (debería ser rápido, menos de 1 segundo)

### ✅ Verificación:

- Deberías ver: **"Success. No rows returned"** o similar
- Ve a **"Table Editor"** en el menú lateral
- Deberías ver la tabla **`negocios_leads`**
- Haz clic en `negocios_leads` → Deberías ver las columnas: `id`, `nombre_negocio`, `contacto_nombre`, etc.

### ⚠️ Si hay error:

- **Error "already exists"**: La tabla ya existe, está bien. Continúa con el siguiente script.
- **Otro error**: Copia el mensaje de error y compártelo.

---

## 📝 SCRIPT 2: `supabase-schema-productos.sql`

**Qué crea**: Tablas `negocios`, `productos`, `clientes`

### Pasos:

1. En el SQL Editor, haz clic en **"New query"** (nueva pestaña)
2. Abre el archivo `supabase-schema-productos.sql`
3. **Copia TODO el contenido**
4. **Pega** en el SQL Editor
5. Haz clic en **"Run"** o `Ctrl+Enter`

### ✅ Verificación:

- Deberías ver: **"Success. No rows returned"**
- Ve a **"Table Editor"**
- Deberías ver 3 nuevas tablas:
  - ✅ `negocios`
  - ✅ `productos`
  - ✅ `clientes`

### ⚠️ Si hay error:

- **Error "already exists"**: Las tablas ya existen, está bien. Continúa.
- **Error de foreign key**: Ejecuta primero el Script 1 si no lo hiciste.

---

## 📝 SCRIPT 3: `supabase-schema-negocios-auth.sql`

**Qué hace**: Agrega campos de autenticación a la tabla `negocios`

### Pasos:

1. **Nueva query** en SQL Editor
2. Abre `supabase-schema-negocios-auth.sql`
3. **Copia TODO el contenido**
4. **Pega** y ejecuta

### ✅ Verificación:

- Deberías ver: **"Success. No rows returned"**
- Ve a **"Table Editor"** → `negocios`
- Deberías ver estas columnas nuevas:
  - ✅ `email`
  - ✅ `password_hash`
  - ✅ `ultimo_login`

### ⚠️ Si hay error:

- **Error "column already exists"**: Los campos ya existen, está bien. Continúa.

---

## 📝 SCRIPT 4: `supabase-schema-pedidos.sql`

**Qué crea**: Tablas `pedidos` y `pedidos_items`

### Pasos:

1. **Nueva query** en SQL Editor
2. Abre `supabase-schema-pedidos.sql`
3. **Copia TODO el contenido**
4. **Pega** y ejecuta

### ✅ Verificación:

- Deberías ver: **"Success. No rows returned"**
- Ve a **"Table Editor"**
- Deberías ver 2 nuevas tablas:
  - ✅ `pedidos`
  - ✅ `pedidos_items`

### ⚠️ Si hay error:

- **Error "already exists"**: Las tablas ya existen, está bien.

---

## 📝 SCRIPT 5: `supabase-schema-password-reset.sql`

**Qué crea**: Tabla `password_reset_tokens`

### Pasos:

1. **Nueva query** en SQL Editor
2. Abre `supabase-schema-password-reset.sql`
3. **Copia TODO el contenido**
4. **Pega** y ejecuta

### ✅ Verificación:

- Deberías ver: **"Success. No rows returned"**
- Ve a **"Table Editor"**
- Deberías ver la tabla:
  - ✅ `password_reset_tokens`

---

## ✅ VERIFICACIÓN FINAL

Después de ejecutar todos los scripts, verifica que tengas estas tablas:

### Tablas que DEBEN existir:

1. ✅ `negocios_leads`
2. ✅ `negocios`
3. ✅ `productos`
4. ✅ `clientes`
5. ✅ `pedidos`
6. ✅ `pedidos_items`
7. ✅ `password_reset_tokens`

### Cómo verificar:

1. Ve a **"Table Editor"** en Supabase
2. Deberías ver todas las tablas listadas arriba
3. Haz clic en cada una y verifica que tenga las columnas correctas

---

## 🧪 PRUEBA RÁPIDA

Para verificar que todo funciona:

1. Ve a tu app: `http://localhost:3000/soy-negocio` (o tu URL)
2. Completa el formulario y envía
3. Ve a Supabase → **"Table Editor"** → `negocios_leads`
4. Deberías ver el registro que acabas de crear

Si esto funciona, ✅ **¡Los scripts están correctamente ejecutados!**

---

## ❌ SOLUCIÓN DE PROBLEMAS

### Error: "relation already exists"
- **Solución**: Está bien, la tabla ya existe. Continúa con el siguiente script.

### Error: "syntax error"
- **Solución**: Asegúrate de copiar TODO el contenido, sin omitir líneas
- Verifica que no hayas copiado comentarios de Markdown (#)

### Error: "permission denied"
- **Solución**: Asegúrate de estar en el proyecto correcto
- Verifica que tengas permisos de administrador

### Error: "function already exists"
- **Solución**: Está bien, la función ya existe. El script es idempotente.

### No veo las tablas después de ejecutar
- **Solución**: 
  1. Refresca la página de Table Editor (F5)
  2. Verifica que estés en el proyecto correcto
  3. Revisa los logs en SQL Editor para ver si hubo errores

---

## 📞 ¿NECESITAS AYUDA?

Si encuentras algún error que no puedas resolver:
1. Copia el mensaje de error completo
2. Indica qué script estabas ejecutando
3. Comparte la información y te ayudo a resolverlo

---

## ✅ CHECKLIST DE COMPLETACIÓN

Marca cada script cuando lo completes:

- [ ] Script 1: `supabase-schema.sql` ejecutado y verificado
- [ ] Script 2: `supabase-schema-productos.sql` ejecutado y verificado
- [ ] Script 3: `supabase-schema-negocios-auth.sql` ejecutado y verificado
- [ ] Script 4: `supabase-schema-pedidos.sql` ejecutado y verificado
- [ ] Script 5: `supabase-schema-password-reset.sql` ejecutado y verificado
- [ ] Verificación final: Todas las 7 tablas existen
- [ ] Prueba rápida: Crear un lead y verificar en Supabase

---

**¡Vamos a ejecutarlos uno por uno!** 🚀
