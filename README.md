# Proyecto 1
## Seminario de Sistemas 1
## Grupo 21

### Integrantes
|Nombre|Carné|
|--|--|
|Erick Fernando Reyes Mancilla|200915347|
|Edgar Arnoldo Aldana Arriola|201602797|


## Herramientas utilizadas
### API Server
* ``Node.js``: es un entorno de ejecución de JavaScript orientado a eventos asíncronos.
* ``Express``: infraestructura web rápida, minimalista y flexible para Node.js.
* ``Morgan``: permite crear un middleware para registrar peticiones HTTP en Node.js.
* ``Cors``: permite crear un middleware para configurar CORS para Node.js.
* ``Aws-sdk``: el SDK oficial de AWS para javascript, disponible para navegadores y dispositivos móviles, o backends de Node.js.

### API Serverless
* ``S3``: es un servicio de almacenamiento de objetos que ofrece escalabilidad, disponibilidad de datos, seguridad y rendimiento.
* ``Lambda``: permite ejecutar código sin aprovisionar ni administrar servidores.
* ``API Gateway``: es un servicio completamente administrado que facilita las tareas que realizan los desarrolladores para la creación, la publicación, el mantenimiento, la monitorización y la protección de las API a cualquier escala.
* ``DinamoDB``: es un servicio de base de datos NoSQL rápido y flexible para todas las aplicaciones en las que se requieren latencias de milisegundos de un solo dígito uniformes a cualquier escala.
* ``Rekognition``: puede identificar objetos, personas, texto, escenas y actividades en imágenes y videos, además de detectar cualquier contenido inapropiado.


## Usuarios IAM
* **administrador_200915347**: usuario con permisos de administrador, cuenta con acceso a la consola de AWS para la creación de servicios.
* **administrador_201602797**: usuario con permisos de administrador, cuenta con acceso a la consola de AWS para la creación de servicios.
* **semi1-dinamodb**: usuario con permisos para manejo de ``DynamoDB``, cuenta con acceso mediante programación para el manejo del sdk de AWS.
* **semi1-rekognition**: usuario con permisos para manejo de ``Rekognition``, cuenta con acceso mediante programación para el manejo del sdk de AWS.
* **semi1-s3**: usuario con permisos para manejo de ``Amazon S3``, cuenta con acceso mediante programación para el manejo del sdk de AWS.

## Security Groups
### Instancia EC2
|Tipo|Protocolo|Puerto|IP Origen|
|--|--|--|--|
|HTTP|TCP|80|0.0.0.0/0::/0|
|SSH|TCP|22|Mi IP|

### Load Balancer
|Tipo|Protocolo|Puerto|IP Origen|
|--|--|--|--|
|HTTP|TCP|80|0.0.0.0/0::/0|
