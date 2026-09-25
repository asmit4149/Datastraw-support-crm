# Datastraw Support CRM

A full-stack Customer Support CRM System built for the Datastraw Assessment Test.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)

## Architecture
The project follows a standard Client-Server architecture:
- `frontend/`: A Single Page Application (SPA) built with React and styled with a custom Tailwind CSS setup for a modern, SaaS-like interface.
- `backend/`: A REST API built with Node/Express that handles data validation and business logic (like auto-incrementing Ticket IDs `TKT-XXX`).

## Stand Out Feature Added
**Ticket Priority & Dashboard Statistics**

### What was added:
1. **Ticket Priorities:** Added a `priority` field (`Low`, `Medium`, `High`) to the Ticket schema. Users can set the priority when creating a ticket and update it from the Ticket Details page. The priority is visually represented across the UI with distinct colored badges (e.g., Red for High priority).
2. **Dashboard Statistics:** Added a dedicated `/api/tickets/stats` endpoint that leverages MongoDB aggregations to return real-time system counts. These stats (Total, Open, In Progress, Closed, High Priority) are displayed prominently at the top of the dashboard.

### Why it was added:
A bare-bones CRM that simply lists tickets can quickly become overwhelming for a real support team handling hundreds of tickets a day. By adding **Priorities**, support agents can immediately triage urgent issues (High Priority) before tackling standard requests. The **Dashboard Statistics** provide an instant, birds-eye view of the team's current workload and backlog health (e.g., seeing 50 "Open" tickets vs 5 "In Progress" tickets immediately signals a bottleneck), making the system genuinely useful for daily operations.

### What tradeoff was made:
To keep the implementation simple and maintainable for this MVP, I added the statistics calculation directly into a simple `countDocuments` query in the Node.js controller rather than setting up a complex, cached analytics pipeline or a separate analytics database. While this is slightly less performant at a massive scale (millions of tickets), it perfectly suits the current requirements without over-engineering the backend architecture.

## How to Run Locally

### Prerequisites
- Node.js installed
- MongoDB connection string (Cloud MongoDB Atlas or local)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*The backend will run on http://localhost:5000*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on http://localhost:5173*
