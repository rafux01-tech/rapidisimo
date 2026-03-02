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

export const pedidosAdminMock: PedidoAdmin[] = [
  {
    id: "RPD-00123",
    cliente: "María G.",
    restaurante: "Pica Pollo La Esquina",
    sector: "Villa Juana",
    total: 780,
    estado: "en_camino",
    creadoHaceMin: 18,
  },
  {
    id: "RPD-00122",
    cliente: "Carlos R.",
    restaurante: "Burgers 809",
    sector: "Naco",
    total: 1_250,
    estado: "en_preparacion",
    creadoHaceMin: 27,
  },
  {
    id: "RPD-00121",
    cliente: "Ana P.",
    restaurante: "Sushi Piantini",
    sector: "Piantini",
    total: 2_050,
    estado: "entregado",
    creadoHaceMin: 64,
  },
  {
    id: "RPD-00120",
    cliente: "Luis D.",
    restaurante: "Comida Criolla Doña Lila",
    sector: "Gazcue",
    total: 620,
    estado: "problema",
    creadoHaceMin: 90,
  },
];

export const negociosLeadsAdminMock: NegocioLeadAdmin[] = [
  {
    id: "NEG-0005",
    nombreNegocio: "Pica Pollo La Esquina",
    contactoNombre: "José",
    contactoTelefono: "8XX-XXX-0001",
    sector: "Villa Juana",
    tipoNegocio: "Pica pollo",
    estado: "activado",
    creadoHaceHoras: 72,
  },
  {
    id: "NEG-0006",
    nombreNegocio: "Colmado La 27",
    contactoNombre: "Carolina",
    contactoTelefono: "8XX-XXX-0002",
    sector: "Ens. La Fé",
    tipoNegocio: "Colmado",
    estado: "contactado",
    creadoHaceHoras: 36,
  },
  {
    id: "NEG-0007",
    nombreNegocio: "Tostones & Más",
    contactoNombre: "Miguel",
    contactoTelefono: "8XX-XXX-0003",
    sector: "Los Prados",
    tipoNegocio: "Comida rápida",
    estado: "nuevo",
    creadoHaceHoras: 5,
  },
];

