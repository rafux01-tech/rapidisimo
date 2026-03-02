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
