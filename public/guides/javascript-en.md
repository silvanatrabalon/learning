# JavaScript Guide

## Scope
**Description:** JavaScript has function scope, block scope (with let/const), and global scope. Understanding scope is crucial for variable accessibility and avoiding conflicts.
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
```

## Syntax and Semantics
**Description:** JavaScript syntax rules and semantic meaning. Includes statement vs expression differences, automatic semicolon insertion, and language constructs.
**Example:**
```javascript
// Statement vs Expression
if (true) console.log("Statement"); // Statement
const result = true ? "yes" : "no"; // Expression

// Automatic Semicolon Insertion (ASI)
function problematicReturn() {
  return
    {
      value: 42
    }; // ASI inserts semicolon after return, returns undefined
}

function correctReturn() {
  return {
    value: 42
  }; // Returns the object
}

// Strict Mode
"use strict";
// undeclaredVariable = 5; // ❌ Error in strict mode
// delete Object.prototype; // ❌ Error in strict mode

// Labels and break/continue
outer: for (let i = 0; i < 3; i++) {
  inner: for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) break outer; // Break outer loop
    console.log(i, j);
  }
}
```

## Closures
**Description:** Functions that retain access to variables from their outer scope even after the outer function has returned. Essential for data privacy and functional programming patterns.
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
**Description:** JavaScript's automatic type conversion when operations are performed between different data types. Understanding coercion prevents unexpected behavior.
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
**Description:** JavaScript's mechanism of moving variable and function declarations to the top of their scope during compilation. Different declaration types behave differently with hoisting.
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
**Description:** Extract values from arrays or properties from objects into distinct variables using a convenient syntax.
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
**Description:** Rest (...) collects multiple elements into an array/object. Spread (...) expands elements from an array/object.
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

## Event Loop
**Description:** JavaScript's concurrency model that handles asynchronous operations through a call stack, callback queue, and event loop mechanism.
**Example:**
```javascript
// Call Stack and Event Loop
console.log('1'); // Synchronous

setTimeout(() => {
  console.log('2'); // Asynchronous - goes to callback queue
}, 0);

console.log('3'); // Synchronous

// Output: 1, 3, 2

// Microtasks vs Macrotasks
console.log('Start');

setTimeout(() => console.log('Macrotask 1'), 0);

Promise.resolve().then(() => console.log('Microtask 1'));
Promise.resolve().then(() => console.log('Microtask 2'));

setTimeout(() => console.log('Macrotask 2'), 0);

console.log('End');

// Output: Start, End, Microtask 1, Microtask 2, Macrotask 1, Macrotask 2

// Event Loop with different APIs
console.log('1');

// Macrotask
setTimeout(() => console.log('setTimeout'), 0);

// Microtask
Promise.resolve().then(() => console.log('Promise'));

// Immediate (Node.js)
if (typeof setImmediate !== 'undefined') {
  setImmediate(() => console.log('setImmediate'));
}

// Process.nextTick (Node.js) - highest priority
if (typeof process !== 'undefined') {
  process.nextTick(() => console.log('nextTick'));
}

console.log('2');
```

## Event Delegation and Event Handling
**Description:** Event delegation uses event bubbling to handle events on parent elements instead of individual child elements, improving performance and handling dynamic content.
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
**Description:** Methods to select, modify, create, and remove DOM elements dynamically using JavaScript.
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

## Functions (Life/Anonymous/Arrow)
**Description:** Different ways to declare and use functions in JavaScript, each with specific characteristics regarding hoisting, this binding, and syntax.
**Example:**
```javascript
// Function Declaration (Hoisted)
console.log(declared(5)); // Works due to hoisting

function declared(x) {
  return x * 2;
}

// Function Expression (Not hoisted)
const expression = function(x) {
  return x * 2;
};

// Named Function Expression (useful for debugging)
const namedExpression = function multiply(x) {
  return x < 2 ? x : multiply(x - 1) * x; // Can reference itself
};

// Arrow Functions (ES6)
const arrow = (x) => x * 2;
const arrowBlock = (x) => {
  const result = x * 2;
  return result;
};

// IIFE (Immediately Invoked Function Expression)
const result = (function(x) {
  return x * 2;
})(5);

// Arrow functions and 'this' binding
const obj = {
  name: 'Object',
  regularMethod: function() {
    console.log(this.name); // 'Object'
    
    const innerArrow = () => {
      console.log(this.name); // 'Object' (lexical this)
    };
    
    function innerRegular() {
      console.log(this.name); // undefined (or global in non-strict)
    }
    
    innerArrow();
    innerRegular();
  },
  
  arrowMethod: () => {
    console.log(this.name); // undefined (lexical this from global)
  }
};

// Higher-order functions
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

// Function parameters and arguments
function flexible(required, optional = 'default', ...rest) {
  console.log(required); // First argument
  console.log(optional); // Second or default
  console.log(rest);     // Array of remaining arguments
  console.log(arguments); // Arguments object (not in arrow functions)
}

flexible('req', 'opt', 'extra1', 'extra2');

// Callback functions
function processArray(arr, callback) {
  return arr.map(callback);
}

const numbers = [1, 2, 3, 4, 5];
const squared = processArray(numbers, x => x * x);
console.log(squared); // [1, 4, 9, 16, 25]
```

## Call, Bind, and Apply
**Description:** Methods to explicitly set the 'this' context and invoke functions with specific arguments. Essential for function borrowing and context manipulation.
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

## ES Modules
**Description:** Modern JavaScript module system using import/export syntax for organizing and sharing code between files.
**Example:**
```javascript
// math.js - Named exports
export const PI = 3.14159;

export function add(a, b) {
  return a + b;
}

export const subtract = (a, b) => a - b;

// Default export
export default function multiply(a, b) {
  return a * b;
}

// Alternative syntax
const divide = (a, b) => a / b;
const power = (a, b) => a ** b;

export { divide, power };

// utils.js - Default export
export default class Calculator {
  static add(a, b) { return a + b; }
  static multiply(a, b) { return a * b; }
}

// main.js - Importing
import multiply from './math.js'; // Default import
import { add, subtract, PI } from './math.js'; // Named imports
import Calculator from './utils.js'; // Default import with different name
import * as MathUtils from './math.js'; // Namespace import

console.log(add(5, 3)); // 8
console.log(multiply(4, 2)); // 8
console.log(PI); // 3.14159

// Using namespace
console.log(MathUtils.add(1, 2)); // 3
console.log(MathUtils.default(3, 4)); // 12 (default export)

// Dynamic imports
async function loadModule() {
  const { add, subtract } = await import('./math.js');
  console.log(add(10, 5)); // 15
}

// Conditional imports
if (condition) {
  import('./feature.js').then(module => {
    module.default();
  });
}

// Re-exports
// api.js
export { add, subtract } from './math.js';
export { default as Calculator } from './utils.js';

// Mixed imports and exports
import { someFunction } from './helper.js';

export const processedData = someFunction(rawData);
export { someFunction as processor };
```

## Template Strings
**Description:** Template literals allow embedded expressions and multi-line strings using backticks, providing a more powerful alternative to string concatenation.
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
**Description:** JavaScript's error handling mechanisms using try-catch-finally blocks, custom errors, and async error handling patterns.
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

## Data Types
**Description:** JavaScript has various data types including primitives (number, string, boolean, null, undefined, symbol, bigint) and objects.
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

**Comparison:** == performs type coercion while === doesn't. null is explicitly assigned, undefined means not assigned. Symbols create unique identifiers. BigInt handles large integers. typeof returns type string, instanceof checks prototype chain. Map stores key-value pairs, Set stores unique values.

## Hoisting
**Description:** JavaScript's mechanism of moving variable and function declarations to the top of their scope during compilation. Different declaration types behave differently with hoisting.

**Example:**
```javascript
// var vs let vs const hoisting
console.log(varVariable); // undefined (hoisted but not initialized)
console.log(letVariable); // ReferenceError (Temporal Dead Zone)

var varVariable = "I'm var";
let letVariable = "I'm let";
const constVariable = "I'm const";

// Temporal Dead Zone
function example() {
  console.log(temp); // ReferenceError
  let temp = "value";
}

// Hoisting in functions and classes
console.log(hoistedFunction()); // "I'm hoisted!"

function hoistedFunction() {
  return "I'm hoisted!";
}

// console.log(notHoisted()); // TypeError
const notHoisted = () => "I'm not hoisted";

// IIFE (Immediately Invoked Function Expression)
(function() {
  var private = "Can't access me outside!";
  console.log("IIFE executed");
})();

// Modern IIFE with arrow function
(() => {
  const moduleVar = "Private to this scope";
  console.log("Arrow IIFE executed");
})();
```

**Comparison:** var is hoisted and initialized with undefined, let/const are hoisted but remain in Temporal Dead Zone until declaration. Function declarations are fully hoisted, function expressions are not. IIFE creates immediate scope isolation.

## Scope
**Description:** Determines variable accessibility in different parts of code. JavaScript uses lexical scoping, closures, and different module systems affect how variables are accessed.

**Example:**
```javascript
// Lexical scope
function outer() {
  const outerVar = "I'm outer";
  
  function inner() {
    console.log(outerVar); // Accesses outer scope
  }
  
  return inner;
}

// Closures
function createCounter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2

// ES Modules vs CommonJS
// ES Modules (modern)
import { namedExport } from './module.js';
export const myFunction = () => {};

// CommonJS (Node.js traditional)
const { namedExport } = require('./module');
module.exports = { myFunction };

// this (call vs bind vs apply)
const obj = {
  name: "Object",
  greet: function(greeting, punctuation) {
    return `${greeting} ${this.name}${punctuation}`;
  }
};

console.log(obj.greet.call(obj, "Hello", "!")); // "Hello Object!"
console.log(obj.greet.apply(obj, ["Hi", "."])); // "Hi Object."
const boundGreet = obj.greet.bind(obj, "Hey");
console.log(boundGreet("?")); // "Hey Object?"

// Strict Mode
"use strict";
function strictExample() {
  // undeclaredVar = "error"; // ReferenceError in strict mode
}

// First-class functions
const func = function() { return "I'm a value"; };
const array = [func];
const obj2 = { method: func };
function takeFunction(fn) { return fn(); }
```

**Comparison:** Lexical scope is determined at compile time. Closures maintain access to outer variables. ES Modules use import/export, CommonJS uses require/module.exports. call/apply invoke immediately, bind creates new function. Strict mode prevents common mistakes. First-class functions can be stored, passed, and returned like any other value.

## Synchronism
**Description:** JavaScript's single-threaded nature with event loop, call stack, and callback queue. 

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

**Comparison:** Call stack executes synchronously, callback queue handles async operations. Callbacks can lead to callback hell. Generators pause/resume execution, iterators define how objects are iterated. Event loop coordinates between stack and queue.

## Promises
**Description:** Objects representing eventual completion or failure of asynchronous operations. Promises provide better async handling than callbacks and integrate with modern async/await syntax.

**Example:**
```javascript
// Promise Methods
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve('foo'), 1000));
const promise3 = Promise.reject('Error');

// Promise.all - waits for all to resolve
Promise.all([promise1, promise2])
  .then(values => console.log(values)); // [3, 'foo']

// Promise.allSettled - waits for all to settle
Promise.allSettled([promise1, promise2, promise3])
  .then(results => console.log(results));

// Promise.race - first to settle wins
Promise.race([promise1, promise2])
  .then(value => console.log(value)); // 3

// Promise.any - first to resolve wins
Promise.any([promise3, promise2])
  .then(value => console.log(value)); // 'foo'

// Async / Await
async function fetchUserData() {
  try {
    const response = await fetch('/api/user');
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}

// Microtask
console.log('1');
Promise.resolve().then(() => console.log('2'));
setTimeout(() => console.log('3'), 0);
console.log('4');
// Output: 1, 4, 2, 3 (Promise microtask executes before setTimeout)
```

**Comparison:** Promise.all fails if one fail, Promise.allSettled waits for all. Promise.race returns first settled, Promise.any returns first resolved. Async/await provides synchronous-like syntax for promises. Microtasks (Promises) have higher priority than macrotasks (setTimeout).

## Prototype
**Description:** JavaScript's inheritance mechanism where objects can inherit properties and methods from other objects through the prototype chain.

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

**Comparison:** Prototype chain enables inheritance through __proto__ links. Object.create directly sets prototype, class syntax provides cleaner inheritance model. Classes are syntactic sugar over prototypal inheritance.

## Debounce & Throttle
**Description:** Techniques to improve performance and user experience by controlling function execution frequency and optimizing code delivery.

**Example:**
```javascript
// Debounce - delay execution until after calls have stopped
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedSearch = debounce((query) => {
  console.log(`Searching for: ${query}`);
}, 300);

// Throttle - limit execution to once per time period
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

const throttledScroll = throttle(() => {
  console.log('Scroll event fired');
}, 100);

// Tree Shaking (build-time optimization)
// Only import what you need
import { specificFunction } from 'large-library';
// Instead of: import * as library from 'large-library';

// Code Splitting (dynamic imports)
async function loadFeature() {
  try {
    const { featureModule } = await import('./feature-module.js');
    featureModule.initialize();
  } catch (error) {
    console.error('Failed to load feature:', error);
  }
}

// Route-based code splitting
const routes = {
  '/home': () => import('./pages/Home.js'),
  '/about': () => import('./pages/About.js'),
  '/contact': () => import('./pages/Contact.js')
};

async function navigateTo(path) {
  const loadComponent = routes[path];
  if (loadComponent) {
    const component = await loadComponent();
    // Render component
  }
}
```

**Comparison:** Debounce waits for quiet period, throttle limits frequency. Tree shaking removes unused code at build time. Code splitting loads code on demand, reducing initial bundle size.

## Web API
**Description:** Browser-provided APIs that extend JavaScript's capabilities for web development, including timing functions, storage, communication, and web components.

**Example:**
```javascript
// setTimeout vs setInterval
const timeoutId = setTimeout(() => {
  console.log('Executed once after 1 second');
}, 1000);

const intervalId = setInterval(() => {
  console.log('Executed every 2 seconds');
}, 2000);

// Clear timers
clearTimeout(timeoutId);
clearInterval(intervalId);

// Fetch (methods: POST/GET, status codes)
// GET request
fetch('/api/data')
  .then(response => {
    console.log('Status:', response.status); // 200, 404, 500, etc.
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
  },
  body: JSON.stringify({ name: 'John', email: 'john@example.com' })
})
  .then(response => response.json())
  .then(data => console.log('Success:', data));

// localStorage vs sessionStorage
localStorage.setItem('persistent', 'survives browser restart');
sessionStorage.setItem('temporary', 'cleared when tab closes');

console.log(localStorage.getItem('persistent'));
console.log(sessionStorage.getItem('temporary'));

// Cookies
document.cookie = "username=john; expires=Thu, 18 Dec 2024 12:00:00 UTC; path=/";
console.log(document.cookie);

// Web Workers & Shared Workers
const worker = new Worker('worker.js');
worker.postMessage('Hello Worker');
worker.onmessage = (e) => console.log('From worker:', e.data);

// postMessage (cross-frame communication)
// In parent window
window.postMessage('Hello', '*');
// In child frame/window
window.addEventListener('message', (event) => {
  console.log('Received:', event.data);
});

// Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}

// WebSocket
const socket = new WebSocket('wss://example.com/socket');
socket.onopen = () => console.log('WebSocket connected');
socket.onmessage = (event) => console.log('Message:', event.data);
socket.send('Hello Server');

// Script strategy (async vs defer)
// <script async src="script.js"></script> // Downloads parallel, executes immediately
// <script defer src="script.js"></script> // Downloads parallel, executes after HTML parsing

// Web Components
class CustomButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    const button = document.createElement('button');
    button.textContent = this.getAttribute('text') || 'Click me';
    
    const style = document.createElement('style');
    style.textContent = `
      button { background: blue; color: white; padding: 10px; }
    `;
    
    shadow.appendChild(style);
    shadow.appendChild(button);
  }
}

customElements.define('custom-button', CustomButton);
```

**Comparison:** setTimeout executes once, setInterval repeats. fetch returns promises, handles HTTP methods and status codes. localStorage persists across sessions, sessionStorage is tab-specific. Service Workers enable offline functionality, Web Workers run code in background threads. async scripts execute immediately, defer scripts wait for HTML parsing.

## ECMAScript
**Description:** Modern JavaScript features and syntax improvements that enhance developer productivity and code readability, including arrow functions, array methods, and newer operators.

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

**Comparison:** Arrow functions inherit this, regular functions have their own this context. map returns new array, forEach returns undefined. BigInt handles integers beyond Number.MAX_SAFE_INTEGER. Dynamic imports enable code splitting. Rest collects parameters, spread expands elements. Optional chaining prevents errors on undefined properties. Nullish coalescing only considers null/undefined as falsy, unlike || operator.

## Async/Await
**Description:** Modern syntax for handling asynchronous operations, built on top of Promises but with cleaner, more readable synchronous-looking code.
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

## Promises
**Description:** Objects representing the eventual completion or failure of asynchronous operations, providing a cleaner alternative to callbacks.
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

// Promise.all - waits for all to resolve
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

Promise.all(promises)
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(data => {
    console.log('All data loaded:', data);
  })
  .catch(error => {
    console.error('One request failed:', error);
  });

// Promise.allSettled - waits for all to complete (success or failure)
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

// Promise.race - resolves with first settled promise
Promise.race([
  fetch('/api/fast-server'),
  fetch('/api/slow-server'),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Timeout')), 5000)
  )
]).then(response => {
  console.log('First response received');
}).catch(error => {
  console.error('All failed or timed out');
});

// Promise.any - resolves with first fulfilled promise
Promise.any([
  fetch('/api/server1').catch(() => Promise.reject('Server 1 failed')),
  fetch('/api/server2').catch(() => Promise.reject('Server 2 failed')),
  fetch('/api/server3').catch(() => Promise.reject('Server 3 failed'))
]).then(response => {
  console.log('At least one server responded');
}).catch(error => {
  console.error('All servers failed:', error);
});

// Converting callbacks to promises
function promisifyTimeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function promisifyNodeCallback(nodeFunction) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      nodeFunction(...args, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  };
}

// Promise composition patterns
function retryPromise(promiseFactory, maxRetries) {
  return new Promise((resolve, reject) => {
    function attempt(retryCount) {
      promiseFactory()
        .then(resolve)
        .catch(error => {
          if (retryCount < maxRetries) {
            console.log(`Retry ${retryCount + 1}/${maxRetries}`);
            setTimeout(() => attempt(retryCount + 1), 1000);
          } else {
            reject(error);
          }
        });
    }
    attempt(0);
  });
}
```

## Timers
**Description:** JavaScript functions for scheduling code execution after specified delays or at regular intervals.
**Example:**
```javascript
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
**Description:** Native and custom data structures in JavaScript including primitives, objects, arrays, Maps, Sets, and specialized structures.
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

## Web Workers
**Description:** Browser API that allows running JavaScript in background threads, enabling parallel processing without blocking the main UI thread.
**Example:**
```javascript
// main.js - Main thread
if (typeof Worker !== 'undefined') {
  // Create a new worker
  const worker = new Worker('worker.js');
  
  // Send data to worker
  worker.postMessage({
    command: 'calculate',
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  });
  
  // Listen for messages from worker
  worker.onmessage = function(event) {
    const { result, error } = event.data;
    if (error) {
      console.error('Worker error:', error);
    } else {
      console.log('Result from worker:', result);
      document.getElementById('result').textContent = result;
    }
  };
  
  // Handle worker errors
  worker.onerror = function(error) {
    console.error('Worker failed:', error);
  };
  
  // Terminate worker when done
  setTimeout(() => {
    worker.terminate();
    console.log('Worker terminated');
  }, 10000);
} else {
  console.log('Web Workers not supported');
}

// worker.js - Worker thread
self.onmessage = function(event) {
  const { command, data } = event.data;
  
  try {
    switch (command) {
      case 'calculate':
        // Perform heavy calculation
        const result = heavyCalculation(data);
        self.postMessage({ result });
        break;
        
      case 'process':
        const processed = processData(data);
        self.postMessage({ processed });
        break;
        
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

function heavyCalculation(numbers) {
  // Simulate heavy computation
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += numbers.reduce((sum, num) => sum + Math.sqrt(num), 0);
  }
  return result;
}

function processData(data) {
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

// Shared Worker (for multiple tabs)
// shared-worker.js
const connections = [];

self.addEventListener('connect', function(event) {
  const port = event.ports[0];
  connections.push(port);
  
  port.onmessage = function(e) {
    // Broadcast to all connected tabs
    connections.forEach(connection => {
      if (connection !== port) {
        connection.postMessage(e.data);
      }
    });
  };
  
  port.start();
});

// main.js - using shared worker
const sharedWorker = new SharedWorker('shared-worker.js');
const port = sharedWorker.port;

port.onmessage = function(event) {
  console.log('Message from other tab:', event.data);
};

port.postMessage('Hello from this tab!');
```

## Generators
**Description:** Functions that can be paused and resumed, yielding values on demand and enabling powerful iteration and async programming patterns.
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

## Reactive Structures
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