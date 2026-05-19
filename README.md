# URL Shortener

A production-ready URL shortening backend built with NestJS and TypeScript. Supports user authentication, per-user short URL ownership, click tracking, and rate-limited API endpoints.

## Overview

Long URLs are hard to share. This backend service lets authenticated users shorten any URL into a compact code, share it, and track how many times it gets clicked — all through a clean REST API.

## Architecture

```
Client (Postman / Browser)
        │
        ▼
JWT Auth Guard → Rate Limiter → URLs Controller
                                      │
                          ┌───────────┴───────────┐
                          ▼                       ▼
                     URLs Service         Analytics Service
                          │                       │
                          └───────────┬───────────┘
                                      ▼
                               PostgreSQL Database
```

## Key Features

- **URL shortening** — generate a unique short code for any long URL
- **Redirect** — visiting a short code redirects to the original URL instantly
- **Click analytics** — every visit is recorded and counted
- **User authentication** — register and login with JWT
- **Per-user ownership** — users can only manage their own short URLs
- **Rate limiting** — prevents abuse on URL creation endpoints

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| Database | PostgreSQL |
| ORM | TypeORM |
| Authentication | JWT |
| Rate Limiting | @nestjs/throttler |

## Modules

| Module | Responsibility |
|---|---|
| `auth` | Register, login, issue and validate JWT tokens |
| `users` | User entity and user lookup |
| `urls` | Create short URLs, redirect, list user's URLs |
| `analytics` | Record clicks, serve click stats per short URL |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login and receive a JWT |

### URL Management
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/urls` | JWT | Create a new short URL |
| GET | `/urls` | JWT | List all URLs owned by the current user |
| DELETE | `/urls/:code` | JWT | Delete a short URL |

### Redirect
| Method | Endpoint | Description |
|---|---|---|
| GET | `/:code` | Redirect to the original URL |

### Analytics
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/urls/:code/stats` | JWT | Get click stats for a short URL |

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/url-shortener.git
cd url-shortener

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Start in development mode
pnpm start:dev
```

### Environment Variables
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=url_shortener

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## Project Status

🚧 Active development — building phase by phase.

- [x] Project setup and database connection
- [x] Users module and JWT authentication
- [ ] URLs module — create, redirect, list
- [ ] Analytics module — click tracking and stats
- [ ] Rate limiting and validation
- [ ] Global error handling and polish