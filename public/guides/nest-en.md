# NestJS Guide

## Controllers
**Description:** Handle incoming requests and return responses to the client. They're responsible for handling HTTP requests and delegating more complex tasks to services.

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
