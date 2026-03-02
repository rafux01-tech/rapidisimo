# Configuración de Supabase para Rapidisimo

Este documento explica cómo configurar Supabase para que los datos de negocios se guarden de forma persistente.

## Paso 1: Crear cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en "Start your project" o "Sign up"
3. Inicia sesión con GitHub (recomendado) o crea una cuenta nueva
4. Crea un nuevo proyecto:
   - **Name**: `rapidisimo` (o el que prefieras)
   - **Database Password**: Elige una contraseña segura (guárdala, la necesitarás)
   - **Region**: Elige la más cercana (ej: `US East (N. Virginia)`)
   - Espera 1-2 minutos mientras se crea el proyecto

## Paso 2: Crear la tabla en la base de datos

1. En tu proyecto de Supabase, ve a **SQL Editor** (menú lateral izquierdo)
2. Haz clic en **"New query"**
3. Copia y pega el contenido completo del archivo `supabase-schema.sql`
4. Haz clic en **"Run"** (o presiona `Ctrl+Enter`)
5. Deberías ver un mensaje de éxito: "Success. No rows returned"

## Paso 3: Obtener las credenciales de API

1. En Supabase, ve a **Settings** (icono de engranaje) → **API**
2. Encontrarás dos valores importantes:
   - **Project URL**: Algo como `https://xxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJ...`

## Paso 4: Configurar variables de entorno en Vercel

1. Ve a tu proyecto en Vercel: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `rapidisimo`
3. Ve a **Settings** → **Environment Variables**
4. Agrega estas dos variables:

   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
     **Value**: Tu Project URL de Supabase (ej: `https://xxxxx.supabase.co`)
   
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     **Value**: Tu anon public key de Supabase

5. Asegúrate de que ambas estén marcadas para **Production**, **Preview**, y **Development**
6. Haz clic en **Save**

## Paso 5: Configurar variables de entorno localmente (opcional)

Si quieres probar con Supabase en tu PC local:

1. Crea un archivo `.env.local` en la raíz del proyecto (junto a `package.json`)
2. Agrega estas líneas:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

3. Reinicia tu servidor de desarrollo: `npm run dev`

## Paso 6: Redeploy en Vercel

1. En Vercel, ve a tu proyecto
2. Haz clic en **Deployments**
3. Encuentra el último deployment y haz clic en los tres puntos `...`
4. Selecciona **"Redeploy"**
5. Espera a que termine el deploy

## Verificar que funciona

1. Ve a tu app en Vercel: `https://tu-url.vercel.app/soy-negocio`
2. Llena el formulario y envía un lead
3. Ve a `/admin` y verifica que el lead aparezca en la tabla
4. En Supabase, ve a **Table Editor** → **negocios_leads** y deberías ver el registro

## Notas importantes

- **Los datos ahora persisten**: Aunque reinicies Vercel o el servidor, los datos se mantienen en Supabase
- **Plan gratuito**: Supabase tiene un tier gratuito generoso (500MB de base de datos, suficiente para empezar)
- **Seguridad**: Las políticas RLS (Row Level Security) están configuradas para permitir solo lectura e inserción pública. Para actualizar/eliminar, necesitarías autenticación adicional.

## Troubleshooting

**Error: "Faltan variables de entorno de Supabase"**
- Verifica que las variables estén configuradas en Vercel
- Asegúrate de que los nombres sean exactamente: `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Haz redeploy después de agregar las variables

**Error: "relation 'negocios_leads' does not exist"**
- Asegúrate de haber ejecutado el script SQL en Supabase
- Verifica en **Table Editor** que la tabla `negocios_leads` existe

**Los datos no aparecen**
- Verifica en Supabase **Table Editor** si los datos se están guardando
- Revisa la consola del navegador (F12) para ver errores
- Verifica que las políticas RLS estén correctamente configuradas
