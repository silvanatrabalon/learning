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
