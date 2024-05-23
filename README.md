# Sistema de Gestión de Vacunación
para prueba de ejecución usar usuario dardo@gmail.com pass 2222
## Requisitos Funcionales

- Registro de vacunas adquiridas por el Ministerio de Salud.
- Seguimiento de la trazabilidad de cada dosis de vacuna por lote-proveedor.
- Distribución de vacunas a las distintas provincias y centros de vacunación.
- Registro de información detallada sobre las dosis aplicadas a las personas.
- Control de vencimiento de las vacunas y alertas para dosis vencidas no aplicadas.
- Registro de descarte de vacunas por mal estado o vencimiento.
- Gestión de reasignación de vacunas de un centro de vacunación a otro.

## Instalación
1. El repositorio desde GitHub:
    git: 


```
2. Instalar las dependencias del proyecto:
 ```bash
npm update
```  
3. El siguiente Comando crea la Base de datos
```bash
npm run db:create
```
4. Ejecutar la aplicación
```bash
npm start
```
5. La aplicación se ejecutará en el entorno local y estará disponible en http://localhost:3000.
   
## Tecnologías Utilizadas
- Frontend:

    - HTML: para páginas web.
    - CSS: para el diseño y la presentación de las páginas web.
    - JavaScript: para agregar interactividad y funcionalidad a las páginas web.
    
- Backend:

    - Node.js: Entorno de tiempo de ejecución de JavaScript para el servidor.
    - Express.js: Framework de aplicaciones web de Node.js para facilitar el enrutamiento y la gestión de solicitudes HTTP.

- Base de Datos:

    - MySQL:

- Otras herramientas:

    - Sequelize: ORM (Object-Relational Mapping) 
    - Pug: El modelo de plantillas utilizado
    - Bootstrap: Framework CSS 
    - bcryptjs: manejo de contraseñas.
    - cookie-parser: Middleware para analizar las cookies en las solicitudes HTTP.
    - dotenv: para variables de entorno desde un archivo .env.
    - express-session: Middleware de Express para la gestión de sesiones de usuario.
    - jsonwebtoken: JSON Web Tokens para la autenticación y autorización.    -
    - nodemon.


## Estructura 
    MVC:
    /controllers: Contiene el código de los controladores de los modelos.
    /database: Contiene los scripts de inicialización de la abse de datos.
    /env: Contiene el archivo de configuracion de las variables de entorno
    /middlewares: Contiene middleware de autentificacion
    /models: Contiene los modelos de la base de datos
    /public: Contiene todos los archivos publicos de imagenes, estilo y scrips de front end
    /views: Contiene las vistas pug
