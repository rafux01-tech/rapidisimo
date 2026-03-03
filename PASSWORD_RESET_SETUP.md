# Recuperación de Contraseña por Email - Guía de Configuración

## Resumen

Se ha implementado un sistema completo de recuperación de contraseña por email para negocios. Los negocios pueden solicitar un enlace de recuperación que se envía a su email.

## Características

✅ **Solicitud de recuperación**: Los negocios pueden solicitar un enlace de recuperación
✅ **Tokens seguros**: Tokens únicos con expiración de 1 hora
✅ **Emails HTML**: Emails profesionales con diseño responsive
✅ **Seguridad**: Previene enumeración de emails (siempre retorna éxito)
✅ **Validación de tokens**: Verifica que el token sea válido antes de permitir reset

## Paso 1: Crear la tabla en Supabase

1. Ve a tu proyecto en Supabase → **SQL Editor**
2. Ejecuta el script `supabase-schema-password-reset.sql`
3. Verifica que se creó la tabla:
   - `password_reset_tokens`

## Paso 2: Configurar Resend (Servicio de Email)

### Opción A: Usar Resend (Recomendado)

1. **Crear cuenta en Resend**:
   - Ve a [https://resend.com](https://resend.com)
   - Crea una cuenta gratuita
   - Verifica tu dominio o usa el dominio de prueba

2. **Obtener API Key**:
   - Ve a **API Keys** en el dashboard de Resend
   - Crea una nueva API Key
   - Copia la clave (empieza con `re_`)

3. **Configurar en Vercel**:
   - Ve a tu proyecto en Vercel → **Settings** → **Environment Variables**
   - Agrega:
     - **Name**: `RESEND_API_KEY`
     - **Value**: Tu API Key de Resend
     - Marca para **Production**, **Preview**, y **Development**
   - Haz clic en **Save**

4. **Configurar dominio (opcional)**:
   - En Resend, verifica tu dominio
   - Actualiza el `from` en `src/lib/email.ts`:
     ```typescript
     from: "Rapidisimo <noreply@tudominio.com>",
     ```

### Opción B: Usar otro servicio de email

Si prefieres usar otro servicio (SendGrid, Mailgun, etc.), modifica `src/lib/email.ts` para usar su SDK.

## Paso 3: Configurar URL base (Opcional)

Si tu aplicación está en producción, configura la URL base:

1. En Vercel → **Settings** → **Environment Variables**
2. Agrega:
   - **Name**: `NEXT_PUBLIC_BASE_URL`
   - **Value**: `https://tu-dominio.vercel.app` (o tu dominio personalizado)
   - Marca para **Production**, **Preview**, y **Development**

Si no configuras esto, se usará automáticamente la URL de Vercel.

## Paso 4: Flujo de Recuperación

### Para Negocios:

1. **Solicitar recuperación**:
   - Van a `/negocio/login`
   - Hacen clic en "¿Olvidaste tu contraseña?"
   - Ingresan su email
   - Reciben confirmación (por seguridad, siempre muestra éxito)

2. **Recibir email**:
   - Reciben un email con un enlace de recuperación
   - El enlace expira en 1 hora
   - El enlace solo puede usarse una vez

3. **Restablecer contraseña**:
   - Hacen clic en el enlace del email
   - Se verifica que el token sea válido
   - Ingresan su nueva contraseña (mínimo 6 caracteres)
   - Confirman la contraseña
   - Son redirigidos al login

## Estructura de Datos

### Tabla `password_reset_tokens`:
- `id`: UUID del token
- `negocio_id`: Referencia al negocio
- `token`: Token único (32 bytes hexadecimal)
- `email`: Email del negocio
- `usado`: Boolean (si el token ya fue usado)
- `expira_en`: Timestamp de expiración (1 hora después de creación)
- `creado_en`: Timestamp de creación

## APIs Creadas

### `/api/negocios/auth/forgot-password` (POST)
- Solicita recuperación de contraseña
- Body: `{ email: string }`
- Retorna: `{ success: true, message: string }`
- **Seguridad**: Siempre retorna éxito para prevenir enumeración de emails

### `/api/negocios/auth/reset-password` (POST)
- Restablece la contraseña con un token
- Body: `{ token: string, nuevaPassword: string }`
- Retorna: `{ success: true, message: string }`

### `/api/negocios/auth/reset-password` (GET)
- Verifica si un token es válido
- Query params: `token`
- Retorna: `{ valid: boolean, reason?: string }`

## Páginas Creadas

### `/negocio/forgot-password`
- Formulario para solicitar recuperación
- Ingresa email
- Muestra confirmación

### `/negocio/reset-password?token=...`
- Verifica el token
- Formulario para nueva contraseña
- Valida que las contraseñas coincidan
- Redirige al login después de éxito

## Seguridad

### Características de seguridad implementadas:

1. **Prevención de enumeración**: Siempre retorna éxito aunque el email no exista
2. **Tokens únicos**: Tokens de 32 bytes generados con crypto
3. **Expiración**: Tokens expiran en 1 hora
4. **Uso único**: Cada token solo puede usarse una vez
5. **Validación**: Verifica token antes de permitir reset
6. **Hashing**: Nueva contraseña se hashea con bcrypt antes de guardar

## Personalización

### Cambiar tiempo de expiración:

En `src/app/api/negocios/auth/forgot-password/route.ts`:

```typescript
// Cambiar de 1 hora a otro valor
expiraEn.setHours(expiraEn.getHours() + 2); // 2 horas
```

### Personalizar email:

Modifica el HTML en `src/lib/email.ts` para cambiar el diseño del email.

### Cambiar dominio del email:

En `src/lib/email.ts`:

```typescript
from: "Rapidisimo <noreply@tudominio.com>",
```

## Troubleshooting

### Error: "RESEND_API_KEY no configurada"
- Verifica que la variable de entorno esté configurada en Vercel
- Asegúrate de hacer redeploy después de agregar la variable

### Los emails no llegan
- Verifica que la API Key de Resend sea correcta
- Revisa la carpeta de spam
- Verifica que el dominio esté verificado en Resend (si usas dominio personalizado)
- Revisa los logs de Resend en su dashboard

### Token inválido o expirado
- Los tokens expiran en 1 hora
- Cada token solo puede usarse una vez
- Solicita un nuevo enlace si el token expiró

### Error al verificar token
- Verifica que la tabla `password_reset_tokens` exista en Supabase
- Verifica que las políticas RLS estén configuradas correctamente

## Próximos Pasos

- [ ] Agregar límite de intentos de recuperación por email
- [ ] Agregar notificación cuando se cambia la contraseña
- [ ] Agregar historial de cambios de contraseña
- [ ] Implementar recuperación para clientes (no solo negocios)
