export interface Producto {
  id: string;
  nombre: string;
  nombreEn?: string;
  precio: number;
  categoria: string;
  categoriaEn?: string;
  imagen?: string;
}

export const categorias = [
  { id: "bebidas", nombre: "Bebidas", nombreEn: "Drinks" },
  { id: "snacks", nombre: "Snacks", nombreEn: "Snacks" },
  { id: "limpieza", nombre: "Limpieza", nombreEn: "Cleaning" },
  { id: "abarrotes", nombre: "Abarrotes", nombreEn: "Groceries" },
  { id: "lacteos", nombre: "Lácteos", nombreEn: "Dairy" },
  { id: "panaderia", nombre: "Panadería", nombreEn: "Bakery" },
];

// Productos vacíos - se cargarán desde restaurantes reales cuando se implemente
export const productos: Producto[] = [];

export const costoEnvio = 49;
export const ordenMinima = 150;
