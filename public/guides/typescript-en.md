# TypeScript - Learning Guide

## Purpose and Differences with JavaScript
**Description:** TypeScript is a superset of JavaScript that adds optional static typing, allowing error detection at compile time and providing better development tools.

**Example:**
```typescript
// Traditional JavaScript - no types
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Possible runtime problems
calculateTotal([
  { price: "10", quantity: 2 }, // price is string, not number
  { price: 15 } // missing quantity
]);

// TypeScript - with types
interface CartItem {
  price: number;
  quantity: number;
  name: string;
}

function calculateTotalTS(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Error caught at compile time
// calculateTotalTS([
//   { price: "10", quantity: 2 }, // ❌ Error: Type 'string' is not assignable to type 'number'
//   { price: 15 } // ❌ Error: Property 'quantity' is missing
// ]);

// Correct usage
const cartItems: CartItem[] = [
  { name: "Laptop", price: 999, quantity: 1 },
  { name: "Mouse", price: 25, quantity: 2 }
];

const total = calculateTotalTS(cartItems); // total: number
console.log(`Total: $${total}`); // Total: $1049

// Benefits of typing
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

  // Method with multiple return types
  findItem(name: string): CartItem | undefined {
    return this.items.find(item => item.name === name);
  }

  // Generic method
  filterItems<T extends keyof CartItem>(
    property: T, 
    value: CartItem[T]
  ): CartItem[] {
    return this.items.filter(item => item[property] === value);
  }
}

// Usage with autocomplete and type checking
const cart = new ShoppingCart();
cart.addItem({ name: "Keyboard", price: 75, quantity: 1 });

// IntelliSense suggests available methods
const keyboard = cart.findItem("Keyboard"); // keyboard: CartItem | undefined
if (keyboard) {
  console.log(`Found: ${keyboard.name} - $${keyboard.price}`);
}

// Typed filtering
const expensiveItems = cart.filterItems("price", 75);
```

**Comparison:** TypeScript vs JavaScript - TypeScript provides early error detection, better IntelliSense, safer refactoring, and better code documentation, while JavaScript is simpler and doesn't require compilation.

## Variable Definition with Types
**Description:** TypeScript allows specifying explicit types for variables, function parameters, and return values, providing compile-time verification.

**Example:**
```typescript
// Primitive types
let userName: string = "John Doe";
let age: number = 30;
let isActive: boolean = true;
let score: number = 95.5;

// Types can be inferred
let inferredString = "TypeScript"; // type: string
let inferredNumber = 42; // type: number
let inferredBoolean = false; // type: boolean

// Typed arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Ana", "Luis", "María"];
let flags: boolean[] = [true, false, true];

// Alternative syntax for arrays
let scores: Array<number> = [85, 92, 78, 96];
let emails: Array<string> = ["ana@email.com", "luis@email.com"];

// Typed objects
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

// Function with types
function greetUser(name: string, age: number): string {
  return `Hello ${name}, you are ${age} years old`;
}

// Optional parameters
function createUser(name: string, email: string, age?: number): object {
  return {
    name,
    email,
    age: age || null,
    createdAt: new Date()
  };
}

// Parameters with default values
function formatCurrency(
  amount: number, 
  currency: string = "USD", 
  decimals: number = 2
): string {
  return `${amount.toFixed(decimals)} ${currency}`;
}

// Multiple parameter types
function logMessage(message: string | number): void {
  console.log(`Log: ${message}`);
}

logMessage("Error occurred"); // ✅ valid
logMessage(404); // ✅ valid
// logMessage(true); // ❌ Error: Argument of type 'boolean' is not assignable

// Functions as types
type Calculator = (a: number, b: number) => number;

const add: Calculator = (x, y) => x + y;
const multiply: Calculator = (x, y) => x * y;
const divide: Calculator = (x, y) => y !== 0 ? x / y : 0;

// Function that receives another function
function performOperation(
  a: number, 
  b: number, 
  operation: Calculator
): number {
  return operation(a, b);
}

console.log(performOperation(10, 5, add)); // 15
console.log(performOperation(10, 5, multiply)); // 50

// Variables with multiple possible types
let id: string | number;
id = "user_123"; // ✅ valid
id = 123; // ✅ valid
// id = true; // ❌ Error

// Null and undefined
let nullable: string | null = null;
let optional: string | undefined;

// Runtime type checking
function processId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase(); // TypeScript knows id is string here
  }
  return id.toString(); // TypeScript knows id is number here
}

// any (avoid when possible)
let anything: any = "text";
anything = 42;
anything = { name: "object" };
// No type checking with any

// unknown (safer than any)
let unknownValue: unknown = "could be anything";

// We need to check the type before using
if (typeof unknownValue === "string") {
  console.log(unknownValue.toUpperCase()); // ✅ safe
}

// Literal types
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
// colors is of type readonly ["red", "green", "blue"]

// Destructuring with types
const userData: { name: string; age: number; city: string } = {
  name: "Carlos",
  age: 28,
  city: "Madrid"
};

const { name: userName2, age: userAge }: { name: string; age: number } = userData;

// Spread operator with types
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const person = { name: "Ana", age: 25 };
const contact = { email: "ana@email.com", phone: "123-456" };
const fullProfile = mergeObjects(person, contact);
// fullProfile has all fields from person and contact
```

**Comparison:** Explicit vs implicit typing - Explicit typing provides clarity and error prevention, while type inference reduces verbosity while maintaining type safety.

## Interfaces
**Description:** Interfaces define the shape/structure that an object should have, providing clear contracts for implementing and using complex types.

**Example:**
```typescript
// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Using the interface
const newUser: User = {
  id: 1,
  name: "María González",
  email: "maria@email.com",
  createdAt: new Date()
};

// Interface with optional properties
interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string; // optional
  bio?: string; // optional
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
  // avatar and bio are optional
};

// Interface with readonly properties
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

// Interface with methods
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

// Extended interface
interface ExtendedCalculator extends Calculator {
  power(base: number, exponent: number): number;
  sqrt(value: number): number;
}

class ScientificCalculator implements ExtendedCalculator {
  // Implement Calculator methods
  add(a: number, b: number): number { return a + b; }
  subtract(a: number, b: number): number { return a - b; }
  multiply(a: number, b: number): number { return a * b; }
  divide(a: number, b: number): number { return a / b; }

  // Additional methods
  power(base: number, exponent: number): number {
    return Math.pow(base, exponent);
  }

  sqrt(value: number): number {
    return Math.sqrt(value);
  }
}

// Interface with index signatures
interface StringDictionary {
  [key: string]: string;
}

const translations: StringDictionary = {
  hello: "hola",
  goodbye: "adiós",
  welcome: "bienvenido"
};

// Interface with computed properties
interface DynamicObject {
  [key: string]: any;
  id: number; // required fixed property
  name: string; // required fixed property
}

const dynamicUser: DynamicObject = {
  id: 1,
  name: "Ana",
  age: 30,
  city: "Barcelona",
  hobbies: ["reading", "gaming"]
};

// Interface for functions
interface SearchFunction {
  (source: string, substring: string): boolean;
}

const mySearch: SearchFunction = (src, sub) => {
  return src.indexOf(sub) > -1;
};

// Hybrid interface (function with properties)
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

// Interface with generics
interface Repository<T> {
  create(item: T): Promise<T>;
  findById(id: number): Promise<T | null>;
  update(id: number, changes: Partial<T>): Promise<T>;
  delete(id: number): Promise<boolean>;
  findAll(filters?: Partial<T>): Promise<T[]>;
}

// Specific implementation
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

// Interface with multiple generics
interface ApiResponse<T, E = string> {
  success: boolean;
  data?: T;
  error?: E;
  timestamp: Date;
}

// Using the generic interface
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

// Interface with conditional types
interface ConditionalInterface<T> {
  value: T;
  serialized: T extends string ? T : string;
}

const stringExample: ConditionalInterface<string> = {
  value: "hello",
  serialized: "hello" // T is string, so serialized is also string
};

const numberExample: ConditionalInterface<number> = {
  value: 42,
  serialized: "42" // T is number, so serialized must be string
};
```

**Comparison:** Interfaces vs Types - Interfaces can be extended and merged, are ideal for defining object contracts, while types are more versatile for unions, primitives, and complex type operations.

## Type Alias
**Description:** Type aliases create alternative names for existing types, allowing reusability and better code readability.

**Example:**
```typescript
// Basic aliases
type UserID = string | number;
type UserName = string;
type Timestamp = Date | string | number;

// Using basic aliases
function getUserById(id: UserID): Promise<User | null> {
  // Implementation
  return Promise.resolve(null);
}

const userId1: UserID = "user_123";
const userId2: UserID = 456;

// Aliases for objects
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

// Aliases for functions
type EventHandler<T = any> = (event: T) => void;
type AsyncFunction<T, R> = (arg: T) => Promise<R>;

const clickHandler: EventHandler<MouseEvent> = (event) => {
  console.log(`Clicked at ${event.clientX}, ${event.clientY}`);
};

const fetchUser: AsyncFunction<UserID, User | null> = async (id) => {
  // Simulate API call
  return { id: 1, name: "John", email: "john@email.com", createdAt: new Date() };
};

// Aliases for arrays and complex structures
type UserList = User[];
type UserMap = Map<UserID, User>;
type UserRecord = Record<UserID, User>;

const users: UserList = [];
const userMap: UserMap = new Map();
const userRecord: UserRecord = {
  "1": { id: 1, name: "Ana", email: "ana@email.com", createdAt: new Date() },
  "2": { id: 2, name: "Luis", email: "luis@email.com", createdAt: new Date() }
};

// Aliases with union types
type Status = "idle" | "loading" | "success" | "error";
type Theme = "light" | "dark" | "auto";
type Size = "small" | "medium" | "large";

type ComponentProps = {
  status: Status;
  theme: Theme;
  size: Size;
  children: React.ReactNode;
};

// Aliases with conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
type ApiResult<T> = T extends string ? { message: T } : { data: T };

// Usage examples
type SafeString = NonNullable<string | null>; // string
type StringResult = ApiResult<string>; // { message: string }
type NumberResult = ApiResult<number>; // { data: number }

// Aliases with type operators
type UserKeys = keyof User; // "id" | "name" | "email" | "createdAt"
type UserValues = User[keyof User]; // number | string | Date

type PartialUser = Partial<User>; // All properties optional
type RequiredUser = Required<UserProfile>; // All properties required
type UserEmail = Pick<User, "email">; // { email: string }
type UserWithoutId = Omit<User, "id">; // User without id property

// Recursive aliases
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

// Aliases with template literal types
type EventName<T extends string> = `on${Capitalize<T>}`;
type CSSProperty = `--${string}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"
type CustomCSSVar = CSSProperty; // "--primary-color", etc.

// Aliases for complex utility types
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

type ReadonlyUser = DeepReadonly<User>;
// All User properties are readonly, including nested ones

// Aliases with mapped types
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type Nullable<T> = { [P in keyof T]: T[P] | null };

type UserWithOptionalEmail = Optional<User, "email">;
type NullableUser = Nullable<User>;

// Aliases for React components
type ComponentWithChildren<P = {}> = React.ComponentType<P & { children: React.ReactNode }>;
type EventHandlers = {
  onClick?: EventHandler<MouseEvent>;
  onSubmit?: EventHandler<FormEvent>;
  onChange?: EventHandler<ChangeEvent<HTMLInputElement>>;
};

// Usage in real context
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

// Function overloading with type aliases
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
      console.log("Data:", state.data); // TypeScript knows data exists
      break;
    case "error":
      console.log("Error:", state.error); // TypeScript knows error exists
      break;
  }
}
```

**Comparison:** Type Alias vs Interface - Type aliases are more versatile for unions, primitives, and type operations, while interfaces are better for defining object contracts and can be extended/merged.

## Union Types
**Description:** Union types allow a variable to be one of several specific types, providing flexibility while maintaining type safety.

**Example:**
```typescript
// Basic union types
type StringOrNumber = string | number;
type BooleanOrNull = boolean | null;

let id: StringOrNumber;
id = "user_123"; // ✅ valid
id = 456; // ✅ valid
// id = true; // ❌ Error

// Union with multiple types
type Status = "pending" | "approved" | "rejected" | "cancelled";
type Priority = "low" | "medium" | "high" | "urgent";

function updateTaskStatus(taskId: number, status: Status): void {
  console.log(`Task ${taskId} status changed to ${status}`);
}

updateTaskStatus(1, "approved"); // ✅ valid
// updateTaskStatus(1, "completed"); // ❌ Error

// Union types with objects
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
    // TypeScript knows this is SuccessResponse
    console.log("Data received:", response.data);
    console.log("Timestamp:", response.timestamp);
  } else {
    // TypeScript knows this is ErrorResponse
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
      // TypeScript verifies all cases are covered
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

// Union types with arrays
type MixedArray = (string | number | boolean)[];
const mixed: MixedArray = ["hello", 42, true, "world", 15];

// Filter by type
const strings = mixed.filter((item): item is string => typeof item === "string");
const numbers = mixed.filter((item): item is number => typeof item === "number");

// Custom type guards
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

// Union types with functions
type Logger = {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string) => void;
};

type SimpleLogger = (message: string) => void;

type AnyLogger = Logger | SimpleLogger;

function log(logger: AnyLogger, message: string) {
  if (typeof logger === "function") {
    // It's SimpleLogger
    logger(message);
  } else {
    // It's Logger object
    logger.info(message);
  }
}

// Union with null and undefined
type Optional<T> = T | null | undefined;
type Nullable<T> = T | null;

function processOptionalValue<T>(value: Optional<T>): T | never {
  if (value == null) { // checks null and undefined
    throw new Error("Value is null or undefined");
  }
  return value;
}

// Union types in form context
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

// Union types with generics
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUserData(id: number): Promise<Result<User, string>> {
  try {
    // Simulate API call
    const user = await getUserById(id);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Failed to fetch user" };
  }
}

// Using the Result type
async function handleUserFetch(id: number) {
  const result = await fetchUserData(id);
  
  if (result.success) {
    console.log("User loaded:", result.data.name);
  } else {
    console.error("Error:", result.error);
  }
}

// Union types with conditional types
type NonEmptyArray<T> = [T, ...T[]];
type ArrayOrSingle<T> = T | NonEmptyArray<T>;

function processItems<T>(items: ArrayOrSingle<T>): T[] {
  return Array.isArray(items) ? items : [items];
}

const singleItem = processItems("hello"); // ["hello"]
const multipleItems = processItems(["a", "b", "c"]); // ["a", "b", "c"]

// Complex union types with mapped types
type EventMap = {
  click: { x: number; y: number };
  submit: { formData: FormData };
  change: { value: string };
};

type EventListener<K extends keyof EventMap> = (event: EventMap[K]) => void;

type AllEventListeners = {
  [K in keyof EventMap]: EventListener<K>;
};

// Advanced type narrowing
function isSuccessResponse(response: ApiResponse): response is SuccessResponse {
  return response.success === true;
}

function processResponse(response: ApiResponse) {
  if (isSuccessResponse(response)) {
    // response is SuccessResponse
    console.log("Success:", response.data);
    console.log("Time:", response.timestamp.toISOString());
  } else {
    // response is ErrorResponse
    console.log("Error:", response.error);
    console.log("Code:", response.code);
  }
}
```

**Comparison:** Union Types vs any - Union types provide type safety by allowing only specific values, while any completely disables type checking. Union types maintain IntelliSense and error detection.

## Partial Utility Type
**Description:** The Partial<T> type makes all properties of type T optional, useful for partial object updates and flexible configurations.

**Example:**
```typescript
// Base type
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt: Date;
}

// Partial makes all properties optional
type PartialUser = Partial<User>;
// Equivalent to:
// {
//   id?: number;
//   name?: string;
//   email?: string;
//   age?: number;
//   isActive?: boolean;
//   createdAt?: Date;
// }

// Function to update user
function updateUser(id: number, changes: Partial<User>): Promise<User> {
  // Only need to pass the fields we want to change
  return fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes)
  }).then(res => res.json());
}

// Usage examples
updateUser(1, { name: "New Name" }); // ✅ valid
updateUser(2, { email: "new@email.com", age: 25 }); // ✅ valid
updateUser(3, { isActive: false }); // ✅ valid

// Forms with partial states
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

// API responses with partial data
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

// Function to get minimal user data
function getBasicUserInfo(id: number): Promise<Partial<ApiUser>> {
  return fetch(`/api/users/${id}/basic`)
    .then(res => res.json())
    .then(data => ({
      id: data.id,
      username: data.username,
      email: data.email
      // profile and settings might not be available
    }));
}

// Application configuration with optional values
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

// Different configurations for different environments
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

// Partial with nested types
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepPartialConfig = DeepPartial<AppConfig>;

const partialConfig: DeepPartialConfig = {
  features: {
    darkMode: true
    // notifications and analytics are optional
  }
  // apiUrl, timeout, etc. are optional
};

// Recursive merge function with Partial
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

// Database operations with Partial
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
      id: Math.random(), // In real case, would be generated by DB
      createdAt: now,
      updatedAt: now
    };
    
    // Save to database
    return product;
  }

  async update(id: number, changes: Partial<Omit<Product, keyof DatabaseEntity>>): Promise<Product> {
    // Only update specific fields
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    const updated: Product = {
      ...existing,
      ...changes,
      updatedAt: new Date()
    };

    // Save changes
    return updated;
  }

  async findById(id: number): Promise<Product | null> {
    // Simulate DB search
    return null;
  }
}

// Repository usage
const repo = new ProductRepository();

// Create new product
const newProduct = await repo.create({
  name: "Gaming Laptop",
  description: "High-performance gaming laptop",
  price: 1299.99,
  category: "Electronics",
  inStock: true
});

// Update only some fields
const updatedProduct = await repo.update(newProduct.id, {
  price: 1199.99, // Only change price
  inStock: false   // and availability
});
```

**Comparison:** Partial vs Optional Properties - Partial automatically makes all properties optional, while manually defining optional properties gives granular control over which fields are optional.

## Generics
**Description:** Generics allow creating reusable components that work with multiple types, providing flexibility while maintaining type safety.

**Example:**
```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

// Usage with different types
const stringResult = identity<string>("hello"); // type: string
const numberResult = identity<number>(42); // type: number
const booleanResult = identity<boolean>(true); // type: boolean

// TypeScript can infer the type
const inferredString = identity("world"); // inferred type: string
const inferredNumber = identity(100); // inferred type: number

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

// Using the generic class
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

// Using ArrayUtils
const numbers = [1, 2, 3, 4, 5];
const strings = ["apple", "banana", "cherry"];

const firstNumber = ArrayUtils.first(numbers); // number | undefined
const lastString = ArrayUtils.last(strings); // string | undefined
const evenNumbers = ArrayUtils.filter(numbers, n => n % 2 === 0); // number[]
const lengths = ArrayUtils.map(strings, s => s.length); // number[]
const sum = ArrayUtils.reduce(numbers, (acc, n) => acc + n, 0); // number

// Constraints in generics
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know arg has .length
  return arg;
}

logLength("hello"); // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
logLength({ length: 10, value: "something" }); // ✅ object with length
// logLength(123); // ❌ Error: number doesn't have length

// Generic with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const person = { name: "John", age: 30, city: "Madrid" };
const name = getProperty(person, "name"); // type: string
const age = getProperty(person, "age"); // type: number
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

// Typed API client usage
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

// All calls are typed
const userResponse = await api.get<User[]>('/users'); // ApiResponse<User[]>
const newUser = await api.post<User, CreateUserRequest>('/users', {
  name: "New User",
  email: "new@example.com"
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
    // Increment ID (works for numbers, would need different logic for strings)
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

// Using the generic repository
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

const productRepo = new InMemoryRepository<Product>(1);

// All operations are correctly typed
const product = await productRepo.create({
  name: "Laptop",
  price: 999.99,
  category: "Electronics"
}); // Product

const foundProduct = await productRepo.findById(1); // Product | null
const allProducts = await productRepo.findAll(); // Product[]

// Conditional types with generics
type ApiError = {
  code: number;
  message: string;
};

type Result<T, E = ApiError> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Helper function to create results
function createSuccess<T>(data: T): Result<T> {
  return { success: true, data };
}

function createError<E = ApiError>(error: E): Result<never, E> {
  return { success: false, error };
}

// Usage with different data and error types
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

// Pattern matching with Result
function handleUserResult(result: Result<User, string>) {
  if (result.success) {
    console.log("User loaded:", result.data.name);
  } else {
    console.error("Error:", result.error);
  }
}
```

**Comparison:** Generics vs any - Generics maintain type information and provide type safety, while any completely removes type checking. Generics enable reusability with safety.

## Namespaces
**Description:** Namespaces organize code into logical groups and provide a way to avoid naming conflicts in large applications. While modules are preferred in modern TypeScript, namespaces are still useful for certain scenarios.
**Example:**
```typescript
// Basic namespace
namespace Geometry {
  export interface Point {
    x: number;
    y: number;
  }
  
  export class Circle {
    constructor(public center: Point, public radius: number) {}
    
    area(): number {
      return Math.PI * this.radius ** 2;
    }
  }
  
  export function distance(p1: Point, p2: Point): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }
}

// Usage
const point1: Geometry.Point = { x: 0, y: 0 };
const point2: Geometry.Point = { x: 3, y: 4 };
const circle = new Geometry.Circle(point1, 5);

console.log(Geometry.distance(point1, point2)); // 5
console.log(circle.area()); // ~78.54

// Nested namespaces
namespace Company {
  export namespace HR {
    export class Employee {
      constructor(public name: string, public id: number) {}
    }
    
    export function hire(name: string): Employee {
      return new Employee(name, Math.floor(Math.random() * 10000));
    }
  }
  
  export namespace Finance {
    export class Budget {
      constructor(public amount: number, public department: string) {}
    }
    
    export function allocate(amount: number, dept: string): Budget {
      return new Budget(amount, dept);
    }
  }
}

// Usage of nested namespaces
const employee = Company.HR.hire("John Doe");
const budget = Company.Finance.allocate(50000, "Engineering");

// Namespace aliases
import HR = Company.HR;
const newEmployee = HR.hire("Jane Smith");

// Merging namespaces
namespace Utilities {
  export function log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

// In another file or later in the same file
namespace Utilities {
  export function error(message: string): void {
    console.error(`[ERROR]: ${message}`);
  }
  
  export const version = "1.0.0";
}

// Both functions and version are available
Utilities.log("Application started");
Utilities.error("Something went wrong");
console.log(Utilities.version);

// Namespace vs Module comparison
// Namespace (internal module)
namespace DatabaseNamespace {
  export interface Connection {
    host: string;
    port: number;
  }
  
  export class MySQL implements Connection {
    constructor(public host: string, public port: number) {}
  }
}

// Module (external module) - preferred approach
// database.ts
export interface Connection {
  host: string;
  port: number;
}

export class MySQL implements Connection {
  constructor(public host: string, public port: number) {}
}

// main.ts
// import { MySQL, Connection } from './database';
```

## Enums
**Description:** Enums allow you to define a set of named constants, making code more readable and maintainable by giving meaningful names to numeric or string values.
**Example:**
```typescript
// Numeric enums (default)
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

console.log(Direction.Up);    // 0
console.log(Direction[0]);    // "Up" (reverse mapping)

// Enum with custom numeric values
enum HttpStatus {
  OK = 200,
  NotFound = 404,
  InternalServerError = 500
}

function handleResponse(status: HttpStatus): string {
  switch (status) {
    case HttpStatus.OK:
      return "Success";
    case HttpStatus.NotFound:
      return "Resource not found";
    case HttpStatus.InternalServerError:
      return "Server error";
    default:
      return "Unknown status";
  }
}

console.log(handleResponse(HttpStatus.OK)); // "Success"

// String enums
enum Theme {
  Light = "light",
  Dark = "dark",
  Auto = "auto"
}

function applyTheme(theme: Theme): void {
  document.body.className = theme; // theme is guaranteed to be a valid string
}

applyTheme(Theme.Dark); // Sets className to "dark"

// Heterogeneous enums (mixed types)
enum MixedEnum {
  No = 0,
  Yes = "YES",
}

// Computed enums
enum FileAccess {
  // Constant members
  None,
  Read = 1 << 1,     // 2
  Write = 1 << 2,    // 4
  ReadWrite = Read | Write, // 6
  
  // Computed member
  G = "123".length   // 3
}

// Enum member types
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case ShapeKind.Circle:
      return Math.PI * shape.radius ** 2;
    case ShapeKind.Square:
      return shape.sideLength ** 2;
  }
}

// Const enums (compile-time optimization)
const enum Colors {
  Red = "red",
  Green = "green",
  Blue = "blue"
}

const favoriteColor = Colors.Red; // Inlined as "red" at compile time

// Enum as types
function move(direction: Direction): void {
  // direction is guaranteed to be one of the Direction values
  console.log(`Moving ${Direction[direction]}`);
}

move(Direction.Up); // Valid
// move(5); // Error: Argument of type '5' is not assignable to parameter of type 'Direction'

// Using enums with arrays and objects
const directionNames = Object.values(Direction).filter(v => typeof v === "string");
const statusCodes = Object.values(HttpStatus).filter(v => typeof v === "number");

console.log(directionNames); // ["Up", "Down", "Left", "Right"]
console.log(statusCodes);    // [200, 404, 500]
```

## Decorators
**Description:** Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. They're experimental but widely used in frameworks like Angular.
**Example:**
```typescript
// Enable decorators in tsconfig.json: "experimentalDecorators": true

// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

// Method decorator
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Person {
  constructor(public name: string) {}
  
  @enumerable(false)
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Property decorator
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    let value: string;
    
    const getter = () => value;
    const setter = (newVal: string) => {
      value = formatString.replace("%s", newVal);
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class Product {
  @format("Product: %s")
  name: string = "";
}

const product = new Product();
product.name = "Laptop";
console.log(product.name); // "Product: Laptop"

// Parameter decorator
function required(target: any, propertyName: string | symbol | undefined, parameterIndex: number) {
  let requiredParameters: number[] = Reflect.getOwnMetadata("required", target) || [];
  requiredParameters.push(parameterIndex);
  Reflect.defineMetadata("required", requiredParameters, target);
}

function validate(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  let method = descriptor.value;
  
  descriptor.value = function (...args: any[]) {
    let requiredParameters: number[] = Reflect.getOwnMetadata("required", target) || [];
    
    for (let parameterIndex of requiredParameters) {
      if (parameterIndex >= args.length || args[parameterIndex] === undefined) {
        throw new Error(`Missing required argument at index ${parameterIndex}`);
      }
    }
    
    return method.apply(this, args);
  };
}

class User {
  @validate
  setInfo(@required name: string, age: number) {
    console.log(`Setting info: ${name}, ${age}`);
  }
}

// Decorator factory
function log(prefix: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      console.log(`${prefix} - Calling ${propertyKey} with args:`, args);
      const result = originalMethod.apply(this, args);
      console.log(`${prefix} - ${propertyKey} returned:`, result);
      return result;
    };
  };
}

class Calculator {
  @log("CALC")
  add(a: number, b: number): number {
    return a + b;
  }
  
  @log("CALC")
  multiply(a: number, b: number): number {
    return a * b;
  }
}

const calc = new Calculator();
calc.add(2, 3); // Logs method calls and results
calc.multiply(4, 5);

// Multiple decorators
@sealed
class MultiDecorated {
  @enumerable(false)
  @log("PROP")
  getValue(): string {
    return "decorated value";
  }
}

// Decorator metadata (requires reflect-metadata library)
import "reflect-metadata";

function Entity(tableName: string) {
  return function (target: Function) {
    Reflect.defineMetadata("tableName", tableName, target);
  };
}

function Column(name?: string) {
  return function (target: any, propertyKey: string) {
    const columns = Reflect.getMetadata("columns", target) || [];
    columns.push({
      propertyKey,
      name: name || propertyKey
    });
    Reflect.defineMetadata("columns", columns, target);
  };
}

@Entity("users")
class UserEntity {
  @Column("user_id")
  id: number = 0;
  
  @Column()
  name: string = "";
  
  @Column("email_address")
  email: string = "";
}

// Reading metadata
const tableName = Reflect.getMetadata("tableName", UserEntity);
const columns = Reflect.getMetadata("columns", UserEntity.prototype);

console.log(`Table: ${tableName}`); // "Table: users"
console.log("Columns:", columns);
```

## Utility Types
**Description:** TypeScript provides built-in utility types that help transform and manipulate existing types, enabling powerful type compositions and transformations.
**Example:**
```typescript
// Base interface for examples
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  isActive: boolean;
}

// Partial<T> - makes all properties optional
type PartialUser = Partial<User>;
// Equivalent to: { id?: number; name?: string; email?: string; age?: number; isActive?: boolean; }

function updateUser(user: User, updates: PartialUser): User {
  return { ...user, ...updates };
}

const user: User = { id: 1, name: "John", email: "john@email.com", isActive: true };
const updatedUser = updateUser(user, { name: "Jane", age: 25 });

// Required<T> - makes all properties required
type RequiredUser = Required<User>;
// age is no longer optional: { id: number; name: string; email: string; age: number; isActive: boolean; }

function createRequiredUser(data: RequiredUser): void {
  console.log(`Creating user: ${data.name}, age: ${data.age}`); // age is guaranteed to exist
}

// Readonly<T> - makes all properties readonly
type ReadonlyUser = Readonly<User>;

const readonlyUser: ReadonlyUser = { id: 1, name: "John", email: "john@email.com", isActive: true };
// readonlyUser.name = "Jane"; // Error: Cannot assign to 'name' because it is a read-only property

// Pick<T, K> - creates type with only specified properties
type UserSummary = Pick<User, 'id' | 'name'>;
// { id: number; name: string; }

function displaySummary(summary: UserSummary): void {
  console.log(`User ${summary.id}: ${summary.name}`);
}

// Omit<T, K> - creates type without specified properties
type UserWithoutId = Omit<User, 'id'>;
// { name: string; email: string; age?: number; isActive: boolean; }

function createUserWithoutId(userData: UserWithoutId): User {
  return {
    id: Math.floor(Math.random() * 1000),
    ...userData
  };
}

// Record<K, T> - creates object type with keys K and values T
type UserRoles = Record<string, string[]>;
const roles: UserRoles = {
  "admin": ["read", "write", "delete"],
  "user": ["read"],
  "guest": ["read"]
};

type StatusMap = Record<'pending' | 'approved' | 'rejected', string>;
const statusMessages: StatusMap = {
  pending: "Waiting for approval",
  approved: "Request approved",
  rejected: "Request denied"
};

// Exclude<T, U> - excludes types that are assignable to U
type NonBooleanPrimitives = Exclude<string | number | boolean | null, boolean>;
// string | number | null

type AllowedStatusCodes = Exclude<200 | 400 | 401 | 404 | 500, 400 | 401>;
// 200 | 404 | 500

// Extract<T, U> - extracts types that are assignable to U
type BooleanProperties = Extract<keyof User, 'isActive'>;
// "isActive"

type StringOrNumber = Extract<string | number | boolean, string | number>;
// string | number

// NonNullable<T> - excludes null and undefined
type NonNullableString = NonNullable<string | null | undefined>;
// string

function processValue(value: string | null | undefined): NonNullableString {
  if (value == null) {
    throw new Error("Value cannot be null or undefined");
  }
  return value; // TypeScript knows this is string
}

// ReturnType<T> - extracts return type of function
function getUser(): User {
  return { id: 1, name: "John", email: "john@email.com", isActive: true };
}

type GetUserReturn = ReturnType<typeof getUser>; // User

// Parameters<T> - extracts parameter types of function
function createUser(name: string, email: string, age?: number): User {
  return { id: Math.random(), name, email, age, isActive: true };
}

type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string, age?: number | undefined]

function callCreateUser(...args: CreateUserParams): User {
  return createUser(...args);
}

// ConstructorParameters<T> - extracts constructor parameter types
class DatabaseConnection {
  constructor(public host: string, public port: number, public database: string) {}
}

type DBConstructorParams = ConstructorParameters<typeof DatabaseConnection>;
// [host: string, port: number, database: string]

function createConnection(...args: DBConstructorParams): DatabaseConnection {
  return new DatabaseConnection(...args);
}

// InstanceType<T> - extracts instance type of constructor
type DBInstance = InstanceType<typeof DatabaseConnection>;
// DatabaseConnection

// Conditional types with utility types
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : T extends number 
    ? { code: T } 
    : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type NumberResponse = ApiResponse<number>; // { code: number }
type UserResponse = ApiResponse<User>;     // { data: User }

// Mapped type utilities
type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;
type UserOptionalExceptId = OptionalExcept<User, 'id'>;
// { id: number; name?: string; email?: string; age?: number; isActive?: boolean; }

// Combining utility types
type CreateUserRequest = Omit<Required<User>, 'id'>;
// { name: string; email: string; age: number; isActive: boolean; }

type UpdateUserRequest = Partial<Pick<User, 'name' | 'email' | 'age'>>;
// { name?: string; email?: string; age?: number; }

// Template literal types (TypeScript 4.1+)
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>; // "onClick"
type HoverEvent = EventName<'hover'>; // "onHover"

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = `/${string}`;
type APICall = `${HTTPMethod} ${Endpoint}`;

const apiCall: APICall = "GET /users"; // Valid
// const invalid: APICall = "INVALID /users"; // Error
```
