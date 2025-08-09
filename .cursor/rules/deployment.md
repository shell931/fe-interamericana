# Deployment & Build Configuration

## Build Commands
- **Development**: `npm start`
- **Production**: `npm run build:prod`
- **Testing**: `npm test`

## Build Configuration
- **Base href**: Must be `/swiftly/`
- **Output path**: `dist/swiftly/`
- **AOT compilation**: Enabled
- **Optimization**: Enabled for production

## Docker Configuration
- **Base image**: `nginx:latest`
- **Static files**: Mounted to `/usr/share/nginx/html`
- **Config**: `./nginx/nginx.conf`

## Traefik Configuration
- **SSL**: Automatic with Let's Encrypt
- **Domain**: `ofertas-swiftly.com`
- **Priority**: 5 for fe-market router
- **CORS**: Enabled via middleware

## Environment Variables
```bash
# Required for production
NODE_OPTIONS=--openssl-legacy-provider
```

## Deployment Checklist
- [ ] Run `npm run build:prod`
- [ ] Verify base-href is `/swiftly/`
- [ ] Check all assets are in `dist/swiftly/`
- [ ] Test Docker build
- [ ] Verify Traefik routing
- [ ] Check SSL certificate
- [ ] Test CORS functionality 
