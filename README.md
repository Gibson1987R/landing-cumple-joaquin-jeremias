# Fiesta de Joaquín Jeremías

Landing page en React + Vite para gestionar invitados del cumpleaños de 4 años.

## Ejecutar en local

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm run build
```

## Despliegue recomendado

1. Sube este proyecto a GitHub.
2. Entra a Vercel y crea un proyecto importando el repositorio.
3. Vercel detectará Vite automáticamente.
4. Publica la app.

## Prepararlo para GitHub

```bash
git add .
git commit -m "Landing de cumpleanos con CRUD de invitados"
git branch -M main
git remote add origin TU_REPO_GITHUB
git push -u origin main
```

## Configuración de Vercel

Se añadió `vercel.json` con una configuración explícita para compilar la app con Vite y publicar el directorio `dist`.

## Personalización rápida

Los datos del evento están en `src/App.jsx` dentro de `eventDetails`.
