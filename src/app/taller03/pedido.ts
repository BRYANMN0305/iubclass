import { Component, computed, signal } from '@angular/core';
import { TarjetaProducto } from './tarjeta-producto';
import { ResumenPedido } from './resumen-pedido';
import { Linea, Producto } from './producto';

// =============================================================================
//  Taller 03 · R4 · Pedido, el dueño del estado
// -----------------------------------------------------------------------------
//  Qué muestra
//    - productos es el catálogo de la tabla 1. No es estado que cambie: por eso
//      es un arreglo normal y no una signal.
//    - pedido = signal<Linea[]>([]) es el ÚNICO estado del taller. Ni
//      TarjetaProducto ni ResumenPedido guardan nada: los dos solo reciben
//      datos y emiten avisos.
//    - unidades es un computed que reparte el estado por producto, para que
//      cada tarjeta reciba el número que le corresponde con [enPedido].
//    - agregar(nombre) y quitar(nombre) son los dos únicos métodos que escriben
//      en la signal, y los dos usan update() con un arreglo NUEVO.
//
//  Error típico que este padre evita
//    Si los métodos escribieran con push, splice o con ++ sobre una línea
//      this.pedido().find(...)!.cantidad++
//    mutarían el arreglo sin avisarle a la signal: la pantalla no se
//    actualizaría. La signal solo detecta un arreglo nuevo.
//
//  Los datos bajan (input) y los eventos suben (output). Ningún hijo sabe que
//  existe la signal del pedido.
//
//  Pasan los pasos P1 a P7 de la tabla 2 sin recargar la página.
// =============================================================================

@Component({
  selector: 'app-pedido',
  imports: [TarjetaProducto, ResumenPedido],
  template: `
    <h1 class="text-2xl font-bold text-slate-900">Taller 03 · Pedido con componentes que se comunican</h1>
    <p class="mt-1 text-sm text-slate-500">
      Pedido es el dueño del estado. Las tarjetas reciben datos con input() y avisan con output().
    </p>

    <h3 class="bloque">Catálogo</h3>
    <div class="flex flex-wrap gap-3">
      @for (p of productos; track p.nombre) {
        <app-tarjeta-producto
          [producto]="p"
          [enPedido]="unidades()[p.nombre] ?? 0"
          (agregar)="agregar($event)"
        />
      }
    </div>

    <h3 class="bloque">Pedido</h3>
    <app-resumen-pedido [lineas]="pedido()" (quitar)="quitar($event)" />
  `,
  styles: `
    .bloque { margin: 1.5rem 0 .6rem; font-size: .75rem; font-weight: 800; text-transform: uppercase; letter-spacing: .15em; color: #b45309; }
  `,
})
export class Pedido {
  // Tabla 1 del enunciado. Catálogo fijo: no es estado, no necesita signal.
  productos: Producto[] = [
    { nombre: 'Mango', precio: 1800, existencias: 3 },
    { nombre: 'Aguacate', precio: 4500, existencias: 2 },
    { nombre: 'Limón', precio: 650, existencias: 10 },
    { nombre: 'Queso costeño', precio: 12000, existencias: 1 },
  ];

  // El estado del taller, en un solo lugar.
  pedido = signal<Linea[]>([]);

  // Lectura para las tarjetas: cuántas unidades hay de cada producto.
  unidades = computed<Record<string, number>>(() =>
    Object.fromEntries(this.pedido().map((l) => [l.nombre, l.cantidad])),
  );

  // Suma una unidad a la línea existente o crea la línea nueva. update() entrega
  // un arreglo nuevo; nunca se toca el que ya está en la signal.
  agregar(nombre: string) {
    this.pedido.update((lineas) => {
      const producto = this.productos.find((p) => p.nombre === nombre);
      if (!producto) return lineas;

      const existe = lineas.find((l) => l.nombre === nombre);
      if (!existe) {
        return [...lineas, { nombre, precio: producto.precio, cantidad: 1 }];
      }
      // Guarda del dueño del estado: nadie supera las existencias del catálogo.
      if (existe.cantidad >= producto.existencias) return lineas;

      return lineas.map((l) =>
        l.nombre === nombre ? { ...l, cantidad: l.cantidad + 1 } : l,
      );
    });
  }

  // Quitar elimina la línea completa, no una unidad.
  quitar(nombre: string) {
    this.pedido.update((lineas) => lineas.filter((l) => l.nombre !== nombre));
  }
}
