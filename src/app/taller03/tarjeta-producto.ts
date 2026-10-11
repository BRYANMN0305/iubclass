import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Producto } from './producto';

// =============================================================================
//  Taller 03 · R2 y R3 · TarjetaProducto
// -----------------------------------------------------------------------------
//  Qué muestra
//    - producto = input.required<Producto>(): el padre está obligado a pasarlo.
//      Si lo omite, la aplicación no compila (NG8008).
//    - enPedido = input(0): las unidades que ya tiene ese producto en el
//      pedido. Si el padre no la pasa, vale 0, que es el caso del pedido vacío.
//    - disponibles es un computed que depende de los DOS inputs. Cuando el
//      padre cambia el pedido, la tarjeta se recalcula sola.
//    - agregar = output<string>(): la tarjeta avisa qué producto se agregó,
//      pero no decide qué pasa después ni guarda nada.
//
//  Error típico que este hijo evita
//    Modificar producto() o el estado del padre desde la tarjeta (ejemplo 4,
//    panel izquierdo). Compila, no muestra ningún error, y deja el precio de
//    la fila y la suma del padre en desacuerdo. Aquí solo se emite el aviso.
//
//  Pasan los pasos P2, P3, P5 y P6 de la tabla 2.
// =============================================================================

@Component({
  selector: 'app-tarjeta-producto',
  imports: [CurrencyPipe],
  template: `
    <article class="flex w-52 flex-col rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <h5 class="text-sm font-bold text-slate-900">{{ producto().nombre }}</h5>

      <p class="mt-1 text-lg font-extrabold text-blue-700">
        {{ producto().precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
      </p>

      <p
        class="mt-1 text-xs font-bold"
        [class.verde]="disponibles() > 0"
        [class.rojo]="disponibles() === 0"
      >
        Disponibles: {{ disponibles() }}
      </p>

      <button
        type="button"
        class="agregar"
        [disabled]="disponibles() <= 0"
        (click)="agregar.emit(producto().nombre)"
      >
        Agregar
      </button>
    </article>
  `,
  styles: `
    .agregar { margin-top: .6rem; border: none; border-radius: .5rem; background: #1e293b; color: #fff; padding: .3rem .8rem; font-size: .78rem; font-weight: 700; cursor: pointer; }
    .agregar:disabled { background: #cbd5e1; color: #64748b; cursor: not-allowed; }
    .verde { color: #065f46; }
    .rojo { color: #991b1b; }
  `,
})
export class TarjetaProducto {
  // Obligatorio: sin producto, la tarjeta no tiene nada que mostrar.
  producto = input.required<Producto>();

  // Opcional: al abrir la pantalla el pedido está vacío y vale 0.
  enPedido = input(0);

  // Valor derivado de dos inputs. No es estado propio: se recalcula solo.
  disponibles = computed(() => this.producto().existencias - this.enPedido());

  // El dato que viaja en el evento es el nombre del producto.
  agregar = output<string>();
}
