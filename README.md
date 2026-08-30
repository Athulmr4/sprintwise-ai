# SprintWise AI

SprintWise AI is an AI-powered project management and team collaboration platform designed to help teams plan projects, manage tasks, collaborate efficiently, and make better project decisions using AI.

The goal of SprintWise AI is to combine traditional project management features with practical AI-powered assistance instead of simply adding a chatbot to a task management application.

---

## 🚀 Project Overview

Managing software projects often involves multiple tools for planning, task management, communication, progress tracking, and reporting.

SprintWise AI aims to bring these workflows together into a single workspace.

The platform will allow users to:

- Create and manage workspaces
- Create and manage projects
- Create, assign and track tasks
- Collaborate with team members
- Monitor project progress
- Analyze team workload
- Receive notifications
- Track project activity
- Generate project reports
- Use AI to assist with planning and decision-making

---

## 🤖 AI-Powered Features

AI is a core part of SprintWise AI rather than an isolated chatbot.

Planned AI capabilities include:

- AI Task Breakdown
- AI Sprint Planner
- AI Project Summary
- AI Risk Detection
- AI Team Workload Analysis
- AI Project Health Analysis
- AI Meeting Notes → Tasks
- AI Smart Search
- AI Bug Explanation
- AI Documentation Generation

The AI system will use project and task information where appropriate to provide contextual recommendations.

AI-generated actions that modify project data will require user review and confirmation where necessary.

---

## ✨ Core Features

### Authentication

- User registration
- User login/logout
- Secure password hashing
- JWT authentication
- Protected routes
- Role-based authorization
- Email verification
- Password reset

### Workspace Management

- Create workspaces
- Invite members
- Manage workspace members
- Workspace roles
- Workspace settings

### Project Management

- Create and manage projects
- Project members
- Project status and priority
- Deadlines
- Project progress tracking
- Project activity

### Task Management

- Create and manage tasks
- Assign tasks to team members
- Task priorities
- Task statuses
- Due dates
- Estimated effort
- Checklists
- Task dependencies
- Comments
- File attachments

### Collaboration

- Team members
- Comments
- Notifications
- Activity logs
- Task history

### Analytics

- Project progress
- Task completion
- Overdue tasks
- Team workload
- Project health
- Reports and visualizations

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- Tailwind CSS
- Vanilla JavaScript
- EJS

### Backend

- Node.js
- Express.js

### Database

- MySQL
- Sequelize ORM

### Authentication & Security

- JWT
- bcrypt
- HttpOnly cookies
- Helmet
- Input validation
- Rate limiting

### AI

The AI layer will be designed to support an LLM provider through a dedicated AI service.

Potential providers include:

- OpenAI
- Google Gemini
- Groq
- Ollama

The final provider will be selected during the AI implementation phase.

### Other Technologies

- Nodemailer
- Multer
- Chart.js
- dotenv
- Git
- GitHub

---

## 🏗️ Architecture

SprintWise AI follows a layered backend architecture.

```text
Client
  │
  ▼
Express Routes
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Authorization
  └── Validation
  │
  ▼
Controllers
  │
  ▼
Services
  │
  ├── Business Logic
  └── AI Services
  │
  ▼
Sequelize ORM
  │
  ▼
MySQL