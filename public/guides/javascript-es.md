# Guía de JavaScript

## Scope (Ámbito)
**Descripción:** JavaScript tiene ámbito de función, ámbito de bloque (con let/const) y ámbito global. Entender el ámbito es crucial para la accesibilidad de variables y evitar conflictos.
**Ejemplo:**
```javascript
// Ámbito Global
var globalVar = "Soy global";
let globalLet = "También soy global";

function demoAmbito() {
  // Ámbito de Función
  var funcionVar = "Tengo ámbito de función";
  
  if (true) {
    // Ámbito de Bloque
    let bloqueLet = "Tengo ámbito de bloque";
    const bloqueConst = "También tengo ámbito de bloque";
    var funcionVarEnBloque = "Aún tengo ámbito de función";
    
    console.log(bloqueLet); // ✅ Funciona
    console.log(globalVar); // ✅ Funciona - puede acceder al global
  }
  
  // console.log(bloqueLet); // ❌ ReferenceError - ámbito de bloque
  console.log(funcionVarEnBloque); // ✅ Funciona - ámbito de función
}

// Ejemplo de Ámbito Léxico
function funcionExterna(x) {
  function funcionInterna(y) {
    console.log(x + y); // Puede acceder al parámetro de la función externa
  }
  return funcionInterna;
}

const closure = funcionExterna(10);
closure(5); // 15
```

## Sintaxis y Semántica
**Descripción:** Reglas de sintaxis de JavaScript y significado semántico. Incluye diferencias entre declaraciones vs expresiones, inserción automática de punto y coma, y construcciones del lenguaje.
**Ejemplo:**
```javascript
// Declaración vs Expresión
if (true) console.log("Declaración"); // Declaración
const resultado = true ? "sí" : "no"; // Expresión

// Inserción Automática de Punto y Coma (ASI)
function retornoProblemático() {
  return
    {
      valor: 42
    }; // ASI inserta punto y coma después de return, devuelve undefined
}

function retornoCorrecto() {
  return {
    valor: 42
  }; // Devuelve el objeto
}

// Modo Estricto
"use strict";
// variableNoDeclarada = 5; // ❌ Error en modo estricto
// delete Object.prototype; // ❌ Error en modo estricto

// Etiquetas y break/continue
externo: for (let i = 0; i < 3; i++) {
  interno: for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break externo; // Rompe el bucle externo
    console.log(i, j);
  }
}
```

## Closures (Clausuras)
**Descripción:** Funciones que retienen acceso a variables de su ámbito externo incluso después de que la función externa haya terminado. Esencial para privacidad de datos y patrones de programación funcional.
**Ejemplo:**
```javascript
// Closure Básico
function crearContador() {
  let contador = 0;
  return function() {
    contador++;
    return contador;
  };
}

const contador1 = crearContador();
const contador2 = crearContador();
console.log(contador1()); // 1
console.log(contador1()); // 2
console.log(contador2()); // 1 (closure separado)

// Patrón de Módulo usando Closures
const calculadora = (function() {
  let resultado = 0;
  
  return {
    sumar: function(x) { resultado += x; return this; },
    restar: function(x) { resultado -= x; return this; },
    multiplicar: function(x) { resultado *= x; return this; },
    obtenerResultado: function() { return resultado; },
    reiniciar: function() { resultado = 0; return this; }
  };
})();

calculadora.sumar(10).multiplicar(2).restar(5).obtenerResultado(); // 15

// Closure en Bucles (Trampa Común)
// Forma incorrecta
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Imprime 3, 3, 3
  }, 100);
}

// Forma correcta con closure
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Imprime 0, 1, 2
  }, 100);
}

// O con IIFE
for (var i = 0; i < 3; i++) {
  (function(indice) {
    setTimeout(function() {
      console.log(indice); // Imprime 0, 1, 2
    }, 100);
  })(i);
}
```

## Coerción de Tipos
**Descripción:** Conversión automática de tipos de JavaScript cuando se realizan operaciones entre diferentes tipos de datos. Entender la coerción previene comportamientos inesperados.
**Ejemplo:**
```javascript
// Coerción Implícita
console.log("5" + 3);       // "53" (número a string)
console.log("5" - 3);       // 2 (string a número)
console.log("5" * "2");     // 10 (ambos a números)
console.log(true + 1);      // 2 (boolean a número)
console.log(false + 1);     // 1
console.log(null + 1);      // 1 (null se convierte a 0)
console.log(undefined + 1); // NaN

// Valores Falsy y Truthy
const valoresFalsy = [false, 0, -0, 0n, "", null, undefined, NaN];
const valoresTruthy = [true, 1, -1, "0", "false", [], {}, function(){}];

valoresFalsy.forEach(val => console.log(!!val)); // Todos false
valoresTruthy.forEach(val => console.log(!!val)); // Todos true

// Coerción == vs ===
console.log(0 == false);      // true (coerción)
console.log(0 === false);     // false (sin coerción)
console.log("" == false);     // true
console.log("" === false);    // false
console.log(null == undefined); // true (caso especial)
console.log(null === undefined); // false

// Conversión de Objeto a Primitivo
const obj = {
  valueOf: () => 42,
  toString: () => "Objeto"
};
console.log(obj + 1);    // 43 (usa valueOf)
console.log(obj + "");   // "42" (usa valueOf, luego string)
console.log(String(obj)); // "Objeto" (usa toString)

// Coerción de Arrays
console.log([1,2,3] + [4,5,6]); // "1,2,34,5,6" (ambos se convierten a strings)
console.log([1] + [2]);         // "12"
console.log([1] - [2]);         // -1 (ambos se convierten a números: 1 - 2)
```

## Hoisting (Elevación)
**Descripción:** Mecanismo de JavaScript que mueve las declaraciones de variables y funciones al inicio de su ámbito durante la compilación. Diferentes tipos de declaración se comportan diferente con hoisting.
**Ejemplo:**
```javascript
// Hoisting de var vs let vs const
console.log(variableVar); // undefined (elevada pero no inicializada)
console.log(variableLet); // ❌ ReferenceError (zona muerta temporal)

var variableVar = "Soy var";
let variableLet = "Soy let";
const variableConst = "Soy const";

// Hoisting de Funciones
console.log(funcionElevada()); // "¡Estoy elevada!" - funciona

function funcionElevada() {
  return "¡Estoy elevada!";
}

// Las expresiones de función no se elevan
console.log(noElevada()); // ❌ TypeError: noElevada is not a function

var noElevada = function() {
  return "No estoy elevada";
};

// Zona Muerta Temporal con let/const
function ejemploZonaMuerta() {
  console.log(typeof miLet); // ❌ ReferenceError
  let miLet = "inicializada";
}

// Hoisting de Clases
console.log(new MiClase()); // ❌ ReferenceError

class MiClase {
  constructor() {
    this.valor = 42;
  }
}
```

## Destructuring (Desestructuración)
**Descripción:** Extraer valores de arrays o propiedades de objetos en variables distintas usando una sintaxis conveniente.
**Ejemplo:**
```javascript
// Desestructuración de Arrays
const numeros = [1, 2, 3, 4, 5];
const [primero, segundo, ...resto] = numeros;
console.log(primero);  // 1
console.log(segundo); // 2
console.log(resto);   // [3, 4, 5]

// Omitir elementos
const [a, , c] = numeros; // Omite el segundo elemento
console.log(a, c); // 1, 3

// Valores por defecto
const [x = 0, y = 0] = [1]; // y obtiene valor por defecto
console.log(x, y); // 1, 0

// Desestructuración de Objetos
const persona = { nombre: 'Juan', edad: 30, ciudad: 'Madrid' };
const { nombre, edad, pais = 'España' } = persona;
console.log(nombre, edad, pais); // Juan, 30, España

// Renombrar variables
const { nombre: nombrePersona, edad: edadPersona } = persona;
console.log(nombrePersona, edadPersona); // Juan, 30

// Desestructuración anidada
const usuario = {
  id: 1,
  perfil: {
    nombre: 'Ana',
    apellido: 'García',
    social: {
      twitter: '@anagarcia'
    }
  }
};

const {
  perfil: {
    nombre,
    social: { twitter }
  }
} = usuario;
console.log(nombre, twitter); // Ana, @anagarcia

// Desestructuración en parámetros de función
function mostrarUsuario({ nombre, edad = 0, email }) {
  console.log(`${nombre}, ${edad}, ${email}`);
}

mostrarUsuario({ nombre: 'Roberto', email: 'roberto@email.com' }); // Roberto, 0, roberto@email.com
```

## Rest y Spread
**Descripción:** Rest (...) recoge múltiples elementos en un array/objeto. Spread (...) expande elementos de un array/objeto.
**Ejemplo:**
```javascript
// Rest en Funciones
function suma(...numeros) {
  return numeros.reduce((total, num) => total + num, 0);
}
console.log(suma(1, 2, 3, 4)); // 10

// Rest en Desestructuración
const [cabeza, ...cola] = [1, 2, 3, 4];
console.log(cabeza); // 1
console.log(cola); // [2, 3, 4]

const { nombre, ...otrasProps } = { nombre: 'Juan', edad: 30, ciudad: 'Madrid' };
console.log(nombre);       // Juan
console.log(otrasProps); // { edad: 30, ciudad: 'Madrid' }

// Spread con Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combinado = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Spread con Objetos
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const fusionado = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Spread en llamadas a funciones
function multiplicar(x, y, z) {
  return x * y * z;
}
const nums = [2, 3, 4];
console.log(multiplicar(...nums)); // 24

// Clonación (superficial)
const original = [1, 2, 3];
const clon = [...original];
const clonObjeto = { ...obj1 };
```

## Event Loop (Bucle de Eventos)
**Descripción:** Modelo de concurrencia de JavaScript que maneja operaciones asíncronas a través de un call stack, cola de callbacks y mecanismo de event loop.
**Ejemplo:**
```javascript
// Call Stack y Event Loop
console.log('1'); // Síncrono

setTimeout(() => {
  console.log('2'); // Asíncrono - va a la cola de callbacks
}, 0);

console.log('3'); // Síncrono

// Salida: 1, 3, 2

// Microtasks vs Macrotasks
console.log('Inicio');

setTimeout(() => console.log('Macrotask 1'), 0);

Promise.resolve().then(() => console.log('Microtask 1'));
Promise.resolve().then(() => console.log('Microtask 2'));

setTimeout(() => console.log('Macrotask 2'), 0);

console.log('Fin');

// Salida: Inicio, Fin, Microtask 1, Microtask 2, Macrotask 1, Macrotask 2
```

## Async/Await
**Descripción:** Sintaxis moderna para manejar operaciones asíncronas, construida sobre Promises pero con código más limpio y legible que parece síncrono.
**Ejemplo:**
```javascript
// async/await básico
async function obtenerUsuario(id) {
  try {
    const respuesta = await fetch(`/api/usuarios/${id}`);
    const usuario = await respuesta.json();
    return usuario;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

// Manejo de errores con async/await
async function busquedaRobusta(url) {
  try {
    const respuesta = await fetch(url);
    
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
    }
    
    return await respuesta.json();
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Error de red:', error.message);
    } else {
      console.error('Solicitud falló:', error.message);
    }
    return null;
  }
}

// Ejecución paralela con Promise.all
async function obtenerMultiplesUsuarios(ids) {
  try {
    const promesas = ids.map(id => obtenerUsuario(id));
    const usuarios = await Promise.all(promesas);
    return usuarios;
  } catch (error) {
    console.error('Una o más solicitudes fallaron:', error);
  }
}
```

## Promises (Promesas)
**Descripción:** Objetos que representan la eventual finalización o falla de operaciones asíncronas, proporcionando una alternativa más limpia a los callbacks.
**Ejemplo:**
```javascript
// Creando Promesas
const promesa1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    const exito = Math.random() > 0.5;
    if (exito) {
      resolve('¡Operación exitosa!');
    } else {
      reject(new Error('¡Operación falló!'));
    }
  }, 1000);
});

// Métodos de Promise
Promise.resolve('valor inmediato'); // Promesa resuelta
Promise.reject(new Error('error inmediato')); // Promesa rechazada

// Encadenamiento de Promesas
fetch('/api/datos')
  .then(respuesta => respuesta.json())
  .then(datos => {
    console.log('Datos recibidos:', datos);
    return datos.procesados;
  })
  .then(procesados => {
    console.log('Procesados:', procesados);
  })
  .catch(error => {
    console.error('Cadena falló:', error);
  })
  .finally(() => {
    console.log('Cadena completada');
  });

// Promise.all - espera a que todas se resuelvan
const promesas = [
  fetch('/api/usuarios'),
  fetch('/api/posts'),
  fetch('/api/comentarios')
];

Promise.all(promesas)
  .then(respuestas => Promise.all(respuestas.map(r => r.json())))
  .then(datos => {
    console.log('Todos los datos cargados:', datos);
  })
  .catch(error => {
    console.error('Una solicitud falló:', error);
  });
```

## Tipos de Datos
**Descripción:** JavaScript tiene varios tipos de datos incluyendo primitivos (number, string, boolean, null, undefined, symbol, bigint) y objetos. 
**Ejemplo:**
```javascript
// == vs === (Comparación superficial)
console.log(5 == "5");    // true (coerción de tipos)
console.log(5 === "5");   // false (comparación estricta)
console.log(null == undefined);  // true
console.log(null === undefined); // false

// null vs undefined
let declarada;              // undefined
let vacia = null;          // null
console.log(declarada);    // undefined
console.log(vacia);        // null

// Caso de uso de Symbol
const id1 = Symbol('id');
const id2 = Symbol('id');
console.log(id1 === id2); // false (los símbolos son únicos)
const usuario = { [id1]: 'Juan' };

// BigInt
const numeroGrande = 9007199254740991n;
const otroGrande = BigInt(9007199254740991);
console.log(numeroGrande + 1n); // 9007199254740992n

// typeof vs instanceof
console.log(typeof "hola");      // "string"
console.log(typeof 42);          // "number"
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true

// Map vs Set
const mapa = new Map();
mapa.set('clave', 'valor');
const conjunto = new Set([1, 2, 3, 3]); // {1, 2, 3}
```

**Comparación:** == realiza coerción de tipos mientras que === no. null se asigna explícitamente, undefined significa no asignado. Los Symbols crean identificadores únicos. BigInt maneja enteros grandes. typeof devuelve cadena de tipo, instanceof verifica cadena de prototipos. Map almacena pares clave-valor, Set almacena valores únicos.

## Hoisting
**Descripción:** Mecanismo de JavaScript que mueve las declaraciones de variables y funciones al inicio de su ámbito durante la compilación. Diferentes tipos de declaración se comportan diferente con hoisting.

**Ejemplo:**
```javascript
// Hoisting de var vs let vs const
console.log(variableVar); // undefined (elevada pero no inicializada)
console.log(variableLet); // ReferenceError (Zona Temporal Muerta)

var variableVar = "Soy var";
let variableLet = "Soy let";
const variableConst = "Soy const";

// Zona Temporal Muerta
function ejemplo() {
  console.log(temp); // ReferenceError
  let temp = "valor";
}

// Hoisting en funciones y clases
console.log(funcionElevada()); // "¡Estoy elevada!"

function funcionElevada() {
  return "¡Estoy elevada!";
}

// console.log(noElevada()); // TypeError
const noElevada = () => "No estoy elevada";

// IIFE (Expresión de Función Inmediatamente Invocada)
(function() {
  var privada = "¡No puedes accederme desde afuera!";
  console.log("IIFE ejecutada");
})();

// IIFE moderna con función flecha
(() => {
  const variableModulo = "Privada a este ámbito";
  console.log("IIFE flecha ejecutada");
})();
```

**Comparación:** var es elevada e inicializada con undefined, let/const son elevadas pero permanecen en Zona Temporal Muerta hasta su declaración. Las declaraciones de función son completamente elevadas, las expresiones de función no. IIFE crea aislamiento de ámbito inmediato.

## Scope
**Descripción:** Determina la accesibilidad de variables en diferentes partes del código. JavaScript usa scope léxico, closures y diferentes sistemas de módulos que afectan cómo se accede a las variables.

**Ejemplo:**
```javascript
// Ámbito léxico
function externa() {
  const varExterna = "Soy externa";
  
  function interna() {
    console.log(varExterna); // Accede al ámbito externo
  }
  
  return interna;
}

// Closures
function crearContador() {
  let contador = 0;
  return function() {
    return ++contador;
  };
}
const miContador = crearContador();
console.log(miContador()); // 1
console.log(miContador()); // 2

// Módulos ES vs CommonJS
// Módulos ES (moderno)
import { exportacionNombrada } from './modulo.js';
export const miFuncion = () => {};

// CommonJS (tradicional de Node.js)
const { exportacionNombrada } = require('./modulo');
module.exports = { miFuncion };

// this (call vs bind vs apply)
const obj = {
  nombre: "Objeto",
  saludar: function(saludo, puntuacion) {
    return `${saludo} ${this.nombre}${puntuacion}`;
  }
};

console.log(obj.saludar.call(obj, "Hola", "!")); // "Hola Objeto!"
console.log(obj.saludar.apply(obj, ["Hi", "."])); // "Hi Objeto."
const saludoEnlazado = obj.saludar.bind(obj, "Hey");
console.log(saludoEnlazado("?")); // "Hey Objeto?"

// Modo Estricto
"use strict";
function ejemploEstricto() {
  // variableNoDeclarada = "error"; // ReferenceError en modo estricto
}

// Funciones de primera clase
const func = function() { return "Soy un valor"; };
const array = [func];
const obj2 = { metodo: func };
function tomarFuncion(fn) { return fn(); }
```

**Comparación:** El scope léxico se determina en tiempo de compilación. Los closures mantienen acceso a variables externas. Los Módulos ES usan import/export, CommonJS usa require/module.exports. call/apply invocan inmediatamente, bind crea nueva función. El modo estricto previene errores comunes. Las funciones de primera clase pueden almacenarse, pasarse y devolver como cualquier otro valor.

## Sincronismo
**Descripción:** La naturaleza de hilo único de JS con event loop, call stack y callback queue.

**Ejemplo:**
```javascript
// Event Loop / Stack / Callback Queue
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
// Salida: 1, 3, 2

// Demostración del Call Stack
function primera() {
  console.log("Primera");
  segunda();
}

function segunda() {
  console.log("Segunda");
}

primera(); // Stack: primera -> segunda -> pop segunda -> pop primera

// Callbacks
function obtenerDatos(callback) {
  setTimeout(() => {
    callback("Datos recibidos");
  }, 1000);
}

obtenerDatos((datos) => {
  console.log(datos); // "Datos recibidos" después de 1 segundo
});

// Generadores / Iteradores
function* generadorNumeros() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = generadorNumeros();
console.log(gen.next()); // {value: 1, done: false}
console.log(gen.next()); // {value: 2, done: false}

// Iterador personalizado
const iterable = {
  [Symbol.iterator]: function() {
    let paso = 0;
    return {
      next: function() {
        paso++;
        return paso <= 3 
          ? {value: paso, done: false}
          : {done: true};
      }
    };
  }
};

for (const valor of iterable) {
  console.log(valor); // 1, 2, 3
}
```

**Comparación:** El call stack ejecuta síncronamente, la callback queue maneja operaciones async. Los callbacks pueden llevar al callback hell. Los generadores pausan/reanudan ejecución, los iteradores definen cómo se iteran los objetos. El event loop coordina entre stack y queue.

## Promesas
**Descripción:** Objetos que representan la eventual finalización o falla de operaciones asíncronas. Las promesas proporcionan mejor manejo async que los callbacks e integran con la sintaxis moderna async/await.

**Ejemplo:**
```javascript
// Métodos de Promesas
const promesa1 = Promise.resolve(3);
const promesa2 = new Promise(resolve => setTimeout(() => resolve('foo'), 1000));
const promesa3 = Promise.reject('Error');

// Promise.all - espera a que todas se resuelvan
Promise.all([promesa1, promesa2])
  .then(valores => console.log(valores)); // [3, 'foo']

// Promise.allSettled - espera a que todas se establezcan
Promise.allSettled([promesa1, promesa2, promesa3])
  .then(resultados => console.log(resultados));

// Promise.race - la primera en establecerse gana
Promise.race([promesa1, promesa2])
  .then(valor => console.log(valor)); // 3

// Promise.any - la primera en resolverse gana
Promise.any([promesa3, promesa2])
  .then(valor => console.log(valor)); // 'foo'

// Async / Await
async function obtenerDatosUsuario() {
  try {
    const respuesta = await fetch('/api/usuario');
    const datosUsuario = await respuesta.json();
    return datosUsuario;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
}

// Microtarea
console.log('1');
Promise.resolve().then(() => console.log('2'));
setTimeout(() => console.log('3'), 0);
console.log('4');
// Salida: 1, 4, 2, 3 (microtarea Promise se ejecuta antes que setTimeout)
```

**Comparación:** Promise.all falla si una falla, Promise.allSettled espera a todas. Promise.race devuelve la primera establecida, Promise.any devuelve la primera resuelta. Async/await proporciona sintaxis similar a la síncrona para promesas. Las microtareas (Promises) tienen mayor prioridad que las macrotareas (setTimeout).

## Prototipo
**Descripción:** Mecanismo de herencia de JavaScript donde los objetos pueden heredar propiedades y métodos de otros objetos a través de la cadena de prototipos.

**Ejemplo:**
```javascript
// Cadena de Prototipos
function Animal(nombre) {
  this.nombre = nombre;
}

Animal.prototype.hablar = function() {
  return `${this.nombre} hace un sonido`;
};

function Perro(nombre, raza) {
  Animal.call(this, nombre);
  this.raza = raza;
}

// Configurar herencia
Perro.prototype = Object.create(Animal.prototype);
Perro.prototype.constructor = Perro;

Perro.prototype.ladrar = function() {
  return `${this.nombre} ladra`;
};

const perro = new Perro("Rex", "Pastor Alemán");
console.log(perro.hablar()); // "Rex hace un sonido"
console.log(perro.ladrar());  // "Rex ladra"

// Object.create vs sintaxis de clase
// Usando Object.create
const protoAnimal = {
  hablar() {
    return `${this.nombre} hace un sonido`;
  }
};

const gato = Object.create(protoAnimal);
gato.nombre = "Bigotes";
console.log(gato.hablar()); // "Bigotes hace un sonido"

// Usando sintaxis de clase (ES6+)
class AnimalModerno {
  constructor(nombre) {
    this.nombre = nombre;
  }
  
  hablar() {
    return `${this.nombre} hace un sonido`;
  }
}

class PerroModerno extends AnimalModerno {
  constructor(nombre, raza) {
    super(nombre);
    this.raza = raza;
  }
  
  ladrar() {
    return `${this.nombre} ladra`;
  }
}

const perroModerno = new PerroModerno("Buddy", "Golden Retriever");
```

**Comparación:** La cadena de prototipos habilita herencia a través de enlaces __proto__. Object.create establece prototipo directamente, la sintaxis de clase proporciona modelo de herencia más limpio. Las clases son azúcar sintáctico sobre herencia prototípica.

## Debounce & Throttle
**Descripción:** Técnicas para mejorar el rendimiento y experiencia del usuario controlando la frecuencia de ejecución de funciones y optimizando la entrega de código.

**Ejemplo:**
```javascript
// Debounce - retrasa ejecución hasta que las llamadas hayan parado
function debounce(func, retraso) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), retraso);
  };
}

const busquedaDebounced = debounce((consulta) => {
  console.log(`Buscando: ${consulta}`);
}, 300);

// Throttle - limita ejecución a una vez por período de tiempo
function throttle(func, limite) {
  let enThrottle;
  return function(...args) {
    if (!enThrottle) {
      func.apply(this, args);
      enThrottle = true;
      setTimeout(() => enThrottle = false, limite);
    }
  };
}

const scrollThrottled = throttle(() => {
  console.log('Evento scroll disparado');
}, 100);

// Tree Shaking (optimización en tiempo de construcción)
// Solo importa lo que necesitas
import { funcionEspecifica } from 'libreria-grande';
// En lugar de: import * as libreria from 'libreria-grande';

// Code Splitting (importaciones dinámicas)
async function cargarCaracteristica() {
  try {
    const { moduloCaracteristica } = await import('./modulo-caracteristica.js');
    moduloCaracteristica.inicializar();
  } catch (error) {
    console.error('Error al cargar característica:', error);
  }
}

// Code splitting basado en rutas
const rutas = {
  '/inicio': () => import('./paginas/Inicio.js'),
  '/acerca': () => import('./paginas/Acerca.js'),
  '/contacto': () => import('./paginas/Contacto.js')
};

async function navegarA(ruta) {
  const cargarComponente = rutas[ruta];
  if (cargarComponente) {
    const componente = await cargarComponente();
    // Renderizar componente
  }
}
```

**Comparación:** Debounce espera período de calma, throttle limita frecuencia. Tree shaking remueve código no usado en tiempo de construcción. Code splitting carga código bajo demanda, reduciendo el tamaño del bundle inicial.

## Web API
**Descripción:** APIs proporcionadas por el navegador que extienden las capacidades de JavaScript para desarrollo web, incluyendo funciones de tiempo, almacenamiento, comunicación y componentes web.

**Ejemplo:**
```javascript
// setTimeout vs setInterval
const timeoutId = setTimeout(() => {
  console.log('Ejecutado una vez después de 1 segundo');
}, 1000);

const intervalId = setInterval(() => {
  console.log('Ejecutado cada 2 segundos');
}, 2000);

// Limpiar temporizadores
clearTimeout(timeoutId);
clearInterval(intervalId);

// Fetch (métodos: POST/GET, códigos de estado)
// Petición GET
fetch('/api/datos')
  .then(respuesta => {
    console.log('Estado:', respuesta.status); // 200, 404, 500, etc.
    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
    }
    return respuesta.json();
  })
  .then(datos => console.log(datos))
  .catch(error => console.error('Error de fetch:', error));

// Petición POST
fetch('/api/usuarios', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ nombre: 'Juan', email: 'juan@ejemplo.com' })
})
  .then(respuesta => respuesta.json())
  .then(datos => console.log('Éxito:', datos));

// localStorage vs sessionStorage
localStorage.setItem('persistente', 'sobrevive reinicio de navegador');
sessionStorage.setItem('temporal', 'se borra al cerrar pestaña');

console.log(localStorage.getItem('persistente'));
console.log(sessionStorage.getItem('temporal'));

// Cookies
document.cookie = "usuario=juan; expires=Thu, 18 Dec 2024 12:00:00 UTC; path=/";
console.log(document.cookie);

// Web Workers & Shared Workers
const worker = new Worker('worker.js');
worker.postMessage('Hola Worker');
worker.onmessage = (e) => console.log('Del worker:', e.data);

// postMessage (comunicación entre frames)
// En ventana padre
window.postMessage('Hola', '*');
// En frame/ventana hijo
window.addEventListener('message', (evento) => {
  console.log('Recibido:', evento.data);
});

// Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registro => console.log('SW registrado'))
    .catch(error => console.log('Registro SW falló'));
}

// WebSocket
const socket = new WebSocket('wss://ejemplo.com/socket');
socket.onopen = () => console.log('WebSocket conectado');
socket.onmessage = (evento) => console.log('Mensaje:', evento.data);
socket.send('Hola Servidor');

// Estrategia de script (async vs defer)
// <script async src="script.js"></script> // Descarga paralela, ejecuta inmediatamente
// <script defer src="script.js"></script> // Descarga paralela, ejecuta después del parsing HTML

// Componentes Web
class BotonPersonalizado extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    const boton = document.createElement('button');
    boton.textContent = this.getAttribute('texto') || 'Clic aquí';
    
    const estilo = document.createElement('style');
    estilo.textContent = `
      button { background: blue; color: white; padding: 10px; }
    `;
    
    shadow.appendChild(estilo);
    shadow.appendChild(boton);
  }
}

customElements.define('boton-personalizado', BotonPersonalizado);
```

**Comparación:** setTimeout ejecuta una vez, setInterval se repite. fetch devuelve promesas, maneja métodos HTTP y códigos de estado. localStorage persiste entre sesiones, sessionStorage es específico de pestaña. Service Workers habilitan funcionalidad offline, Web Workers ejecutan código en hilos en background. Scripts async ejecutan inmediatamente, defer espera el parsing HTML.

## ECMAScript
**Descripción:** Características modernas de JavaScript y mejoras de sintaxis que aumentan la productividad del desarrollador y legibilidad del código, incluyendo funciones flecha, métodos de array y operadores más nuevos.

**Ejemplo:**
```javascript
// Función flecha vs función regular
const funcionRegular = function(nombre) {
  console.log('this:', this);
  return `Hola ${nombre}`;
};

const funcionFlecha = (nombre) => {
  console.log('this:', this); // Hereda this del ámbito envolvente
  return `Hola ${nombre}`;
};

const obj = {
  nombre: 'Objeto',
  metodoRegular: function() {
    console.log('This regular:', this.nombre); // 'Objeto'
  },
  metodoFlecha: () => {
    console.log('This flecha:', this.nombre); // undefined (hereda del global)
  }
};

// map vs forEach
const numeros = [1, 2, 3, 4, 5];

// forEach - ejecuta función para cada elemento, devuelve undefined
numeros.forEach(num => console.log(num * 2));

// map - transforma cada elemento, devuelve nuevo array
const duplicados = numeros.map(num => num * 2);
console.log(duplicados); // [2, 4, 6, 8, 10]

// BigInt (manejando enteros grandes)
const numeroGrande = 9007199254740991n;
const otroGrande = BigInt("9007199254740991");
console.log(numeroGrande + 1n); // 9007199254740992n

// Importaciones dinámicas
async function cargarModulo() {
  const { default: modulo } = await import('./mi-modulo.js');
  modulo.hacerAlgo();
}

// Importación dinámica condicional
if (algunaCondicion) {
  const { utilidades } = await import('./utilidades.js');
  utilidades.ayudante();
}

// Parámetros (spread y rest)
// Parámetros rest
function suma(...numeros) {
  return numeros.reduce((total, num) => total + num, 0);
}
console.log(suma(1, 2, 3, 4)); // 10

// Operador spread
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Encadenamiento opcional (?.)
const usuario = {
  perfil: {
    configuracion: {
      tema: 'oscuro'
    }
  }
};

console.log(usuario?.perfil?.configuracion?.tema); // 'oscuro'
console.log(usuario?.perfil?.preferencias?.idioma); // undefined (sin error)

// Encadenamiento de métodos con encadenamiento opcional
const resultado = obj?.metodo?.()?.propiedad;

// Coalescencia nula (??)
const nombreUsuario = usuario.nombre ?? 'Invitado'; // Solo null/undefined activan default
const edadUsuario = usuario.edad ?? 18;

// Diferencia con ||
const cadenaVacia = '';
console.log(cadenaVacia || 'default'); // 'default'
console.log(cadenaVacia ?? 'default'); // '' (cadena vacía no es null/undefined)

const cero = 0;
console.log(cero || 'default'); // 'default'
console.log(cero ?? 'default'); // 0
```

**Comparación:** Las funciones flecha heredan this, las funciones regulares tienen su propio contexto this. map devuelve nuevo array, forEach devuelve undefined. BigInt maneja enteros más allá de Number.MAX_SAFE_INTEGER. Las importaciones dinámicas habilitan code splitting. Rest recolecta parámetros, spread expande elementos. El encadenamiento opcional previene errores en propiedades undefined. La coalescencia nula solo considera null/undefined como falsy, a diferencia del operador ||.
