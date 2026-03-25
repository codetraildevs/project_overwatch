# 🛡️ Project Overwatch – MVP Backend

**GDG Hackathon Project: AI-Agent Cyber Exposure & Intelligence Platform**

> Zero-Trust pipeline ensures no raw IP address ever reaches the frontend or AI payloads.

---

## Context & Architecture

Project Overwatch is an early-warning system for FinTech threats like smishing and malicious links affecting Mobile Money (MoMo) users in Rwanda.

The system is designed with two layers:
1. **Enterprise SOC Dashboard** (Current MVP) - National threat map and alerts.
2. **Public AI WhatsApp link scanner** (Future Extension) - Citizen-facing exposure checking.

**Zero-Trust Mandate**: The backend acts as the core radar engine. It mocks intelligence ingestion from sources like LeakIX and urlscan.io, masking all raw IPv4 addresses (e.g., `197.243.10.45` → `197.243.10.XXX`) before they ever touch the frontend or the Gemini AI prompt builders.

---

## Overview

Project Overwatch is an enterprise-grade platform focused on securing Rwanda's FinTech ecosystem through AI-Agent Intelligence. This MVP backend provides:

- **Mocked admin authentication** (no real auth yet)
- **Dashboard counters** and **Rwanda-only map data** (Kigali, Musanze, Rubavu)
- **Vulnerability management** with in-memory storage
- **AI remediation** returning exactly 3 steps in English or Kinyarwanda
- **Zero-Trust IP masking** — the last octet of every IPv4 address is replaced with `XXX`

---

## Project Structure

```
project_overwatch/
├── openapi.yaml                    # OpenAPI 3.0.3 specification
├── package.json
├── .env.example                    # Environment variable template
├── .gitignore
├── README.md
└── src/
    ├── server.js                   # Entry point
    ├── app.js                      # Express app setup + Swagger UI
    ├── controllers/
    │   ├── auth.controller.js      # POST /api/auth/admin-login
    │   ├── dashboard.controller.js # GET  /api/dashboard/summary & map-points
    │   ├── vulnerabilities.controller.js  # GET/POST /api/vulnerabilities
    │   └── ai.controller.js        # POST /api/ai/remediation
    ├── routes/
    │   ├── auth.routes.js
    │   ├── dashboard.routes.js
    │   ├── vulnerabilities.routes.js
    │   └── ai.routes.js
    ├── middleware/
    │   ├── maskIpMiddleware.js      # Zero-Trust IP masking on all responses
    │   └── errorHandler.js         # Centralised error handler
    ├── services/
    │   └── ai.service.js           # Mocked AI service (Gemini-ready)
    ├── data/
    │   └── mockThreats.js          # Seed data for 3 Rwanda cities
    └── utils/
        ├── maskIp.js               # IP masking utility + deep masker
        └── validators.js           # Joi validation schemas
```

---

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** v9+

---

## Installation

```bash
# 1. Clone or navigate to the project
cd project_overwatch

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

---

## Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server starts on **http://localhost:5000** by default (configurable via `PORT` in `.env`).

You will see:

```
🛡️  Project Overwatch API
   Environment : development
   Port        : 5000
   API Docs    : http://localhost:5000/api-docs
   Health      : http://localhost:5000/api/health
```

---

## API Documentation (Swagger)

Once the server is running, open your browser at:

```
http://localhost:5000/api-docs
```

This serves the interactive Swagger UI generated from `openapi.yaml`.

---

## API Endpoints

| Method | Endpoint                    | Description                                |
|--------|-----------------------------|--------------------------------------------|
| GET    | `/api/health`               | Health check                               |
| POST   | `/api/auth/admin-login`     | Mock admin login (returns mock token)      |
| GET    | `/api/dashboard/summary`    | Threat counters + covered locations        |
| GET    | `/api/dashboard/map-points` | Rwanda map data (Kigali, Musanze, Rubavu)  |
| GET    | `/api/vulnerabilities`      | List all vulnerabilities (IPs masked)      |
| POST   | `/api/vulnerabilities`      | Create a new vulnerability                 |
| POST   | `/api/ai/remediation`       | Get 3 AI remediation steps (en / rw)       |

All responses follow a consistent format:

```json
// Success
{ "success": true, "data": { ... } }

// Error
{ "success": false, "message": "Error description" }
```

---

## Testing with cURL

> **Note:** On Windows PowerShell, use `Invoke-RestMethod` or install `curl.exe` via [Git Bash](https://git-scm.com/) or [scoop](https://scoop.sh/).

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Admin Login

```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "overwatch2026"}'
```

### Dashboard Summary

```bash
curl http://localhost:5000/api/dashboard/summary
```

### Map Points

```bash
curl http://localhost:5000/api/dashboard/map-points
```

### List Vulnerabilities

```bash
curl http://localhost:5000/api/vulnerabilities
```

### Create Vulnerability

```bash
curl -X POST http://localhost:5000/api/vulnerabilities \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Kigali",
    "lat": -1.9441,
    "lng": 30.0619,
    "riskScore": 75,
    "threatType": "XSS Attack",
    "ipAddress": "10.20.30.40",
    "severity": "medium"
  }'
```

### AI Remediation (English)

```bash
curl -X POST http://localhost:5000/api/ai/remediation \
  -H "Content-Type: application/json" \
  -d '{
    "vulnerability": {
      "city": "Kigali",
      "lat": -1.9441,
      "lng": 30.0619,
      "riskScore": 82,
      "threatType": "Phishing Domain",
      "ipAddress": "197.243.10.45",
      "severity": "high"
    },
    "language": "en"
  }'
```

### AI Remediation (Kinyarwanda)

```bash
curl -X POST http://localhost:5000/api/ai/remediation \
  -H "Content-Type: application/json" \
  -d '{
    "vulnerability": {
      "city": "Musanze",
      "lat": -1.4997,
      "lng": 29.6346,
      "riskScore": 78,
      "threatType": "SQL Injection Vector",
      "ipAddress": "41.186.30.77",
      "severity": "high"
    },
    "language": "rw"
  }'
```

### Validation Error Example

```bash
curl -X POST http://localhost:5000/api/vulnerabilities \
  -H "Content-Type: application/json" \
  -d '{"city": "Paris", "severity": "critical"}'
```

Expected: `400` with validation error messages.

---

## Frontend Integration Guide

The frontend team should consume this API as a standard REST JSON backend:

1. **Base URL**: `http://localhost:5000` (or the deployed URL)
2. **All responses** use `{ success, data/message }` format
3. **IP addresses** are always masked (`XXX` last octet) — no need to mask on the frontend
4. **Map data** is Rwanda-only (Kigali, Musanze, Rubavu) — do not render a global map
5. **AI remediation** always returns exactly 3 steps
6. **Languages**: only `"en"` (English) and `"rw"` (Kinyarwanda) are accepted
7. **Cities**: only `"Kigali"`, `"Musanze"`, `"Rubavu"` are accepted
8. **Auth token**: The mock token `mock-jwt-token-overwatch-2026` can be stored and sent as `Authorization: Bearer <token>` in future iterations

---

## Dependencies

| Package              | Purpose                                |
|----------------------|----------------------------------------|
| express              | Web framework                          |
| cors                 | Cross-Origin Resource Sharing          |
| helmet               | Security headers                       |
| morgan               | HTTP request logging                   |
| dotenv               | Environment variable loading           |
| joi                  | Request validation                     |
| swagger-ui-express   | Swagger UI at `/api-docs`              |
| yamljs               | YAML parsing for OpenAPI spec          |
| nodemon *(dev)*      | Auto-restart on file changes           |

---

## MVP Scope & Constraints

| ✅ Included                     | ❌ Not in MVP                        |
|---------------------------------|--------------------------------------|
| Mocked admin login              | Real JWT authentication              |
| Rwanda-only map (3 cities)      | Global map support                   |
| In-memory data store            | Database (PostgreSQL, MongoDB, etc.) |
| Joi request validation          | RBAC / role-based access             |
| IP masking (Zero-Trust)         | Email verification                   |
| Mocked AI remediation (en, rw)  | Live Gemini API integration          |
| Swagger UI docs                 | Rate limiting / API keys             |

---

**Author:** Fidele  
**License:** UNLICENSED (Private)
