# Smart Leads API

Base URL: `http://localhost:5000/api`

Responses use:

```json
{
  "success": true,
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Validation failed",
  "details": []
}
```

## Auth

### Register

`POST /auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Password123",
  "role": "admin"
}
```

Roles: `admin`, `sales`.

### Login

`POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Password123"
}
```

Returns `{ user, token }`. Send the token as `Authorization: Bearer <token>`.

### Me

`GET /auth/me`

Protected.

## Leads

All leads routes are protected.

### List Leads

`GET /leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1`

Query params:

- `status`: `New`, `Contacted`, `Qualified`, `Lost`
- `source`: `Website`, `Instagram`, `Referral`
- `search`: name or email
- `sort`: `latest`, `oldest`
- `page`: positive number

Pagination limit is always `10`.

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Qualified",
  "source": "Instagram"
}
```

### Get Lead

`GET /leads/:id`

### Update Lead

`PUT /leads/:id`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Contacted",
  "source": "Referral"
}
```

### Delete Lead

`DELETE /leads/:id`

Admin only.

### Export CSV

`GET /leads/export?status=Qualified&source=Instagram&search=Rahul`

Exports filtered leads as `leads.csv`.
