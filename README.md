# Employee Management Tool

A full-stack employee management system built for Entain NCE, supporting three offices (Riga, Tallinn, Vilnius) with a flexible, editable tag system.

## Tech Stack

| Layer    | Technology                                 |
| -------- | ------------------------------------------ |
| Frontend | Angular 19 (Standalone) + Angular Material |
| Backend  | NestJS                                     |
| Database | MongoDB + Mongoose                         |

## Project Structure

```
employee-management/
├── backend/        # NestJS REST API
├── frontend/       # Angular 19 SPA
└── README.md
```

## Prerequisites

- Node.js >= 20
- MongoDB running locally (or Atlas URI)
- Angular CLI >= 19

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SiavashBashiri/employee-management
cd employee-management
```

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on `http://localhost:3000/api`

### 3. Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend runs on `http://localhost:4200`

## API Overview

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| GET    | `/api/tags`                   | Get all tags          |
| GET    | `/api/tags?listType=positive` | Get tags by list type |
| POST   | `/api/tags`                   | Create a tag          |
| PATCH  | `/api/tags/:id`               | Update a tag          |
| DELETE | `/api/tags/:id`               | Delete a tag          |
| GET    | `/api/employees`              | Get all employees     |
| GET    | `/api/employees/:id`          | Get employee by ID    |
| POST   | `/api/employees`              | Create an employee    |
| PATCH  | `/api/employees/:id`          | Update an employee    |
| DELETE | `/api/employees/:id`          | Delete an employee    |

## Key Design Decisions

### Tag ID Types

The system maintains two separate tag lists with intentionally different ID types:

- **Positive tags** → `tagId` is a `string`
- **Negative tags** → `tagId` is a `number`

This constraint is enforced at both the DTO validation layer and the service layer.

### Tag Deletion — Cascading Cleanup

When a tag is deleted, all employee records referencing that `tagId` are automatically cleaned up via a cascading update, preventing orphaned references.

### No Shared Package Layer

Frontend and backend are kept fully independent. Given the scope of this project, a shared types package would introduce tooling overhead without meaningful benefit. Both sides define their own interfaces.
