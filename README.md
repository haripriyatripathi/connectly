# Social Media Hub

A full-stack social media application with a React frontend and Supabase backend.

## Project Structure

```text
orbit-social-hub-45/
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
└── README.md
```

## Technologies Used

### Frontend

* React
* TypeScript
* Vite
* TanStack Router
* Tailwind CSS
* Fontsource

### Backend

* Supabase
* PostgreSQL
* SQL Migrations

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd orbit-social-hub-45
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The development server will start at:

```
http://localhost:5173
```

## Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Run Supabase locally (if using the Supabase CLI):

```bash
supabase start
```

Apply database migrations:

```bash
supabase db reset
```

## Environment Variables

Create a `.env` file inside the `frontend` directory and add your project credentials.

Example:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Features

* User Authentication
* User Profiles
* Social Feed
* Posts
* Likes
* Comments
* Responsive UI

## Folder Description

### frontend/

Contains the React application, UI components, assets, routing, and frontend configuration.

### backend/

Contains the Supabase configuration and database migrations.

### config/

Contains project-specific configuration files.

## Build

```bash
cd frontend
npm run build
```

## Development

Start the frontend:

```bash
cd frontend
npm run dev
```

## License

This project is intended for educational and learning purposes.
