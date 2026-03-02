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

-- Nota: Para actualizar/eliminar, necesitarías autenticación adicional
-- Por ahora, solo lectura e inserción están permitidas
