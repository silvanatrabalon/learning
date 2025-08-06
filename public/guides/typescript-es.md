# TypeScript - Guía de Aprendizaje

## Propósito y Diferencias con JavaScript
**Descripción:** TypeScript es un superset de JavaScript que añade tipado estático opcional, permitiendo detectar errores en tiempo de compilación y proporcionar mejor herramientas de desarrollo.

**Ejemplo:**
```typescript
// JavaScript tradicional - sin tipos
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Posibles problemas en runtime
calculateTotal([
  { price: "10", quantity: 2 }, // price es string, no number
  { price: 15 } // falta quantity
]);

// TypeScript - con tipos
interface CartItem {
  price: number;
  quantity: number;
  name: string;
}

function calculateTotalTS(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Error detectado en tiempo de compilación
// calculateTotalTS([
//   { price: "10", quantity: 2 }, // ❌ Error: Type 'string' is not assignable to type 'number'
//   { price: 15 } // ❌ Error: Property 'quantity' is missing
// ]);

// Uso correcto
const cartItems: CartItem[] = [
  { name: "Laptop", price: 999, quantity: 1 },
  { name: "Mouse", price: 25, quantity: 2 }
];

const total = calculateTotalTS(cartItems); // total: number
console.log(`Total: $${total}`); // Total: $1049

// Beneficios del tipado
class ShoppingCart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    this.items.push(item);
  }

  removeItem(name: string): boolean {
    const index = this.items.findIndex(item => item.name === name);
    if (index > -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  getTotal(): number {
    return calculateTotalTS(this.items);
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Método con múltiples tipos de retorno
  findItem(name: string): CartItem | undefined {
    return this.items.find(item => item.name === name);
  }

  // Método genérico
  filterItems<T extends keyof CartItem>(
    property: T, 
    value: CartItem[T]
  ): CartItem[] {
    return this.items.filter(item => item[property] === value);
  }
}

// Uso con autocompletado y verificación de tipos
const cart = new ShoppingCart();
cart.addItem({ name: "Keyboard", price: 75, quantity: 1 });

// IntelliSense sugiere métodos disponibles
const keyboard = cart.findItem("Keyboard"); // keyboard: CartItem | undefined
if (keyboard) {
  console.log(`Found: ${keyboard.name} - $${keyboard.price}`);
}

// Filtrado tipado
const expensiveItems = cart.filterItems("price", 75);
```

**Comparación:** TypeScript vs JavaScript - TypeScript proporciona detección temprana de errores, mejor IntelliSense, refactoring más seguro y mejor documentación del código, mientras que JavaScript es más simple y no requiere compilación.

## Definición de Variables con Tipos
**Descripción:** TypeScript permite especificar tipos explícitos para variables, parámetros de función y valores de retorno, proporcionando verificación en tiempo de compilación.

**Ejemplo:**
```typescript
// Tipos primitivos
let userName: string = "Juan Pérez";
let age: number = 30;
let isActive: boolean = true;
let score: number = 95.5;

// Tipos pueden ser inferidos
let inferredString = "TypeScript"; // tipo: string
let inferredNumber = 42; // tipo: number
let inferredBoolean = false; // tipo: boolean

// Arrays tipados
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Ana", "Luis", "María"];
let flags: boolean[] = [true, false, true];

// Sintaxis alternativa para arrays
let scores: Array<number> = [85, 92, 78, 96];
let emails: Array<string> = ["ana@email.com", "luis@email.com"];

// Objetos tipados
let user: {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
} = {
  id: 1,
  name: "Ana García",
  email: "ana@email.com",
  isAdmin: false
};

// Función con tipos
function greetUser(name: string, age: number): string {
  return `Hola ${name}, tienes ${age} años`;
}

// Parámetros opcionales
function createUser(name: string, email: string, age?: number): object {
  return {
    name,
    email,
    age: age || null,
    createdAt: new Date()
  };
}

// Parámetros con valores por defecto
function formatCurrency(
  amount: number, 
  currency: string = "USD", 
  decimals: number = 2
): string {
  return `${amount.toFixed(decimals)} ${currency}`;
}

// Múltiples tipos de parámetros
function logMessage(message: string | number): void {
  console.log(`Log: ${message}`);
}

logMessage("Error occurred"); // ✅ válido
logMessage(404); // ✅ válido
// logMessage(true); // ❌ Error: Argument of type 'boolean' is not assignable

// Funciones como tipos
type Calculator = (a: number, b: number) => number;

const add: Calculator = (x, y) => x + y;
const multiply: Calculator = (x, y) => x * y;
const divide: Calculator = (x, y) => y !== 0 ? x / y : 0;

// Función que recibe otra función
function performOperation(
  a: number, 
  b: number, 
  operation: Calculator
): number {
  return operation(a, b);
}

console.log(performOperation(10, 5, add)); // 15
console.log(performOperation(10, 5, multiply)); // 50

// Variables con múltiples tipos posibles
let id: string | number;
id = "user_123"; // ✅ válido
id = 123; // ✅ válido
// id = true; // ❌ Error

// Null y undefined
let nullable: string | null = null;
let optional: string | undefined;

// Verificación de tipos en runtime
function processId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase(); // TypeScript sabe que aquí id es string
  }
  return id.toString(); // TypeScript sabe que aquí id es number
}

// any (evitar en lo posible)
let anything: any = "texto";
anything = 42;
anything = { name: "objeto" };
// No hay verificación de tipos con any

// unknown (más seguro que any)
let unknownValue: unknown = "podría ser cualquier cosa";

// Necesitamos verificar el tipo antes de usar
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()); // ✅ seguro
}

// Tipos literales
type Status = "pending" | "approved" | "rejected";
let orderStatus: Status = "pending";
// orderStatus = "processing"; // ❌ Error: Type '"processing"' is not assignable

// Enums
enum UserRole {
  ADMIN = "admin",
  MODERATOR = "moderator",
  USER = "user"
}

let currentRole: UserRole = UserRole.ADMIN;

// Const assertions
const colors = ["red", "green", "blue"] as const;
// colors es de tipo readonly ["red", "green", "blue"]

// Destructuring con tipos
const userData: { name: string; age: number; city: string } = {
  name: "Carlos",
  age: 28,
  city: "Madrid"
};

const { name: userName2, age: userAge }: { name: string; age: number } = userData;

// Spread operator con tipos
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const person = { name: "Ana", age: 25 };
const contact = { email: "ana@email.com", phone: "123-456" };
const fullProfile = mergeObjects(person, contact);
// fullProfile tiene todos los campos de person y contact
```

**Comparación:** Tipado explícito vs implícito - El tipado explícito proporciona claridad y prevención de errores, mientras que la inferencia de tipos reduce la verbosidad manteniendo la seguridad de tipos.

## Interfaces
**Descripción:** Las interfaces definen la forma/estructura que debe tener un objeto, proporcionando contratos claros para la implementación y uso de tipos complejos.

**Ejemplo:**
```typescript
// Interface básica
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Uso de la interface
const newUser: User = {
  id: 1,
  name: "María González",
  email: "maria@email.com",
  createdAt: new Date()
};

// Interface con propiedades opcionales
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string; // opcional
  bio?: string; // opcional
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const profile: UserProfile = {
  id: 1,
  name: "Luis Martín",
  email: "luis@email.com"
  // avatar y bio son opcionales
};

// Interface con propiedades readonly
interface Product {
  readonly id: number;
  readonly sku: string;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

const product: Product = {
  id: 1,
  sku: "LAPTOP_001",
  name: "Gaming Laptop",
  price: 1299.99,
  description: "High-performance gaming laptop",
  inStock: true
};

// product.id = 2; // ❌ Error: Cannot assign to 'id' because it is a read-only property

// Interface con métodos
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
  multiply(a: number, b: number): number;
  divide(a: number, b: number): number;
}

class BasicCalculator implements Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error("Division by zero");
    }
    return a / b;
  }
}

// Interface extendida
interface ExtendedCalculator extends Calculator {
  power(base: number, exponent: number): number;
  sqrt(value: number): number;
}

class ScientificCalculator implements ExtendedCalculator {
  // Implementar métodos de Calculator
  add(a: number, b: number): number { return a + b; }
  subtract(a: number, b: number): number { return a - b; }
  multiply(a: number, b: number): number { return a * b; }
  divide(a: number, b: number): number { return a / b; }

  // Métodos adicionales
  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  sqrt(value: number): number {
    return Math.sqrt(value);
  }
}

// Interface con index signatures
interface StringDictionary {
  [key: string]: string;
}

const translations: StringDictionary = {
  hello: "hola",
  goodbye: "adiós",
  welcome: "bienvenido"
};

// Interface con propiedades computadas
interface DynamicObject {
  [key: string]: any;
  id: number; // propiedad fija requerida
  name: string; // propiedad fija requerida
}

const dynamicUser: DynamicObject = {
  id: 1,
  name: "Ana",
  age: 30,
  city: "Barcelona",
  hobbies: ["reading", "gaming"]
};

// Interface para funciones
interface SearchFunction {
  (source: string, substring: string): boolean;
}

const mySearch: SearchFunction = (src, sub) => {
  return src.indexOf(sub) > -1;
};

// Interface híbrida (función con propiedades)
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  const counter = (start: number) => {
    return `Started at ${start}`;
  } as Counter;
  
  counter.interval = 1000;
  counter.reset = () => {
    console.log("Counter reset");
  };
  
  return counter;
}

// Interface con generic
interface Repository<T> {
  create(item: T): Promise<T>;
  findById(id: number): Promise<T | null>;
  update(id: number, changes: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
  findAll(filters?: Partial<T>): Promise<T[]>;
}

// Implementación específica
class UserRepository implements Repository<User> {
  private users: User[] = [];

  async create(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async update(id: number, changes: Partial<User>): Promise<User> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    this.users[userIndex] = { ...this.users[userIndex], ...changes };
    return this.users[userIndex];
  }

  async delete(id: number): Promise<boolean> {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
      return false;
    }
    
    this.users.splice(userIndex, 1);
    return true;
  }

  async findAll(filters?: Partial<User>): Promise<User[]> {
    if (!filters) return this.users;
    
    return this.users.filter(user => {
      return Object.keys(filters).every(key => {
        return user[key as keyof User] === filters[key as keyof User];
      });
    });
  }
}

// Interface con múltiples generics
interface ApiResponse<T, E = string> {
  success: boolean;
  data?: T;
  error?: E;
  timestamp: Date;
}

// Uso de la interface genérica
const userResponse: ApiResponse<User[]> = {
  success: true,
  data: [newUser],
  timestamp: new Date()
};

const errorResponse: ApiResponse<null, { code: number; message: string }> = {
  success: false,
  error: { code: 404, message: "User not found" },
  timestamp: new Date()
};

// Interface con conditional types
interface ConditionalInterface<T> {
  value: T;
  serialized: T extends string ? T : string;
}

const stringExample: ConditionalInterface<string> = {
  value: "hello",
  serialized: "hello" // T es string, así que serialized también es string
};

const numberExample: ConditionalInterface<number> = {
  value: 42,
  serialized: "42" // T es number, así que serialized debe ser string
};
```

**Comparación:** Interfaces vs Types - Las interfaces pueden extenderse y fusionarse, son ideales para definir contratos de objetos, mientras que los tipos son más versátiles para uniones, primitivos y operaciones de tipos complejas.

## Type Alias
**Descripción:** Los alias de tipos crean nombres alternativos para tipos existentes, permitiendo reutilización y mejor legibilidad del código.

**Ejemplo:**
```typescript
// Alias básicos
type UserID = string | number;
type UserName = string;
type Timestamp = Date | string | number;

// Uso de alias básicos
function getUserById(id: UserID): Promise<User | null> {
  // Implementación
  return Promise.resolve(null);
}

const userId1: UserID = "user_123";
const userId2: UserID = 456;

// Alias para objetos
type Point = {
  x: number;
  y: number;
};

type Rectangle = {
  topLeft: Point;
  bottomRight: Point;
  color?: string;
};

const rect: Rectangle = {
  topLeft: { x: 0, y: 10 },
  bottomRight: { x: 10, y: 0 },
  color: "red"
};

// Alias para funciones
type EventHandler<T = any> = (event: T) => void;
type AsyncFunction<T, R> = (arg: T) => Promise<R>;

const clickHandler: EventHandler<MouseEvent> = (event) => {
  console.log(`Clicked at ${event.clientX}, ${event.clientY}`);
};

const fetchUser: AsyncFunction<UserID, User | null> = async (id) => {
  // Simular llamada API
  return { id: 1, name: "Juan", email: "juan@email.com", createdAt: new Date() };
};

// Alias para arrays y estructuras complejas
type UserList = User[];
type UserMap = Map<UserID, User>;
type UserRecord = Record<UserID, User>;

const users: UserList = [];
const userMap: UserMap = new Map();
const userRecord: UserRecord = {
  "1": { id: 1, name: "Ana", email: "ana@email.com", createdAt: new Date() },
  "2": { id: 2, name: "Luis", email: "luis@email.com", createdAt: new Date() }
};

// Alias con tipos de unión
type Status = "idle" | "loading" | "success" | "error";
type Theme = "light" | "dark" | "auto";
type Size = "small" | "medium" | "large";

type ComponentProps = {
  status: Status;
  theme: Theme;
  size: Size;
  children: React.ReactNode;
};

// Alias con tipos condicionales
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResult<T> = T extends string ? { message: T } : { data: T };

// Ejemplos de uso
type SafeString = NonNullable<string | null>; // string
type StringResult = ApiResult<string>; // { message: string }
type NumberResult = ApiResult<number>; // { data: number }

// Alias con operadores de tipos
type UserKeys = keyof User; // "id" | "name" | "email" | "createdAt"
type UserValues = User[keyof User]; // number | string | Date

type PartialUser = Partial<User>; // Todas las propiedades opcionales
type RequiredUser = Required<UserProfile>; // Todas las propiedades requeridas
type UserEmail = Pick<User, "email">; // { email: string }
type UserWithoutId = Omit<User, "id">; // User sin la propiedad id

// Alias recursivos
type TreeNode<T> = {
  value: T;
  children?: TreeNode<T>[];
};

const numberTree: TreeNode<number> = {
  value: 1,
  children: [
    { value: 2 },
    { 
      value: 3, 
      children: [
        { value: 4 },
        { value: 5 }
      ]
    }
  ]
};

// Alias con template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;
type CSSProperty = `--${string}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"
type CustomCSSVar = CSSProperty; // "--primary-color", etc.

// Alias para tipos de utilidad complejos
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type ReadonlyUser = DeepReadonly<User>;
// Todas las propiedades de User son readonly, incluso las anidadas

// Alias con mapped types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Nullable<T> = { [P in keyof T]: T[P] | null };

type UserWithOptionalEmail = Optional<User, "email">;
type NullableUser = Nullable<User>;

// Alias para componentes React
type ComponentWithChildren<P = {}> = React.ComponentType<P & { children: React.ReactNode }>;
type EventHandlers = {
  onClick?: EventHandler<MouseEvent>;
  onSubmit?: EventHandler<FormEvent>;
  onChange?: EventHandler<ChangeEvent<HTMLInputElement>>;
};

// Uso en contexto real
type FormData = {
  username: UserName;
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

type FormState = {
  data: FormData;
  errors: FormErrors;
  status: Status;
  isValid: boolean;
};

const initialFormState: FormState = {
  data: {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  },
  errors: {},
  status: "idle",
  isValid: false
};

// Function overloading con type aliases
type SearchByName = (name: string) => Promise<User[]>;
type SearchById = (id: UserID) => Promise<User | null>;
type SearchFunction = SearchByName & SearchById;

// Discriminated unions
type LoadingState = { status: "loading" };
type SuccessState = { status: "success"; data: User[] };
type ErrorState = { status: "error"; error: string };

type AppState = LoadingState | SuccessState | ErrorState;

function handleState(state: AppState) {
  switch (state.status) {
    case "loading":
      console.log("Loading...");
      break;
    case "success":
      console.log("Data:", state.data); // TypeScript sabe que data existe
      break;
    case "error":
      console.log("Error:", state.error); // TypeScript sabe que error existe
      break;
  }
}
```

**Comparación:** Type Alias vs Interface - Los type alias son más versátiles para uniones, primitivos y operaciones de tipos, mientras que las interfaces son mejores para definir contratos de objetos y pueden extenderse/fusionarse.

## Union Types
**Descripción:** Los tipos unión permiten que una variable pueda ser de uno de varios tipos específicos, proporcionando flexibilidad manteniendo la seguridad de tipos.

**Ejemplo:**
```typescript
// Union types básicos
type StringOrNumber = string | number;
type BooleanOrNull = boolean | null;

let id: StringOrNumber;
id = "user_123"; // ✅ válido
id = 456; // ✅ válido
// id = true; // ❌ Error

// Union con múltiples tipos
type Status = "pending" | "approved" | "rejected" | "cancelled";
type Priority = "low" | "medium" | "high" | "urgent";

function updateTaskStatus(taskId: number, status: Status): void {
  console.log(`Task ${taskId} status changed to ${status}`);
}

updateTaskStatus(1, "approved"); // ✅ válido
// updateTaskStatus(1, "completed"); // ❌ Error

// Union types con objetos
type SuccessResponse = {
  success: true;
  data: any;
  timestamp: Date;
};

type ErrorResponse = {
  success: false;
  error: string;
  code: number;
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleApiResponse(response: ApiResponse) {
  if (response.success) {
    // TypeScript sabe que es SuccessResponse
    console.log("Data received:", response.data);
    console.log("Timestamp:", response.timestamp);
  } else {
    // TypeScript sabe que es ErrorResponse
    console.log("Error:", response.error);
    console.log("Code:", response.code);
  }
}

// Discriminated unions (Tagged unions)
interface Rectangle {
  kind: "rectangle";
  width: number;
  height: number;
}

interface Circle {
  kind: "circle";
  radius: number;
}

interface Triangle {
  kind: "triangle";
  base: number;
  height: number;
}

type Shape = Rectangle | Circle | Triangle;

function calculateArea(shape: Shape): number {
  switch (shape.kind) {
    case "rectangle":
      return shape.width * shape.height;
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "triangle":
      return (shape.base * shape.height) / 2;
    default:
      // TypeScript verifica que todos los casos estén cubiertos
      const _exhaustiveCheck: never = shape;
      return _exhaustiveCheck;
  }
}

const shapes: Shape[] = [
  { kind: "rectangle", width: 10, height: 5 },
  { kind: "circle", radius: 3 },
  { kind: "triangle", base: 8, height: 6 }
];

shapes.forEach(shape => {
  console.log(`Area: ${calculateArea(shape)}`);
});

// Union types con arrays
type MixedArray = (string | number | boolean)[];
const mixed: MixedArray = ["hello", 42, true, "world", 15];

// Filtrar por tipo
const strings = mixed.filter((item): item is string => typeof item === "string");
const numbers = mixed.filter((item): item is number => typeof item === "number");

// Type guards personalizados
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

function processValue(value: string | number | boolean) {
  if (isString(value)) {
    console.log(`String: ${value.toUpperCase()}`);
  } else if (isNumber(value)) {
    console.log(`Number: ${value.toFixed(2)}`);
  } else {
    console.log(`Boolean: ${value}`);
  }
}

// Union types con funciones
type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

type SimpleLogger = (message: string) => void;

type AnyLogger = Logger | SimpleLogger;

function log(logger: AnyLogger, message: string) {
  if (typeof logger === "function") {
    // Es SimpleLogger
    logger(message);
  } else {
    // Es Logger object
    logger.info(message);
  }
}

// Union con null y undefined
type Optional<T> = T | null | undefined;
type Nullable<T> = T | null;

function processOptionalValue<T>(value: Optional<T>): T | never {
  if (value == null) { // verifica null y undefined
    throw new Error("Value is null or undefined");
  }
  return value;
}

// Union types en contexto de formularios
type InputValue = string | number | boolean | Date;

type FormField<T extends InputValue = string> = {
  name: string;
  value: T;
  required: boolean;
  validate?: (value: T) => string | null;
};

type FormData = {
  username: FormField<string>;
  age: FormField<number>;
  isActive: FormField<boolean>;
  birthDate: FormField<Date>;
};

const formData: FormData = {
  username: {
    name: "username",
    value: "",
    required: true,
    validate: (value) => value.length < 3 ? "Username too short" : null
  },
  age: {
    name: "age",
    value: 0,
    required: true,
    validate: (value) => value < 18 ? "Must be 18 or older" : null
  },
  isActive: {
    name: "isActive",
    value: false,
    required: false
  },
  birthDate: {
    name: "birthDate",
    value: new Date(),
    required: true
  }
};

// Union types con generics
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUserData(id: number): Promise<Result<User, string>> {
  try {
    // Simular llamada API
    const user = await getUserById(id);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Failed to fetch user" };
  }
}

// Uso del Result type
async function handleUserFetch(id: number) {
  const result = await fetchUserData(id);
  
  if (result.success) {
    console.log("User loaded:", result.data.name);
  } else {
    console.error("Error:", result.error);
  }
}

// Union types con conditional types
type NonEmptyArray<T> = [T, ...T[]];
type ArrayOrSingle<T> = T | NonEmptyArray<T>;

function processItems<T>(items: ArrayOrSingle<T>): T[] {
  return Array.isArray(items) ? items : [items];
}

const singleItem = processItems("hello"); // ["hello"]
const multipleItems = processItems(["a", "b", "c"]); // ["a", "b", "c"]

// Union types complejos con mapped types
type EventMap = {
  click: { x: number; y: number };
  submit: { formData: FormData };
  change: { value: string };
};

type EventListener<K extends keyof EventMap> = (event: EventMap[K]) => void;

type AllEventListeners = {
  [K in keyof EventMap]: EventListener<K>;
};

// Type narrowing avanzado
function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.success === true;
}

function processResponse(response: ApiResponse) {
  if (isSuccessResponse(response)) {
    // response es SuccessResponse
    console.log("Success:", response.data);
    console.log("Time:", response.timestamp.toISOString());
  } else {
    // response es ErrorResponse
    console.log("Error:", response.error);
    console.log("Code:", response.code);
  }
}
```

**Comparación:** Union Types vs any - Union types proporcionan seguridad de tipos permitiendo solo valores específicos, mientras que any desactiva completamente la verificación de tipos. Union types mantienen IntelliSense y detección de errores.

## Partial Utility Type
**Descripción:** El tipo Partial<T> convierte todas las propiedades de un tipo T en opcionales, útil para actualizaciones parciales de objetos y configuraciones flexibles.

**Ejemplo:**
```typescript
// Tipo base
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
}

// Partial hace todas las propiedades opcionales
type PartialUser = Partial<User>;
// Equivale a:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
//   isActive?: boolean;
//   createdAt?: Date;
// }

// Función para actualizar usuario
function updateUser(id: number, changes: Partial<User>): Promise<User> {
  // Solo necesitamos pasar los campos que queremos cambiar
  return fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  }).then(res => res.json());
}

// Ejemplos de uso
updateUser(1, { name: "Nuevo Nombre" }); // ✅ válido
updateUser(2, { email: "nuevo@email.com", age: 25 }); // ✅ válido
updateUser(3, { isActive: false }); // ✅ válido

// Formularios con estados parciales
interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  acceptTerms: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type FormTouched = Partial<Record<keyof FormData, boolean>>;

class FormValidator {
  private data: Partial<FormData> = {};
  private errors: FormErrors = {};
  private touched: FormTouched = {};

  updateField(field: keyof FormData, value: any) {
    this.data[field] = value;
    this.touched[field] = true;
    this.validateField(field);
  }

  private validateField(field: keyof FormData) {
    const value = this.data[field];
    
    switch (field) {
      case 'username':
        if (!value || value.length < 3) {
          this.errors.username = "Username must be at least 3 characters";
        } else {
          delete this.errors.username;
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          this.errors.email = "Please enter a valid email";
        } else {
          delete this.errors.email;
        }
        break;
      
      case 'password':
        if (!value || value.length < 6) {
          this.errors.password = "Password must be at least 6 characters";
        } else {
          delete this.errors.password;
        }
        break;
      
      case 'confirmPassword':
        if (value !== this.data.password) {
          this.errors.confirmPassword = "Passwords do not match";
        } else {
          delete this.errors.confirmPassword;
        }
        break;
    }
  }

  isFieldValid(field: keyof FormData): boolean {
    return this.touched[field] === true && !this.errors[field];
  }

  getFieldError(field: keyof FormData): string | undefined {
    return this.touched[field] ? this.errors[field] : undefined;
  }

  isFormValid(): boolean {
    return Object.keys(this.errors).length === 0 && 
           Object.keys(this.touched).length > 0;
  }
}

// API responses con datos parciales
interface ApiUser {
  id: number;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar: string;
    bio: string;
  };
  settings: {
    theme: string;
    notifications: boolean;
    privacy: string;
  };
}

// Función para obtener datos mínimos del usuario
function getBasicUserInfo(id: number): Promise<Partial<ApiUser>> {
  return fetch(`/api/users/${id}/basic`)
    .then(res => res.json())
    .then(data => ({
      id: data.id,
      username: data.username,
      email: data.email
      // profile y settings pueden no estar disponibles
    }));
}

// Configuración de aplicación con valores opcionales
interface AppConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  enableLogging: boolean;
  features: {
    darkMode: boolean;
    notifications: boolean;
    analytics: boolean;
  };
}

const defaultConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  enableLogging: false,
  features: {
    darkMode: false,
    notifications: true,
    analytics: false
  }
};

function createConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  return {
    ...defaultConfig,
    ...overrides,
    features: {
      ...defaultConfig.features,
      ...overrides.features
    }
  };
}

// Diferentes configuraciones para diferentes entornos
const devConfig = createConfig({
  enableLogging: true,
  timeout: 10000
});

const prodConfig = createConfig({
  apiUrl: 'https://production-api.example.com',
  retries: 5,
  features: {
    analytics: true
  }
});

// Partial con tipos anidados
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepPartialConfig = DeepPartial<AppConfig>;

const partialConfig: DeepPartialConfig = {
  features: {
    darkMode: true
    // notifications y analytics son opcionales
  }
  // apiUrl, timeout, etc. son opcionales
};

// Función de merge recursivo con Partial
function mergeConfigs(base: AppConfig, partial: DeepPartial<AppConfig>): AppConfig {
  const result = { ...base };
  
  for (const key in partial) {
    const value = partial[key];
    if (value !== undefined) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        result[key] = { ...base[key], ...value };
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}

// Database operations con Partial
interface DatabaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Product extends DatabaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

class ProductRepository {
  async create(productData: Omit<Product, keyof DatabaseEntity>): Promise<Product> {
    const now = new Date();
    const product: Product = {
      ...productData,
      id: Math.random(), // En un caso real, lo generaría la DB
      createdAt: now,
      updatedAt: now
    };
    
    // Guardar en base de datos
    return product;
  }

  async update(id: number, changes: Partial<Omit<Product, keyof DatabaseEntity>>): Promise<Product> {
    // Solo actualizar campos específicos
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    const updated: Product = {
      ...existing,
      ...changes,
      updatedAt: new Date()
    };

    // Guardar cambios
    return updated;
  }

  async findById(id: number): Promise<Product | null> {
    // Simular búsqueda en DB
    return null;
  }
}

// Uso del repositorio
const repo = new ProductRepository();

// Crear producto nuevo
const newProduct = await repo.create({
  name: "Laptop Gaming",
  description: "High-performance gaming laptop",
  price: 1299.99,
  category: "Electronics",
  inStock: true
});

// Actualizar solo algunos campos
const updatedProduct = await repo.update(newProduct.id, {
  price: 1199.99, // Solo cambiar precio
  inStock: false   // y disponibilidad
});
```

**Comparación:** Partial vs Optional Properties - Partial convierte automáticamente todas las propiedades en opcionales, mientras que definir propiedades opcionales manualmente da control granular sobre qué campos son opcionales.

## Generics
**Descripción:** Los generics permiten crear componentes reutilizables que funcionan con múltiples tipos, proporcionando flexibilidad manteniendo la seguridad de tipos.

**Ejemplo:**
```typescript
// Generic function básica
function identity<T>(arg: T): T {
  return arg;
}

// Uso con diferentes tipos
const stringResult = identity<string>("hello"); // tipo: string
const numberResult = identity<number>(42); // tipo: number
const booleanResult = identity<boolean>(true); // tipo: boolean

// TypeScript puede inferir el tipo
const inferredString = identity("world"); // tipo inferido: string
const inferredNumber = identity(100); // tipo inferido: number

// Generic interface
interface Container<T> {
  value: T;
  getValue(): T;
  setValue(value: T): void;
}

class Box<T> implements Container<T> {
  constructor(private _value: T) {}

  getValue(): T {
    return this._value;
  }

  setValue(value: T): void {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }
}

// Uso de la clase generic
const stringBox = new Box<string>("Hello TypeScript");
const numberBox = new Box<number>(42);
const objectBox = new Box<{ name: string; age: number }>({ name: "Ana", age: 25 });

// Generic Array utilities
class ArrayUtils {
  static first<T>(array: T[]): T | undefined {
    return array.length > 0 ? array[0] : undefined;
  }

  static last<T>(array: T[]): T | undefined {
    return array.length > 0 ? array[array.length - 1] : undefined;
  }

  static filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
    return array.filter(predicate);
  }

  static map<T, U>(array: T[], mapper: (item: T) => U): U[] {
    return array.map(mapper);
  }

  static reduce<T, R>(
    array: T[], 
    reducer: (acc: R, current: T) => R, 
    initialValue: R
  ): R {
    return array.reduce(reducer, initialValue);
  }
}

// Uso de ArrayUtils
const numbers = [1, 2, 3, 4, 5];
const strings = ["apple", "banana", "cherry"];

const firstNumber = ArrayUtils.first(numbers); // number | undefined
const lastString = ArrayUtils.last(strings); // string | undefined
const evenNumbers = ArrayUtils.filter(numbers, n => n % 2 === 0); // number[]
const lengths = ArrayUtils.map(strings, s => s.length); // number[]
const sum = ArrayUtils.reduce(numbers, (acc, n) => acc + n, 0); // number

// Constraints en generics
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Ahora sabemos que arg tiene .length
  return arg;
}

logLength("hello"); // ✅ string tiene length
logLength([1, 2, 3]); // ✅ array tiene length
logLength({ length: 10, value: "something" }); // ✅ objeto con length
// logLength(123); // ❌ Error: number no tiene length

// Generic con keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "Juan", age: 30, city: "Madrid" };
const name = getProperty(person, "name"); // tipo: string
const age = getProperty(person, "age"); // tipo: number
// const invalid = getProperty(person, "invalid"); // ❌ Error

// Generic API Client
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  async post<T, U>(endpoint: string, body: U): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json();
  }

  async put<T, U>(endpoint: string, body: U): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return response.json();
  }
}

// Uso tipado del API client
interface User {
  id: number;
  name: string;
  email: string;
}

interface CreateUserRequest {
  name: string;
  email: string;
}

const api = new ApiClient('https://api.example.com');

// Todas las llamadas están tipadas
const userResponse = await api.get<User[]>('/users'); // ApiResponse<User[]>
const newUser = await api.post<User, CreateUserRequest>('/users', {
  name: "Nueva Usuario",
  email: "nuevo@example.com"
}); // ApiResponse<User>

// Generic Repository pattern
interface Repository<T, ID = number> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: ID, changes: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

class InMemoryRepository<T extends { id: ID }, ID = number> implements Repository<T, ID> {
  private entities: T[] = [];
  private nextId: ID;

  constructor(initialId: ID) {
    this.nextId = initialId;
  }

  async findById(id: ID): Promise<T | null> {
    return this.entities.find(entity => entity.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return [...this.entities];
  }

  async create(entityData: Omit<T, 'id'>): Promise<T> {
    const entity = { ...entityData, id: this.nextId } as T;
    // Incrementar ID (funciona para numbers, para strings necesitaríamos lógica diferente)
    this.nextId = (this.nextId as any) + 1;
    this.entities.push(entity);
    return entity;
  }

  async update(id: ID, changes: Partial<T>): Promise<T> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      throw new Error('Entity not found');
    }
    
    this.entities[index] = { ...this.entities[index], ...changes };
    return this.entities[index];
  }

  async delete(id: ID): Promise<boolean> {
    const index = this.entities.findIndex(entity => entity.id === id);
    if (index === -1) {
      return false;
    }
    
    this.entities.splice(index, 1);
    return true;
  }
}

// Uso del repositorio genérico
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const productRepo = new InMemoryRepository<Product>(1);

// Todas las operaciones están tipadas correctamente
const product = await productRepo.create({
  name: "Laptop",
  price: 999.99,
  category: "Electronics"
}); // Product

const foundProduct = await productRepo.findById(1); // Product | null
const allProducts = await productRepo.findAll(); // Product[]

// Conditional types con generics
type ApiError = {
  code: number;
  message: string;
};

type Result<T, E = ApiError> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Helper function para crear resultados
function createSuccess<T>(data: T): Result<T> {
  return { success: true, data };
}

function createError<E = ApiError>(error: E): Result<never, E> {
  return { success: false, error };
}

// Uso con diferentes tipos de datos y errores
async function fetchUserSafe(id: number): Promise<Result<User, string>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return createError("User not found");
    }
    const user = await response.json();
    return createSuccess(user);
  } catch (error) {
    return createError("Network error");
  }
}

// Pattern matching con Result
function handleUserResult(result: Result<User, string>) {
  if (result.success) {
    console.log("User loaded:", result.data.name);
  } else {
    console.error("Error:", result.error);
  }
}
```

**Comparación:** Generics vs any - Los generics mantienen la información de tipos y proporcionan seguridad de tipos, mientras que any elimina completamente la verificación de tipos. Los generics permiten reutilización con seguridad.
