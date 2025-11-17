# Backend Setup

## Installation

```bash
cd backend
npm install
```

## Running the Backend

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## API Endpoints

### POST /api/auth/login

Authenticates user with Xibo CMS using username/password

**Request:**

```json
{
  "username": "admin",
  "password": "password"
}
```

**Response:**

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600
}
```

### POST /api/auth/token

Gets API token using client credentials

**Response:**

```json
{
  "access_token": "...",
  "expires_in": 3600
}
```

### GET /api/auth/user

Gets current user info (requires Bearer token)

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "userId": 1,
  "userName": "admin",
  "email": "admin@example.com"
}
```

## Configuration

The backend uses environment variables from `.env`:

- `PORT` - Server port (default: 5000)
- `VITE_XIBO_API_URL` - Xibo API URL
- `VITE_XIBO_CLIENT_ID` - Xibo OAuth client ID
- `VITE_XIBO_CLIENT_SECRET` - Xibo OAuth client secret

## How it Works

1. Frontend sends username/password to backend `/api/auth/login`
2. Backend proxies the request to Xibo API (handles CORS)
3. Backend returns the access token to frontend
4. Frontend stores the token and uses it for subsequent API calls
5. All Xibo API requests from frontend now go through the backend proxy
