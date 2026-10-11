// =============================================================================
//  Taller 03 · Tipos compartidos por los tres componentes
// -----------------------------------------------------------------------------
//  Cuando dos componentes intercambian datos, los dos necesitan conocer la
//  forma de ese dato. Por eso las interfaces viven en un archivo propio:
//  Pedido declara el catálogo y el estado, TarjetaProducto declara el input
//  del producto y ResumenPedido declara el input de las líneas.
// =============================================================================

// Tabla 1 del enunciado: el catálogo que el padre ofrece.
export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

// Una línea del pedido: qué producto es y cuántas unidades hay de él.
export interface Linea {
  nombre: string;
  precio: number;
  cantidad: number;
}
