# Cursor Rules for Angular fe-market Project

## Project Overview
This is an Angular 10 e-commerce application called "Interamericana" with the following characteristics:
- Base path: `/interamericana/`
- Uses Angular Material, Bootstrap, and ngx-bootstrap
- Implements lazy loading for modules
- Uses Traefik for reverse proxy and Nginx for static file serving
- Deployed with Docker Compose

## Quick Reference

### Core Dependencies
- Angular 10.x
- Angular Material 11.x
- Bootstrap 4.6.x
- ngx-bootstrap 7.x
- RxJS 6.x

### Key Libraries
- ngx-translate for internationalization
- ngx-cookie-service for cookie management
- ngx-mask for input masking
- ngx-pagination for pagination
- Swiper for carousels

### Development Commands
- `npm start` - Development server
- `npm run build:prod` - Production build
- `npm test` - Run tests

## Import Other Rules
- See `angular-patterns.md` for component and service patterns
- See `project-structure.md` for file organization
- See `deployment.md` for build and deployment rules

## General Guidelines
- Use strict typing, avoid `any` type
- Implement proper error handling
- Follow Angular style guide
- Use OnPush change detection when possible
- Implement proper form validation
- Use lazy loading for all feature modules 
