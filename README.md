# CineBook — Movie Ticket Booking Platform

A production-ready full-stack movie ticket booking application built with **React.js** and **Django REST Framework**.

## Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | React 18, Vite, React Router, Axios             |
| Backend    | Django 4.2, Django REST Framework, SimpleJWT     |
| Database   | PostgreSQL                                       |
| Auth       | JWT (access + refresh tokens with auto-rotation) |
| Styling    | Custom CSS (dark theme, responsive)              |

## Project Structure

```
ecommerce-web/
├── backend/
│   ├── config/              # Django project settings, URLs, WSGI/ASGI
│   ├── apps/
│   │   ├── accounts/        # Custom user model, registration, JWT auth
│   │   ├── movies/          # Movies & genres CRUD
│   │   ├── theaters/        # Theaters, screens, seats, showtimes
│   │   └── bookings/        # Booking creation, cancellation, history
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios instance + API service modules
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context (AuthContext)
│   │   ├── hooks/           # Custom hooks (useFetch)
│   │   ├── pages/           # Route-level page components
│   │   ├── utils/           # Helper functions
│   │   └── styles/          # Global CSS
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

## Features

- **User Authentication** — Register, login, JWT access/refresh with automatic token renewal
- **Movie Browsing** — List, search, filter by genre, view details
- **Showtime Selection** — Browse available showtimes per movie with pricing
- **Interactive Seat Map** — Visual seat selection with Regular/Premium/VIP tiers
- **Booking Management** — Create bookings, view history, cancel confirmed bookings
- **User Profile** — Update personal info, change password
- **Admin Panel** — Full Django admin for managing movies, theaters, showtimes
- **Responsive Design** — Mobile-first dark-themed UI

## API Endpoints

### Authentication (`/api/auth/`)
| Method | Endpoint             | Description                |
| ------ | -------------------- | -------------------------- |
| POST   | `/token/`            | Obtain JWT token pair      |
| POST   | `/token/refresh/`    | Refresh access token       |
| POST   | `/register/`         | Register new user          |
| GET    | `/profile/`          | Get current user profile   |
| PATCH  | `/profile/`          | Update profile             |
| POST   | `/change-password/`  | Change password            |

### Movies (`/api/movies/`)
| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| GET    | `/`               | List movies (paginated)  |
| GET    | `/{slug}/`        | Movie detail             |
| GET    | `/genres/`        | List all genres          |

### Theaters (`/api/theaters/`)
| Method | Endpoint                      | Description               |
| ------ | ----------------------------- | ------------------------- |
| GET    | `/venues/`                    | List theaters             |
| GET    | `/venues/{slug}/`             | Theater detail + screens  |
| GET    | `/showtimes/`                 | List upcoming showtimes   |
| GET    | `/showtimes/{id}/seats/`      | Seat map with availability|

### Bookings (`/api/bookings/`)
| Method | Endpoint            | Description             |
| ------ | ------------------- | ----------------------- |
| GET    | `/`                 | User's bookings         |
| POST   | `/`                 | Create a booking        |
| GET    | `/{id}/`            | Booking detail          |
| POST   | `/{id}/cancel/`     | Cancel a booking        |

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and secret key

# Create the database
createdb movie_booking

# Run migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

The frontend runs at `http://localhost:5173` and proxies API requests to `http://localhost:8000`.

### Admin Panel

Access the Django admin at `http://localhost:8000/admin/` to manage movies, theaters, screens, seats, and showtimes.

## Environment Variables

### Backend (`.env`)
| Variable                 | Description                      | Default                        |
| ------------------------ | -------------------------------- | ------------------------------ |
| `SECRET_KEY`             | Django secret key                | (insecure default)             |
| `DEBUG`                  | Debug mode                       | `False`                        |
| `ALLOWED_HOSTS`          | Comma-separated hosts            | `localhost,127.0.0.1`          |
| `DATABASE_URL`           | PostgreSQL connection string     | `postgres://...`               |
| `CORS_ALLOWED_ORIGINS`   | Allowed frontend origins         | `http://localhost:5173`        |
| `ACCESS_TOKEN_LIFETIME`  | JWT access token lifetime (min)  | `30`                           |
| `REFRESH_TOKEN_LIFETIME` | JWT refresh token lifetime (min) | `1440`                         |

### Frontend (`.env`)
| Variable             | Description     | Default                       |
| -------------------- | --------------- | ----------------------------- |
| `VITE_API_BASE_URL`  | Backend API URL | `http://localhost:8000/api`   |

## License

MIT
