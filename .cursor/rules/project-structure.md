# Project Structure & Organization

## Directory Structure
```
src/app/
├── Pages/           # Page-level components (lazy loaded)
│   ├── Products/
│   ├── StoreFront/
│   ├── Checkout/
│   └── UserAccount/
├── Global/          # Shared components
│   ├── HeaderCart/
│   ├── ProductCard/
│   └── Loader/
├── Services/        # Injectable services
├── Models/          # Data models and interfaces
├── Core/            # Core functionality
└── Layouts/         # Layout components
```

## File Organization Rules
- **Page components** go in `src/app/Pages/`
- **Shared components** go in `src/app/Global/`
- **Services** go in `src/app/Services/`
- **Models** go in `src/app/Models/`
- **Use lazy loading** for all feature modules
- **Keep components small** and focused on single responsibility

## Module Organization
- Each feature should have its own module
- Use lazy loading for all feature modules
- Shared modules for common functionality
- Core module for singleton services

## Import Organization
```typescript
// Angular imports
import { Component, OnInit } from '@angular/core';

// Third-party imports
import { Observable } from 'rxjs';

// Local imports
import { MyService } from '../services/my.service';
import { MyModel } from '../models/my.model';
``` 
