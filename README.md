# RenewCred CMS

A production-ready Content Management System (CMS) with an authenticated admin dashboard and a dynamic public-facing website.

The application allows administrators to create, update, delete, and publish website pages through an admin panel. The public frontend retrieves published content dynamically through the backend API.

## Features

### Authentication

- Admin login
- JWT-based authentication
- Protected admin routes
- Admin logout

### Admin CMS

- Admin dashboard
- Create pages
- Edit pages
- Delete pages
- Draft and published page status
- Dynamic page slugs
- Block-based content management

### Rich Content Blocks

The CMS supports multiple content block types:

- Header
- Paragraph
- List
- Table
- Mathematical Equation

A single page can contain mixed content blocks, allowing the application to support structured and rich content.

### Public Website

- Dynamic content fetched from the backend API
- Public pages accessible through dynamic slugs
- Only published pages are displayed publicly
- Draft pages are not accessible through the public frontend

## Technology Stack

### Admin Frontend

- Next.js
- React
- Redux Toolkit
- React Redux
- Axios
- Tailwind CSS

### Public Frontend

- Next.js
- React
- Tailwind CSS
- KaTeX / React KaTeX for mathematical equations

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Axios / REST API communication

### Infrastructure

- Docker
- Docker Compose

## Project Architecture

The project is organized into three main applications:

```text
renewcred-cms/
│
├── backend/
│   └── Express.js REST API
│
├── admin-frontend/
│   └── Next.js Admin CMS
│
├── public-frontend/
│   └── Next.js Public Website
│
├── docker-compose.yml
├── README.md
└── .env.example
```

### Application Flow

```text
Admin
   │
   ▼
Admin Frontend
   │
   │ JWT Authentication
   ▼
Express Backend
   │
   ▼
MongoDB
   │
   │ Published Content
   ▼
Public Frontend
```

## Content Model

Pages use a block-based content structure.

Example:

```text
Page
│
├── Header
├── Paragraph
├── List
├── Table
└── Equation
```

Each page contains:

- Title
- Slug
- Status
- Content blocks

The status can be:

```text
draft
published
```

Draft pages can be managed through the admin panel but are not displayed on the public website.

Published pages are available through the public frontend using their slug.

## API Structure

### Authentication

```text
POST /api/v1/auth/login
```

Used by administrators to authenticate and receive a JWT token.

### Public Content

```text
GET /api/v1/content/public
```

Returns published pages.

```text
GET /api/v1/content/public/:slug
```

Returns a specific published page using its slug.

### Protected Admin Content

```text
GET /api/v1/content
```

Returns all pages for authenticated administrators.

```text
POST /api/v1/content
```

Creates a new page.

```text
PUT /api/v1/content/:id
```

Updates an existing page.

```text
DELETE /api/v1/content/:id
```

Deletes an existing page.

## Environment Variables

Create `.env` files according to the configuration used by each application.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

See `.env.example` for the required environment variables.

**Do not commit actual `.env` files or secret credentials to GitHub.**

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-github-repository-url>
cd renewcred-cms
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create the required `.env` file and add your MongoDB connection string and JWT secret.

Start the backend:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Admin Frontend Setup

Open a new terminal:

```bash
cd admin-frontend
npm install
npm run dev
```

The admin dashboard runs on:

```text
http://localhost:3000
```

Open the login page:

```text
http://localhost:3000/login
```

### 4. Public Frontend Setup

Open another terminal:

```bash
cd public-frontend
npm install
npm run dev -- -p 3001
```

The public website runs on:

```text
http://localhost:3001
```

Dynamic pages can be accessed using their slug.

Example:

```text
http://localhost:3001/about-renewcred
```

## Sample Admin Credentials

For evaluation purposes:

```text
Email: admin@renewcred.com
Password: Admin@123
```

> Change these credentials before production deployment.

## Example CMS Workflow

1. Login to the admin panel.
2. Open the dashboard.
3. Create a new page.
4. Add content blocks such as headers, paragraphs, lists, tables, and equations.
5. Set the page status to `published`.
6. Save the page.
7. Open the public frontend using the page slug.
8. The public frontend retrieves and displays the content through the backend API.

## Assumptions

- Only authenticated administrators can create, update, and delete content.
- Public users can only access pages with `published` status.
- Page slugs are unique.
- Content is stored as structured blocks instead of raw HTML.
- Redux Toolkit is used for authentication-related global state.
- Local component state is used for form fields and temporary UI state.
- MongoDB is used as the database because the block-based content model can be stored flexibly using Mongoose.
- The frontend and backend are maintained as separate applications within a single repository.

## Architectural Decisions

### Block-Based Content Model

Content is represented as reusable blocks rather than storing an entire page as a single HTML string. This allows new content types to be added in the future without redesigning the complete data model.

### Separate Admin and Public Frontends

The admin CMS and public website are separated into independent Next.js applications. This keeps administrative functionality isolated from the public-facing application and allows each application to evolve independently.

### JWT Authentication

JWT authentication is used to protect administrative APIs. Public content endpoints remain accessible without authentication, while content management operations require a valid authentication token.

### Draft and Published Workflow

The CMS separates content management from content publication. Administrators can create and edit drafts without exposing unfinished content to public users.

## Future Improvements

Possible future improvements include:

- Role-based admin permissions
- Rich text editor integration
- Image and media management
- Content versioning
- Page preview functionality
- Search and filtering in the admin dashboard
- Automated testing
- CI/CD pipeline
- Production deployment
- Improved JWT token expiration and refresh handling
- HTTP-only secure cookies for authentication
- Advanced request validation

## License

This project was developed as part of the RenewCred Frontend Engineering Assignment.
