# Configuración SEO con Variables de Entorno

## 🎯 Problema Solucionado

Hemos implementado un sistema dinámico de SEO que utiliza variables de entorno para generar automáticamente:
- ✅ **Sitemap.xml** dinámico
- ✅ **Robots.txt** dinámico  
- ✅ **URLs canónicas** automáticas
- ✅ **Meta tags** con dominio correcto

## 📁 Archivos Configurados

### 1. Variables de Entorno

#### `src/environments/environment.ts` (Desarrollo)
```typescript
export const environment = {
  production: false,
  domain: 'http://localhost:4200',           // 🔧 Cambia aquí para desarrollo
  basePath: '/interamericana',               // 🔧 Ruta base de la app
  api: {
    // ... resto de configuración
  }
};
```

#### `src/environments/environment.prod.ts` (Producción)
```typescript
export const environment = {
  production: true,
  get domain() { return `${window.location.protocol}//${window.location.host}`; }, // 🚀 Dinámico
  basePath: '/interamericana',
  api: {
    // ... resto de configuración
  }
};
```

### 2. Servicios SEO

#### `src/app/Services/sitemap.service.ts`
- Genera sitemap.xml dinámicamente
- Usa variables de entorno
- Puede incluir productos de la API

#### `src/app/Services/seo.service.ts`
- URLs canónicas automáticas
- Meta tags con dominio correcto
- Schema.org con URLs dinámicas

### 3. Script de Generación

#### `scripts/generate-sitemap.js`
Genera sitemap.xml y robots.txt usando variables de entorno.

## 🚀 Comandos Disponibles

### Desarrollo
```bash
# Generar sitemap para desarrollo (localhost:4200)
npm run generate-sitemap

# Iniciar servidor de desarrollo
npm start
```

### Producción
```bash
# Generar sitemap para producción con dominio específico
npm run generate-sitemap:prod

# Build completo (incluye generación de sitemap)
npm run build:prod
```

### Personalizado
```bash
# Generar para dominio específico
node scripts/generate-sitemap.js https://mi-dominio.com /mi-ruta
```

## 🔧 Configuración por Entorno

### Para Desarrollo Local
1. **No cambies nada** - ya está configurado para `http://localhost:4200`
2. El sitemap se genera automáticamente con URLs locales

### Para Staging
1. Actualiza `environment.ts`:
```typescript
domain: 'https://staging.mi-dominio.com',
basePath: '/interamericana'
```

2. Ejecuta:
```bash
npm run generate-sitemap
```

### Para Producción
1. **Opción A**: Usar detección automática (recomendado)
   - No cambies nada en `environment.prod.ts`
   - El dominio se detecta automáticamente

2. **Opción B**: Dominio fijo
   - Cambia en `environment.prod.ts`:
   ```typescript
   domain: 'https://mi-dominio-final.com',
   ```

3. **Opción C**: Build con dominio específico
   ```bash
   # Edita package.json, línea 13:
   "generate-sitemap:prod": "node scripts/generate-sitemap.js https://MI-DOMINIO.com /interamericana"
   ```

## 📋 URLs Generadas Automáticamente

El sistema genera estas URLs en el sitemap:

### Páginas Principales (Prioridad Alta)
- `{domain}{basePath}/` - Página principal (1.0)
- `{domain}{basePath}/products` - Productos (0.9)

### Categorías de Productos (Prioridad 0.8)
- `/products/escobillas`
- `/products/escobillas-grafito` 
- `/products/escobillas-carbon`
- `/products/rodamientos`
- `/products/farolas`
- `/products/luces-carro`
- `/products/balastros`
- `/products/repuestos-carro`

### Páginas de Navegación (Prioridad 0.6-0.7)
- `/search`
- `/storefront`
- `/storelist`

### Páginas Informativas (Prioridad 0.3-0.5)
- `/terms_conditions`
- `/data_protection`
- `/help_pqr`
- `/payment_information`
- `/assisted_buy`

## 🔄 Flujo de Trabajo

### Durante Desarrollo
1. Trabajas normalmente con `npm start`
2. El SEO usa `http://localhost:4200/interamericana`
3. URLs canónicas se generan automáticamente

### Al Hacer Deploy
1. Ejecutas `npm run build:prod`
2. Se genera sitemap con dominio de producción
3. Se copia a `dist/interamericana/`
4. Todo listo para subir al servidor

## 🛠️ Personalización

### Agregar Nuevas URLs al Sitemap
Edita `scripts/generate-sitemap.js` y agrega en el array `urls`:

```javascript
{
  loc: `${baseUrl}/nueva-pagina`,
  lastmod: currentDate,
  changefreq: 'weekly',
  priority: '0.7'
}
```

### Cambiar Prioridades SEO
Modifica los valores de `priority` en el script:
- `1.0` - Página más importante
- `0.9` - Muy importante  
- `0.8` - Importante
- `0.6-0.7` - Moderadamente importante
- `0.3-0.5` - Menos importante

### URLs Canónicas Personalizadas
En cualquier componente:

```typescript
constructor(private seoService: SeoService) {}

ngOnInit() {
  this.seoService.updateSeoData({
    canonicalUrl: 'https://mi-dominio.com/pagina-especifica'
  });
}
```

## 📊 Verificación

### Comprobar Sitemap Generado
```bash
# Ver contenido del sitemap
cat src/sitemap.xml

# Ver robots.txt
cat src/robots.txt
```

### URLs que deberían funcionar:
- `http://localhost:4200/sitemap.xml` (desarrollo)
- `https://tu-dominio.com/interamericana/sitemap.xml` (producción)

### Verificar en Google Search Console
1. Sube el sitemap: `https://tu-dominio.com/interamericana/sitemap.xml`
2. Verifica que no hay errores
3. Monitorea la indexación

## 🚨 Solución de Problemas

### Sitemap no se actualiza
```bash
# Regenerar manualmente
npm run generate-sitemap
```

### URLs incorrectas en producción
1. Verifica `environment.prod.ts`
2. Asegúrate que `domain` sea correcto
3. Recompila: `npm run build:prod`

### Meta tags con dominio incorrecto
1. Verifica que estás usando `environment.domain` 
2. Comprueba que el servicio SEO esté importado
3. Revisa la consola del navegador

## ✅ Beneficios del Sistema

- **🔄 Automático**: No más URLs hardcodeadas
- **🌍 Multi-entorno**: Desarrollo, staging, producción
- **⚡ Dinámico**: Sitemap se actualiza con cada build
- **🎯 SEO Optimizado**: URLs canónicas correctas
- **🛠️ Mantenible**: Un solo lugar para cambiar URLs

---

**¡Tu SEO ahora es completamente dinámico y no requiere cambios manuales de URLs!** 🎉
