# NestJS Guide

## Controllers
**Description:** Handle incoming requests and return responses to the client. They're responsible for handling HTTP requests and d**Comparison:** Middleware vs Guards - Middleware executes earlier in the request lifecycle and is more general-purpose, while Guards are specifically designed for authentication and authorization decisions.

## Middleware vs Guards - Detailed Comparison
**Description:** Both are interception mechanisms in NestJS, but they operate at different levels and moments in the request lifecycle. It's important to understand when to use each one.

**Example:**
```typescript
// Middleware - Executes first, decodes JWT
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded; // Add user to request
      } catch (e) {
        // Invalid token, but don't block here
      }
    }
    next();
  }
}

// Guard - Executes after, verifies permissions
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // User added by middleware
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    
    return user && user.role === requiredRole;
  }
}
```

**Comparison:** 
- **Level**: Middleware (Express - low level) vs Guards (NestJS - high level)
- **Execution timing**: Middleware executes before Guards
- **Purpose**: Middleware for generic processing (logging, parsing) vs Guards for access control
- **Decorators**: Middleware has no access to decorators, Guards do (`ExecutionContext`, `@Req()`)
- **Return**: Middleware uses `next()`, Guards return `true`/`false`
- **Combined usage**: Common to use Middleware to decode JWT and Guards to verify permissionslegating more complex tasks to services.

**Example:**
```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): string {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: any): string {
    return this.usersService.create(createUserDto);
  }
}
```

**Comparison:** Controllers vs Services - Controllers handle HTTP layer concerns (routing, request/response), while Services contain business logic and can be reused across different controllers.

## Services
**Description:** Providers that encapsulate business logic and can be injected into controllers or other services through dependency injection.

**Example:**
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [];

  findAll(): any[] {
    return this.users;
  }

  findOne(id: number): any {
    return this.users.find(user => user.id === id);
  }

  create(user: any): any {
    const newUser = { id: Date.now(), ...user };
    this.users.push(newUser);
    return newUser;
  }
}
```

**Comparison:** Services vs Controllers - Services contain business logic and data manipulation, while Controllers handle HTTP requests and responses.

## Modules
**Description:** Organize related functionality together. Each module encapsulates controllers, services, and other providers related to a specific feature.

**Example:**
```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Make service available to other modules
})
export class UsersModule {}

// App Module
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
})
export class AppModule {}
```

**Comparison:** Modules vs Providers - Modules are organizational units that group related functionality, while Providers are the actual services, repositories, and other classes that can be injected.

## Guards
**Description:** Determine whether a request should be handled by the route handler based on certain conditions like authentication or authorization.

**Example:**
```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    
    return this.validateToken(token);
  }

  private validateToken(token: string): boolean {
    // Validation logic here
    return token === 'valid-token';
  }
}

// Usage in controller
import { UseGuards } from '@nestjs/common';

@Controller('protected')
@UseGuards(AuthGuard)
export class ProtectedController {
  @Get()
  getProtectedResource() {
    return 'This is protected';
  }
}
```

**Comparison:** Guards vs Middleware - Guards have access to ExecutionContext and know which handler will be executed, while Middleware runs before the route handler is determined.

## Middleware
**Description:** Functions that execute before the route handler and have access to request and response objects. They can modify these objects or end the request-response cycle.

**Example:**
```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  }
}

// Apply middleware in module
import { Module, MiddlewareConsumer } from '@nestjs/common';

@Module({
  // ... other module configuration
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
```

**Comparison:** Middleware vs Guards - Middleware runs earlier in the request lifecycle and is more general-purpose, while Guards are specifically designed for authentication and authorization decisions.

## Pipes
**Description:** Transform input data or validate it before it reaches the route handler. They can also throw exceptions for invalid data.

**Example:**
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}

// Usage in controller
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

**Comparison:** Pipes vs DTOs - Pipes are runtime transformation and validation mechanisms, while DTOs are TypeScript classes that define the shape of data for compile-time type checking.

## DTOs (Data Transfer Objects)
**Description:** Objects that define how data will be received in the backend. They are TypeScript classes that describe the structure and data types expected, providing compile-time type checking.

**Example:**
```typescript
export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly age: number;
}

export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
  readonly age?: number;
}

// Usage in controller
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

**Comparison:** DTOs vs Pipes - DTOs define data structure at compile-time for type checking, while Pipes perform transformation and validation at runtime.

## Interceptors
**Description:** Provide intermediate logic that can execute before and/or after method execution. They can transform the result, extend basic behavior, or completely change logic based on specific conditions.

**Example:**
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');
    const now = Date.now();
    
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
        map(data => ({ data, timestamp: new Date().toISOString() }))
      );
  }
}

// Usage
@UseInterceptors(LoggingInterceptor)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

**Comparison:** Interceptors vs Middleware - Interceptors have access to the return value and can transform it, operating both before and after the handler, while Middleware only runs before the handler and cannot access the return value.

## Entities vs DTOs
**Description:** Entities represent database tables and are used with ORMs, while DTOs define the format of input/output data and are used for validation and data transfer.

**Example:**
```typescript
// Entity - Represents the database table
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column()
  createdAt: Date;
}

// DTO - Defines data format and validation
import { IsString, IsEmail, IsNumber, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsNumber()
  @Min(0)
  readonly age: number;
}
```

**Comparison:** Entities are persistent and represent database structure with ORM decorators, while DTOs are temporary and used for data validation with class-validator.

## Swagger Documentation
**Description:** Swagger provides automatic documentation for REST APIs in NestJS, generating an interactive interface where endpoints can be tested.

**Example:**
```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('My API')
  .setDescription('API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);

// Controller with Swagger decorators
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Post()
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

**Comparison:** Swagger vs Manual documentation - Swagger generates documentation automatically from code and allows endpoint testing, while manual documentation requires separate maintenance and isn't interactive.

## CORS Configuration
**Description:** CORS (Cross-Origin Resource Sharing) controls which domains can access your API from the browser, preventing attacks from malicious sites and allowing access from authorized origins.

**Example:**
```typescript
// main.ts - Basic configuration
app.enableCors(); // Allow all origins

// Advanced configuration
app.enableCors({
  origin: ['http://localhost:3000', 'https://myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Dynamic configuration
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000', 'https://production.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
});
```

**Comparison:** Restrictive vs Permissive CORS - A restrictive configuration is more secure but requires specifying each allowed origin, while a permissive one is more flexible but less secure for production.

## Prisma ORM Integration
**Description:** Prisma is a modern ORM that provides type-safe database access, automatic TypeScript type generation, and an intuitive query client.

**Example:**
```typescript
// schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}

// users.service.ts
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findMany() {
    return this.prisma.user.findMany({
      include: { posts: true }
    });
  }

  async create(data: { name: string; email: string }) {
    return this.prisma.user.create({
      data,
      include: { posts: true }
    });
  }
}
```

**Comparison:** Prisma vs Traditional SQL - Prisma provides type-safety and generates types automatically, while traditional SQL requires manual type validation and is more prone to runtime errors.

## Asynchronous Providers with useFactory
**Description:** Asynchronous providers allow injecting external configurations or performing asynchronous initialization before creating a service instance, useful for loading configurations from external APIs or databases.

**Example:**
```typescript
// config.service.ts
export class ConfigService {
  private dbConfig: any;

  async load(): Promise<void> {
    this.dbConfig = await fetchExternalConfig();
  }

  get(key: string): any {
    return this.dbConfig[key];
  }
}

// app.module.ts
@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: async () => {
        const config = new ConfigService();
        await config.load();
        return config;
      }
    }
  ],
  exports: [ConfigService],
})
export class AppModule {}
```

**Comparison:** useFactory vs useClass - useFactory allows complex and asynchronous initialization logic, while useClass creates instances directly without additional configuration.

## Custom Decorators with Metadata
**Description:** Custom decorators store metadata that can be read by Guards, Interceptors, or Pipes, allowing creation of custom and reusable functionality like public routes or specific permissions.

**Example:**
```typescript
// public.decorator.ts
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// auth.guard.ts
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    return Boolean(req.user);
  }
}

// app.controller.ts
@UseGuards(AuthGuard)
@Controller()
export class AppController {
  @Public()
  @Get('login')
  login() {
    return 'This route does not require authentication';
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
```

**Comparison:** Custom decorators vs Hardcoding - Custom decorators provide a declarative and reusable way to add behaviors, while hardcoding logic makes it less maintainable.

## Exception Filters
**Description:** Exception filters capture and process errors globally or specifically, allowing customization of error responses and maintaining a consistent format throughout the application.

**Example:**
```typescript
// all-exceptions.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : exception;

    response.status(status).json({
      success: false,
      statusCode: status,
      error: message,
      timestamp: new Date().toISOString(),
    });
  }
}

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}
```

**Comparison:** Exception Filters vs Manual try-catch - Exception Filters centralize error handling and provide consistency, while manual try-catch requires code duplication.

## Testing with Jest and Mocks
**Description:** NestJS provides testing utilities that allow creating test modules, mocking dependencies, and testing services, controllers, and guards in isolation.

**Example:**
```typescript
// user.service.ts
@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  getUser(id: string) {
    return this.dbService.findById(id);
  }
}

// user.service.spec.ts
describe('UserService', () => {
  let service: UserService;
  const mockDbService = { 
    findById: jest.fn().mockReturnValue({ id: '1', name: 'Silvana' }) 
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: DbService, useValue: mockDbService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should return user data', () => {
    expect(service.getUser('1')).toEqual({ id: '1', name: 'Silvana' });
    expect(mockDbService.findById).toHaveBeenCalledWith('1');
  });
});
```

**Comparison:** Testing with mocks vs Integration testing - Mocks allow isolated and fast unit testing, while integration testing verifies real behavior but is slower.

## Role-based Authorization
**Description:** Authorization system that verifies user roles using custom Guards and metadata, allowing route protection based on specific permissions of the authenticated user.

**Example:**
```typescript
// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// roles.decorator.ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// app.controller.ts
@UseGuards(AuthGuard, RolesGuard)
@Controller()
export class AppController {
  @Get('admin')
  @Roles('admin')
  getAdminData() {
    return 'Only accessible by admins';
  }

  @Get('user')
  @Roles('user', 'admin')
  getUserData() {
    return 'Accessible by users and admins';
  }
}
```

**Comparison:** Role-based authorization vs Simple authorization - Role-based authorization is more granular and scalable, while simple authorization only verifies if authenticated or not.
