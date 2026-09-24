import { Component, computed, signal } from '@angular/core';

// -----------------------------------------------------------------------------
// El modelo de datos.
// Esto es TypeScript, no JavaScript: describimos la FORMA que tiene un producto.
// A cambio de estas cinco líneas, el editor nos avisa si escribimos p.precoi.
// -----------------------------------------------------------------------------
interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.html',
})
export class Tablero {
  // ===========================================================================
  //  EL ESTADO — todo en signals
  // ===========================================================================
  // Una signal es una cajita que contiene el valor y que además lleva la cuenta
  // de quién la está mirando. Cuando cambia, avisa exactamente a esos.
  // ---------------------------------------------------------------------------
  vendedor = signal('Don Efraín');

  filtro = signal('');

  productos = signal<Producto[]>([
    { nombre: 'Yuca', precio: 2800, cantidad: 3 },
    { nombre: 'Ñame', precio: 4200, cantidad: 2 },
    { nombre: 'Plátano', precio: 1500, cantidad: 6 },
    { nombre: 'Mango', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', precio: 1200, cantidad: 0 },
  ]);

  // ===========================================================================
  //  LOS VALORES DERIVADOS — computed()
  // ===========================================================================
  // No se guardan: se deducen de otros. Al leer productos() adentro, el computed
  // queda suscrito y se recalcula solo cuando la lista cambia.
  // ---------------------------------------------------------------------------
  total = computed(() =>
    this.productos().reduce((suma, p) => suma + p.precio * p.cantidad, 0),
  );

  // Ojo: aquí se suma la CANTIDAD, no el precio por la cantidad.
  unidades = computed(() =>
    this.productos().reduce((suma, p) => suma + p.cantidad, 0),
  );

  // Un computed puede depender de dos signals a la vez.
  visibles = computed(() => {
    const texto = this.filtro().toLowerCase().trim();
    if (texto === '') return this.productos();
    return this.productos().filter((p) => p.nombre.toLowerCase().includes(texto));
  });

  // ===========================================================================
  //  RETO 1 · Contar los productos agotados
  // ===========================================================================
  // filter() deja solo los de cantidad cero y .length los cuenta. Es un número,
  // no una lista, y se actualiza solo como los otros dos totales.
  // ---------------------------------------------------------------------------
  agotados = computed(() => this.productos().filter((p) => p.cantidad === 0).length);

  // ===========================================================================
  //  RETO 2 · Aviso de inventario bajo
  // ===========================================================================
  // some() devuelve true en cuanto encuentra uno que cumpla, y false si no
  // encuentra ninguno. Ojo: la cantidad 0 NO es inventario bajo, es inventario
  // agotado; por eso se excluye con p.cantidad > 0.
  // ---------------------------------------------------------------------------
  inventarioBajo = computed(() =>
    this.productos().some((p) => p.cantidad > 0 && p.cantidad < 3),
  );

  // ===========================================================================
  //  RETO 3 · El producto más caro
  // ===========================================================================
  // reduce() compara de a dos y se queda con el mayor. La lista vacía es el
  // caso trampa: un reduce SIN valor inicial sobre [] lanza error, así que antes
  // de reducir se pregunta si hay algo que reducir.
  // ---------------------------------------------------------------------------
  masCaro = computed(() => {
    const lista = this.productos();
    if (lista.length === 0) return '';
    return lista.reduce((a, b) => (b.precio > a.precio ? b : a)).nombre;
  });

  // ===========================================================================
  //  RETO 5 · Ordenar por subtotal, de mayor a menor
  // ===========================================================================
  // sort() MODIFICA POR DENTRO el arreglo que recibe. Como el que está dentro de
  // la signal es el mismo arreglo de memoria, hacerlo directo corrupte el estado
  // aunque la tabla se vea correcta. Por eso se copia antes con [...] y se
  // ordena la COPIA.
  //
  // Nótese que parte de visibles() y no de productos(): así la lista filtrada
  // del buscador también sale ordenada, en vez de romper el buscador de clase.
  // ---------------------------------------------------------------------------
  ordenados = computed(() =>
    [...this.visibles()].sort((a, b) => b.precio * b.cantidad - a.precio * a.cantidad),
  );

  // ===========================================================================
  //  LOS MÉTODOS — cómo se cambia una signal
  // ===========================================================================

  // update() cuando el valor nuevo se calcula A PARTIR del viejo.
  //
  // Lo que NO funciona, y es el error más común:
  //     this.productos()[0].cantidad--;     <- modifica por dentro
  // El arreglo sí cambia, la consola lo confirma, y la pantalla no se entera.
  // Hay que construir un arreglo NUEVO: por eso map y el operador de propagación.
  vender(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) =>
        p.nombre === nombre && p.cantidad > 0
          ? { ...p, cantidad: p.cantidad - 1 } // objeto nuevo, con una menos
          : p, // los demás, tal cual estaban
      ),
    );
    // Y aquí NO hay que llamar a pintar(). No existe pintar().
    // El total y las unidades ya están al día: son computed.
  }

  reabastecer(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, cantidad: p.cantidad + 10 } : p)),
    );
  }

  // ===========================================================================
  //  RETO 4 · Vender todo lo que queda
  // ===========================================================================
  // Un solo update() con la cantidad en cero. No hay que acordarse de marcar la
  // fila ni de recalcular el total: el [class.opacity-40] de la plantilla y los
  // computed se encargan solos.
  // ---------------------------------------------------------------------------
  liquidar(nombre: string) {
    this.productos.update((lista) =>
      lista.map((p) => (p.nombre === nombre ? { ...p, cantidad: 0 } : p)),
    );
  }

  // El objeto $event trae lo que escribió el usuario.
  // TypeScript sabe que todo evento tiene un target, pero no sabe si ese target
  // es una caja de texto: por eso hace falta el "as HTMLInputElement".
  onFiltrar(e: Event) {
    const caja = e.target as HTMLInputElement;
    this.filtro.set(caja.value);
  }

  // set() cuando el valor nuevo no depende del anterior.
  limpiarFiltro() {
    this.filtro.set('');
  }
}
