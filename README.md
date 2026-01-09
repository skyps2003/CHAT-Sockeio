# Proyecto de Sistemas Distribuidos - Chat & Videollamadas

Este es una aplicación completa de Chat y Videollamadas en tiempo real, construida con el stack MERN (MongoDB, Express, React, Node.js) y potenciada por WebSockets y WebRTC.

## 📦 Estructura del Proyecto

-   **`/backend`**: Contiene todo el código del servidor (Controladores, Modelos, Rutas, Configuración de DB y Sockets).
-   **`/frontend`**: Contiene la aplicación React (Componentes, Hooks, Contextos, Estilos).


## 🚀 Características Principales

-   **Autenticación de Usuarios**: Registro e inicio de sesión seguros con JWT.
-   **Chat en Tiempo Real**: Mensajería instantánea utilizando Socket.io.
-   **Videollamadas**: Comunicación de video peer-to-peer (P2P) integrada con PeerJS.
-   **Estados en Línea**: Visualización de usuarios conectados en tiempo real.
-   **Interfaz Moderna**: UI responsiva y elegante construida con TailwindCSS y DaisyUI.
-   **Gestión de Estado**: Manejo eficiente del estado global con Zustand.

## 🛠️ Stack Tecnológico

### Backend
-   **Node.js & Express**: Servidor robusto y API RESTful.
-   **Socket.io**: Comunicación bidireccional en tiempo real (Chat).
-   **Mongoose**: Modelado de objetos para MongoDB.
-   **JWT (JSON Web Tokens)**: Autenticación segura sin estado.
-   **Multer**: Manejo de subida de archivos (imágenes, etc.).
-   **Cookie Parser**: Manejo de cookies para la sesión.

### Frontend
-   **React (Vite)**: Biblioteca de UI rápida y moderna.
-   **TailwindCSS & DaisyUI**: Framework de utilidades CSS y componentes UI.
-   **Zustand**: Gestor de estado ligero y escalable.
-   **Socket.io-client**: Cliente para la conexión con el servidor de sockets.
-   **PeerJS**: Implementación simplificada de WebRTC para videollamadas.
-   **React Router**: Navegación SPA (Single Page Application).
-   **React Hot Toast**: Notificaciones elegantes.

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:
-   **Node.js**: Versión 18 o superior (se requiere soporte moderno de JavaScript).
-   **MongoDB**: Una instancia local de MongoDB en ejecución o una URI de conexión a MongoDB Atlas.

## ⚙️ Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente.

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Sistemas_Distribuidos
```

### 2. Instalar Dependencias del Backend (Raíz)
Desde la carpeta raíz del proyecto:
```bash
npm install
```

### 3. Instalar Dependencias del Frontend
```bash
cd frontend
npm install
cd ..
```

### 4. Configurar Variables de Entorno
Crea un archivo llamado `.env` en la **raíz** del proyecto y añade las siguientes variables:

```env
PORT=4200
MONGO_DB_URI=mongodb://localhost:27017/chat_db  # O tu URI de MongoDB Atlas
JWT_SECRET=tu_clave_secreta_super_segura
NODE_ENV=development
```

> **Nota**: Asegúrate de que tu servicio de MongoDB esté corriendo si usas una base de datos local.

## ▶️ Ejecución del Proyecto

Para desarrollar, necesitarás correr tanto el servidor backend como el cliente frontend.

### Iniciar el Backend
Desde la raíz del proyecto:
```bash
npm run server
```
El servidor iniciará (por defecto) en `http://localhost:4200`.

### Iniciar el Frontend
Abre una nueva terminal, ve a la carpeta `frontend` e inicia el servidor de desarrollo:
```bash
cd frontend
npm run dev
```
La aplicación estará disponible usualmente en `http://localhost:5173`.

## 📦 Estructura del Proyecto

-   **`/backend`**: Contiene todo el código del servidor (Controladores, Modelos, Rutas, Configuración de DB y Sockets).
-   **`/frontend`**: Contiene la aplicación React (Componentes, Hooks, Contextos, Estilos).
-   **`Login.txt`**: Archivo de referencia (según estructura observada).

## 🚀 Despliegue

### Backend
El backend se encuentra desplegado actualmente en [Render](https://render.com/).

### Frontend
Se planea desplegar el frontend en **Azure Static Web Apps**.
