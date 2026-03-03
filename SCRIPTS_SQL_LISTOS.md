# 📋 Scripts SQL Listos para Copiar y Pegar

Este documento contiene todos los scripts SQL listos para copiar directamente en Supabase.

---

## 🎯 INSTRUCCIONES RÁPIDAS

1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Haz clic en **"SQL Editor"** en el menú lateral
4. Haz clic en **"New query"**
5. Copia y pega cada script (uno a la vez)
6. Haz clic en **"Run"** o presiona `Ctrl+Enter`
7. Verifica que diga "Success"
8. Repite con el siguiente script

---

## 📝 SCRIPT 1: Tabla de Leads (PRIMERO)

Copia TODO desde aquí hasta "FIN SCRIPT 1":

```sql
-- Script SQL para crear la tabla de leads de negocios en Supabase
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase

-- Tabla para almacenar leads de negocios interesados
CREATE TABLE IF NOT EXISTS negocios_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_negocio TEXT NOT NULL,
  contacto_nombre TEXT NOT NULL,
  contacto_telefono TEXT NOT NULL,
  direccion TEXT NOT NULL,
  tipo_negocio TEXT NOT NULL,
  horario TEXT,
  estado TEXT NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'contactado', 'activado')),
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsquedas rápidas por estado
CREATE INDEX IF NOT EXISTS idx_negocios_leads_estado ON negocios_leads(estado);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_negocios_leads_creado_en ON negocios_leads(creado_en DESC);

-- Función para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar actualizado_en (eliminar si existe primero)
DROP TRIGGER IF EXISTS update_negocios_leads_updated_at ON negocios_leads;
CREATE TRIGGER update_negocios_leads_updated_at
  BEFORE UPDATE ON negocios_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS) - solo lectura desde la API
ALTER TABLE negocios_leads ENABLE ROW LEVEL SECURITY;

-- Política: permitir lectura pública (solo para la API)
DROP POLICY IF EXISTS "Permitir lectura pública de negocios_leads" ON negocios_leads;
CREATE POLICY "Permitir lectura pública de negocios_leads"
  ON negocios_leads
  FOR SELECT
  USING (true);

-- Política: permitir inserción pública (para el formulario)
DROP POLICY IF EXISTS "Permitir inserción pública de negocios_leads" ON negocios_leads;
CREATE POLICY "Permitir inserción pública de negocios_leads"
  ON negocios_leads
  FOR INSERT
  WITH CHECK (true);
```

**✅ Verificación**: Ve a "Table Editor" → Deberías ver `negocios_leads`

---

## 📝 SCRIPT 2: Tablas de Negocios, Productos y Clientes (SEGUNDO)

Copia TODO desde aquí hasta "FIN SCRIPT 2":

```sql
-- Script SQL para crear tablas de negocios/restaurantes y productos
-- Ejecuta esto en el SQL Editor de Supabase DESPUÉS de haber ejecutado supabase-schema.sql

-- Tabla para negocios/restaurantes activos
CREATE TABLE IF NOT EXISTS negocios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_negocio TEXT NOT NULL,
  contacto_nombre TEXT NOT NULL,
  contacto_telefono TEXT NOT NULL,
  direccion TEXT NOT NULL,
  sector TEXT,
  tipo_negocio TEXT NOT NULL,
  horario TEXT,
  activo BOOLEAN DEFAULT false,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para productos/items de los negocios
CREATE TABLE IF NOT EXISTS productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  nombre_en TEXT,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  categoria TEXT NOT NULL,
  categoria_en TEXT,
  imagen_url TEXT,
  disponible BOOLEAN DEFAULT true,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT,
  email TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_productos_negocio_id ON productos(negocio_id);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_disponible ON productos(disponible);
CREATE INDEX IF NOT EXISTS idx_negocios_activo ON negocios(activo);

-- Función para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar actualizado_en
DROP TRIGGER IF EXISTS update_negocios_updated_at ON negocios;
CREATE TRIGGER update_negocios_updated_at
  BEFORE UPDATE ON negocios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_productos_updated_at ON productos;
CREATE TRIGGER update_productos_updated_at
  BEFORE UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE negocios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Políticas para negocios: lectura pública, inserción pública
DROP POLICY IF EXISTS "Permitir lectura pública de negocios" ON negocios;
CREATE POLICY "Permitir lectura pública de negocios"
  ON negocios
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de negocios" ON negocios;
CREATE POLICY "Permitir inserción pública de negocios"
  ON negocios
  FOR INSERT
  WITH CHECK (true);

-- Políticas para productos: lectura pública de productos disponibles
DROP POLICY IF EXISTS "Permitir lectura pública de productos" ON productos;
CREATE POLICY "Permitir lectura pública de productos"
  ON productos
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de productos" ON productos;
CREATE POLICY "Permitir inserción pública de productos"
  ON productos
  FOR INSERT
  WITH CHECK (true);

-- Políticas para clientes: inserción pública, lectura propia (por ahora pública)
DROP POLICY IF EXISTS "Permitir lectura pública de clientes" ON clientes;
CREATE POLICY "Permitir lectura pública de clientes"
  ON clientes
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de clientes" ON clientes;
CREATE POLICY "Permitir inserción pública de clientes"
  ON clientes
  FOR INSERT
  WITH CHECK (true);
```

**✅ Verificación**: Deberías ver 3 nuevas tablas: `negocios`, `productos`, `clientes`

---

## 📝 SCRIPT 3: Autenticación de Negocios (TERCERO)

Copia TODO desde aquí hasta "FIN SCRIPT 3":

```sql
-- Script SQL para agregar autenticación a negocios
-- Ejecuta esto en el SQL Editor de Supabase DESPUÉS de haber ejecutado supabase-schema-productos.sql

-- Agregar campos de autenticación a la tabla negocios
ALTER TABLE negocios 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMPTZ;

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_negocios_email ON negocios(email);
```

**✅ Verificación**: Ve a "Table Editor" → `negocios` → Deberías ver columnas: `email`, `password_hash`, `ultimo_login`

---

## 📝 SCRIPT 4: Tablas de Pedidos (CUARTO)

Copia TODO desde aquí hasta "FIN SCRIPT 4":

```sql
-- Script SQL para crear tablas de pedidos y notificaciones
-- Ejecuta esto en el SQL Editor de Supabase DESPUÉS de haber ejecutado supabase-schema-productos.sql

-- Tabla para pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  numero_pedido TEXT NOT NULL UNIQUE,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'en_preparacion', 'listo', 'en_camino', 'entregado', 'cancelado')),
  metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('efectivo', 'tarjeta')),
  subtotal DECIMAL(10, 2) NOT NULL,
  costo_envio DECIMAL(10, 2) NOT NULL DEFAULT 49.00,
  total DECIMAL(10, 2) NOT NULL,
  direccion_entrega TEXT NOT NULL,
  telefono_cliente TEXT,
  notas TEXT,
  leido_por_negocio BOOLEAN DEFAULT false,
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para items de pedido (productos en el pedido)
CREATE TABLE IF NOT EXISTS pedidos_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto TEXT NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 1,
  subtotal DECIMAL(10, 2) NOT NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_pedidos_negocio_id ON pedidos(negocio_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_pedidos_creado_en ON pedidos(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_leido_por_negocio ON pedidos(leido_por_negocio);
CREATE INDEX IF NOT EXISTS idx_pedidos_items_pedido_id ON pedidos_items(pedido_id);

-- Trigger para actualizar actualizado_en en pedidos
DROP TRIGGER IF EXISTS update_pedidos_updated_at ON pedidos;
CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_items ENABLE ROW LEVEL SECURITY;

-- Políticas para pedidos: lectura pública (para API), inserción pública
DROP POLICY IF EXISTS "Permitir lectura pública de pedidos" ON pedidos;
CREATE POLICY "Permitir lectura pública de pedidos"
  ON pedidos
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de pedidos" ON pedidos;
CREATE POLICY "Permitir inserción pública de pedidos"
  ON pedidos
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización de pedidos" ON pedidos;
CREATE POLICY "Permitir actualización de pedidos"
  ON pedidos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Políticas para pedidos_items: lectura e inserción públicas
DROP POLICY IF EXISTS "Permitir lectura pública de pedidos_items" ON pedidos_items;
CREATE POLICY "Permitir lectura pública de pedidos_items"
  ON pedidos_items
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir inserción pública de pedidos_items" ON pedidos_items;
CREATE POLICY "Permitir inserción pública de pedidos_items"
  ON pedidos_items
  FOR INSERT
  WITH CHECK (true);
```

**✅ Verificación**: Deberías ver 2 nuevas tablas: `pedidos`, `pedidos_items`

---

## 📝 SCRIPT 5: Recuperación de Contraseña (QUINTO)

Copia TODO desde aquí hasta "FIN SCRIPT 5":

```sql
-- Script SQL para crear tabla de tokens de recuperación de contraseña
-- Ejecuta esto en el SQL Editor de Supabase DESPUÉS de haber ejecutado supabase-schema-negocios-auth.sql

-- Tabla para tokens de recuperación de contraseña
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  usado BOOLEAN DEFAULT false,
  expira_en TIMESTAMPTZ NOT NULL,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_negocio_id ON password_reset_tokens(negocio_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expira_en ON password_reset_tokens(expira_en);

-- Habilitar Row Level Security (RLS)
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Políticas: permitir inserción y lectura pública (para la API)
DROP POLICY IF EXISTS "Permitir inserción pública de password_reset_tokens" ON password_reset_tokens;
CREATE POLICY "Permitir inserción pública de password_reset_tokens"
  ON password_reset_tokens
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir lectura pública de password_reset_tokens" ON password_reset_tokens;
CREATE POLICY "Permitir lectura pública de password_reset_tokens"
  ON password_reset_tokens
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir actualización de password_reset_tokens" ON password_reset_tokens;
CREATE POLICY "Permitir actualización de password_reset_tokens"
  ON password_reset_tokens
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Función para limpiar tokens expirados (opcional, puede ejecutarse periódicamente)
CREATE OR REPLACE FUNCTION limpiar_tokens_expirados()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expira_en < NOW() OR usado = true;
END;
$$ LANGUAGE plpgsql;
```

**✅ Verificación**: Deberías ver la tabla `password_reset_tokens`

---

## ✅ VERIFICACIÓN FINAL

Después de ejecutar los 5 scripts, verifica en **"Table Editor"** que tengas estas 7 tablas:

1. ✅ `negocios_leads`
2. ✅ `negocios`
3. ✅ `productos`
4. ✅ `clientes`
5. ✅ `pedidos`
6. ✅ `pedidos_items`
7. ✅ `password_reset_tokens`

---

## 🧪 PRUEBA RÁPIDA

1. Ve a tu app: `http://localhost:3000/soy-negocio`
2. Completa y envía el formulario
3. Ve a Supabase → **"Table Editor"** → `negocios_leads`
4. Deberías ver el registro que acabas de crear

**Si esto funciona → ✅ ¡Los scripts están correctamente ejecutados!**

---

## ❓ ¿NECESITAS AYUDA?

Si encuentras algún error:
1. Copia el mensaje de error completo
2. Indica qué script estabas ejecutando
3. Comparte la información

---

**¡Vamos a ejecutarlos!** 🚀
