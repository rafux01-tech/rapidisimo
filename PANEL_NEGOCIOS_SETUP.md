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

**Nota importante**: Actualmente, las contraseñas se guardan directamente en la base de datos. Esto es **solo para desarrollo**. 

Para producción, deberías:
1. Usar una librería de hashing como `bcrypt` o `argon2`
2. Hashear la contraseña antes de guardarla
3. Comparar hashes al verificar login

Ejemplo con bcrypt (para implementar después):
```typescript
import bcrypt from 'bcrypt';

// Al crear/actualizar contraseña
const passwordHash = await bcrypt.hash(password, 10);

// Al verificar login
const isValid = await bcrypt.compare(password, negocio.password_hash);
```

## Flujo Completo

1. **Cliente/Negocio** llena el formulario en `/soy-negocio`
2. **Admin** ve el lead en `/admin`
3. **Admin** activa el negocio y configura email/contraseña
4. **Negocio** recibe las credenciales (por email, teléfono, etc.)
5. **Negocio** inicia sesión en `/negocio/login`
6. **Negocio** gestiona sus productos en `/negocio/panel`
7. **Clientes** ven los productos en `/menu` (solo productos de negocios activos)

## Próximos Pasos

- [ ] Implementar hashing de contraseñas
- [ ] Agregar funcionalidad para que negocios cambien su contraseña
- [ ] Agregar subida de imágenes para productos
- [ ] Implementar notificaciones cuando hay nuevos pedidos
- [ ] Agregar vista de pedidos para negocios
