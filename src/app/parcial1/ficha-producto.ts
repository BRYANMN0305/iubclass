import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';


export interface Producto {
  nombre: string;
  precio: number;
  existencias: number;
}

type Estado = 'agotado' | 'bajo' | 'disponible';

@Component({
  selector: 'app-ficha',
  imports: [CurrencyPipe],
  template: `
    <article class="flex w-52 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <h5 class="text-sm font-bold text-slate-900">{{ producto().nombre }}</h5>

      <p class="mt-1 text-lg font-extrabold text-blue-700">
        {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
      </p>

      <p class="mt-1 text-xs text-slate-500">Existencias: {{ producto().existencias }}</p>

      @switch (estado()) {
        @case ('agotado') {
          <span class="etq rojo">Agotado</span>
        }
        @case ('bajo') {
          <span class="etq ambar">Inventario bajo</span>
        }
        @default {
          <span class="etq verde">Disponible</span>
        }
      }

      <button
        type="button"
        class="retirar"
        [disabled]="producto().existencias === 0"
        (click)="retirar.emit(producto().nombre)"
      >
        Retirar 1
      </button>
    </article>
  `,
  styles: `
    .etq { align-self: flex-start; margin-top: .5rem; border-radius: 999px; padding: .1rem .6rem; font-size: .72rem; font-weight: 700; }
    .rojo  { background: #fee2e2; color: #991b1b; }
    .ambar { background: #fef3c7; color: #92400e; }
    .verde { background: #d1fae5; color: #065f46; }
    .retirar { margin-top: .6rem; border: none; border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .78rem; font-weight: 700; cursor: pointer; }
    .retirar:disabled { background: #cbd5e1; color: #64748b; cursor: not-allowed; }
  `,
})
export class FichaProducto {
  producto = input.required<Producto>();

  retirar = output<string>();

  estado = computed<Estado>(() => {
    const existencias = this.producto().existencias;
    if (existencias === 0) return 'agotado';
    return existencias < 3 ? 'bajo' : 'disponible';
  });
}
