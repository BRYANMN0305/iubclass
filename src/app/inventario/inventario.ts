import { Component, computed, signal } from '@angular/core';

type Estado = 'agotado' | 'bajo' | 'disponible';

interface Producto {
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

interface Fila extends Producto {
  estado: Estado;
}

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.html',
  styles: `
    .etq { border-radius: 999px; padding: .1rem .6rem; font-size: .72rem; font-weight: 700; }
    .rojo { background: #fee2e2; color: #991b1b; }
    .ambar { background: #fef3c7; color: #92400e; }
    .verde { background: #d1fae5; color: #065f46; }
  `,
})
export class Inventario {
  categorias = ['Todas', 'Frutas', 'Verduras', 'Granos'];

  filtro = signal('Todas');

  productos = signal<Producto[]>([
    { nombre: 'Mango', categoria: 'Frutas', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', categoria: 'Frutas', precio: 1200, cantidad: 0 },
    { nombre: 'Patilla', categoria: 'Frutas', precio: 6500, cantidad: 2 },
    { nombre: 'Tomate', categoria: 'Verduras', precio: 3200, cantidad: 9 },
    { nombre: 'Cebolla', categoria: 'Verduras', precio: 2800, cantidad: 1 },
    { nombre: 'Ahuyama', categoria: 'Verduras', precio: 4500, cantidad: 0 },
  ]);

  visibles = computed(() => {
    const categoria = this.filtro();
    if (categoria === 'Todas') return this.productos();
    return this.productos().filter((p) => p.categoria === categoria);
  });

  filas = computed<Fila[]>(() =>
    this.visibles().map((p) => ({ ...p, estado: this.estadoDe(p.cantidad) })),
  );

  private estadoDe(cantidad: number): Estado {
    if (cantidad === 0) return 'agotado';
    return cantidad < 3 ? 'bajo' : 'disponible';
  }
}
