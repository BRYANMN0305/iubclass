import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Linea } from './producto';

// =============================================================================
//  Taller 03 · R5 · ResumenPedido
// -----------------------------------------------------------------------------
//  Qué muestra
//    - lineas = input.required<Linea[]>(): el resumen recibe la lista COMPLETA
//      del pedido, no un producto suelto como la tarjeta.
//    - quitar = output<string>(): avisa el nombre de la línea a eliminar. El
//      resumen no borra nada: eso lo hace Pedido, que es el dueño del estado.
//    - @for con track l.nombre y @empty para el mensaje del pedido vacío (P1 y
//      P7). El track es obligatorio: sin track, Angular no puede reutilizar las
//      filas y es motivo de descuento.
//    - subtotal, domicilio y total son computed sobre un input: cuando Pedido
//      actualiza el pedido, los tres valores se recalculan sin código extra.
//
//  La regla del domicilio tiene TRES casos, no dos
//      1. Pedido vacío      -> no se cobra nada y se muestra «-»   (P1, P7)
//      2. Subtotal >= 20000 -> el domicilio es gratis             (P5)
//      3. En otro caso      -> el domicilio cuesta $ 3.000         (P2 a P4, P6)
//    P5 es el caso límite: un subtotal de exactamente $ 20.000 ya tiene
//    domicilio gratis. Por eso su total ($ 20.000) es MENOR que el de P4
//    ($ 22.350). Escribir > en lugar de >= falla solo en ese paso.
// =============================================================================

const DOMICILIO = 3000;
const UMBRAL_ENVIO_GRATIS = 20000;

@Component({
  selector: 'app-resumen-pedido',
  imports: [CurrencyPipe],
  template: `
    <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h4 class="text-sm font-extrabold uppercase tracking-wide text-slate-500">
        Resumen del pedido
      </h4>

      @for (l of lineas(); track l.nombre) {
        <div class="fila">
          <span class="nombre">
            {{ l.nombre }}
            <span class="detalle">
              {{ l.cantidad }} × {{ l.precio | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
            </span>
          </span>
          <span class="subtotal-linea">
            {{ (l.precio * l.cantidad) | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
          </span>
          <button type="button" class="quitar" (click)="quitar.emit(l.nombre)">Quitar</button>
        </div>
      } @empty {
        <p class="vacio">El pedido está vacío</p>
      }

      <dl class="mt-3 grid grid-cols-[1fr_auto] gap-y-1 border-t border-slate-200 pt-3 text-sm">
        <dt class="text-slate-500">Subtotal</dt>
        <dd class="text-right font-semibold text-slate-900">
          {{ subtotal() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
        </dd>

        <dt class="text-slate-500">Domicilio</dt>
        <dd class="text-right font-semibold text-slate-900">
          @if (lineas().length === 0) {
            <span class="gris">-</span>
          } @else if (domicilio() === 0) {
            <span class="verde">Gratis</span>
          } @else {
            {{ domicilio() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}
          }
        </dd>

        <dt class="total">Total</dt>
        <dd class="total-valor">{{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</dd>
      </dl>
    </section>
  `,
  styles: `
    .fila { display: flex; align-items: center; justify-content: space-between; gap: .8rem; border-top: 1px solid #f1f5f9; padding: .45rem 0; font-size: .85rem; }
    .fila:first-of-type { border-top: none; }
    .nombre { font-weight: 600; color: #0f172a; }
    .detalle { margin-left: .35rem; font-size: .75rem; font-weight: 400; color: #64748b; }
    .subtotal-linea { font-weight: 700; color: #0f172a; }
    .quitar { border: 1px solid #cbd5e1; border-radius: .4rem; background: #fff; color: #475569; padding: .1rem .55rem; font-size: .72rem; font-weight: 700; cursor: pointer; }
    .quitar:hover { background: #fee2e2; border-color: #fca5a5; color: #991b1b; }
    .vacio { padding: 1.2rem 0; text-align: center; font-size: .85rem; color: #94a3b8; }
    .total { padding-top: .3rem; font-weight: 800; color: #0f172a; }
    .total-valor { padding-top: .3rem; text-align: right; font-size: 1.05rem; font-weight: 800; color: #1d4ed8; }
    .verde { color: #065f46; }
    .gris { color: #94a3b8; }
  `,
})
export class ResumenPedido {
  // Obligatorio: el resumen necesita la lista completa, nunca un solo producto.
  lineas = input.required<Linea[]>();

  // El nombre de la línea a eliminar. No borra nada por su cuenta.
  quitar = output<string>();

  subtotal = computed(() => this.lineas().reduce((s, l) => s + l.precio * l.cantidad, 0));

  // Los tres casos de la regla del domicilio (ver el comentario de arriba).
  domicilio = computed(() => {
    if (this.lineas().length === 0) return 0;
    return this.subtotal() >= UMBRAL_ENVIO_GRATIS ? 0 : DOMICILIO;
  });

  total = computed(() => this.subtotal() + this.domicilio());
}
