import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

interface Fruta {
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-frutas',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './frutas.html',
})
export class Frutas {
  frutas = signal<Fruta[]>([
    { nombre: 'Mango', precio: 1800, cantidad: 12 },
    { nombre: 'Guayaba', precio: 1200, cantidad: 8 },
    { nombre: 'Patilla', precio: 6500, cantidad: 2 },
    { nombre: 'Maracuyá', precio: 3400, cantidad: 5 },
    { nombre: 'Níspero', precio: 2900, cantidad: 4 },
  ]);

  total = computed(() =>
    this.frutas().reduce((suma, f) => suma + f.precio * f.cantidad, 0),
  );

  unidades = computed(() => this.frutas().reduce((suma, f) => suma + f.cantidad, 0));

  mangoAgotado = computed(() => {
    const mango = this.frutas().find((f) => f.nombre === 'Mango');
    return !mango || mango.cantidad === 0;
  });

  vender(nombre: string) {
    this.frutas.update((lista) =>
      lista.map((f) =>
        f.nombre === nombre && f.cantidad > 0 ? { ...f, cantidad: f.cantidad - 1 } : f,
      ),
    );
  }
}
