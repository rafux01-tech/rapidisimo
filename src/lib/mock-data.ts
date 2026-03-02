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

export const productos: Producto[] = [
  { id: "1", nombre: "Agua 500ml", nombreEn: "Water 500ml", precio: 25, categoria: "bebidas" },
  { id: "2", nombre: "Refresco 2L", nombreEn: "Soda 2L", precio: 95, categoria: "bebidas" },
  { id: "3", nombre: "Jugo natural 1L", nombreEn: "Natural juice 1L", precio: 120, categoria: "bebidas" },
  { id: "4", nombre: "Cerveza 355ml", nombreEn: "Beer 355ml", precio: 85, categoria: "bebidas" },
  { id: "5", nombre: "Café 200g", nombreEn: "Coffee 200g", precio: 185, categoria: "bebidas" },
  { id: "6", nombre: "Té verde caja", nombreEn: "Green tea box", precio: 75, categoria: "bebidas" },
  { id: "7", nombre: "Papas fritas", nombreEn: "Chips", precio: 65, categoria: "snacks" },
  { id: "8", nombre: "Galletas", nombreEn: "Cookies", precio: 55, categoria: "snacks" },
  { id: "9", nombre: "Chocolate", nombreEn: "Chocolate", precio: 75, categoria: "snacks" },
  { id: "10", nombre: "Maní salado", nombreEn: "Salted peanuts", precio: 45, categoria: "snacks" },
  { id: "11", nombre: "Detergente 1kg", nombreEn: "Detergent 1kg", precio: 180, categoria: "limpieza" },
  { id: "12", nombre: "Jabón líquido", nombreEn: "Liquid soap", precio: 110, categoria: "limpieza" },
  { id: "13", nombre: "Cloro 1L", nombreEn: "Bleach 1L", precio: 65, categoria: "limpieza" },
  { id: "14", nombre: "Arroz 1lb", nombreEn: "Rice 1lb", precio: 45, categoria: "abarrotes" },
  { id: "15", nombre: "Habichuelas 1lb", nombreEn: "Beans 1lb", precio: 55, categoria: "abarrotes" },
  { id: "16", nombre: "Aceite 1L", nombreEn: "Oil 1L", precio: 220, categoria: "abarrotes" },
  { id: "17", nombre: "Salsa de tomate", nombreEn: "Tomato sauce", precio: 85, categoria: "abarrotes" },
  { id: "18", nombre: "Leche 1L", nombreEn: "Milk 1L", precio: 95, categoria: "lacteos" },
  { id: "19", nombre: "Queso crema", nombreEn: "Cream cheese", precio: 150, categoria: "lacteos" },
  { id: "20", nombre: "Yogurt", nombreEn: "Yogurt", precio: 45, categoria: "lacteos" },
  { id: "21", nombre: "Pan de agua", nombreEn: "Water bread", precio: 35, categoria: "panaderia" },
  { id: "22", nombre: "Pan integral", nombreEn: "Whole wheat bread", precio: 65, categoria: "panaderia" },
  { id: "23", nombre: "Dulce de leche", nombreEn: "Dulce de leche", precio: 120, categoria: "panaderia" },
];

export const costoEnvio = 49;
export const ordenMinima = 150;
