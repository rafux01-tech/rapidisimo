# Configuración de Supabase Storage para Imágenes de Productos

Este documento explica cómo configurar Supabase Storage para que los negocios puedan subir imágenes de sus productos.

## Paso 1: Crear el bucket de almacenamiento

1. Ve a tu proyecto en Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. En el menú lateral, haz clic en **Storage**
3. Haz clic en **"New bucket"** o **"Create bucket"**
4. Configura el bucket:
   - **Name**: `productos-imagenes` (debe ser exactamente este nombre)
   - **Public bucket**: ✅ **Marca esta opción** (para que las imágenes sean accesibles públicamente)
   - **File size limit**: `5242880` (5MB en bytes) o deja el valor por defecto
   - **Allowed MIME types**: Deja vacío o agrega: `image/jpeg,image/jpg,image/png,image/webp`
5. Haz clic en **"Create bucket"**

## Paso 2: Configurar políticas de acceso (RLS)

1. En la página de Storage, haz clic en el bucket `productos-imagenes`
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New policy"** o **"Create policy"**

### Política 1: Permitir lectura pública (SELECT)

- **Policy name**: `Permitir lectura pública de imágenes`
- **Allowed operation**: `SELECT`
- **Policy definition**: 
  ```sql
  (bucket_id = 'productos-imagenes')
  ```
- Haz clic en **"Review"** y luego **"Save policy"**

### Política 2: Permitir subida a negocios autenticados (INSERT)

- **Policy name**: `Permitir subida a negocios autenticados`
- **Allowed operation**: `INSERT`
- **Policy definition**:
  ```sql
  (bucket_id = 'productos-imagenes')
  ```
- Haz clic en **"Review"** y luego **"Save policy"**

**Nota**: Para mayor seguridad, podrías restringir la subida solo a negocios autenticados usando RLS avanzado, pero por ahora esta configuración básica funcionará.

## Paso 3: Verificar configuración

1. Ve a **Storage** → **productos-imagenes**
2. Deberías ver el bucket creado
3. Las políticas deberían estar activas

## Estructura de archivos

Las imágenes se guardarán con la siguiente estructura:
```
productos-imagenes/
  └── {negocio_id}/
      └── {timestamp}-{random}.{ext}
```

Ejemplo:
```
productos-imagenes/
  └── 123e4567-e89b-12d3-a456-426614174000/
      └── 1703123456789-abc123def456.jpg
```

## Límites y restricciones

- **Tamaño máximo**: 5MB por imagen
- **Tipos permitidos**: JPG, JPEG, PNG, WEBP
- **Formato**: Las imágenes se guardan con nombres únicos para evitar conflictos

## Solución de problemas

### Error: "Bucket not found"
- Verifica que el bucket se llame exactamente `productos-imagenes`
- Verifica que el bucket esté marcado como público

### Error: "Permission denied"
- Verifica que las políticas de RLS estén configuradas correctamente
- Asegúrate de que el bucket sea público

### Error: "File too large"
- Verifica el tamaño del archivo (máximo 5MB)
- Comprime la imagen antes de subirla si es necesario

### Las imágenes no se muestran
- Verifica que el bucket sea público
- Verifica que la URL pública esté correctamente generada
- Revisa la consola del navegador para ver errores de CORS
