# Alitas-Bonnibel

Se conserva NestJS/Prisma/PostgreSQL y la autenticación existente. El formulario público de contacto ahora indica que es una simulación y muestra un resultado local. El carrito público conserva la creación real de pedidos mediante la API y evita confirmaciones duplicadas; el resultado se registra únicamente después de una respuesta correcta. Las rutas administrativas están traducidas, pero no se instrumentan en la analítica pública. Se reemplazaron tipos any por contratos de pedidos/menú y errores unknown, sin cambiar los contratos del servidor.

La aplicación está en [alitas-bonnibel-frontend/README.md](alitas-bonnibel-frontend/README.md). Consulta [la analítica SQLite](analytics/README.md) para su ejecución y despliegue.
