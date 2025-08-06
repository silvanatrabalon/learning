# JavaScript Guide

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