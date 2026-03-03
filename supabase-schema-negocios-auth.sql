-- Script SQL para agregar autenticación a negocios
-- Ejecuta esto en el SQL Editor de Supabase DESPUÉS de haber ejecutado supabase-schema-productos.sql

-- Agregar campos de autenticación a la tabla negocios
ALTER TABLE negocios 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMPTZ;

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_negocios_email ON negocios(email);

-- Nota: En producción, deberías usar un hash seguro (bcrypt, argon2, etc.)
-- Por ahora, guardaremos un hash simple. Para producción real, usa una función de hash segura.
