# JavaScript Guide

## Data Types
**Description:** JavaScript tiene tipos de datos primitivos (number, string, boolean, null, undefined, symbol, bigint) y tipos por referencia como objetos.
**Example:**
```javascript
// == vs === (Shallow comparison)
console.log(5 == "5");    // true (type coercion)
console.log(5 === "5");   // false (strict comparison)
console.log(null == undefined);  // true
console.log(null === undefined); // false

// null vs undefined
let declared;              // undefined
let empty = null;         // null
console.log(declared);    // undefined
console.log(empty);       // null

// Symbol use case
const id1 = Symbol('id');
const id2 = Symbol('id');
console.log(id1 === id2); // false (symbols are unique)
const user = { [id1]: 'John' };

// BigInt
const bigNumber = 9007199254740991n;
const anotherBig = BigInt(9007199254740991);
console.log(bigNumber + 1n); // 9007199254740992n

// typeof vs instanceof
console.log(typeof "hello");     // "string"
console.log(typeof 42);          // "number"
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true

// Map vs Set
const map = new Map();
map.set('key', 'value');
const set = new Set([1, 2, 3, 3]); // {1, 2, 3}
```

**Comparison:**
| Concepto                   | Descripción                                                       |
|----------------------------|------------------------------------------------------------------|
| `==` vs `===`              | `==` realiza coerción de tipo, `===` no la realiza (compara tipo y valor) |
| `null` vs `undefined`      | `null` es asignado explícitamente; `undefined` significa no asignado |
| `Symbol`                   | Crea identificadores únicos                                       |
| `BigInt`                   | Maneja enteros muy grandes                                        |
| `typeof`                   | Devuelve una cadena con el tipo de dato                           |
| `instanceof`               | Verifica la cadena de prototipos para un tipo específico         |
| `Map`                      | Almacena pares clave-valor                                       |
| `Set`                      | Almacena valores únicos                                          |


## Scope
**Description:** define desde dónde puedes acceder a una variable. En JavaScript hay scope global, de función y de bloque (let/const). Conocerlo evita errores y conflictos de nombres.
**Example:**
```javascript
// Global Scope
var globalVar = "I'm global";
let globalLet = "I'm also global";

function demoScope() {
  // Function Scope
  var functionVar = "I'm function scoped";
  
  if (true) {
    // Block Scope
    let blockLet = "I'm block scoped";
    const blockConst = "I'm also block scoped";
    var functionVarInBlock = "I'm still function scoped";
    
    console.log(blockLet); // ✅ Works
    console.log(globalVar); // ✅ Works - can access global
  }
  
  // console.log(blockLet); // ❌ ReferenceError - block scoped
  console.log(functionVarInBlock); // ✅ Works - function scoped
}

// Lexical Scope Example
function outerFunction(x) {
  function innerFunction(y) {
    console.log(x + y); // Can access outer function's parameter
  }
  return innerFunction;
}

const closure = outerFunction(10);
closure(5); // 15

// Comparison: var vs let vs const
// 1. Hoisting behavior
console.log(varVariable); // undefined (hoisted but not initialized)
// console.log(letVariable); // ❌ ReferenceError (temporal dead zone)
// console.log(constVariable); // ❌ ReferenceError (temporal dead zone)

var varVariable = "I'm var";
let letVariable = "I'm let";
const constVariable = "I'm const";

// 2. Re-declaration
var varVariable = "I can be re-declared"; // ✅ Works
// let letVariable = "I cannot be re-declared"; // ❌ SyntaxError
// const constVariable = "I cannot be re-declared"; // ❌ SyntaxError

// 3. Re-assignment
varVariable = "I can be re-assigned"; // ✅ Works
letVariable = "I can be re-assigned"; // ✅ Works
// constVariable = "I cannot be re-assigned"; // ❌ TypeError

// 4. Block scope
function scopeDemo() {
  if (true) {
    var varInBlock = "I'm function scoped";
    let letInBlock = "I'm block scoped";
    const constInBlock = "I'm block scoped";
  }
  
  console.log(varInBlock); // ✅ Works - function scoped
  // console.log(letInBlock); // ❌ ReferenceError - block scoped
  // console.log(constInBlock); // ❌ ReferenceError - block scoped
}
```

## Closures
**Description:** Es una función que recuerda y puede acceder a las variables de su scope (ámbito) externo, incluidas las variables declaradas internamente y los argumentos de la función externa, incluso después de que esta haya terminado de ejecutarse.
**Example:**
```javascript
// Basic Closure
function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate closure)

// Module Pattern using Closures
const calculator = (function() {
  let result = 0;
  
  return {
    add: function(x) { result += x; return this; },
    subtract: function(x) { result -= x; return this; },
    multiply: function(x) { result *= x; return this; },
    getResult: function() { return result; },
    reset: function() { result = 0; return this; }
  };
})();

calculator.add(10).multiply(2).subtract(5).getResult(); // 15

// Closure in Loops (Common Pitfall)
// Wrong way
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Prints 3, 3, 3
  }, 100);
}

// Right way with closure
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // Prints 0, 1, 2
  }, 100);
}

// Or with IIFE
for (var i = 0; i < 3; i++) {
  (function(index) {
    setTimeout(function() {
      console.log(index); // Prints 0, 1, 2
    }, 100);
  })(i);
}
```

## Type Coercion
**Description:** es cuando JavaScript convierte automáticamente un valor de un tipo a otro, como de número a texto. Comprenderla ayuda a evitar resultados inesperados.
**Example:**
```javascript
// Implicit Coercion
console.log("5" + 3);       // "53" (number to string)
console.log("5" - 3);       // 2 (string to number)
console.log("5" * "2");     // 10 (both to numbers)
console.log(true + 1);      // 2 (boolean to number)
console.log(false + 1);     // 1
console.log(null + 1);      // 1 (null becomes 0)
console.log(undefined + 1); // NaN

// Falsy and Truthy Values
const falsyValues = [false, 0, -0, 0n, "", null, undefined, NaN];
const truthyValues = [true, 1, -1, "0", "false", [], {}, function(){}];

falsyValues.forEach(val => console.log(!!val)); // All false
truthyValues.forEach(val => console.log(!!val)); // All true

// == vs === Coercion
console.log(0 == false);      // true (coercion)
console.log(0 === false);     // false (no coercion)
console.log("" == false);     // true
console.log("" === false);    // false
console.log(null == undefined); // true (special case)
console.log(null === undefined); // false

// Object to Primitive Conversion
const obj = {
  valueOf: () => 42,
  toString: () => "Object"
};
console.log(obj + 1);    // 43 (uses valueOf)
console.log(obj + "");   // "42" (uses valueOf, then string)
console.log(String(obj)); // "Object" (uses toString)

// Array Coercion
console.log([1,2,3] + [4,5,6]); // "1,2,34,5,6" (both become strings)
console.log([1] + [2]);         // "12"
console.log([1] - [2]);         // -1 (both become numbers: 1 - 2)
```

## Hoisting
**Description:** Es el comportamiento de JavaScript de mover declaraciones al inicio del ámbito antes de ejecutar el código. Esto afecta cómo y cuándo puedes usar variables y funciones.
**Example:**
```javascript
// var vs let vs const hoisting
console.log(varVariable); // undefined (hoisted but not initialized)
console.log(letVariable); // ❌ ReferenceError (temporal dead zone)

var varVariable = "I'm var";
let letVariable = "I'm let";
const constVariable = "I'm const";

// Function Hoisting
console.log(hoistedFunction()); // "I'm hoisted!" - works

function hoistedFunction() {
  return "I'm hoisted!";
}

// Function expressions are not hoisted
console.log(notHoisted()); // ❌ TypeError: notHoisted is not a function

var notHoisted = function() {
  return "I'm not hoisted";
};

// Temporal Dead Zone with let/const
function temporalDeadZoneExample() {
  console.log(typeof myLet); // ❌ ReferenceError
  let myLet = "initialized";
}

// Class hoisting
console.log(new MyClass()); // ❌ ReferenceError

class MyClass {
  constructor() {
    this.value = 42;
  }
}
```

## Destructuring
**Description:** Permite extraer valores de arrays u objetos y asignarlos a variables de forma concisa, facilitando la lectura del código.
**Example:**
```javascript
// Array Destructuring
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5]

// Skipping elements
const [a, , c] = numbers; // Skip second element
console.log(a, c); // 1, 3

// Default values
const [x = 0, y = 0] = [1]; // y gets default value
console.log(x, y); // 1, 0

// Object Destructuring
const person = { name: 'John', age: 30, city: 'New York' };
const { name, age, country = 'USA' } = person;
console.log(name, age, country); // John, 30, USA

// Renaming variables
const { name: personName, age: personAge } = person;
console.log(personName, personAge); // John, 30

// Nested destructuring
const user = {
  id: 1,
  profile: {
    firstName: 'Jane',
    lastName: 'Doe',
    social: {
      twitter: '@janedoe'
    }
  }
};

const {
  profile: {
    firstName,
    social: { twitter }
  }
} = user;
console.log(firstName, twitter); // Jane, @janedoe

// Function parameter destructuring
function displayUser({ name, age = 0, email }) {
  console.log(`${name}, ${age}, ${email}`);
}

displayUser({ name: 'Bob', email: 'bob@email.com' }); // Bob, 0, bob@email.com
```

## Rest and Spread Operators
**Description:**  operadores que usan `...` para reunir valores en un array u objeto o para expandirlos. Facilitan la manipulación de datos y parámetros.
**Example:**
```javascript
// Rest in Functions
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Rest in Destructuring
const [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [2, 3, 4]

const { name, ...otherProps } = { name: 'John', age: 30, city: 'NYC' };
console.log(name);       // John
console.log(otherProps); // { age: 30, city: 'NYC' }

// Spread with Arrays
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Spread with Objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 }; // { a: 1, b: 2, c: 3, d: 4 }

// Spread in Function Calls
function multiply(x, y, z) {
  return x * y * z;
}
const nums = [2, 3, 4];
console.log(multiply(...nums)); // 24

// Cloning (shallow)
const original = [1, 2, 3];
const clone = [...original];
const objectClone = { ...obj1 };
```

## Event Delegation and Event Handling
**Description:** Permite manejar eventos desde un elemento padre en lugar de asignar uno a cada hijo. Esto mejora el rendimiento y simplifica el código.
**Example:**
```javascript
// Event Bubbling Example
document.addEventListener('DOMContentLoaded', () => {
  // Without delegation (inefficient for many elements)
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', (e) => {
      console.log('Button clicked:', e.target.textContent);
    });
  });

  // With Event Delegation (efficient)
  document.getElementById('container').addEventListener('click', (e) => {
    if (e.target.classList.contains('button')) {
      console.log('Delegated click:', e.target.textContent);
    }
  });

  // Event phases: capturing, target, bubbling
  document.getElementById('outer').addEventListener('click', () => {
    console.log('Outer (bubbling)');
  }, false); // false = bubbling phase

  document.getElementById('inner').addEventListener('click', (e) => {
    console.log('Inner target');
    // e.stopPropagation(); // Stops bubbling
  });

  document.getElementById('outer').addEventListener('click', () => {
    console.log('Outer (capturing)');
  }, true); // true = capturing phase

  // Custom events
  const customEvent = new CustomEvent('myEvent', {
    detail: { message: 'Hello from custom event!' },
    bubbles: true
  });

  document.addEventListener('myEvent', (e) => {
    console.log(e.detail.message);
  });

  // Dispatch custom event
  document.dispatchEvent(customEvent);

  // Event object properties
  document.addEventListener('click', (e) => {
    console.log({
      target: e.target,        // Element that triggered the event
      currentTarget: e.currentTarget, // Element with the listener
      type: e.type,           // Event type
      bubbles: e.bubbles,     // Whether it bubbles
      preventDefault: e.preventDefault, // Prevent default action
      stopPropagation: e.stopPropagation // Stop event propagation
    });
  });
});
```

## DOM Manipulation
**Description:** Consiste en seleccionar, crear, modificar o eliminar elementos HTML dinámicamente con JavaScript.
**Example:**
```javascript
// Element Selection
const byId = document.getElementById('myId');
const byClass = document.getElementsByClassName('myClass'); // HTMLCollection
const byTag = document.getElementsByTagName('div');
const querySelector = document.querySelector('.class #id'); // First match
const querySelectorAll = document.querySelectorAll('.class'); // NodeList

// Creating Elements
const newDiv = document.createElement('div');
newDiv.textContent = 'Hello World';
newDiv.className = 'new-element';
newDiv.id = 'dynamicDiv';

// Setting attributes
newDiv.setAttribute('data-info', 'value');
newDiv.dataset.custom = 'dataset value'; // data-custom attribute

// Modifying content
element.innerHTML = '<strong>HTML content</strong>'; // Can be dangerous
element.textContent = 'Safe text content'; // Safe from XSS
element.innerText = 'Text respecting styling'; // Respects display:none

// Modifying styles
element.style.color = 'red';
element.style.backgroundColor = 'blue';
element.style.cssText = 'color: red; background: blue;';

// Class manipulation
element.classList.add('new-class');
element.classList.remove('old-class');
element.classList.toggle('toggle-class');
element.classList.contains('check-class');

// Adding to DOM
document.body.appendChild(newDiv);
document.body.insertBefore(newDiv, existingElement);
element.insertAdjacentHTML('beforeend', '<span>New content</span>');

// Removing from DOM
element.remove(); // Modern way
element.parentNode.removeChild(element); // Legacy way

// Traversing DOM
const parent = element.parentNode;
const children = element.children; // HTMLCollection
const siblings = element.nextElementSibling;
const previousSibling = element.previousElementSibling;

// Event handling
element.addEventListener('click', function(e) {
  console.log('Clicked!', this, e.target);
});

// Performance optimization
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const item = document.createElement('li');
  item.textContent = `Item ${i}`;
  fragment.appendChild(item);
}
document.getElementById('list').appendChild(fragment); // Single reflow
```


## Named Function
**Description:** Una función, hoisted (elevada) al inicio de su ámbito, disponible incluso antes de que su definición aparezca en el código.
**Example:**
```javascript
// 1. Named Function
function greet(name) {
  return `Hello, ${name}!`;
}
```

**Comparison:**
| Tipo de función       | Descripción | Hoisting | Enlace de `this` | Sintaxis |
|-----------------------|-------------|----------|------------------|----------|
| **Función Nombrada**  | Una función con un nombre declarado, elevada (*hoisted*) al inicio de su ámbito, disponible incluso antes de que su definición aparezca en el código. | Sí | Tiene su propio `this` | `function nombre() { ... }` |
| **Función Anónima**   | Una función sin nombre, normalmente asignada a una variable o pasada como argumento. No se eleva, por lo que solo puede usarse después de su definición. | No | Tiene su propio `this` | `const fn = function() { ... };` |
| **Función Flecha**    | Una sintaxis más concisa para escribir funciones. No tiene su propio `this`, `arguments` ni `prototype`, lo que la hace útil para *callbacks* y para preservar el `this` del contexto exterior. | No | Hereda el `this` del contexto exterior | `const fn = () => { ... };` |


## Anonymous Function
**Description:** Una función, normalmente asignada a una variable o pasada como argumento. No se hoistea, por lo que solo puede usarse después de su definición.
**Example:**
```javascript
// 2. Anonymous Function
const greetAnon = function(name) {
  return `Hi, ${name}!`;
};
```

**Comparison:**
| Tipo de función       | Descripción | Hoisting | Enlace de `this` | Sintaxis |
|-----------------------|-------------|----------|------------------|----------|
| **Función Nombrada**  | Una función con un nombre declarado, elevada (*hoisted*) al inicio de su ámbito, disponible incluso antes de que su definición aparezca en el código. | Sí | Tiene su propio `this` | `function nombre() { ... }` |
| **Función Anónima**   | Una función sin nombre, normalmente asignada a una variable o pasada como argumento. No se eleva, por lo que solo puede usarse después de su definición. | No | Tiene su propio `this` | `const fn = function() { ... };` |
| **Función Flecha**    | Una sintaxis más concisa para escribir funciones. No tiene su propio `this`, `arguments` ni `prototype`, lo que la hace útil para *callbacks* y para preservar el `this` del contexto exterior. | No | Hereda el `this` del contexto exterior | `const fn = () => { ... };` |


## Arrow Function
**Description:** Una sintaxis más concisa para escribir funciones. No tiene su propio this, arguments ni prototype, lo que la hace útil para callbacks y para preservar el this del contexto exterior.
**Example:**
```javascript
// 3. Arrow Function
const greetArrow = (name) => `Hey, ${name}!`;
```
**Comparison:**

| Tipo de función       | Descripción | Hoisting | Enlace de `this` | Sintaxis |
|-----------------------|-------------|----------|------------------|----------|
| **Función Nombrada**  | Una función con un nombre declarado, elevada (*hoisted*) al inicio de su ámbito, disponible incluso antes de que su definición aparezca en el código. | Sí | Tiene su propio `this` | `function nombre() { ... }` |
| **Función Anónima**   | Una función sin nombre, normalmente asignada a una variable o pasada como argumento. No se eleva, por lo que solo puede usarse después de su definición. | No | Tiene su propio `this` | `const fn = function() { ... };` |
| **Función Flecha**    | Una sintaxis más concisa para escribir funciones. No tiene su propio `this`, `arguments` ni `prototype`, lo que la hace útil para *callbacks* y para preservar el `this` del contexto exterior. | No | Hereda el `this` del contexto exterior | `const fn = () => { ... };` |


## Call, Bind, and Apply
**Description:** Los métodos que permiten definir explícitamente el valor de `this` y cómo pasar argumentos al llamar a una función.

**Comparison:**
| Método   | ¿Ejecuta la función de inmediato? | Forma de pasar argumentos | Uso típico |
|----------|-----------------------------------|----------------------------|------------|
| **call** | Sí                                | Argumentos separados por comas (`fn.call(ctx, arg1, arg2)`) | Ejecutar la función con un `this` específico y argumentos directos. |
| **apply**| Sí                                | Argumentos en un array o similar (`fn.apply(ctx, [arg1, arg2])`) | Igual que `call`, pero útil cuando ya tienes los argumentos en un array. |
| **bind** | No (devuelve una nueva función)   | Igual que `call` (separados por comas) | Crear una nueva función con `this` fijo y argumentos predefinidos para usar después. |

**Example:**
```javascript
const person1 = { name: 'John', age: 30 };
const person2 = { name: 'Jane', age: 25 };

function introduce(greeting, punctuation) {
  return `${greeting}, I'm ${this.name} and I'm ${this.age} years old${punctuation}`;
}

// Call - invoke immediately with specific 'this' and individual arguments
console.log(introduce.call(person1, 'Hello', '!')); 
// "Hello, I'm John and I'm 30 years old!"

console.log(introduce.call(person2, 'Hi', '.'));
// "Hi, I'm Jane and I'm 25 years old."

// Apply - invoke immediately with specific 'this' and array of arguments
const args = ['Greetings', '!!!'];
console.log(introduce.apply(person1, args));
// "Greetings, I'm John and I'm 30 years old!!!"

// Bind - returns new function with bound 'this' (doesn't invoke immediately)
const johnIntroduce = introduce.bind(person1);
console.log(johnIntroduce('Hey', '.')); 
// "Hey, I'm John and I'm 30 years old."

const janeGreeting = introduce.bind(person2, 'Welcome'); // Partial application
console.log(janeGreeting('!')); 
// "Welcome, I'm Jane and I'm 25 years old!"

// Practical examples
const calculator = {
  result: 0,
  add: function(x) {
    this.result += x;
    return this;
  },
  multiply: function(x) {
    this.result *= x;
    return this;
  },
  getResult: function() {
    return this.result;
  }
};

const calculator2 = { result: 100 };

// Borrowing methods
const add = calculator.add;
add.call(calculator2, 50); // calculator2.result becomes 150
console.log(calculator2.result); // 150

// Function borrowing from arrays
const arrayLike = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3
};

const realArray = Array.prototype.slice.call(arrayLike);
console.log(realArray); // ['a', 'b', 'c']

// Modern alternative
const modernArray = Array.from(arrayLike);
console.log(modernArray); // ['a', 'b', 'c']

// Binding event handlers
class Button {
  constructor(element) {
    this.element = element;
    this.clickCount = 0;
    
    // Without bind, 'this' would refer to the button element
    this.element.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick() {
    this.clickCount++;
    console.log(`Button clicked ${this.clickCount} times`);
  }
}

// Arrow functions vs bind
class Component {
  constructor() {
    this.value = 42;
  }
  
  // Traditional binding
  traditionalMethod() {
    setTimeout(function() {
      console.log(this.value); // undefined without bind
    }.bind(this), 1000);
  }
  
  // Arrow function (lexical this)
  arrowMethod() {
    setTimeout(() => {
      console.log(this.value); // 42 - arrow functions inherit 'this'
    }, 1000);
  }
}
```

## Módulos

**Description**  
Permiten dividir el código en partes independientes y reutilizables. En JavaScript, los tres sistemas de módulos más usados son: ES Modules (ESM), CommonJS (CJS) y AMD (Asynchronous Module Definition). Cada uno tiene su propia sintaxis, forma de cargar los módulos y soporte en distintas plataformas.

**Comparison**

| Característica              | ES Modules (ESM)                         | CommonJS (CJS)                      | AMD (Asynchronous Module Definition)         |
|----------------------------|----------------------------------------|-----------------------------------|-----------------------------------------------|
| Año / Estándar             | ECMAScript 2015 (ES6)                   | No estándar, surgió en Node.js    | Surgió en 2009 para navegadores                |
| Sintaxis principal         | `import` / `export`                     | `require()` / `module.exports`    | `define()` y `require()`                        |
| Carga                     | Asincrónica y estática                  | Sincrónica                       | Asincrónica                                    |
| Soporte nativo             | Navegadores modernos y Node.js (v14+)  | Node.js                          | Navegadores (con librerías tipo RequireJS)     |
| Scope                     | Cada módulo tiene su propio scope       | Cada módulo tiene su propio scope | Cada módulo tiene su propio scope                |
| Formato                   | Archivos `.js` con import/export        | Archivos `.js` con require/module.exports | Funciones que definen módulos                 |
| Uso principal             | JavaScript moderno (frontend y backend) | Principalmente backend (Node.js)  | Principalmente frontend antes de ESM           |
| Compatibilidad            | No compatible directo con CommonJS sin herramientas | No compatible con ES Modules sin herramientas | No compatible directamente con CommonJS ni ESM |
| Ventajas                  | Estándar oficial, soporte en navegadores, optimizable para carga | Simple, ampliamente usado en Node.js | Permite carga asíncrona en navegador           |
| Desventajas               | Requiere herramientas o flags en Node.js antiguos, sintaxis estricta | Sin soporte en navegador nativo, carga sincrónica | Más complejo, menos popular hoy en día          |


**Example:**
```javascript
// ES Modules (ESM)
export function suma(a, b) {
  return a + b;
}

import { suma } from './suma.js';
console.log(suma(2, 3)); // 5
```

## Template Strings
**Description:** Usan comillas invertidas y permiten insertar variables, expresiones y saltos de línea fácilmente.
**Example:**
```javascript
const name = 'John';
const age = 30;

// Basic template literal
const greeting = `Hello, my name is ${name} and I'm ${age} years old.`;
console.log(greeting);

// Multi-line strings
const multiLine = `
  This is a multi-line string
  that preserves all whitespace
  and line breaks.
`;

// Expression evaluation
const a = 5, b = 10;
console.log(`The sum of ${a} and ${b} is ${a + b}.`); // "The sum of 5 and 10 is 15."

// Function calls in templates
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

const price = 19.99;
console.log(`The price is ${formatCurrency(price)}`); // "The price is $19.99"

// Conditional expressions
const user = { name: 'Alice', premium: true };
const message = `Welcome ${user.name}${user.premium ? ' (Premium Member)' : ''}!`;

// Object property access
const product = { name: 'Laptop', price: 999 };
console.log(`Product: ${product.name} - Price: $${product.price}`);

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : '';
    return result + string + value;
  }, '');
}

const searchTerm = 'JavaScript';
const text = highlight`Learn ${searchTerm} programming today!`;
console.log(text); // "Learn <mark>JavaScript</mark> programming today!"

// Raw strings
console.log(`Line 1\nLine 2`); // With newline
console.log(String.raw`Line 1\nLine 2`); // Literal \n

// Complex expressions
const users = ['Alice', 'Bob', 'Charlie'];
const html = `
  <ul>
    ${users.map(user => `<li>${user}</li>`).join('')}
  </ul>
`;
console.log(html);

// Nested templates
const renderCard = (title, items) => `
  <div class="card">
    <h3>${title}</h3>
    <ul>
      ${items.map(item => `
        <li class="${item.active ? 'active' : 'inactive'}">
          ${item.name} ${item.active ? '✓' : '✗'}
        </li>
      `).join('')}
    </ul>
  </div>
`;
```

## Exception Handling
**Description:** permite capturar y responder a errores con `try`, `catch` y `finally`, evitando que el programa falle.
**Example:**
```javascript
// Basic try-catch-finally
try {
  const result = riskyOperation();
  console.log(result);
} catch (error) {
  console.error('An error occurred:', error.message);
} finally {
  console.log('This always runs');
}

// Specific error types
try {
  JSON.parse('invalid json');
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log('Invalid JSON syntax');
  } else if (error instanceof ReferenceError) {
    console.log('Reference error');
  } else {
    console.log('Unknown error:', error);
  }
}

// Custom errors
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

function validateEmail(email) {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email');
  }
  return email;
}

try {
  validateEmail('invalid-email');
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed for ${error.field}: ${error.message}`);
  }
}

// Async error handling
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error.message);
    throw error; // Re-throw if needed
  }
}

// Promise error handling
fetchData('/api/data')
  .then(data => console.log(data))
  .catch(error => console.error('Promise rejected:', error));

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // Prevent default browser behavior
});

// Error boundaries concept (React-like)
function safeExecute(fn, fallback) {
  try {
    return fn();
  } catch (error) {
    console.error('Safe execution failed:', error);
    return fallback;
  }
}

const result = safeExecute(
  () => riskyCalculation(),
  'default value'
);

// Retrying with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```


## Synchronism Event Loop
**Description:** JavaScript es de un solo hilo, ejecuta código de forma síncrona y usa el event loop para manejar tareas asíncronas.

**Example:**
```javascript
// Event Loop / Stack / Callback Queue
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
// Output: 1, 3, 2

// Call Stack demonstration
function first() {
  console.log("First");
  second();
}

function second() {
  console.log("Second");
}

first(); // Stack: first -> second -> pop second -> pop first

// Callbacks
function fetchData(callback) {
  setTimeout(() => {
    callback("Data received");
  }, 1000);
}

fetchData((data) => {
  console.log(data); // "Data received" after 1 second
});

// Generators / Iterators
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // {value: 1, done: false}
console.log(gen.next()); // {value: 2, done: false}

// Custom iterator
const iterable = {
  [Symbol.iterator]: function() {
    let step = 0;
    return {
      next: function() {
        step++;
        return step <= 3 
          ? {value: step, done: false}
          : {done: true};
      }
    };
  }
};

for (const value of iterable) {
  console.log(value); // 1, 2, 3
}
```

**Comparison:** 
| Concepto              | Descripción                                                             |
|-----------------------|------------------------------------------------------------------------|
| Call Stack            | Ejecuta operaciones de forma síncrona                                  |
| Callback Queue        | Maneja operaciones asíncronas                                          |
| Callbacks             | Pueden generar callback hell (anidamiento profundo y difícil de leer) |
| Generadores           | Permiten pausar y reanudar la ejecución                               |
| Iteradores            | Definen cómo se itera un objeto                                        |
| Event Loop            | Coordina la ejecución entre el call stack y la callback queue          |


## Promises
**Description:** Representa una operación asíncrona que puede completarse con éxito o error. Facilita el manejo de código asíncrono.

**Example:**
```javascript
// Creating Promises
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) {
      resolve('Operation succeeded!');
    } else {
      reject(new Error('Operation failed!'));
    }
  }, 1000);
});

// Promise methods
Promise.resolve('immediate value'); // Resolved promise
Promise.reject(new Error('immediate error')); // Rejected promise

// Promise chaining
fetch('/api/data')
  .then(response => response.json())
  .then(data => {
    console.log('Data received:', data);
    return data.processed;
  })
  .then(processed => {
    console.log('Processed:', processed);
  })
  .catch(error => {
    console.error('Chain failed:', error);
  })
  .finally(() => {
    console.log('Chain completed');
  });
```

## Promise.all
**Description:** Ejecuta varias promesas en paralelo y devuelve todas sus respuestas si ninguna falla, o un error si alguna rechaza.

**Example:**
```javascript
// Basic Promise.all usage
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(data => {
    console.log('All data loaded:', data);
    // data[0] = users, data[1] = posts, data[2] = comments
  })
  .catch(error => {
    console.error('One request failed:', error);
  });

// Promise.all with mixed promises
const mixedPromises = [
  Promise.resolve(42),
  Promise.resolve('hello'),
  Promise.resolve(true)
];

Promise.all(mixedPromises)
  .then(values => console.log(values)); // [42, 'hello', true]
```

## Promise.allSettled
**Description:** Ejecuta varias promesas y devuelve los resultados de todas, sin importar si se resolvieron o rechazaron.

**Example:**
```javascript
Promise.allSettled([
  fetch('/api/reliable'),
  fetch('/api/unreliable'),
  fetch('/api/sometimes-fails')
]).then(results => {
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Request ${index} succeeded:`, result.value);
    } else {
      console.log(`Request ${index} failed:`, result.reason);
    }
  });
});

// Mixed success and failure
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('Error'),
  Promise.resolve('Another success')
]).then(results => {
  console.log(results);
  // [
  //   { status: 'fulfilled', value: 'Success' },
  //   { status: 'rejected', reason: 'Error' },
  //   { status: 'fulfilled', value: 'Another success' }
  // ]
});
```

## Promise.race
**Description:** Devuelve el resultado de la primera promesa que se resuelva o rechace.

**Example:**
```javascript
// Race between multiple servers
Promise.race([
  fetch('/api/fast-server'),
  fetch('/api/slow-server'),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
]).then(response => {
  console.log('First response received');
}).catch(error => {
  console.error('First to settle was a rejection:', error);
});

// Race with timeout
function fetchWithTimeout(url, timeout) {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

fetchWithTimeout('/api/data', 3000)
  .then(response => response.json())
  .catch(error => console.error('Request failed or timed out:', error));
```


## Promise.any
**Description:** Devuelve la primera promesa que se cumpla. Solo falla si todas las promesas se rechazan.

**Example:**
```javascript
// First successful server response
Promise.any([
  fetch('/api/server1').catch(() => Promise.reject('Server 1 failed')),
  fetch('/api/server2').catch(() => Promise.reject('Server 2 failed')),
  fetch('/api/server3').catch(() => Promise.reject('Server 3 failed'))
]).then(response => {
  console.log('At least one server responded');
}).catch(error => {
  console.error('All servers failed:', error.errors);
});

// Fallback chain
Promise.any([
  fetch('/api/primary'),
  fetch('/api/backup'),
  fetch('/api/emergency')
]).then(response => {
  console.log('Got response from available server');
}).catch(aggregateError => {
  console.error('All servers unavailable:', aggregateError.errors);
});
```

## Prototype
**Description:** Es el mecanismo de herencia en JavaScript donde objetos pueden compartir propiedades y métodos.

**Example:**
```javascript
// Prototype Chain
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} barks`;
};

const dog = new Dog("Rex", "German Shepherd");
console.log(dog.speak()); // "Rex makes a sound"
console.log(dog.bark());  // "Rex barks"

// Object.create vs class syntax
// Using Object.create
const animalProto = {
  speak() {
    return `${this.name} makes a sound`;
  }
};

const cat = Object.create(animalProto);
cat.name = "Whiskers";
console.log(cat.speak()); // "Whiskers makes a sound"

// Using class syntax (ES6+)
class ModernAnimal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    return `${this.name} makes a sound`;
  }
}

class ModernDog extends ModernAnimal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }
  
  bark() {
    return `${this.name} barks`;
  }
}

const modernDog = new ModernDog("Buddy", "Golden Retriever");
```

## Debounce
**Description:** Retrasa la ejecución de una función hasta que pasa un tiempo sin que vuelva a llamarse, útil para optimizar eventos frecuentes. Casos de uso: Search inputs, form validation, window resize handlers, API calls triggered by user input.

**Example:**
```javascript
// Basic debounce implementation
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Search input debouncing
const searchInput = document.getElementById('search');
const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
  // API call here
  fetch(`/api/search?q=${query}`)
    .then(response => response.json())
    .then(data => console.log(data));
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Window resize debouncing
const debouncedResize = debounce(() => {
  console.log('Window resized:', window.innerWidth, window.innerHeight);
  // Expensive layout calculations here
}, 250);

window.addEventListener('resize', debouncedResize);
```


## Throttle
**Description:** limita la frecuencia con la que una función puede ejecutarse durante un intervalo de tiempo. Casos de uso: Scroll events, mouse movement tracking, button click prevention, animation frame updates, API calls that should execute at regular intervals.

**Example:**
```javascript
// Basic throttle implementation
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Scroll event throttling
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
  // Update progress bar, check if elements are in view, etc.
}, 100);

window.addEventListener('scroll', throttledScroll);

// Mouse move throttling
const throttledMouseMove = throttle((e) => {
  console.log('Mouse position:', e.clientX, e.clientY);
  // Update cursor effects, drag operations, etc.
}, 16); // ~60 FPS

document.addEventListener('mousemove', throttledMouseMove);

// Advanced throttle with leading and trailing options
function advancedThrottle(func, limit, options = {}) {
  let timeout;
  let previous = 0;
  const { leading = true, trailing = true } = options;

  return function(...args) {
    const now = Date.now();
    if (!previous && !leading) previous = now;
    const remaining = limit - (now - previous);

    if (remaining <= 0 || remaining > limit) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout && trailing) {
      timeout = setTimeout(() => {
        previous = leading ? Date.now() : 0;
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
}
```

## setTimeout
**Description:** Ejecuta una función una sola vez después de un retraso en milisegundos.

**Example:**
```javascript
// Basic setTimeout
const timeoutId = setTimeout(() => {
  console.log('Executed after 2 seconds');
}, 2000);

// setTimeout with parameters
setTimeout((name, age) => {
  console.log(`Hello ${name}, you are ${age} years old`);
}, 1000, 'John', 25);

// Clearing timeout
clearTimeout(timeoutId);

// Common pattern: cleanup on component unmount
function createTimer() {
  const timeoutId = setTimeout(() => {
    console.log('Timer executed');
  }, 5000);
  
  // Return cleanup function
  return () => clearTimeout(timeoutId);
}

const cleanup = createTimer();
// Later... cleanup(); // Prevents timer execution
```


## setInterval
**Description:** Ejecuta repetidamente una función cada cierto tiempo en milisegundos hasta que se detiene.

**Example:**
```javascript
// Basic setInterval
const intervalId = setInterval(() => {
  console.log('This runs every second');
}, 1000);

// Clearing interval after some time
setTimeout(() => {
  clearInterval(intervalId);
  console.log('Interval stopped');
}, 5000);

// Counter example
let count = 0;
const counter = setInterval(() => {
  count++;
  console.log(`Count: ${count}`);
  
  if (count >= 10) {
    clearInterval(counter);
    console.log('Counter finished');
  }
}, 500);

// Clock example
function startClock() {
  const clockInterval = setInterval(() => {
    const now = new Date();
    console.log(now.toLocaleTimeString());
  }, 1000);
  
  return () => clearInterval(clockInterval);
}

const stopClock = startClock();
```


## Fetch
**Description:** La API  permite hacer solicitudes HTTP de forma sencilla y devuelve promesas para manejar las respuestas.

**Example:**
```javascript
// GET request
fetch('/api/data')
  .then(response => {
    console.log('Status:', response.status); // 200, 404, 500, etc.
    console.log('Headers:', response.headers.get('content-type'));
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Fetch error:', error));

// POST request
fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ 
    name: 'John', 
    email: 'john@example.com' 
  })
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));

// PUT/PATCH/DELETE requests
fetch('/api/users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated Name' })
});

fetch('/api/users/123', { method: 'DELETE' });

// File upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('description', 'Profile picture');

fetch('/api/upload', {
  method: 'POST',
  body: formData // Don't set Content-Type header with FormData
});

// Async/await with fetch
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`User not found: ${response.status}`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

## Local Storage
**Description:** Guarda datos en el navegador sin fecha de expiración, accesibles incluso al cerrar y abrir el navegador. Casos de uso: User preferences, shopping cart data, form data persistence, authentication tokens, cache data.

**Example:**
```javascript
// Setting items
localStorage.setItem('username', 'john_doe');
localStorage.setItem('preferences', JSON.stringify({
  theme: 'dark',
  language: 'en',
  notifications: true
}));

// Getting items
const username = localStorage.getItem('username');
const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');

console.log(username); // 'john_doe'
console.log(preferences.theme); // 'dark'

// Removing items
localStorage.removeItem('username');

// Clear all
localStorage.clear();

// Check if item exists
if (localStorage.getItem('token')) {
  console.log('User is logged in');
}

// Storage event (fires when localStorage changes in another tab)
window.addEventListener('storage', (e) => {
  console.log('Storage changed:', e.key, e.oldValue, e.newValue);
});

// Helper functions for common patterns
const storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return defaultValue;
    }
  },
  
  remove(key) {
    localStorage.removeItem(key);
  }
};
```

## Session Storage
**Description:** Los datos se eliminan cuando se cierra la pestaña o ventana del navegador. Casos de uso: Multi-step forms, temporary data, tab-specific state, navigation state, temporary user input.

**Example:**
```javascript
// Setting items (same API as localStorage)
sessionStorage.setItem('currentTab', 'dashboard');
sessionStorage.setItem('formData', JSON.stringify({
  step: 2,
  data: { name: 'John', email: 'john@example.com' }
}));

// Getting items
const currentTab = sessionStorage.getItem('currentTab');
const formData = JSON.parse(sessionStorage.getItem('formData') || '{}');

// Multi-step form example
const formManager = {
  saveStep(step, data) {
    sessionStorage.setItem('formStep', step);
    sessionStorage.setItem(`formData_${step}`, JSON.stringify(data));
  },
  
  loadStep() {
    const step = sessionStorage.getItem('formStep') || 1;
    const data = sessionStorage.getItem(`formData_${step}`);
    return { step: parseInt(step), data: data ? JSON.parse(data) : {} };
  },
  
  clearForm() {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('formData_') || key === 'formStep') {
        sessionStorage.removeItem(key);
      }
    });
  }
};

// Tab-specific data
sessionStorage.setItem('tabId', Math.random().toString(36));
```

## Cookies
**Description:** Son pequeños datos que el navegador guarda y envía al servidor en cada petición HTTP al mismo dominio. Casos de uso: Authentication, user preferences, tracking, session management, cross-domain communication.

**Example:**
```javascript
// Setting cookies
document.cookie = "username=john_doe; expires=Thu, 18 Dec 2024 12:00:00 UTC; path=/";
document.cookie = "theme=dark; max-age=3600; path=/; secure; samesite=strict";

// Reading cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const username = getCookie('username');
console.log(username); // 'john_doe'

// Cookie utility functions
const cookies = {
  set(name, value, options = {}) {
    let cookieString = `${name}=${value}`;
    
    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
    
    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }
    
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }
    
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    
    if (options.secure) {
      cookieString += '; secure';
    }
    
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
  },
  
  get(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  },
  
  delete(name, path = '/') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  },
  
  getAll() {
    return document.cookie
      .split(';')
      .reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
        return cookies;
      }, {});
  }
};

// Usage examples
cookies.set('session', 'abc123', { 
  maxAge: 3600, 
  path: '/', 
  secure: true,
  sameSite: 'strict' 
});

const allCookies = cookies.getAll();
console.log(allCookies);
```

## Web Workers
**Description:** Permiten ejecutar código en segundo plano sin bloquear la interfaz del usuario. Casos de uso: Heavy computations, image/video processing, data parsing, background sync, parallel algorithms.

**Example:**
```javascript
// Main thread (main.js)
const worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({
  command: 'process',
  data: [1, 2, 3, 4, 5]
});

// Listen for messages from worker
worker.onmessage = function(e) {
  console.log('Result from worker:', e.data);
};

// Handle worker errors
worker.onerror = function(error) {
  console.error('Worker error:', error);
};

// Terminate worker when done
setTimeout(() => {
  worker.terminate();
}, 10000);

// Worker file (worker.js)
/*
self.onmessage = function(e) {
  const { command, data } = e.data;
  
  if (command === 'process') {
    // Heavy computation
    const result = data.map(n => {
      let sum = 0;
      for (let i = 0; i < 1000000; i++) {
        sum += n * Math.random();
      }
      return sum;
    });
    
    // Send result back to main thread
    self.postMessage(result);
  }
};
*/

// Shared Worker (shared between multiple tabs)
const sharedWorker = new SharedWorker('shared-worker.js');
sharedWorker.port.start();

sharedWorker.port.postMessage('Hello from tab');
sharedWorker.port.onmessage = function(e) {
  console.log('Shared worker response:', e.data);
};
```

## ECMAScript
**Description:** Es el estándar que define el lenguaje JavaScript y sus nuevas características.

**Example:**
```javascript
// Arrow function vs regular function
const regularFunction = function(name) {
  console.log('this:', this);
  return `Hello ${name}`;
};

const arrowFunction = (name) => {
  console.log('this:', this); // Inherits this from enclosing scope
  return `Hello ${name}`;
};

const obj = {
  name: 'Object',
  regularMethod: function() {
    console.log('Regular this:', this.name); // 'Object'
  },
  arrowMethod: () => {
    console.log('Arrow this:', this.name); // undefined (inherits from global)
  }
};

// map vs forEach
const numbers = [1, 2, 3, 4, 5];

// forEach - executes function for each element, returns undefined
numbers.forEach(num => console.log(num * 2));

// map - transforms each element, returns new array
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// BigInt (handling large integers)
const largeNumber = 9007199254740991n;
const anotherLarge = BigInt("9007199254740991");
console.log(largeNumber + 1n); // 9007199254740992n

// Dynamic imports
async function loadModule() {
  const { default: module } = await import('./my-module.js');
  module.doSomething();
}

// Conditional dynamic import
if (someCondition) {
  const { utilities } = await import('./utilities.js');
  utilities.helper();
}

// Parameters (spread and rest)
// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3, 4)); // 10

// Spread operator
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Optional chaining (?.)
const user = {
  profile: {
    settings: {
      theme: 'dark'
    }
  }
};

console.log(user?.profile?.settings?.theme); // 'dark'
console.log(user?.profile?.preferences?.language); // undefined (no error)

// Method chaining with optional chaining
const result = obj?.method?.()?.property;

// Nullish coalescing (??)
const userName = user.name ?? 'Guest'; // Only null/undefined trigger default
const userAge = user.age ?? 18;

// Difference from ||
const emptyString = '';
console.log(emptyString || 'default'); // 'default'
console.log(emptyString ?? 'default'); // '' (empty string is not null/undefined)

const zero = 0;
console.log(zero || 'default'); // 'default'
console.log(zero ?? 'default'); // 0
```

## Async/Await
**Description:** permiten manejar promesas con una sintaxis más clara y similar al código síncrono.
**Example:**
```javascript
// Basic async/await
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Using the async function
async function displayUser() {
  const user = await fetchUser(123);
  console.log(user.name);
}

// Error handling with async/await
async function robustFetch(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error:', error.message);
    } else {
      console.error('Request failed:', error.message);
    }
    return null;
  }
}

// Parallel execution with Promise.all
async function fetchMultipleUsers(ids) {
  try {
    const promises = ids.map(id => fetchUser(id));
    const users = await Promise.all(promises);
    return users;
  } catch (error) {
    console.error('One or more requests failed:', error);
  }
}

// Sequential vs parallel execution
async function sequentialFetch() {
  const user1 = await fetchUser(1); // Wait for this to complete
  const user2 = await fetchUser(2); // Then fetch this
  return [user1, user2];
}

async function parallelFetch() {
  const promise1 = fetchUser(1); // Start both requests
  const promise2 = fetchUser(2);
  const [user1, user2] = await Promise.all([promise1, promise2]);
  return [user1, user2];
}

// Async iteration
async function processItemsSequentially(items) {
  for (const item of items) {
    await processItem(item); // Wait for each to complete
  }
}

async function processItemsConcurrently(items) {
  const promises = items.map(item => processItem(item));
  await Promise.all(promises); // Process all concurrently
}

// Async generators
async function* asyncGenerator() {
  for (let i = 0; i < 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield i;
  }
}

// Using async generator
async function useAsyncGenerator() {
  for await (const value of asyncGenerator()) {
    console.log(value); // 0, 1, 2 (with 1s delays)
  }
}
```

// setTimeout - execute once after delay
const timeoutId = setTimeout(() => {
  console.log('Executed after 2 seconds');
}, 2000);

// Clearing timeout
clearTimeout(timeoutId);

// setTimeout with parameters
setTimeout((name, age) => {
  console.log(`Hello ${name}, you are ${age} years old`);
}, 1000, 'John', 25);

// setInterval - execute repeatedly
const intervalId = setInterval(() => {
  console.log('This runs every second');
}, 1000);

// Clearing interval
setTimeout(() => {
  clearInterval(intervalId);
  console.log('Interval stopped');
}, 5000);

// setImmediate (Node.js) - execute on next iteration of event loop
if (typeof setImmediate !== 'undefined') {
  setImmediate(() => {
    console.log('Runs on next tick');
  });
}

// requestAnimationFrame (Browser) - sync with display refresh
function animate() {
  // Animation logic here
  console.log('Animation frame');
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Timer-based patterns
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

function throttle(func, interval) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Usage examples
const debouncedSearch = debounce((query) => {
  console.log('Searching for:', query);
}, 300);

const throttledScroll = throttle(() => {
  console.log('Scroll event handled');
}, 100);

// Precise timing with performance.now()
const start = performance.now();
setTimeout(() => {
  const end = performance.now();
  console.log(`Actual delay: ${end - start}ms`);
}, 1000);

// Timer cleanup patterns
class ComponentWithTimers {
  constructor() {
    this.timers = [];
  }
  
  addTimer(callback, delay) {
    const id = setTimeout(callback, delay);
    this.timers.push(id);
    return id;
  }
  
  addInterval(callback, interval) {
    const id = setInterval(callback, interval);
    this.timers.push(id);
    return id;
  }
  
  cleanup() {
    this.timers.forEach(id => {
      clearTimeout(id); // Works for both timeout and interval
      clearInterval(id);
    });
    this.timers = [];
  }
}
```

## JavaScript Data Structures
**Description:** JavaScript incluye estructuras de datos como arrays, objetos, maps y sets, además de permitir crear estructuras personalizadas.
**Example:**
```javascript
// JavaScript Primitives
const primitives = {
  number: 42,
  string: 'Hello',
  boolean: true,
  undefined: undefined,
  null: null,
  symbol: Symbol('unique'),
  bigint: 123n
};

// Arrays and methods
const numbers = [1, 2, 3, 4, 5];

// Mutating methods
numbers.push(6);           // Add to end
numbers.unshift(0);        // Add to beginning
const last = numbers.pop(); // Remove from end
const first = numbers.shift(); // Remove from beginning

// Non-mutating methods
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
const sum = numbers.reduce((acc, x) => acc + x, 0);

// Objects and property access
const person = {
  name: 'John',
  age: 30,
  'complex-key': 'value',
  nested: {
    address: '123 Main St'
  }
};

// Property access patterns
console.log(person.name);           // Dot notation
console.log(person['complex-key']); // Bracket notation
console.log(person.nested?.address); // Optional chaining

// Object methods
const keys = Object.keys(person);
const values = Object.values(person);
const entries = Object.entries(person);

// Maps - key-value pairs with any key type
const map = new Map();
map.set('string-key', 'value1');
map.set(42, 'value2');
map.set(true, 'value3');

// Map methods
console.log(map.get('string-key')); // 'value1'
console.log(map.has(42));           // true
console.log(map.size);              // 3

// Iterating Maps
for (const [key, value] of map) {
  console.log(key, value);
}

// Sets - unique values collection
const set = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log(set); // Set {1, 2, 3, 4, 5}

set.add(6);
set.delete(1);
console.log(set.has(3)); // true

// WeakMap and WeakSet - for memory efficiency
const weakMap = new WeakMap();
const obj1 = {};
const obj2 = {};

weakMap.set(obj1, 'associated data');
// obj1 can be garbage collected when no other references exist

// Custom data structures
class Stack {
  constructor() {
    this.items = [];
  }
  
  push(item) {
    this.items.push(item);
  }
  
  pop() {
    return this.items.pop();
  }
  
  peek() {
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

class Queue {
  constructor() {
    this.items = [];
  }
  
  enqueue(item) {
    this.items.push(item);
  }
  
  dequeue() {
    return this.items.shift();
  }
  
  front() {
    return this.items[0];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}

// Linked List implementation
class ListNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }
  
  add(data) {
    const newNode = new ListNode(data);
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
  }
  
  remove(data) {
    if (!this.head) return false;
    
    if (this.head.data === data) {
      this.head = this.head.next;
      this.size--;
      return true;
    }
    
    let current = this.head;
    while (current.next && current.next.data !== data) {
      current = current.next;
    }
    
    if (current.next) {
      current.next = current.next.next;
      this.size--;
      return true;
    }
    
    return false;
  }
  
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }
}

// Tree structure
class TreeNode {
  constructor(data) {
    this.data = data;
    this.children = [];
  }
  
  addChild(data) {
    this.children.push(new TreeNode(data));
  }
  
  removeChild(data) {
    this.children = this.children.filter(child => child.data !== data);
  }
}

// Binary Tree
class BinaryTreeNode {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(data) {
    const newNode = new BinaryTreeNode(data);
    
    if (!this.root) {
      this.root = newNode;
      return;
    }
    
    let current = this.root;
    while (true) {
      if (data < current.data) {
        if (!current.left) {
          current.left = newNode;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          break;
        }
        current = current.right;
      }
    }
  }
  
  search(data) {
    let current = this.root;
    while (current) {
      if (data === current.data) return true;
      if (data < current.data) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    return false;
  }
}
```


## Generators
**Description:** Es una función que puede pausarse y reanudarse, devolviendo múltiples valores bajo demanda.
**Example:**
```javascript
// Basic generator
function* simpleGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = simpleGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Generator with loop
function* countUp(max) {
  let count = 1;
  while (count <= max) {
    yield count++;
  }
}

// Using for...of with generator
for (const num of countUp(5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Generator with parameters and return
function* parameterizedGenerator() {
  const first = yield 'First yield';
  console.log('Received:', first);
  
  const second = yield 'Second yield';
  console.log('Received:', second);
  
  return 'Generator finished';
}

const paramGen = parameterizedGenerator();
console.log(paramGen.next());           // { value: 'First yield', done: false }
console.log(paramGen.next('Hello'));    // { value: 'Second yield', done: false }
console.log(paramGen.next('World'));    // { value: 'Generator finished', done: true }

// Infinite generator
function* fibonacciGenerator() {
  let a = 0, b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Take only what you need
function take(generator, count) {
  const result = [];
  const iterator = generator();
  for (let i = 0; i < count; i++) {
    const { value, done } = iterator.next();
    if (done) break;
    result.push(value);
  }
  return result;
}

console.log(take(fibonacciGenerator, 10)); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

// Generator for tree traversal
class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  
  addChild(value) {
    this.children.push(new TreeNode(value));
    return this.children[this.children.length - 1];
  }
  
  *traverse() {
    yield this.value;
    for (const child of this.children) {
      yield* child.traverse(); // Delegate to child generators
    }
  }
}

const root = new TreeNode('root');
const child1 = root.addChild('child1');
const child2 = root.addChild('child2');
child1.addChild('grandchild1');
child2.addChild('grandchild2');

for (const value of root.traverse()) {
  console.log(value); // root, child1, grandchild1, child2, grandchild2
}

// Generator for pagination
function* paginateData(data, pageSize) {
  for (let i = 0; i < data.length; i += pageSize) {
    yield data.slice(i, i + pageSize);
  }
}

const data = Array.from({ length: 100 }, (_, i) => i + 1);
const paginator = paginateData(data, 10);

console.log(paginator.next().value); // [1, 2, 3, ..., 10]
console.log(paginator.next().value); // [11, 12, 13, ..., 20]

// Async generators
async function* asyncGenerator() {
  for (let i = 0; i < 3; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    yield `Async value ${i}`;
  }
}

// Consuming async generator
async function consumeAsyncGenerator() {
  for await (const value of asyncGenerator()) {
    console.log(value); // Logs each value with 1s delay
  }
}

// Generator composition
function* generator1() {
  yield 1;
  yield 2;
}

function* generator2() {
  yield 3;
  yield 4;
}

function* combinedGenerator() {
  yield* generator1(); // Delegate to generator1
  yield* generator2(); // Delegate to generator2
  yield 5;
}

console.log([...combinedGenerator()]); // [1, 2, 3, 4, 5]

// Error handling in generators
function* errorGenerator() {
  try {
    yield 1;
    yield 2;
    throw new Error('Something went wrong');
  } catch (error) {
    yield `Caught: ${error.message}`;
  }
  yield 3;
}

const errorGen = errorGenerator();
console.log(errorGen.next()); // { value: 1, done: false }
console.log(errorGen.next()); // { value: 2, done: false }
console.log(errorGen.next()); // { value: 'Caught: Something went wrong', done: false }
console.log(errorGen.next()); // { value: 3, done: false }
```


**Description:** Data structures and patterns that automatically update when their dependencies change, fundamental to reactive programming and modern UI frameworks.
**Example:**
```javascript
// Simple Observable implementation
class Observable {
  constructor(value) {
    this._value = value;
    this._observers = [];
  }
  
  get value() {
    return this._value;
  }
  
  set value(newValue) {
    const oldValue = this._value;
    this._value = newValue;
    this._observers.forEach(observer => observer(newValue, oldValue));
  }
  
  subscribe(observer) {
    this._observers.push(observer);
    return () => {
      const index = this._observers.indexOf(observer);
      if (index > -1) {
        this._observers.splice(index, 1);
      }
    };
  }
}

// Usage
const count = new Observable(0);

const unsubscribe = count.subscribe((newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

count.value = 1; // "Count changed from 0 to 1"
count.value = 2; // "Count changed from 1 to 2"

unsubscribe();
count.value = 3; // No output

// Computed values (derived observables)
class Computed extends Observable {
  constructor(computeFn, dependencies) {
    super(computeFn());
    this._computeFn = computeFn;
    this._dependencies = dependencies;
    
    // Subscribe to dependencies
    this._unsubscribe = dependencies.map(dep => 
      dep.subscribe(() => {
        this.value = this._computeFn();
      })
    );
  }
  
  dispose() {
    this._unsubscribe.forEach(fn => fn());
  }
}

// Example usage
const firstName = new Observable('John');
const lastName = new Observable('Doe');

const fullName = new Computed(
  () => `${firstName.value} ${lastName.value}`,
  [firstName, lastName]
);

fullName.subscribe(name => console.log(`Full name: ${name}`));

firstName.value = 'Jane'; // "Full name: Jane Doe"
lastName.value = 'Smith';  // "Full name: Jane Smith"

// Reactive array
class ReactiveArray extends Array {
  constructor(...items) {
    super(...items);
    this._observers = [];
  }
  
  _notify(type, index, item) {
    this._observers.forEach(observer => observer({ type, index, item }));
  }
  
  push(item) {
    const result = super.push(item);
    this._notify('add', this.length - 1, item);
    return result;
  }
  
  pop() {
    const item = super.pop();
    this._notify('remove', this.length, item);
    return item;
  }
  
  splice(start, deleteCount, ...items) {
    const removed = super.splice(start, deleteCount, ...items);
    this._notify('splice', start, { removed, added: items });
    return removed;
  }
  
  subscribe(observer) {
    this._observers.push(observer);
    return () => {
      const index = this._observers.indexOf(observer);
      if (index > -1) {
        this._observers.splice(index, 1);
      }
    };
  }
}

// Usage
const items = new ReactiveArray('apple', 'banana');

items.subscribe(change => {
  console.log('Array changed:', change);
});

items.push('cherry'); // Array changed: { type: 'add', index: 2, item: 'cherry' }

// Simple reactive store
class Store {
  constructor(initialState = {}) {
    this._state = { ...initialState };
    this._observers = [];
  }
  
  getState() {
    return { ...this._state };
  }
  
  setState(updates) {
    const oldState = { ...this._state };
    this._state = { ...this._state, ...updates };
    this._observers.forEach(observer => observer(this._state, oldState));
  }
  
  subscribe(observer) {
    this._observers.push(observer);
    return () => {
      const index = this._observers.indexOf(observer);
      if (index > -1) {
        this._observers.splice(index, 1);
      }
    };
  }
}

// Store usage
const store = new Store({ count: 0, name: 'App' });

store.subscribe((newState, oldState) => {
  console.log('State changed:', { newState, oldState });
});

store.setState({ count: 1 }); // State updated
store.setState({ name: 'My App' }); // State updated again

// Proxy-based reactive object
function createReactive(target) {
  const observers = new Set();
  
  const proxy = new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop];
      obj[prop] = value;
      observers.forEach(observer => observer(prop, value, oldValue));
      return true;
    },
    
    get(obj, prop) {
      if (prop === 'subscribe') {
        return (observer) => {
          observers.add(observer);
          return () => observers.delete(observer);
        };
      }
      return obj[prop];
    }
  });
  
  return proxy;
}

// Proxy usage
const reactiveObj = createReactive({ x: 0, y: 0 });

reactiveObj.subscribe((prop, newValue, oldValue) => {
  console.log(`${prop} changed from ${oldValue} to ${newValue}`);
});

reactiveObj.x = 10; // "x changed from 0 to 10"
reactiveObj.y = 20; // "y changed from 0 to 20"
```