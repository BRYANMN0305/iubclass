import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FichaProducto, Producto } from './ficha-producto';

@Component({
  selector: 'app-inventario',
  imports: [FichaProducto, CurrencyPipe],
  template: `
    <h1 class="text-2xl font-bold text-slate-900">Parcial 1 · Inventario de periféricos</h1>

    <p class="mt-2 text-sm font-semibold text-slate-700">
      Valor total: {{ valorTotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
      · Unidades: {{ unidadesTotales() }}
      · Agotados: {{ agotados() }}
    </p>

    <div class="mt-4 flex flex-wrap gap-3">
      @for (p of productos(); track p.nombre) {
        <app-ficha [producto]="p" (retirar)="retirar($event)" />
      } @empty {
        <p class="vacio">No hay productos para mostrar</p>
      }
    </div>

    <button type="button" class="vaciar" (click)="vaciar()">Vaciar lista</button>
  `,
  styles: `
    .vacio { width: 100%; padding: 1.2rem; text-align: center; font-size: .85rem; color: #94a3b8; }
    .vaciar { margin-top: 1rem; border: none; border-radius: .5rem; background: #b91c1c; color: #fff; padding: .35rem .9rem; font-size: .78rem; font-weight: 700; cursor: pointer; }
  `,
})
export class Inventario {
  productos = signal<Producto[]>([
    { nombre: 'Teclado', precio: 38000, existencias: 6 },
    { nombre: 'Ratón', precio: 22000, existencias: 0 },
    { nombre: 'Cable HDMI', precio: 15000, existencias: 2 },
    { nombre: 'Cable de red', precio: 6500, existencias: 12 },
  ]);

  valorTotal = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.existencias, 0),
  );

  unidadesTotales = computed(() =>
    this.productos().reduce((suma, p) => suma + p.existencias, 0),
  );


  agotados = computed(() => this.productos().filter((p) => p.existencias === 0).length);

  retirar(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) =>
        p.nombre === nombre && p.existencias > 0 ? { ...p, existencias: p.existencias - 1 } : p,
      ),
    );
  }

  vaciar() {
    this.productos.set([]);
  }
}
