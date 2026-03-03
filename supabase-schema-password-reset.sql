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
