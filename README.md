# connectly

a full-stack social media application with a react frontend and supabase backend.

## project structure

```text
connectly/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── backend/
│   └── supabase/
│       ├── migrations/
│       └── config.toml
│
├── config/
│   └── project.json
│
└── readme.md
```

## technologies

### frontend

* react
* typescript
* vite
* tanstack router
* tailwind css
* fontsource

### backend

* supabase
* postgresql
* sql migrations

## installation

### clone the repository

```bash
git clone <repository-url>
cd connectly
```

### frontend setup

```bash
cd frontend
npm install
npm run dev
```

the development server will start at:

```text
http://localhost:5173
```

## backend setup

navigate to the backend directory:

```bash
cd backend
```

run supabase locally (if using the supabase cli):

```bash
supabase start
```

apply database migrations:

```bash
supabase db reset
```

## environment variables

create a `.env` file inside the `frontend` directory and add your project credentials.

example:

```env
vite_supabase_url=your_supabase_url
vite_supabase_anon_key=your_supabase_anon_key
```

## features

* user authentication
* user profiles
* social feed
* posts
* likes
* comments
* responsive ui

## folder description

### frontend

contains the react application, ui components, assets, routing, and frontend configuration.

### backend

contains the supabase configuration and database migrations.

### config

contains project-specific configuration files.

## build

```bash
cd frontend
npm run build
```

## development

start the frontend:

```bash
cd frontend
npm run dev
```

## license

this project is intended for educational and learning purposes.
