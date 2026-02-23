# Firmas Proyecto

## Descripción

Este es un proyecto para la recolección de firmas para una petición. Permite a los usuarios firmar digitalmente y almacena las firmas en una base de datos segura.

## Características

- Informacion general de la petición y del movimiento estudiantil
- Almacenamiento seguro de datos en Firebase
- Estadísticas en tiempo real sobre el número de firmas

## Configuración de Cloud Functions
Para configurar las Cloud Functions, sigue estos pasos:
 - Instala Firebase CLI: `npm install -g firebase-tools`
 - Autentícate con Firebase: `firebase login`
    - Configura tu Project ID en `firebase.json`
    - Instala las dependencias de Functions: `cd functions && npm install`
    - Despliega las funciones: `firebase deploy --only functions`

## Instalación

```bash
git clone [repositorio]
cd firmas-proyecto
npm install
```

## Uso

```bash
npm start 
```
Tambien puede servir:
```bash
ng serve
```
Luego, abre tu navegador y ve a `http://localhost:4200` para ver la aplicación en acción.

## Estructura del Proyecto

```
firmas-proyecto/
├── src/
├── public/
├── tests/
└── README.md
```