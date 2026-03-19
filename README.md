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

## Firebase

1. Crea un proyecto en Firebase.
2. Habilita Authentication con Google y Facebook.
3. Crea una base de datos Firestore.
4. Copia `.env.example` a `.env` y completa las variables `VITE_FIREBASE_*`.
5. Publica las reglas de `firestore.rules`.
6. En Firestore crea manualmente un documento en `admins/<UID>` para cada administrador autorizado.

### Modelo de permisos

- Cualquier visitante puede crear invitados y ver la lista.
- Solo un administrador puede editar o eliminar invitados.
- Un administrador es cualquier usuario autenticado cuyo `uid` tenga un documento en `admins/<UID>`.

### Como crear un admin real

1. Abre la app y entra con Google o Facebook.
2. Copia tu `uid` desde Firebase Console > Authentication > Users.
3. Ve a Firestore Database.
4. Crea la coleccion `admins` si no existe.
5. Crea un documento con id igual a tu `uid`.
6. Puedes guardar un contenido simple como:

```json
{
  "role": "admin",
  "enabled": true
}
```

### Variables de entorno necesarias

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

La app usa:

- React en el frontend
- Firebase Auth para Google/Facebook
- Firestore como base de datos de invitados
- reglas para que solo usuarios autorizados administren edicion y borrado
