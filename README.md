# PrestaFácil — Sistema de Préstamos

Aplicación web para gestionar préstamos de objetos: consulta de préstamos, seguimiento de responsables y registro de devoluciones. Proyecto universitario desarrollado con React.

##  Descripción

El sistema permite:
- Consultar los préstamos activos
- Ver quién tiene cada objeto prestado
- Registrar devoluciones
- Solicitar un nuevo préstamo (con inicio de sesión requerido)

##  Tecnologías y herramientas utilizadas

| Categoría | Herramienta |
|---|---|
| Lenguaje | JavaScript (ES6+) |
| Framework | React |
| Build tool / servidor de desarrollo | Vite |
| Estilos | Tailwind CSS |
| Componentes UI | Flowbite React |
| Tipografía | Google Fonts (Poppins) |
| Navegación | react-router-dom |
| Autenticación | Firebase Authentication |
| Control de versiones | Git + GitHub |

##  Estructura del proyecto

```
sistema-prestamos/
├── src/
│   ├── components/
│   │   └── LoginModal.jsx        # Modal de inicio de sesión (Firebase)
│   ├── pages/
│   │   ├── Home.jsx              # Página principal
│   │   └── SolicitarPrestamo.jsx # Página para solicitar un préstamo
│   ├── App.jsx                   # Configuración de rutas
│   ├── main.jsx                  # Punto de entrada de la aplicación
│   ├── firebase.js               # Configuración de Firebase
│   └── index.css                 # Estilos globales (Tailwind)
├── .env                          # Credenciales de Firebase (no incluido en el repositorio)
├── index.html
├── package.json
└── vite.config.js
```

##  Cómo funciona el código

### Enrutamiento (`App.jsx`)
La aplicación es una **SPA** (Single Page Application): todas las páginas se cargan sobre un único `index.html`, y `react-router-dom` cambia el contenido visible según la URL, sin recargar el navegador. Actualmente define dos rutas:
- `/` → `Home.jsx`
- `/solicitar` → `SolicitarPrestamo.jsx`

### Página principal (`Home.jsx`)
Contiene:
- Encabezado con navegación por anclas (scroll suave implementado manualmente en JavaScript)
- Un carrusel de contenido rotativo construido con `useState`/`useEffect`
- Secciones informativas (¿Por qué?, Visión, Misión, Acerca de)
- Categorías de servicios/objetos disponibles para préstamo
- Formulario de contacto
- Botón "Solicitar Préstamo" que abre el modal de inicio de sesión

### Autenticación (`firebase.js` + `LoginModal.jsx`)
El botón "Solicitar Préstamo" abre un modal de inicio de sesión que usa `signInWithEmailAndPassword` del SDK de Firebase Authentication. Al iniciar sesión correctamente, redirige a la página de solicitud de préstamo.

##  Cómo ejecutar el proyecto

### Requisitos previos
- [Node.js](https://nodejs.org) instalado (versión LTS recomendada)
- Una cuenta de Firebase con un proyecto configurado (Authentication con el método Correo/Contraseña habilitado)

### Pasos

**1. Clona el repositorio**
```bash
git clone https://github.com/rollthoqui/sistema-prestamos.git
cd sistema-prestamos
```

**2. Instala las dependencias**
```bash
npm install
```

**3. Configura las variables de entorno**

Crea un archivo `.env` en la raíz del proyecto con tus propias credenciales de Firebase:
```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

**4. Ejecuta el servidor de desarrollo**
```bash
npm run dev
```

**5. Abre el proyecto en el navegador**

Ve a la dirección que muestra la terminal, normalmente:
```
http://localhost:5173
```

### Otros comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo con recarga en vivo |
| `npm run build` | Genera la versión de producción en la carpeta `dist/` |
| `npm run preview` | Sirve localmente la versión ya compilada (`dist/`) |

##  Estado actual del proyecto

**Implementado:**
- Página principal con diseño completo
- Navegación entre páginas
- Inicio de sesión con Firebase Authentication

**Pendiente:**
- Base de datos para préstamos (consulta, responsables, devoluciones)
- Protección de rutas privadas
- Registro de nuevos usuarios
- Despliegue en producción

##  Autor

Angel Samuel Roa