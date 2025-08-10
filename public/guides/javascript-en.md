# JavaScript Guide

## Data Types
**Description:** JavaScript has primitive data types (number, string, boolean, null, undefined, symbol, bigint) and reference types like objects.
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
| Concept                   | Description                                                     |
|---------------------------|-----------------------------------------------------------------|
| `==` vs `===`             | `==` performs type coercion, `===` does not (compares type and value) |
| `null` vs `undefined`     | `null` is explicitly assigned; `undefined` means not assigned    |
| `Symbol`                  | Creates unique identifiers                                       |
| `BigInt`                  | Handles very large integers                                      |
| `typeof`                  | Returns a string indicating the data type                        |
| `instanceof`              | Checks the prototype chain for a specific type                   |
| `Map`                     | Stores key-value pairs                                           |
| `Set`                     | Stores unique values                                            |



## Scope
**Description:** *Scope* defines where in your code a variable can be accessed. JavaScript has global, function, and block scope (let/const). Understanding it helps prevent errors and name conflicts.
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
**Description:** A closure is a function that remembers and can access variables from its outer scope, including variables declared internally and the arguments of the outer function, even after that function has finished executing.
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
**Description:** *Type coercion* happens when JavaScript automatically converts a value from one type to another, such as from number to string. Understanding it helps avoid unexpected results.
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
**Description:** *Hoisting* is JavaScript's behavior of moving declarations to the top of the scope before executing the code. This affects how and when you can use variables and functions.
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
**Description:** *Destructuring* allows extracting values from arrays or objects and assigning them to variables concisely, making code easier to read.
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
**Description:** *Rest* and *spread* operators use `...` to gather values into an array or object or to expand them. They make working with data and parameters easier.
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
**Description:** Event delegation allows handling events from a parent element instead of assigning one to each child. This improves performance and simplifies code.
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
**Description:** DOM manipulation is about selecting, creating, modifying, or removing HTML elements dynamically using JavaScript.
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
**Description:** A function with a declared name, hoisted to the top of its scope, and available before its definition is encountered.
**Example:**
```javascript
// 1. Named Function
function greet(name) {
  return `Hello, ${name}!`;
}
```

**Comparison:**
| Function Type      | Description | Hoisting | `this` binding | Syntax |
|--------------------|-------------|----------|----------------|--------|
| **Named Function** | A function with a declared name, hoisted to the top of its scope, available even before its definition in the code. | Yes | Own `this` | `function name() { ... }` |
| **Anonymous Function** | A function without a name, usually assigned to a variable or passed as an argument. Not hoisted, so it can only be used after its definition. | No | Own `this` | `const fn = function() { ... };` |
| **Arrow Function** | A concise syntax for writing functions. Does not have its own `this`, `arguments`, or `prototype`, making it useful for callbacks and preserving the outer `this` context. | No | Inherits from outer scope | `const fn = () => { ... };` |


## Anonymous Function
**Description:** A function without a name, usually assigned to a variable or passed as an argument. It is not hoisted, so it can only be used after its definition.
**Example:**
```javascript
// 2. Anonymous Function
const greetAnon = function(name) {
  return `Hi, ${name}!`;
};
```
**Comparison:**
| Function Type      | Description | Hoisting | `this` binding | Syntax |
|--------------------|-------------|----------|----------------|--------|
| **Named Function** | A function with a declared name, hoisted to the top of its scope, available even before its definition in the code. | Yes | Own `this` | `function name() { ... }` |
| **Anonymous Function** | A function without a name, usually assigned to a variable or passed as an argument. Not hoisted, so it can only be used after its definition. | No | Own `this` | `const fn = function() { ... };` |
| **Arrow Function** | A concise syntax for writing functions. Does not have its own `this`, `arguments`, or `prototype`, making it useful for callbacks and preserving the outer `this` context. | No | Inherits from outer scope | `const fn = () => { ... };` |

## Arrow Function
**Description:** A concise syntax for writing functions. It does not have its own this, arguments, or prototype, making it useful for callbacks and preserving the surrounding this context.
**Example:**
```javascript
// 3. Arrow Function
const greetArrow = (name) => `Hey, ${name}!`;
```
**Comparison:**
| Function Type      | Description | Hoisting | `this` binding | Syntax |
|--------------------|-------------|----------|----------------|--------|
| **Named Function** | A function with a declared name, hoisted to the top of its scope, available even before its definition in the code. | Yes | Own `this` | `function name() { ... }` |
| **Anonymous Function** | A function without a name, usually assigned to a variable or passed as an argument. Not hoisted, so it can only be used after its definition. | No | Own `this` | `const fn = function() { ... };` |
| **Arrow Function** | A concise syntax for writing functions. Does not have its own `this`, `arguments`, or `prototype`, making it useful for callbacks and preserving the outer `this` context. | No | Inherits from outer scope | `const fn = () => { ... };` |

## Call, Bind, and Apply
**Description:** `call`, `bind`, and `apply` methods allow explicitly defining the value of `this` and how to pass arguments when calling a function.

**Comparison:**
| Method   | Executes the function immediately? | How to pass arguments | Typical use case |
|----------|------------------------------------|-----------------------|-------------------|
| **call** | Yes                                | Arguments separated by commas (`fn.call(ctx, arg1, arg2)`) | Call the function with a specific `this` value and direct arguments. |
| **apply**| Yes                                | Arguments as an array or array-like (`fn.apply(ctx, [arg1, arg2])`) | Same as `call`, but useful when arguments are already in an array. |
| **bind** | No (returns a new function)        | Same as `call` (separated by commas) | Create a new function with a fixed `this` value and predefined arguments to use later. |

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

## Modules

**Description**  
Module systems allow splitting code into independent and reusable parts. In JavaScript, the three most common module systems are: ES Modules (ESM), CommonJS (CJS), and AMD (Asynchronous Module Definition). Each has its own syntax, loading behavior, and platform support.

**Comparison**

| Feature                   | ES Modules (ESM)                       | CommonJS (CJS)                    | AMD (Asynchronous Module Definition)       |
|---------------------------|--------------------------------------|---------------------------------|---------------------------------------------|
| Year / Standard           | ECMAScript 2015 (ES6)                 | Not standardized, originated in Node.js | Originated in 2009 for browsers              |
| Main Syntax               | `import` / `export`                   | `require()` / `module.exports`  | `define()` and `require()`                    |
| Loading                  | Asynchronous and static               | Synchronous                     | Asynchronous                                |
| Native Support            | Modern browsers and Node.js (v14+)   | Node.js                        | Browsers (with libraries like RequireJS)    |
| Scope                    | Each module has its own scope          | Each module has its own scope   | Each module has its own scope                  |
| Format                   | `.js` files with import/export         | `.js` files with require/module.exports | Functions that define modules               |
| Main Usage               | Modern JavaScript (frontend and backend) | Mainly backend (Node.js)        | Mainly frontend before ESM                    |
| Compatibility            | Not directly compatible with CommonJS without tools | Not compatible with ES Modules without tools | Not directly compatible with CommonJS or ESM |
| Advantages               | Official standard, browser support, optimizable for loading | Simple, widely used in Node.js | Allows asynchronous loading in browsers       |
| Disadvantages            | Requires tools or flags in older Node.js versions, strict syntax | No native browser support, synchronous loading | More complex, less popular today               |

**Example:**
```javascript
// ES Modules (ESM)
export function sum(a, b) {
  return a + b;
}

import { sum } from './sum.js';
console.log(sum(2, 3)); // 5
```

## Template Strings
**Description:** *Template strings* use backticks and allow inserting variables, expressions, and line breaks easily.
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
**Description:** Exception handling allows catching and responding to errors with `try`, `catch`, and `finally`, preventing the program from crashing.
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
**Description:** JavaScript is single-threaded, executes code synchronously, and uses the event loop to handle asynchronous tasks.

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
| Concept           | Description                                                             |
|-------------------|-------------------------------------------------------------------------|
| Call Stack        | Executes operations synchronously                                      |
| Callback Queue    | Handles asynchronous operations                                        |
| Callbacks         | Can lead to callback hell (deeply nested and hard to read)             |
| Generators        | Allow pausing and resuming execution                                   |
| Iterators         | Define how an object is iterated                                       |
| Event Loop        | Coordinates execution between the call stack and the callback queue    |


## Promises
**Description:** A promise represents an asynchronous operation that can either complete successfully or fail. It makes handling async code easier.

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
**Description:** Runs multiple promises in parallel and returns all their results if none fail, or an error if any reject.

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
**Description:** Runs multiple promises and returns the results of all, regardless of whether they resolved or rejected.

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
**Description:** Returns the result of the first promise that resolves or rejects.

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
**Description:** Returns the first promise that fulfills. It only fails if all promises reject.

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
**Description:** The *prototype* is JavaScript's inheritance mechanism where objects can share properties and methods.

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
**Description:** *Debounce* delays the execution of a function until a certain time has passed without it being called again, useful for optimizing frequent events. Use cases: Search inputs, form validation, window resize handlers, API calls triggered by user input.

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
**Description:** *Throttle* limits how often a function can run during a set period of time. Use cases: Scroll events, mouse movement tracking, button click prevention, animation frame updates, API calls that should execute at regular intervals.

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
**Description:** Executes a function once after a delay in milliseconds.

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
**Description:** Executes a function repeatedly at a set interval in milliseconds until stopped.

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
**Description:** The `fetch` API makes HTTP requests simple and returns promises to handle the responses.

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
**Description:** Local storage saves data in the browser with no expiration date, accessible even after closing and reopening it. Use cases: User preferences, shopping cart data, form data persistence, authentication tokens, cache data.

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
**Description:** Similar to localStorage, but data is removed when the browser tab or window is closed. Use cases: Multi-step forms, temporary data, tab-specific state, navigation state, temporary user input.

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
**Description:** Cookies are small pieces of data stored by the browser and sent to the server with each HTTP request to the same domain. Use cases: Authentication, user preferences, tracking, session management, cross-domain communication.

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
**Description:** *Web Workers* allow running code in the background without blocking the user interface. Use cases: Heavy computations, image/video processing, data parsing, background sync, parallel algorithms.

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
**Description:** ECMAScript is the standard that defines the JavaScript language and its new features.

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
**Description:** `async` and `await` let you handle promises with clearer syntax that looks like synchronous code.
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

## Generators
**Description:** A generator is a function that can be paused and resumed, yielding multiple values on demand.
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