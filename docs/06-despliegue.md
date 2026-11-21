# Despliegue

## Dónde está desplegado

| Componente | Plataforma | URL | Rama |
|---|---|---|
| Frontend | **[Vercel](https://fe-boilerplate-is-2026-seven.vercel.app)** | main |
| Backend | [**Render**](https://be-boilerplate-is-2026.onrender.com/) (Swagger en `/api/docs`)| main |
| Base de datos |**Render (privada)** | main |

El sistema debe seguir en línea, con los mismos usuarios, al menos hasta el martes 24 de noviembre. En los planes gratuitos el backend se apaga tras un rato sin uso y la primera petición tarda en responder: abran el sistema unos minutos antes de cualquier revisión.

## Cómo se publica una nueva versión

1. Cuando las historias están integradas en `develop`, se crea la rama `release/<versión>` desde `develop` (por ejemplo `release/1.0.0`). En ella solo se hacen ajustes finales, como la versión del proyecto.
2. Se abre un PR de `release/<versión>` hacia `main`, aprobado por otro integrante, y se fusiona. La misma rama se fusiona de regreso a `develop` para que ambas queden iguales.
3. Sobre el commit de `main` se crea la etiqueta `v<versión>` (en GitHub, desde Releases, con la lista de historias incluidas). Los dos repositorios llevan su propia release.
4. **[COMPLETAR: qué ocurre en cada plataforma al fusionar a `main`: despliegue automático o pasos manuales.]**
5. Backend: al arrancar, el contenedor aplica las migraciones pendientes (`prisma migrate deploy`). **[COMPLETAR: cómo se cargan los datos semilla en el ambiente desplegado, por ejemplo `npx prisma db seed` desde la consola de la plataforma o desde la máquina local contra la base de producción.]**
6. Un defecto en producción se corrige con una rama `hotfix/<descripcion>` desde `main`, que se fusiona a `main` y a `develop`, y la versión sube a `v1.0.1`.

Ambos proyectos incluyen un `Dockerfile` (multi-stage sobre `node:24-alpine`). El del frontend usa la salida `standalone` de Next.js.

## Variables de entorno en producción

Solo los nombres, nunca los valores.

### Backend

| Variable |
|---- |
| `DATABASE_URL` |
| `JWT_SECRET` |
| `JWT_EXPIRES_IN` |
| `REFRESH_TOKEN_EXPIRES_IN_DAYS` |
| `BCRYPT_SALT_ROUNDS` |
| `NODE_ENV` |
| `APP_TIMEZONE` |
| `TRUST_PROXY_HOPS` (1 si la plataforma es Render) |
| `CORS_ORIGINS` (URL del frontend desplegado) |
| `SEED_DEMO_PASSWORD` (solo para cargar los datos semilla) |

### Frontend

| Variable |
|---|---|
| `API_URL` (URL del backend desplegado, con `/api/v1`) |
| `NEXT_PUBLIC_BACKEND_URL` (se incrusta al compilar: definirla antes del build) |
| `NEXT_PUBLIC_CONDOMINIO` (se incrusta al compilar) |
| `NEXT_PUBLIC_MONEDA` (se incrusta al compilar) |
| `COOKIE_SECURE` (solo si el sitio se sirve sin HTTPS) |
