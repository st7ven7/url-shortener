# URL Shortener

A production-ready URL shortening backend built with NestJS and TypeScript. Supports user authentication with access and refresh tokens, per-user short URL ownership, click tracking, and rate-limited API endpoints.

## Live API

**Base URL:** https://api-url-shortener-7tet.onrender.com

**Swagger UI:** https://api-url-shortener-7tet.onrender.com/api

> Note: The API is hosted on Render's free tier. If the service is inactive, the first request may take 30–60 seconds to wake up.

## Overview

Long URLs are hard to share. This backend service lets authenticated users shorten any URL into a compact code, share it, and track how many times it gets clicked — all through a clean REST API.

## Architecture

```
Client (Postman / Browser)
        │
        ▼
Global Exception Filter
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
                               Neon PostgreSQL (cloud)
```

## Key Features

- **URL shortening** — generate a unique short code for any long URL
- **Redirect** — visiting a short code redirects to the original URL instantly
- **Click analytics** — every visit is recorded with timestamp and IP address
- **JWT authentication** — access token (15m) + refresh token (7d) system
- **Token rotation** — refresh tokens are rotated on every use
- **Real logout** — refresh token wiped from database on logout
- **Per-user ownership** — users can only manage their own short URLs
- **Rate limiting** — prevents abuse on URL creation endpoints
- **Global error handling** — consistent error response format across all endpoints
- **Env validation** — all environment variables validated at startup via Joi

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS (TypeScript) |
| Database | PostgreSQL (Neon) |
| ORM | TypeORM |
| Authentication | JWT (Access + Refresh Tokens) |
| Validation | class-validator + Joi |
| API Docs | Swagger (OpenAPI) |
| Rate Limiting | @nestjs/throttler |
| Hosting | Render |
| Package Manager | pnpm |

## Modules

| Module | Responsibility |
|---|---|
| `auth` | Register, login, refresh, logout — full JWT token lifecycle |
| `users` | User entity, user lookup, refresh token storage |
| `urls` | Create short URLs, redirect, list, delete |
| `analytics` | Record click events, serve click stats per short URL |

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create a new account |
| POST | `/auth/login` | — | Login and receive access + refresh tokens |
| POST | `/auth/refresh` | Refresh Token | Get a new access token |
| POST | `/auth/logout` | JWT | Invalidate the refresh token |

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

## API Documentation

Swagger UI is available at:
```
https://api-url-shortener-7tet.onrender.com/api
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL or a Neon account
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
# Edit .env with your database credentials and JWT secrets

# Start in development mode
pnpm start:dev
```

### Environment Variables
```env
PORT=3000
NODE_ENV=development

DATABASE_URL=your_neon_or_postgres_connection_string

JWT_SECRET=your_access_token_secret
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRES_IN=7d

BASE_URL=http://localhost:3000
```

## Project Status

✅ Complete and deployed.

- [x] Project setup and database connection
- [x] Users module and JWT authentication
- [x] URLs module — create, redirect, list, delete
- [x] Swagger API documentation
- [x] Analytics module — click event recording and stats
- [x] Rate limiting and request validation
- [x] Access token + refresh token system with token rotation
- [x] Global error handling — consistent error responses
- [x] Deployed on Render with Neon PostgreSQL