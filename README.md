# 🎬 Movie Management API

## 📝 Descripción del Proyecto

Esta API permite la creación, obtención y gestión de películas a través de diferentes endpoints. La API está documentada y puede ser explorada mediante Swagger, lo que facilita a los desarrolladores interactuar con la API, entender los esquemas de datos, los parámetros necesarios y las posibles respuestas de cada endpoint.

## 🛠️ Tecnologías Utilizadas
- **NestJS** - Framework backend.
- **AWS DynamoDB** - Base de datos NoSQL.
- **AWS Cognito** - Gestión de autenticación y autorización.
- **JSON Web Tokens (JWT)** - Mecanismo de autenticación.
- **Swagger** - Documentación de la API.
- **Docker** - Para levantar los servicios locales.

## 🚀 Funcionalidades

### 🔑 Autenticación y Autorización (AWS Cognito)
- Autenticación mediante **JWT**.
- Registro y login de usuarios.
- Autorización basada en roles: "Usuario Regular" y "Administrador".

### 👥 Gestión de Usuarios
- **User management** : Mediante endpoints de Cognito.

## 🧪 Pruebas Unitarias
Pruebas unitarias implementadas para validar el correcto funcionamiento de la lógica de negocio y los endpoints.

## 📚 Documentación

La API está documentada usando **Swagger**. Para acceder a la documentación, consulta el siguiente enlace:

`http://localhost:3000/api` (Reemplaza con la URL de tu entorno).

## 🛠️ Instalación y Configuración

### Pre-requisitos

1. **Instalar Docker Desktop**

    - Visita el sitio oficial de [Docker Desktop](https://www.docker.com/products/docker-desktop/) para descargarlo.
    - Selecciona la versión correspondiente a tu sistema operativo (Windows o macOS) y sigue las instrucciones para la instalación.
    - Una vez instalado, abre Docker Desktop y asegúrate de que Docker esté corriendo antes de seguir con los siguientes pasos.

2. **Node.js y npm**

    - Asegúrate de tener instalados Node.js y npm en tu máquina. Si no los tienes, descárgalos e instálalos desde [nodejs.org](https://nodejs.org/).

3. **Cuenta de AWS con DynamoDB y Cognito configurados.**

### Pasos

1. **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu_usuario/movie-management-api.git
    cd movie-management-api
    ```

2. **Instalar dependencias:**

    ```bash
    npm install
    ```

3. **Configurar variables de entorno:**

    El proyecto requiere dos archivos de configuración de variables de entorno para funcionar correctamente: un archivo `.env` para la configuración general del proyecto, incluyendo AWS y LocalStack, y un archivo `cognito_ids.env` para la configuración específica de Amazon Cognito.

### 1. Archivo `.env`

Este archivo contiene las configuraciones de AWS y LocalStack necesarias para la ejecución local de los servicios. Asegúrate de crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

    ```bash
    AWS_REGION=us-east-1
    AWS_ACCESS_KEY_ID=test
    AWS_SECRET_ACCESS_KEY=test
    AWS_S3_ENDPOINT=http://localhost:4566
    AWS_DYNAMODB_ENDPOINT=http://localhost:4566
    LOCALSTACK_AUTH_TOKEN="<auth token>" 
    COGNITO_USER_POOL_ID=us-east-1_myid123
    COGNITO_USER_POOL_CLIENT_ID=myclient123
    OGNITO_JWKS_URL=http://localhost:4566/us-east-1_myid123/.well-known/jwks.json
    DISABLE_CORS_CHECKS=1
    EXTRA_CORS_ALLOWED_ORIGINS=http://localhost:3000
    EXTRA_CORS_ALLOWED_HEADERS=*
    EXTRA_CORS_ALLOWED_HEADERS=x-requested-with
    ```
### 2. Archivo `.env`

    ```bash
    USER_POOL_ID=us-east-1_myid123
    USER_POOL_CLIENT_ID=myclient123

    ```

4. **Abrir Docker Desktop:**

    Antes de proceder a levantar los servicios locales, asegúrate de que **Docker Desktop** esté corriendo.

5. **Levantar los servicios locales con Docker:**

    Ejecuta el script `./setup-local-env.sh` o ejecutar el comando `make start-localstack` para iniciar los servicios de AWS necesarios (como DynamoDB y Cognito) en **LocalStack**. Este script configurará el entorno local simulado de AWS para el desarrollo.

    ```bash
    ./setup-local-env.sh
    ```

6. **Ejecutar la aplicación:**

    ```bash
    npm run start:dev
    ```

7. **Acceder a la documentación de la API:**

    Dirígete a `http://localhost:3000/api` para ver la documentación generada por Swagger.

## 🤖 Endpoints Principales

1. **GET `/api/movies`**
   - Descripción: Obtiene una lista de todas las películas.
   - Autenticación: Requiere un token JWT.
   - Respuesta esperada:
     ```json
     [
       {
         "movieId": "4",
         "title": "A New Hope",
         "created": "2014-12-10T14:23:31.880000Z"
       },
       {
         "movieId": "5",
         "title": "The Empire Strikes Back",
         "created": "2014-12-12T11:26:24.656000Z"
       }
     ]
     ```

2. **GET `/api/movies/{id}`**
   - Descripción: Recupera los detalles de una película específica por ID.
   - Autenticación: Requiere un token JWT.
   - Parámetros:
     - `id`: Identificador único de la película.
   - Respuesta esperada:
     ```json
     {
       "movieId": "12345",
       "title": "Star Wars: A New Hope",
       "releaseDate": "1977-05-25",
       "director": "George Lucas",
       "producer": "Gary Kurtz, Rick McCallum"
     }
     ```

3. **POST `/api/movies`**
   - Descripción: Crea una nueva película.
   - Autenticación: Requiere un token JWT.
   - Cuerpo de la solicitud:
     ```json
     {
       "title": "Star Wars: A New Hope",
       "releaseDate": "1977-05-25",
       "director": "George Lucas",
       "producer": "Gary Kurtz"
     }
     ```
   - Respuesta esperada:
     ```json
     {
       "movieId": "12345",
       "title": "Star Wars: A New Hope",
       "releaseDate": "1977-05-25",
       "director": "George Lucas",
       "producer": "Gary Kurtz"
     }
     ```

4. **GET `/api` (Información de bienvenida)**
   - Descripción: Devuelve un mensaje de bienvenida para confirmar que la API está activa.
   - Respuesta esperada:
     ```json
     "Bienvenido a la API de Star Wars"
     ```

## 🔐 Autenticación

La API utiliza **OAuth2 con JWT** para proteger los endpoints. Todos los endpoints de la API están protegidos con el guard `JwtAuthGuard`. Asegúrate de pasar un token JWT válido en los encabezados de las solicitudes.

### Ejemplo de autenticación en Swagger:
1. Dirígete a `http://localhost:3000/api`
2. Haz clic en "Authorize" en la interfaz Swagger.
3. Luego de nuevo en el boton "Authorize" de la parte inferior del modal.
4. Luego ingresar las credenciales de usuario de pruebas (testuser1 para admin o testuser2 para user comun) y la password Password12345!
5. Realiza solicitudes autenticadas.

## 🔍 Validación de Datos

Se utiliza **class-validator** para validar los datos enviados en las solicitudes. Por ejemplo, el DTO `CreateMovieDto` asegura que los campos obligatorios como `title` estén presentes y sean del tipo correcto.

## 🧪 Pruebas

Ejecuta las pruebas unitarias con el siguiente comando:

```bash
npm run test
# conexa-star-wars-api
