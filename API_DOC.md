# API_DOC.md

## Base URLs
- API: `http://localhost:5000/api/v1`
- Health alias: `http://localhost:5000/health`

## Auth Setup
Set token once in your terminal:

```bash
export TOKEN="<FIREBASE_ID_TOKEN>"
export API="http://localhost:5000/api/v1"
```

Windows PowerShell:

```powershell
$TOKEN="<FIREBASE_ID_TOKEN>"
$API="http://localhost:5000/api/v1"
```

## Health
### cURL
```bash
curl -X GET "$API/health"
curl -X GET "http://localhost:5000/health"
```

## Workspaces CRUD
### 1) Create workspace
```bash
curl -X POST "$API/workspaces" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Team",
    "description": "Q1 execution",
    "memberIds": ["uid_2", "uid_3"]
  }'
```

### 2) Read all workspaces
```bash
curl -X GET "$API/workspaces" \
  -H "Authorization: Bearer $TOKEN"
```

### 3) Read one workspace
```bash
curl -X GET "$API/workspaces/<WORKSPACE_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

### 4) Update workspace
```bash
curl -X PATCH "$API/workspaces/<WORKSPACE_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated workspace",
    "description": "Updated description",
    "memberIds": ["uid_2"]
  }'
```

### 5) Delete workspace
```bash
curl -X DELETE "$API/workspaces/<WORKSPACE_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

## Lists CRUD
### 1) Create list
```bash
curl -X POST "$API/workspaces/<WORKSPACE_ID>/lists" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sprint Backlog",
    "description": "Current sprint",
    "position": 1,
    "statuses": ["todo", "in-progress", "review", "done"]
  }'
```

### 2) Read all lists in workspace
```bash
curl -X GET "$API/workspaces/<WORKSPACE_ID>/lists" \
  -H "Authorization: Bearer $TOKEN"
```

### 3) Update list
```bash
curl -X PATCH "$API/workspaces/<WORKSPACE_ID>/lists/<LIST_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated list",
    "position": 2,
    "statuses": ["todo", "doing", "done"]
  }'
```

### 4) Delete list
```bash
curl -X DELETE "$API/workspaces/<WORKSPACE_ID>/lists/<LIST_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

## Tasks CRUD
### 1) Create task
```bash
curl -X POST "$API/workspaces/<WORKSPACE_ID>/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listId": "<LIST_ID>",
    "title": "Implement notifications",
    "description": "Email + in-app alerts",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-03-10T12:00:00.000Z",
    "startDate": "2026-03-01T09:00:00.000Z",
    "assigneeIds": ["uid_2"],
    "tags": ["backend", "v1"],
    "estimateMinutes": 180,
    "parentTaskId": "<PARENT_TASK_ID>"
  }'
```

### 2) Read all tasks (with optional filters)
```bash
curl -X GET "$API/workspaces/<WORKSPACE_ID>/tasks" \
  -H "Authorization: Bearer $TOKEN"
```

Filtered example:
```bash
curl -X GET "$API/workspaces/<WORKSPACE_ID>/tasks?status=todo&limit=20&search=notification" \
  -H "Authorization: Bearer $TOKEN"
```

### 3) Read one task
```bash
curl -X GET "$API/workspaces/<WORKSPACE_ID>/tasks/<TASK_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

### 4) Update task
```bash
curl -X PATCH "$API/workspaces/<WORKSPACE_ID>/tasks/<TASK_ID>" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in-progress",
    "priority": "urgent",
    "archived": false
  }'
```

### 5) Delete task
```bash
curl -X DELETE "$API/workspaces/<WORKSPACE_ID>/tasks/<TASK_ID>" \
  -H "Authorization: Bearer $TOKEN"
```

## Common Status Codes
- `200` OK
- `201` Created
- `204` No Content
- `400` Validation error
- `401` Unauthorized
- `403` Forbidden
- `404` Not found
- `500` Internal server error

## Notes
- Replace placeholders: `<WORKSPACE_ID>`, `<LIST_ID>`, `<TASK_ID>`, `<PARENT_TASK_ID>`.
- Timestamps are ISO strings in responses.
- Firestore may require composite indexes for some filters.
