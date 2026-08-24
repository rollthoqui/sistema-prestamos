# PrestaFácil — Sistema de Préstamos

Aplicación web para gestionar préstamos: catálogo de productos financieros, solicitud de préstamos, seguimiento de cuotas e intereses, y panel de administración con historial y facturación. Proyecto universitario desarrollado con React y Firebase.

🔗 **Sitio en producción:** https://sistema-prestamos-6c2d5.web.app

## 📋 Descripción

El sistema permite:

**Para usuarios:**
- Registrarse e iniciar sesión
- Explorar un catálogo de productos financieros organizados por categorías (monto, plazo, interés)
- Solicitar un préstamo con datos personales
- Ver su perfil: historial de préstamos activos, formas de pago, y adelantar cuotas (con límites según meses e interés restante)
- Cerrar sesión

**Para administradores:**
- Ver todos los préstamos activos (monto, responsable, fecha, cuotas, próxima cuota, cuánto se ha pagado y cuánto falta con interés incluido)
- Ver el historial de préstamos ya completados
- Acceder a una factura detallada por cada préstamo finalizado (datos del cliente, montos y cada pago realizado con fecha y método)

## 🛠️ Tecnologías y herramientas utilizadas

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
| Base de datos | Firebase Firestore |
| Hosting / despliegue | Firebase Hosting |
| Control de versiones | Git + GitHub |

## 📁 Estructura del proyecto

```
sistema-prestamos/
├── src/
│   ├── components/
│   │   ├── LoginModal.jsx        # Modal de inicio de sesión (Firebase Auth)
│   │   ├── HeaderSimple.jsx      # Encabezado reducido (logo + ícono de perfil) para páginas internas
│   │   └── RutaProtegida.jsx     # Protege rutas según sesión y/o rol
│   ├── context/
│   │   ├── AuthContextObject.js  # Objeto de contexto de autenticación
│   │   ├── AuthContext.jsx       # Proveedor: usuario, rol y estado de carga globales
│   │   └── useAuth.js            # Hook para consumir el contexto de autenticación
│   ├── pages/
│   │   ├── Home.jsx              # Página principal (carrusel, secciones, contacto)
│   │   ├── Registro.jsx          # Registro de nuevos usuarios
│   │   ├── Productos.jsx         # Catálogo de productos financieros por categoría
│   │   ├── RegistroCompra.jsx    # Formulario de solicitud de préstamo
│   │   ├── Perfil.jsx            # Perfil del usuario: historial, pagos, adelanto de cuotas
│   │   ├── AdminDashboard.jsx    # Panel admin: pestañas de préstamos activos e historial
│   │   └── Factura.jsx           # Detalle de factura por préstamo (solo admin)
│   ├── App.jsx                   # Configuración de rutas (incluye rutas protegidas)
│   ├── main.jsx                  # Punto de entrada de la aplicación
│   ├── firebase.js               # Configuración e inicialización de Firebase
│   └── index.css                 # Estilos globales (Tailwind + fondo tipo malla)
├── public/
│   └── assets/                   # Imágenes del sitio (home, productos)
├── .env                          # Credenciales de Firebase (no incluido en el repositorio)
├── firebase.json                 # Configuración de Firebase Hosting
├── index.html
├── package.json
└── vite.config.js
```

## ⚙️ Cómo funciona el código

### Enrutamiento (`App.jsx`)
La aplicación es una **SPA** (Single Page Application): `react-router-dom` cambia el contenido visible según la URL sin recargar el navegador. Rutas principales:

| Ruta | Página | Protección |
|---|---|---|
| `/` | Home | Pública |
| `/registro` | Registro de usuario | Pública |
| `/productos` | Catálogo | Requiere sesión |
| `/registro-compra` | Solicitud de préstamo | Requiere sesión |
| `/perfil` | Perfil del usuario | Requiere sesión |
| `/admin` | Panel de administrador | Requiere sesión + rol `admin` |
| `/admin/factura/:id` | Factura de un préstamo | Requiere sesión + rol `admin` |

### Autenticación y roles (`AuthContext`, `firebase.js`)
`AuthContext` escucha el estado de sesión de Firebase (`onAuthStateChanged`) y consulta el rol del usuario (`usuario` / `admin`) guardado en Firestore, exponiendo `usuario`, `rol`, `nombreUsuario` y `cargando` a toda la aplicación mediante el hook `useAuth()`. `RutaProtegida` usa este contexto para redirigir a `/` si no hay sesión, o a `/productos` si el rol no coincide con el requerido por la ruta.

La sesión se mantiene activa entre recargas gracias a `browserLocalPersistence` de Firebase Authentication.

### Base de datos (Firestore)
Tres colecciones principales:

- **`usuarios`** — un documento por usuario (ID = UID de Authentication), con `nombreUsuario`, `correo` y `rol`
- **`prestamos`** — cada préstamo solicitado: datos del cliente, monto, plazo, interés, cuotas adelantadas, y estado (`devuelto: true/false`). Se marca automáticamente como completado cuando el usuario termina de pagar todas sus cuotas
- **`pagos`** — cada adelanto de cuota individual, vinculado a un préstamo (`prestamoId`), con monto, cantidad de cuotas, fecha y método de pago — es la base de la factura

### Página principal (`Home.jsx`)
Encabezado con navegación por anclas y scroll suave (implementado en JavaScript), carrusel de contenido rotativo, secciones informativas (¿Por qué?, Visión, Misión, Acerca de), categorías de servicios, formulario de contacto, y menú responsive con hamburguesa en móvil.

### Catálogo y solicitud (`Productos.jsx`, `RegistroCompra.jsx`)
Los productos están organizados en grupos ("Lo más pedido", "Los más accesibles", "Nuestros paquetes gordos", "Los velocistas") en una cuadrícula que se reorganiza automáticamente. Al seleccionar uno, el usuario completa sus datos y el préstamo se guarda en Firestore.

### Perfil y adelanto de cuotas (`Perfil.jsx`)
Muestra el historial de préstamos activos del usuario, calcula la cuota mensual y el monto restante (incluyendo interés), y permite adelantar cuotas con dos límites: no se puede adelantar más cuotas que meses restantes, ni pagar más del monto proporcional a esas cuotas. Cada adelanto se registra individualmente en `pagos` y actualiza el acumulado del préstamo.

### Panel de administrador (`AdminDashboard.jsx`, `Factura.jsx`)
Dos pestañas: **Préstamos Activos** (con lo pagado y lo que falta, interés incluido) e **Historial** (préstamos ya completados). Cada registro del historial enlaza a una factura con el detalle completo del cliente y cada pago realizado.

## 🚀 Cómo ejecutar el proyecto en local

### Requisitos previos
- [Node.js](https://nodejs.org) instalado (versión LTS recomendada)
- Un proyecto de Firebase con **Authentication** (método Correo/Contraseña) y **Firestore** habilitados

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

Crea un archivo `.env` en la raíz del proyecto:
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
Abre `http://localhost:5173`.

### Otros comandos útiles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga en vivo |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión ya compilada |
| `firebase deploy` | Publica la última compilación en Firebase Hosting |

## ☁️ Despliegue

El sitio se despliega con **Firebase Hosting**, dentro del mismo proyecto de Firebase usado para Authentication y Firestore:
```bash
npm run build
firebase deploy
```

## 🔐 Configuración de roles

Para asignar el rol de administrador a un usuario: en Firestore, colección `usuarios`, crear un documento cuyo ID sea el **UID** de ese usuario (visible en Authentication → Users), con el campo `rol` = `admin`. Cualquier usuario sin documento correspondiente se trata como `usuario` por defecto.

## 📌 Estado actual del proyecto

**Implementado:**
- Registro e inicio de sesión con Firebase Authentication, con persistencia de sesión
- Sistema de roles (usuario / administrador)
- Rutas protegidas según sesión y rol
- Catálogo de productos financieros
- Solicitud de préstamos conectada a Firestore
- Perfil con historial, formas de pago y adelanto de cuotas (con interés y límites)
- Finalización automática de préstamos al completarse el pago
- Panel de administrador con pestañas, resumen de pagos y facturación
- Menú responsive (hamburguesa en móvil)
- Despliegue en producción (Firebase Hosting)

**Pendiente / mejoras futuras:**
- Imágenes reales en todos los productos del catálogo
- Subida de foto de perfil (requeriría Firebase Storage)
- Notificaciones o recordatorios de próxima cuota

## 👤 Autor

Angel Samuel Roa