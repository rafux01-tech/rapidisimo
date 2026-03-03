import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase";

const tieneSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export interface ItemPedido {
  productoId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface CrearPedidoPayload {
  clienteId?: string;
  items: ItemPedido[];
  metodoPago: "efectivo" | "tarjeta";
  direccionEntrega: string;
  telefonoCliente?: string;
  notas?: string;
}

// POST: Crear un nuevo pedido
export async function POST(request: Request) {
  if (!tieneSupabase) {
    return NextResponse.json(
      { error: "Base de datos no configurada" },
      { status: 500 },
    );
  }

  try {
    const body = (await request.json()) as CrearPedidoPayload;
    const {
      clienteId,
      items,
      metodoPago,
      direccionEntrega,
      telefonoCliente,
      notas,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "El pedido debe tener al menos un item" },
        { status: 400 },
      );
    }

    if (!metodoPago || !direccionEntrega) {
      return NextResponse.json(
        { error: "Método de pago y dirección son requeridos" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();

    // Calcular totales
    const subtotal = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0,
    );
    const costoEnvio = 49.0;
    const total = subtotal + costoEnvio;

    // Obtener el negocio_id del primer producto
    const primerProductoId = items[0].productoId;
    const { data: primerProducto, error: productoError } = await supabase
      .from("productos")
      .select("negocio_id")
      .eq("id", primerProductoId)
      .single();

    if (productoError || !primerProducto) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    const negocioId = primerProducto.negocio_id;

    // Verificar que todos los productos pertenecen al mismo negocio
    for (const item of items) {
      const { data: producto } = await supabase
        .from("productos")
        .select("negocio_id")
        .eq("id", item.productoId)
        .single();

      if (!producto || producto.negocio_id !== negocioId) {
        return NextResponse.json(
          { error: "Todos los productos deben ser del mismo negocio" },
          { status: 400 },
        );
      }
    }

    // Generar número de pedido único
    const numeroPedido = `PED-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    // Crear el pedido
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        cliente_id: clienteId || null,
        negocio_id: negocioId,
        numero_pedido: numeroPedido,
        estado: "pendiente",
        metodo_pago: metodoPago,
        subtotal: subtotal,
        costo_envio: costoEnvio,
        total: total,
        direccion_entrega: direccionEntrega,
        telefono_cliente: telefonoCliente || null,
        notas: notas || null,
        leido_por_negocio: false,
      })
      .select()
      .single();

    if (pedidoError) {
      console.error("Error creando pedido:", pedidoError);
      return NextResponse.json(
        { error: "Error al crear el pedido" },
        { status: 500 },
      );
    }

    // Crear los items del pedido
    const itemsParaInsertar = items.map((item) => ({
      pedido_id: pedido.id,
      producto_id: item.productoId,
      nombre_producto: item.nombre,
      precio_unitario: item.precio,
      cantidad: item.cantidad,
      subtotal: item.precio * item.cantidad,
    }));

    const { error: itemsError } = await supabase
      .from("pedidos_items")
      .insert(itemsParaInsertar);

    if (itemsError) {
      console.error("Error creando items del pedido:", itemsError);
      // Intentar eliminar el pedido creado
      await supabase.from("pedidos").delete().eq("id", pedido.id);
      return NextResponse.json(
        { error: "Error al crear los items del pedido" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        pedido: {
          id: pedido.id,
          numeroPedido: pedido.numero_pedido,
        },
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Error en POST /api/pedidos:", err);
    return NextResponse.json(
      { error: "Error al procesar el pedido" },
      { status: 500 },
    );
  }
}
