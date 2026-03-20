# Guia de Flujo de Trabajo

Esta guia resume lo que hicimos en este proyecto y te deja una plantilla reutilizable para futuros proyectos con React, GitHub, Firebase y Vercel.

## 1. Que construimos

Este proyecto termino con:

- landing page en React
- galeria del cumpleanero
- registro de invitados
- lista publica de invitados
- acceso de administrador con Google
- base de datos en Firestore
- despliegue en Vercel
- repositorio remoto en GitHub

## 2. Flujo real que seguimos

1. Crear la base del proyecto React.
2. Construir la landing principal.
3. Agregar estilos y responsive.
4. Cargar imagenes locales en `public/cumple`.
5. Inicializar y usar Git local.
6. Crear y conectar el repositorio remoto en GitHub.
7. Desplegar en Vercel.
8. Integrar Firebase Auth y Firestore.
9. Configurar reglas de seguridad en Firestore.
10. Autorizar el dominio de Vercel en Firebase.
11. Crear el documento admin con el `UID`.
12. Ajustar la experiencia final: responsive, lightbox y footer.

## 3. Flujo recomendado para hacerlo tu solo

### A. Crear el proyecto

```bash
git init
npm install
npm run dev
```

### B. Trabajar localmente

Archivos principales:

- `src/App.jsx`: estructura y logica
- `src/styles.css`: estilos
- `public/`: imagenes estaticas

Comandos utiles:

```bash
npm run dev
npm run build
git status
```

### C. Versionar con Git

Guardar cambios:

```bash
git add .
git commit -m "Mensaje claro del cambio"
```

Subir cambios:

```bash
git push
```

### D. GitHub

Conectar repositorio remoto:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### E. Vercel

Despliegue:

```bash
vercel --prod
```

Cada vez que cambies codigo:

```bash
git add .
git commit -m "Tu cambio"
git push
vercel --prod
```

### F. Firebase

Se uso para:

- Google login
- base de datos Firestore
- permisos para admin

Archivos del proyecto:

- `src/firebase.js`
- `firestore.rules`
- `.env.example`
- `firebase.json`
- `.firebaserc`

## 4. Firebase paso a paso

### Paso 1. Crear proyecto

En Firebase Console, crea un proyecto.

### Paso 2. Crear app web

En `Configuracion del proyecto > General > Tus apps`, crea una app web.

### Paso 3. Sacar firebaseConfig

De ahi copias:

- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

### Paso 4. Crear archivo .env

En la raiz del proyecto:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Paso 5. Activar Google

En Firebase:

`Authentication > Metodo de acceso > Google > Habilitar`

### Paso 6. Crear Firestore

En Firebase:

`Firestore Database`

### Paso 7. Publicar reglas e indices

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### Paso 8. Autorizar el dominio de Vercel

En Firebase:

`Authentication > Dominios autorizados`

Agregar:

```text
landing-cumple-joaquin-jeremias.vercel.app
```

### Paso 9. Crear el admin

1. Entrar a la app con Google.
2. Ir a `Authentication > Users`.
3. Copiar el `UID`.
4. Ir a Firestore.
5. Crear:

```text
admins/TU_UID
```

Con campos como:

```json
{
  "role": "admin",
  "enabled": true
}
```

## 5. Como funciona el sistema de permisos

### Invitado

- entra por la URL publica
- puede ver la landing
- puede registrar invitado
- puede ver la lista
- no puede editar ni borrar

### Administrador

- entra por la misma URL
- inicia sesion con Google
- si existe `admins/TU_UID` en Firestore
- puede editar y eliminar

## 6. Comandos usados cronologicamente

Estos fueron los comandos base que usamos durante el proyecto:

```bash
git init
npm install
npm run dev
git add .
git commit -m "Landing de cumpleanos con galeria y CRUD de invitados"
git remote add origin https://github.com/Gibson1987R/landing-cumple-joaquin-jeremias.git
git push -u origin main
vercel --prod
firebase deploy --only firestore:rules,firestore:indexes
git add .
git commit -m "Configurar Firebase para invitados y administracion"
git push
vercel --prod
git add .
git commit -m "Mejorar responsive y visor de galeria con lightbox"
git push
vercel --prod
git add .
git commit -m "Actualizar footer con palabritas y banners animados"
git push
vercel --prod
```

## 7. Plantilla maestra para futuros proyectos

Usa esto como checklist rapido:

### Crear y trabajar

```bash
git init
npm install
npm run dev
```

### Guardar cambios

```bash
git add .
git commit -m "descripcion del cambio"
```

### Conectar a GitHub

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git branch -M main
git push -u origin main
```

### Desplegar

```bash
vercel --prod
```

### Firebase

```bash
firebase deploy --only firestore:rules,firestore:indexes
```

### Publicar cambios futuros

```bash
git add .
git commit -m "nuevo cambio"
git push
vercel --prod
```

## 8. Archivos importantes de este proyecto

- `src/App.jsx`
- `src/styles.css`
- `src/firebase.js`
- `firestore.rules`
- `firebase.json`
- `.firebaserc`
- `.env.example`
- `vercel.json`

## 9. Regla practica final

Si un proyecto tiene:

- frontend: React
- datos: Firestore
- login: Firebase Auth
- hosting: Vercel
- versionado: GitHub

Entonces el flujo casi siempre es:

1. desarrollar localmente
2. guardar con Git
3. subir a GitHub
4. desplegar en Vercel
5. configurar Firebase
6. probar con usuario normal y admin
