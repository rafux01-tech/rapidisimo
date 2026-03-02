export type EstadoPedidoAdmin =
  | "pendiente"
  | "en_preparacion"
  | "en_camino"
  | "entregado"
  | "problema";

export interface PedidoAdmin {
  id: string;
  cliente: string;
  restaurante: string;
  sector: string;
  total: number;
  estado: EstadoPedidoAdmin;
  creadoHaceMin: number;
}

export interface NegocioLeadAdmin {
  id: string;
  nombreNegocio: string;
  contactoNombre: string;
  contactoTelefono: string;
  sector: string;
  tipoNegocio: string;
  estado: "nuevo" | "contactado" | "activado";
  creadoHaceHoras: number;
}

// Arrays vacíos - solo datos reales
export const pedidosAdminMock: PedidoAdmin[] = [];
export const negociosLeadsAdminMock: NegocioLeadAdmin[] = [];

