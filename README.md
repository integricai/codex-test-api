# ClickUp-Style Task Manager API (Node.js + Firebase)

Professional REST API scaffold using `Express` and `Firebase Firestore` with:

- Firebase Auth token verification middleware
- Workspace/List/Task domain modeling
- Validation via `zod`
- Centralized error handling
- Swagger/OpenAPI docs for API consumption
- Production middleware (`helmet`, `cors`, `compression`, `morgan`)

## 1) Prerequisites

- Node.js 20+
- Firebase project (you already have `codex-test-80fc5`)
- Service account JSON from Firebase Console:
  - Project Settings -> Service Accounts -> Generate new private key

## 2) Setup

```bash
npm install
cp .env.example .env
```

Set your `.env` values:

```env
NODE_ENV=development
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
FIREBASE_PROJECT_ID=codex-test-80fc5
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

Place your downloaded key file at:

```text
./firebase-service-account.json
```

## 3) Run

```bash
npm run dev
```

Base URL:

```text
http://localhost:5000/api/v1
```

Health check:

```http
GET /api/v1/health
```

## 4) Swagger Docs

- Swagger UI: `http://localhost:5000/api-docs`
- Raw OpenAPI JSON: `http://localhost:5000/api-docs.json`

Use Swagger UI `Authorize` and paste only the token value:

```text
<FIREBASE_ID_TOKEN>
```

## 5) Auth

All routes except health require a Firebase ID token:

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

## 6) API Endpoints

### Workspaces

- `GET /workspaces`
- `POST /workspaces`
- `GET /workspaces/:workspaceId`
- `PATCH /workspaces/:workspaceId`
- `DELETE /workspaces/:workspaceId`

### Lists (inside workspace)

- `GET /workspaces/:workspaceId/lists`
- `POST /workspaces/:workspaceId/lists`
- `PATCH /workspaces/:workspaceId/lists/:listId`
- `DELETE /workspaces/:workspaceId/lists/:listId`

### Tasks (inside workspace)

- `GET /workspaces/:workspaceId/tasks?listId=&status=&assigneeId=&archived=&search=&limit=`
- `POST /workspaces/:workspaceId/tasks`
- `GET /workspaces/:workspaceId/tasks/:taskId`
- `PATCH /workspaces/:workspaceId/tasks/:taskId`
- `DELETE /workspaces/:workspaceId/tasks/:taskId`

## 7) Firestore Collections

- `users`
- `workspaces`
- `lists`
- `tasks`

## 8) Notes for production

- Add composite indexes in Firestore when prompted by query errors.
- Restrict CORS in `.env` (`CLIENT_ORIGIN`).
- Prefer Firebase App Hosting / Cloud Run + Secret Manager for credentials.
- Keep service account key out of git.
