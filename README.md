# 🧩 Proyecto Full Stack Kruger: Spring Boot + Next.js

Este proyecto está compuesto por dos partes principales:

- 📦 **Backend**: API REST desarrollada con Spring Boot 3.2.2, Java 17, usando Spring Tool Suite (STS) y una base de datos postgres.
- 🧑‍💻 **Frontend**: Interfaz web desarrollada con Next.js, Tailwind CSS y [shadcn/ui](https://ui.shadcn.com/), que consume la API del backend.

---

## 📁 Estructura del proyecto

```bash
.
├── backend/        # API Spring Boot
├── frontend/       # Aplicación Next.js
├── db/             # Script de inicio de DB
└── docker-compose.yml
````

---

## 🚀 Iniciar el proyecto en modo desarrollo

### ▶️ Backend

Requisitos:

* Java 17
* Spring Tool Suite (STS) o cualquier IDE compatible
* Maven

Pasos:

1. Navega a la carpeta `backend`.
2. Ejecuta el proyecto con STS o por terminal:


Por defecto la API estará disponible en: `http://localhost:9080`

---

### ▶️ Frontend

Requisitos:

* Node.js 20.18.1
* npm

Pasos:

1. Navega a la carpeta `frontend`.
2. Instala las dependencias:

```bash
npm install
```

3. Arranca el servidor en modo desarrollo:

```bash
npm run dev
```

La app estará disponible en: `http://localhost:3000`

---

## 📄 Variables de entorno (`.env`)

Crea un archivo `.env` en la carpeta `frontend/` con las siguientes variables:

| Variable               | Valor por defecto       | Descripción                                  |
| ---------------------- | ----------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:9080/kruger` | URL base del backend para consumir la API    |
| `NEXT_PUBLIC_LOGIN` | `auth/login`          | ruta de auth |
| `NEXT_PUBLIC_PROJECTS` | `kdevfull/projects`          | ruta de projects |
| `NEXT_PUBLIC_USERS` | `kdevfull/users`          | ruta de usuarios |
| `NEXT_PUBLIC_TASKS` | `kdevfull/tasks`          | ruta de tareas |
| `PORT`                 | `3100`                  | Puerto donde corre el frontend localmente    |
| `NODE_ENV`                 | `production`                  |     |
| `HOSTNAME`                 | `0.0.0.0`                  |     |


---

## 🐳 Levantar con Docker Compose

Puedes levantar tanto el backend como el frontend con el siguiente comando:

```bash
docker-compose up -d
```

Esto ejecutará ambos servicios en segundo plano. Verifica los puertos expuestos en el `docker-compose.yml`.

---

## 📘 Requerimientos Técnicos

Consulta los requerimientos técnicos completos en el archivo [📄 EVALUATION2.md](./REQUERIMIENTOS_TECNICOS.md)

---

## 🛠 Tecnologías utilizadas

| Sección  | Tecnología                       |
| -------- | -------------------------------- |
| Backend  | Spring Boot 3.2.2, Java 17, STS  |
| Frontend | Next.js, Tailwind CSS, shadcn/ui |
| Otros    | Docker, Docker Compose           |

---

## 🤝 Colaboradores

* \[Jonathan Quintana] - Desarrollador principal