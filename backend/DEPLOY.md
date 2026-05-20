# Guía de Despliegue del Backend en Render

Esta guía describe los pasos necesarios para desplegar la aplicación backend (Spring Boot) en la plataforma **Render** utilizando la configuración de **Docker** creada.

---

## 🚀 Pasos para el Despliegue

### 1. Preparar el Repositorio en GitHub
Asegúrate de que los cambios más recientes estén subidos a tu repositorio de GitHub (incluyendo el `backend/Dockerfile` y las modificaciones en `application.properties` y `CorsConfig.java`).

### 2. Crear un nuevo servicio en Render
1. Inicia sesión en [Render](https://render.com/).
2. Haz clic en el botón **New +** y selecciona **Web Service**.
3. Conecta tu cuenta de GitHub y selecciona el repositorio de tu proyecto (`erp-sunat-frontend` o el nombre correspondiente).

### 3. Configurar el Web Service
En la pantalla de configuración del servicio, establece los siguientes valores:
- **Name**: `erp-sunat-backend` (o el nombre que prefieras).
- **Region**: Selecciona la más cercana a tus usuarios (ej. `Ohio (us-east-2)` o `Oregon (us-west-2)`).
- **Branch**: `main` (o tu rama por defecto).
- **Root Directory**: `backend` *(¡Muy importante! Indica a Render que trabaje dentro de la carpeta del backend)*.
- **Runtime**: **Docker**.
- **Instance Type**: **Free** o **Starter** (según tus necesidades).

> [!NOTE]
> Al configurar el **Root Directory** como `backend`, Render buscará el `Dockerfile` directamente dentro de esa carpeta de forma automática.

---

## ⚙️ Variables de Entorno (Environment Variables)

Para que el backend funcione correctamente y se conecte a la base de datos Supabase y acepte peticiones de tu frontend, debes configurar las siguientes variables de entorno en Render (**Environment** -> **Add Environment Variable**):

| Variable | Descripción | Valor de Ejemplo |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | URL de conexión JDBC a Supabase PostgreSQL | `jdbc:postgresql://aws-0-us-east-1.pooler.supabase.com:5432/postgres` |
| `SPRING_DATASOURCE_USERNAME` | Usuario de la base de datos Supabase | `postgres.tu_id_proyecto` |
| `SPRING_DATASOURCE_PASSWORD` | Contraseña del usuario de la base de datos | `tu_contraseña_secreta` |
| `CORS_ALLOWED_ORIGINS` | URLs de los frontends permitidos (separadas por comas) | `https://tu-proyecto-frontend.vercel.app` |

> [!WARNING]
> Asegúrate de que la URL de `SPRING_DATASOURCE_URL` tenga el prefijo `jdbc:postgresql://` y no el formato estándar de conexión directa de postgres `postgresql://`, ya que Spring Boot requiere el driver JDBC específico.

---

## 🖥️ Configuración del Frontend

Una vez que tu Web Service en Render esté activo, Render te proporcionará una URL pública (ejemplo: `https://erp-sunat-backend.onrender.com`). 

Debes configurar esta URL en el entorno del frontend:
1. En tu hosting del frontend (ejemplo: Vercel, Netlify o la misma plataforma Render), añade la siguiente variable de entorno:
   - `NEXT_PUBLIC_API_URL` = `https://erp-sunat-backend.onrender.com`
2. Si corres el frontend de forma local pero quieres consumir el backend de producción:
   - Crea o edita el archivo `.env.local` en la raíz del frontend.
   - Añade: `NEXT_PUBLIC_API_URL=https://erp-sunat-backend.onrender.com`

---

## 🔍 Verificación del Estado
Para comprobar que el servicio está funcionando correctamente una vez desplegado, puedes abrir la URL del backend en tu navegador o mediante una herramienta como Postman añadiendo `/api/health` o algún endpoint de login:
```
https://tu-app-backend.onrender.com/api/login/usuarios/auth (debería retornar un error de método no permitido POST en lugar de un error 404 o de conexión)
```
