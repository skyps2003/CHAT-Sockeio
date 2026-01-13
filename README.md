# Proyecto de Sistemas Distribuidos - Chat 

Este es una aplicación completa de Chat y Videollamadas en tiempo real, construida con el stack MERN (MongoDB, Express, React, Node.js) y potenciada por WebSockets y WebRTC.

## 📦 Estructura del Proyecto

-   **`/backend`**: Contiene todo el código del servidor (Controladores, Modelos, Rutas, Configuración de DB y Sockets).
-   **`/frontend`**: Contiene la aplicación React (Componentes, Hooks, Contextos, Estilos).


## 🚀 Características Principales

-   **Autenticación de Usuarios**: Registro e inicio de sesión seguros con JWT.
-   **Chat en Tiempo Real**: Mensajería instantánea utilizando Socket.io.
-   **Inteligencia Artificial (@IA)**: Integración con Gemini AI para responder preguntas directamente en el chat.
-   **Búsqueda en Tiempo Real**: Filtrado instantáneo de conversaciones.
-   **Notas de Voz**: Envío de audios grabados directamente desde la interfaz.
-   **Compartir Imágenes**: Envío de fotos y memes.
-   **Videollamadas**: Comunicación de video peer-to-peer (P2P) integrada con PeerJS.
-   **Estados en Línea**: Visualización de usuarios conectados en tiempo real.
-   **Interfaz Moderna**: UI responsiva y elegante construida con TailwindCSS, DaisyUI y Glassmorphism.

## 🛠️ Stack Tecnológico

### Backend
-   **Node.js & Express**: Servidor robusto y API RESTful.
-   **Socket.io**: Comunicación bidireccional en tiempo real (Chat).
-   **Mongoose**: Modelado de objetos para MongoDB.
-   **JWT (JSON Web Tokens)**: Autenticación segura sin estado.
-   **Multer**: Manejo de subida de archivos (imágenes, etc.).
-   **Google Generative AI**: Integración con Gemini Pro.

### Frontend
-   **React (Vite)**: Biblioteca de UI rápida y moderna.
-   **TailwindCSS & DaisyUI**: Framework de utilidades CSS y componentes UI.
-   **Zustand**: Gestor de estado ligero y escalable.
-   **Socket.io-client**: Cliente para la conexión con el servidor de sockets.
-   **PeerJS**: Implementación simplificada de WebRTC para videollamadas.

## 📋 Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema:
-   **Node.js**: Versión 18 o superior.
-   **MongoDB**: Instancia local o Atlas.
-   **Gemini API Key**: Clave válida de Google AI Studio.

## ⚙️ Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd Sistemas_Distribuidos
```

### 2. Instalar Dependencias
```bash
npm install       # Backend
cd frontend
npm install       # Frontend
cd ..
```

### 3. Configurar Variables de Entorno (`.env` en raíz)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat_db
JWT_SECRET=tu_secreto
GEMINI_API_KEY=tu_clave_de_gemini
NODE_ENV=development
```

## ▶️ Ejecución del Proyecto

### Backend
```bash
npm run server
```

### Frontend
```bash
cd frontend
npm run dev
```

## 🚀 Despliegue

### Backend
Desplegado en **Render**: `https://chat-sockeio-1.onrender.com`

### Frontend
Desplegado en **Azure Static Web Apps**: `https://ambitious-beach-07ae23d10.2.azurestaticapps.net`
