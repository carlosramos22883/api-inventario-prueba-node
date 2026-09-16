# API RESTful de Inventario - Prueba Técnica

API backend modular y profesional desarrollada con Node.js, Express y Sequelize, diseñada para la gestión de inventarios, control de acceso basado en roles (RBAC), transacciones seguras y generación automatizada de reportes.

---

## Tecnologías y Herramientas
* **Runtime:** Node.js & Express
* **Base de Datos / ORM:** MySQL & Sequelize
* **Seguridad:** JWT (JSON Web Tokens) & bcrypt
* **Reportes:** ExcelJS (Excel) & PDFKit (PDF)
* **Documentación:** Swagger UI (`/api-docs`)

---

## Usuario Administrador por Defecto
El sistema cuenta con un seeder automático que crea un usuario administrador inicial al sincronizar la base de datos:
* **Email:** `carlos@test.com`
* **Contraseña:** `Carlos123!`
* **Rol:** `admin`

---

## Pasos para Ejecutar el Proyecto Localmente

Sigue estos pasos si necesitas levantar el proyecto en una computadora nueva:

### 1. Clonar el repositorio
```bash
mkdir api-inventario-prueba-node
cd api-inventario-prueba-node
git clone git@github.com:carlosramos22883/api-inventario-prueba-node.git
```

### 2. Instalar las dependencias
```bash
npm install
```

### 3. Configurar las variables de entorno
Crea un archivo .env en la raíz del proyecto basándote en la siguiente estructura:
```bash
DB_HOST=localhost
DB_USER=prueba_tecnica
DB_PASSWORD=prueba_tecnica
DB_NAME=prueba_tecnica
PORT=3000
JWT_SECRET=tu_secreto_super_secreto
```

### 4. Crear la base de datos en MySQL
Asegúrate de tener un servidor MySQL corriendo y crea la base de datos con el nombre que definiste en tu .env (prueba_tecnica).

### 5. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```

(El servidor utilizará sequelize.sync({ alter: true }) para estructurar las tablas automáticamente y ejecutar los seeders de usuarios y categorías por defecto).

## Documentación Interactiva (Swagger)
Una vez que el servidor esté corriendo, puedes explorar y probar todos los endpoints directamente desde la interfaz gráfica de Swagger en tu navegador:
```bash
http://localhost:3000/api-docs
```