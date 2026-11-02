# LalliChat

LalliChat is a real-time chat application built with React, Express, MongoDB, and Socket.IO. Users can create accounts, manage friends, exchange messages, and see online users.

## Features

- User registration, login, logout, and JWT-based authentication
- One-to-one messaging with conversation history
- Real-time online-user presence through Socket.IO
- Friend search, friend requests, accepting/rejecting requests, and removing friends
- User profiles and account deletion
- Responsive React interface with toast notifications

## Tech Stack

- **Frontend:** React, React Router, Vite, Axios, Zustand, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, HTTP-only cookies, and bcryptjs

## Prerequisites

- Node.js 18 or newer
- npm
- A running MongoDB database

## Getting Started

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/theagrim0410/SocketChat.git
   cd SocketChat
   ```

2. Install the backend dependencies:

   ```bash
   npm install
   ```

3. Install the frontend dependencies:

   ```bash
   npm install --prefix frontend
   ```

4. Create a `.env` file in the project root:

   ```env
   PORT=3000
   MONGODB_URL=mongodb://127.0.0.1:27017/lallichat
   JWT_SECRET=replace-with-a-long-random-secret
   ```

   Keep `.env` private and use a hosted MongoDB connection string for deployments.

## Development

Run the backend from the project root:

```bash
npm run dev
```

In a second terminal, run the Vite frontend:

```bash
npm run dev --prefix frontend
```

Open the frontend URL shown by Vite, usually `http://localhost:5173`. Vite proxies `/api` requests to the backend at `http://localhost:3000`.

The Socket.IO client endpoint is defined in `frontend/src/context/SocketContext.jsx`. Update it to your local or deployed backend URL when changing the realtime server location.

## Production Build

Build the frontend and install dependencies with:

```bash
npm run build
```

Start the backend:

```bash
npm start
```

The Express server serves the generated frontend from `frontend/dist` and listens on the port configured by `PORT` (default: `3000`).

## API Overview

| Area | Base path | Examples |
| --- | --- | --- |
| Authentication | `/api/auth` | Register, login, logout |
| Messages | `/api/message` | Send, retrieve, and delete conversations |
| Users | `/api/user` | Search users, list chatters, delete users |
| Friends | `/api/friend` | Search, add, accept, reject, and remove friends |

Most user, friend, and message endpoints require an authenticated session.

## Project Structure

```text
backend/
  DB/              MongoDB connection
  Models/          Mongoose schemas
  Socket/          Socket.IO server
  rout/            Express routes
  routControlers/  Route handlers
frontend/
  src/             React application
  public/          Static assets
```
