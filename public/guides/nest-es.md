# Guía de NestJS

## Controllers
**Descripción:** Manejan las solicitudes entrantes y devuelven respuestas al cliente. Son responsables de manejar las solicitudes HTTP y delegar tareas más complejas a los servicios.

**Ejemplo:**
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

**Comparación:** Controllers vs Services - Los Controllers manejan aspectos de la capa HTTP (enrutamiento, solicitud/respuesta), mientras que los Services contienen lógica de negocio y pueden ser reutilizados en diferentes controllers.

## Services
**Descripción:** Proveedores que encapsulan la lógica de negocio y pueden ser inyectados en controllers u otros services a través de inyección de dependencias.

**Ejemplo:**
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

**Comparación:** Services vs Controllers - Los Services contienen lógica de negocio y manipulación de datos, mientras que los Controllers manejan solicitudes y respuestas HTTP.

## Modules
**Descripción:** Organizan funcionalidad relacionada. Cada módulo encapsula controllers, services y otros providers relacionados con una característica específica.

**Ejemplo:**
```typescript
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Hace el servicio disponible para otros módulos
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

**Comparación:** Modules vs Providers - Los Modules son unidades organizacionales que agrupan funcionalidad relacionada, mientras que los Providers son los servicios, repositorios y otras clases que pueden ser inyectadas.

## Guards
**Descripción:** Determinan si una solicitud debe ser manejada por el route handler basado en ciertas condiciones como autenticación o autorización.

**Ejemplo:**
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
    // Lógica de validación aquí
    return token === 'valid-token';
  }
}

// Uso en controller
import { UseGuards } from '@nestjs/common';

@Controller('protected')
@UseGuards(AuthGuard)
export class ProtectedController {
  @Get()
  getProtectedResource() {
    return 'Esto está protegido';
  }
}
```

**Comparación:** Guards vs Middleware - Los Guards tienen acceso al ExecutionContext y saben qué handler será ejecutado, mientras que el Middleware se ejecuta antes de que se determine el route handler.

## Middleware
**Descripción:** Funciones que se ejecutan antes del route handler y tienen acceso a los objetos request y response. Pueden modificar estos objetos o terminar el ciclo request-response.

**Ejemplo:**
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

// Aplicar middleware en módulo
import { Module, MiddlewareConsumer } from '@nestjs/common';

@Module({
  // ... otra configuración del módulo
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Aplicar a todas las rutas
  }
}
```

**Comparación:** Middleware vs Guards - El Middleware se ejecuta más temprano en el ciclo de vida de la solicitud y es de propósito más general, mientras que los Guards están específicamente diseñados para decisiones de autenticación y autorización.

## Middleware vs Guards - Comparación Detallada
**Descripción:** Ambos son mecanismos de intercepción en NestJS, pero operan en diferentes niveles y momentos del ciclo de vida de la solicitud. Es importante entender cuándo usar cada uno.

**Ejemplo:**
```typescript
// Middleware - Ejecuta primero, decodifica JWT
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, 'secret');
        req.user = decoded; // Añadir usuario al request
      } catch (e) {
        // Token inválido, pero no bloqueamos aquí
      }
    }
    next();
  }
}

// Guard - Ejecuta después, verifica permisos
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Usuario añadido por el middleware
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    
    return user && user.role === requiredRole;
  }
}
```

**Comparación:** 
- **Nivel**: Middleware (Express - bajo nivel) vs Guards (NestJS - alto nivel)
- **Momento de ejecución**: Middleware se ejecuta antes que los Guards
- **Propósito**: Middleware para procesamiento genérico (logs, parseo) vs Guards para control de acceso
- **Decoradores**: Middleware no tiene acceso a decoradores, Guards sí (`ExecutionContext`, `@Req()`)
- **Retorno**: Middleware usa `next()`, Guards retornan `true`/`false`
- **Uso conjunto**: Común usar Middleware para decodificar JWT y Guards para verificar permisos

## Pipes
**Descripción:** Transforman datos de entrada o los validan antes de que lleguen al route handler. También pueden lanzar excepciones para datos inválidos.

**Ejemplo:**
```typescript
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Falló la validación');
    }
    return val;
  }
}

// Uso en controller
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.usersService.findOne(id);
}
```

**Comparación:** Pipes vs DTOs - Los Pipes son mecanismos de transformación y validación en tiempo de ejecución, mientras que los DTOs son clases TypeScript que definen la forma de los datos para verificación de tipos en tiempo de compilación.

## DTOs (Data Transfer Objects)
**Descripción:** Objetos que definen cómo se van a recibir los datos en el backend. Son clases TypeScript que describen la estructura y tipos de datos esperados, proporcionando verificación de tipos en tiempo de compilación.

**Ejemplo:**
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

// Uso en controller
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

**Comparación:** DTOs vs Pipes - Los DTOs definen la estructura de datos en tiempo de compilación para verificación de tipos, mientras que los Pipes realizan transformación y validación en tiempo de ejecución.

## Interceptors
**Descripción:** Proporcionan lógica intermedia que se puede ejecutar antes y/o después de la ejecución del método. Pueden transformar el resultado, extender comportamiento básico o cambiar completamente la lógica según condiciones específicas.

**Ejemplo:**
```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Antes...');
    const now = Date.now();
    
    return next
      .handle()
      .pipe(
        tap(() => console.log(`Después... ${Date.now() - now}ms`)),
        map(data => ({ data, timestamp: new Date().toISOString() }))
      );
  }
}

// Uso
@UseInterceptors(LoggingInterceptor)
@Get()
findAll() {
  return this.usersService.findAll();
}
```

**Comparación:** Interceptors vs Middleware - Los Interceptors tienen acceso al valor de retorno y pueden transformarlo, operando tanto antes como después del handler, mientras que el Middleware solo se ejecuta antes del handler y no puede acceder al valor de retorno.

## Entities vs DTOs
**Descripción:** Las Entities representan las tablas en la base de datos y se usan con ORMs, mientras que los DTOs definen el formato de datos de entrada/salida y se usan para validación y transferencia de datos.

**Ejemplo:**
```typescript
// Entity - Representa la tabla en la base de datos
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

// DTO - Define formato de datos y validación
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

**Comparación:** Las Entities son persistentes y representan la estructura de la base de datos con decoradores ORM, mientras que los DTOs son temporales y se usan para validación de datos con class-validator.

## Swagger Documentation
**Descripción:** Swagger proporciona documentación automática para APIs REST en NestJS, generando una interfaz interactiva donde se pueden probar los endpoints.

**Ejemplo:**
```typescript
// main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Mi API')
  .setDescription('Descripción de la API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('docs', app, document);

// Controller con decoradores Swagger
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Post()
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

**Comparación:** Swagger vs Documentación manual - Swagger genera documentación automáticamente desde el código y permite probar endpoints, mientras que la documentación manual requiere mantenimiento separado y no es interactiva.

## CORS Configuration
**Descripción:** CORS (Cross-Origin Resource Sharing) controla qué dominios pueden acceder a tu API desde el navegador, previniendo ataques de sitios maliciosos y permitiendo el acceso desde orígenes autorizados.

**Ejemplo:**
```typescript
// main.ts - Configuración básica
app.enableCors(); // Permite todos los orígenes

// Configuración avanzada
app.enableCors({
  origin: ['http://localhost:3000', 'https://miapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Configuración dinámica
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = ['http://localhost:3000', 'https://production.com'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  }
});
```

**Comparación:** CORS restrictivo vs permisivo - Una configuración restrictiva es más segura pero requiere especificar cada origen permitido, mientras que una permisiva es más flexible pero menos segura para producción.

## Prisma ORM Integration
**Descripción:** Prisma es un ORM moderno que proporciona acceso type-safe a la base de datos, generación automática de tipos TypeScript y un cliente de consultas intuitivo.

**Ejemplo:**
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

**Comparación:** Prisma vs SQL tradicional - Prisma proporciona type-safety y genera tipos automáticamente, mientras que SQL tradicional requiere validación manual de tipos y es más propenso a errores de runtime.

## Proveedores Asíncronos con useFactory
**Descripción:** Los proveedores asíncronos permiten inyectar configuraciones externas o realizar inicialización asíncrona antes de crear una instancia del servicio, útil para cargar configuraciones de APIs externas o bases de datos.

**Ejemplo:**
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

**Comparación:** useFactory vs useClass - useFactory permite lógica de inicialización compleja y asíncrona, mientras que useClass crea instancias directamente sin configuración adicional.

## Decoradores Personalizados con Metadata
**Descripción:** Los decoradores personalizados almacenan metadata que puede ser leída por Guards, Interceptors o Pipes, permitiendo crear funcionalidad personalizada y reutilizable como rutas públicas o permisos específicos.

**Ejemplo:**
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
    return 'Esta ruta no requiere autenticación';
  }

  @Get('profile')
  getProfile(@Req() req) {
    return req.user;
  }
}
```

**Comparación:** Decoradores personalizados vs Hardcoding - Los decoradores personalizados proporcionan una forma declarativa y reutilizable de añadir comportamientos, mientras que hardcodear lógica la hace menos mantenible.

## Exception Filters
**Descripción:** Los filtros de excepción capturan y procesan errores de manera global o específica, permitiendo personalizar las respuestas de error y mantener un formato consistente en toda la aplicación.

**Ejemplo:**
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

**Comparación:** Exception Filters vs try-catch manual - Los Exception Filters centralizan el manejo de errores y proporcionan consistencia, mientras que try-catch manual requiere duplicación de código.

## Testing con Jest y Mocks
**Descripción:** NestJS proporciona utilidades para testing que permiten crear módulos de prueba, mockear dependencias y testear servicios, controllers y guards de manera aislada.

**Ejemplo:**
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

**Comparación:** Testing con mocks vs Testing de integración - Los mocks permiten testing unitario aislado y rápido, mientras que testing de integración verifica el comportamiento real pero es más lento.

## Autorización basada en Roles
**Descripción:** Sistema de autorización que verifica los roles de usuario usando Guards personalizados y metadata, permitiendo proteger rutas basándose en permisos específicos del usuario autenticado.

**Ejemplo:**
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
    return 'Solo accesible por admins';
  }

  @Get('user')
  @Roles('user', 'admin')
  getUserData() {
    return 'Accesible por users y admins';
  }
}
```

**Comparación:** Autorización basada en roles vs Autorización simple - La autorización por roles es más granular y escalable, mientras que la simple solo verifica si está autenticado o no.
