-- Script SQL para crear tablas de pedidos y notificaciones
-- Ejecuta esto en el SQL Editor de Supabase DESPUÉS de haber ejecutado supabase-schema-productos.sql

-- Tabla para pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  negocio_id UUID NOT NULL REFERENCES negocios(id) ON DELETE CASCADE,
  numero_pedido TEXT NOT NULL UNIQUE, -- Ej: PED-1234567890
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'en_preparacion', 'listo', 'en_camino', 'entregado', 'cancelado')),
  metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('efectivo', 'tarjeta')),
  subtotal DECIMAL(10, 2) NOT NULL,
  costo_envio DECIMAL(10, 2) NOT NULL DEFAULT 49.00,
  total DECIMAL(10, 2) NOT NULL,
  direccion_entrega TEXT NOT NULL,
  telefono_cliente TEXT,
  notas TEXT, -- Notas del cliente
  leido_por_negocio BOOLEAN DEFAULT false, -- Para notificaciones
  creado_en TIMESTAMPTZ DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla para items de pedido (productos en el pedido)
CREATE TABLE IF NOT EXISTS pedidos_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE SET NULL,
  nombre_producto TEXT NOT NULL, -- Guardamos el nombre por si el producto se elimina
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
