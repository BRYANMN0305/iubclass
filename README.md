# COM30 · Programación con Frameworks para Web

Proyecto base de la **sesión S02** — el tablero de precios de la plaza de mercado, construido en clase con Angular 22.

> **Institución Universitaria de Barranquilla · 2026-III**
> Docente: Kevin Erney De Alba Pomárico · `kerneydealba@unibarranquilla.edu.co`

---

## Qué hay aquí

| Ruta | Qué es |
|---|---|
| `src/app/tablero/` | **El componente de la clase.** Signals, computed, los tres bindings y `@for` con `track` |
| `src/app/acerca/` | Segunda vista, mínima, para demostrar la navegación |
| `src/app/app.routes.ts` | El esqueleto de rutas (el tema completo es la S09) |
| `_para-stackblitz/main.ts` | El mismo código en **un solo archivo**, para quien trabaja en el navegador |
| `CLASE_S02_PASOS.md` | Los cinco pasos con los que se construyó, para reconstruirlo o alcanzar |

Lo que se ve al ejecutarlo: la tabla de productos con subtotales, el buscador, los botones de vender
y reabastecer, los dos totales calculados y el mensaje condicional de venta mayorista.

---

## Cómo trabajar sobre este proyecto

**No trabajes sobre este repositorio: es de solo lectura para ti.** Haz tu propia copia.

### 1 · Fork

Botón **Fork**, arriba a la derecha. GitHub te lleva a tu copia, con tu usuario en la URL.
Esa es la dirección que vas a entregar.

### 2 · Ábrelo, según tu entorno

**Si tienes Angular CLI instalada:**

```bash
git clone https://github.com/TU-USUARIO/iubclass.git
cd iubclass
npm install          # reconstruye node_modules, tarda un par de minutos
ng serve             # y abre http://localhost:4200
```

**Si trabajas en StackBlitz**, abre tu fork directamente en el navegador:

```
https://stackblitz.com/github/TU-USUARIO/iubclass
```

Si eso no arranca, usa `_para-stackblitz/main.ts`: copias su contenido y lo pegas dentro de
`src/main.ts` de un proyecto nuevo de StackBlitz. Ojo: se reemplaza el **contenido** del archivo,
no se borra el archivo.

### 3 · Guarda tu trabajo

```bash
git add .
git commit -m "Taller 01 · parte B"
git push
```

Haz `commit` cada vez que algo te funcione, no uno solo al final. Si después lo dañas, puedes volver.

---

## El trabajo de esta semana

Se entrega el **domingo 20 de septiembre, hasta las 23:59**, en el aula virtual.

### Taller 01 · El puesto de frutas

El mismo problema resuelto dos veces: la **Parte A** con HTML y JavaScript a mano, la **Parte B**
con Angular, y la **Parte C** comparando las dos. La Parte C es la que más pesa.

### Reto S02 · Ampliar este tablero

Cinco puntos sobre el código de este repositorio:

1. Un `computed` que cuente los productos agotados
2. Un aviso de inventario bajo, con `@if`
3. Un `computed` que devuelva el producto más caro
4. Un botón «Vender todo» por fila
5. Ordenar la tabla por subtotal **sin mutar la signal** ← este tiene trampa

> **Los enunciados completos están en el aula virtual**, con los datos de prueba y los resultados
> esperados. Este README es solo el resumen.

### Cómo se entrega

Un **único PDF** hecho con la plantilla `COM30_S02_evidencias_plantilla.docx` del aula, con las
capturas, la comparación escrita y **el enlace de tu fork** adentro.

---

## Los errores que vas a cometer, y qué significan

| Lo que ves | Qué es |
|---|---|
| En pantalla sale `function…` | Falta el paréntesis al leer la signal: `{{ total }}` en vez de `{{ total() }}` |
| El botón no hace nada, sin errores | `(click)="vender"` sin paréntesis: nombra la función, no la llama |
| La consola muestra el dato nuevo y la pantalla el viejo | Se mutó con `push` o `++`. Va con `update()` y un valor nuevo |
| `NG5002: @for loop must have a "track"` | Falta el `track`. No es opcional |
| Rojo en `this.bultos = 5` | A una signal no se le asigna: se le hace `.set()` |
| `Property 'value' does not exist on type 'EventTarget'` | Falta el `as HTMLInputElement` sobre `$event.target` |

**Regla de oro:** si el error trae un código como `NG5002`, búscalo **con el código incluido** en
[angular.dev](https://angular.dev). Es la diferencia entre encontrar la respuesta exacta y leer
veinte foros de 2019 que además hablan de AngularJS, que es otro framework.

---

## Versiones

Angular **22.1** · TypeScript **6.0** · Tailwind CSS **4.1** · Node **22.22.3 o superior**

La documentación que manda es **angular.dev**. Si un tutorial dice `$scope`, `*ngIf` o
`app.component.ts`, está desactualizado.
