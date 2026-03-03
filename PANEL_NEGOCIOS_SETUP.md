# Panel de Negocios - Guía de Configuración

## Resumen

Se ha implementado un sistema completo para que los negocios puedan gestionar sus propios productos. Los negocios pueden:
- Iniciar sesión con email y contraseña
- Ver todos sus productos
- Agregar nuevos productos
- Editar productos existentes
- Eliminar productos
- Cambiar disponibilidad de productos

## Pasos de Configuración

### 1. Ejecutar Script SQL de Autenticación

Primero, necesitas agregar los campos de autenticación a la tabla `negocios`:

1. Ve a tu proyecto de Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `supabase-schema-negocios-auth.sql`
4. Ejecuta el script

Este script agrega:
- `email`: Email del negocio para login
- `password_hash`: Contraseña (por ahora se guarda directamente, en producción usar hash)
- `ultimo_login`: Timestamp del último inicio de sesión

### 2. Activar Negocios con Credenciales

Cuando actives un negocio desde el panel de admin (`/admin`):

1. Haz clic en el botón **"Activar"** de un lead
2. Se abrirá un modal donde debes ingresar:
   - **Email**: Email que el negocio usará para iniciar sesión
   - **Contraseña**: Contraseña temporal (el negocio puede cambiarla después)
3. Haz clic en **"Activar Negocio"**

El sistema verificará que el email no esté en uso y creará el negocio activo con las credenciales.

### 3. Acceso para Negocios

Los negocios pueden acceder a su panel en:

**URL**: `/negocio/login`

Desde ahí pueden:
- Iniciar sesión con el email y contraseña que configuraste
- Acceder a su panel de gestión de productos en `/negocio/panel`

### 4. Gestión de Productos

Una vez que un negocio inicia sesión, puede:

1. **Ver todos sus productos** en una tabla
2. **Agregar nuevo producto**:
   - Haz clic en "+ Agregar Producto"
   - Completa el formulario:
     - Nombre del producto (requerido)
     - Precio en RD$ (requerido)
     - Categoría (requerido)
     - Descripción (opcional)
     - Disponibilidad (checkbox)
   - Haz clic en "Agregar Producto"

3. **Editar producto**:
   - Haz clic en "Editar" en la fila del producto
   - Modifica los campos necesarios
   - Haz clic en "Actualizar"

4. **Eliminar producto**:
   - Haz clic en "Eliminar" en la fila del producto
   - Confirma la eliminación

5. **Cambiar disponibilidad**:
   - Edita el producto y marca/desmarca "Producto disponible"

## Estructura de Archivos Creados

### API Routes
- `/api/negocios/auth/login` - Login de negocios
- `/api/negocios/auth/check` - Verificar autenticación
- `/api/negocios/auth/logout` - Cerrar sesión
- `/api/negocios/productos` - GET (listar) y POST (crear) productos
- `/api/negocios/productos/[id]` - PUT (actualizar) y DELETE (eliminar) productos

### Páginas
- `/negocio/login` - Página de login para negocios
- `/negocio/panel` - Panel de gestión de productos

### Scripts SQL
- `supabase-schema-negocios-auth.sql` - Agrega campos de autenticación

## Seguridad

✅ **Implementado**: Las contraseñas ahora se hashean con `bcrypt` antes de guardarse en la base de datos.

### Características de seguridad:
- **Hashing con bcrypt**: Todas las contraseñas se hashean con 10 salt rounds antes de guardarse
- **Comparación segura**: El login compara hashes usando `bcrypt.compare()`
- **Migración gradual**: El sistema soporta contraseñas legacy sin hashear (para negocios activados antes de esta actualización)
- **Cambio de contraseña**: Los negocios pueden cambiar su contraseña desde el panel, requiriendo la contraseña actual

### Cambiar contraseña:
1. Inicia sesión en `/negocio/panel`
2. En la sección "Configuración de cuenta", haz clic en "Cambiar contraseña"
3. Ingresa tu contraseña actual y la nueva contraseña (mínimo 6 caracteres)
4. Confirma la nueva contraseña
5. Haz clic en "Actualizar contraseña"

## Flujo Completo

1. **Cliente/Negocio** llena el formulario en `/soy-negocio`
2. **Admin** ve el lead en `/admin`
3. **Admin** activa el negocio y configura email/contraseña
4. **Negocio** recibe las credenciales (por email, teléfono, etc.)
5. **Negocio** inicia sesión en `/negocio/login`
6. **Negocio** gestiona sus productos en `/negocio/panel`
7. **Clientes** ven los productos en `/menu` (solo productos de negocios activos)

## Próximos Pasos

- [x] Implementar hashing de contraseñas ✅
- [x] Agregar funcionalidad para que negocios cambien su contraseña ✅
- [x] Agregar subida de imágenes para productos ✅
- [x] Implementar notificaciones cuando hay nuevos pedidos ✅
- [x] Agregar vista de pedidos para negocios ✅
- [x] Agregar recuperación de contraseña (reset por email) ✅

## Sistema de Pedidos y Notificaciones

✅ **Implementado**: Sistema completo de pedidos con notificaciones en tiempo real.

### Características:
- **Notificaciones automáticas**: Badge rojo muestra el número de pedidos no leídos
- **Polling en tiempo real**: Verifica nuevos pedidos cada 30 segundos
- **Gestión de pedidos**: Ver detalles, marcar como leído, actualizar estado
- **Estados de pedidos**: Pendiente → Confirmado → En preparación → Listo → En camino → Entregado

Ver `PEDIDOS_SETUP.md` para más detalles sobre la configuración y uso.

## Recuperación de Contraseña

✅ **Implementado**: Sistema completo de recuperación de contraseña por email.

### Características:
- **Solicitud de recuperación**: Los negocios pueden solicitar un enlace desde `/negocio/login`
- **Tokens seguros**: Tokens únicos con expiración de 1 hora
- **Emails profesionales**: Emails HTML con diseño responsive
- **Seguridad**: Previene enumeración de emails

### Configuración requerida:
1. **Crear tabla en Supabase**: Ejecuta `supabase-schema-password-reset.sql`
2. **Configurar Resend**: Crea cuenta en Resend y agrega `RESEND_API_KEY` en Vercel
3. **Configurar URL base** (opcional): Agrega `NEXT_PUBLIC_BASE_URL` en Vercel

Ver `PASSWORD_RESET_SETUP.md` para instrucciones detalladas.

## Subida de Imágenes

✅ **Implementado**: Los negocios ahora pueden subir imágenes para sus productos.

### Configuración requerida:

1. **Crear bucket en Supabase Storage**:
   - Ve a Supabase → Storage
   - Crea un bucket llamado `productos-imagenes` (debe ser público)
   - Configura las políticas de acceso según `SUPABASE_STORAGE_SETUP.md`

2. **Uso**:
   - Al agregar o editar un producto, selecciona una imagen
   - Formatos permitidos: JPG, PNG, WEBP
   - Tamaño máximo: 5MB
   - La imagen se sube automáticamente antes de guardar el producto
   - Las imágenes aparecen en el menú público (`/menu`)