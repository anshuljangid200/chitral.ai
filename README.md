# Event Ticketing System

A production-grade Event Ticketing Web Application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows organizers to create and manage events, while users can register for events without authentication.

## Features

### Organizer Features (Authenticated)
- **Authentication**: Secure signup and login with JWT tokens and bcrypt password hashing
- **Event Management**: Create, view, update, and delete events
- **Event Configuration**: Set event details including title, description, date, venue, ticket limit, and approval mode (auto/manual)
- **Registration Management**: View all registrations for each event
- **Approval System**: Approve or reject registrations for events with manual approval mode
- **Dashboard**: View all events created by the organizer

### User Features (No Authentication Required)
- **Public Event Access**: View event details using event ID
- **Event Registration**: Register for events with name and email only
- **Auto/Manual Approval**: Automatic approval for auto-mode events, pending status for manual-mode events
- **Ticket Access**: View approved tickets using unique ticket ID

### Security & Data Integrity
- **Race Condition Safety**: MongoDB transactions prevent over-booking
- **Duplicate Prevention**: Unique email per event enforcement
- **Ticket Limit Enforcement**: Strict validation at database and service level
- **Input Validation**: Comprehensive validation using Joi schemas
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Protected Routes**: JWT-based authentication middleware

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Joi** for request validation
- **nanoid** for unique ticket ID generation

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## Project Structure

```
event-ticketing/
├── backend/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── jwt.js            # JWT utilities
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   └── registrationController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Centralized error handling
│   │   ├── notFound.js       # 404 handler
│   │   └── validate.js       # Request validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   └── registrationRoutes.js
│   ├── utils/
│   │   └── asyncHandler.js   # Async error wrapper
│   ├── validations/
│   │   ├── authValidation.js
│   │   ├── eventValidation.js
│   │   └── registrationValidation.js
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Alert.jsx
    │   │   ├── Loading.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── CreateEvent.jsx
    │   │   ├── EventRegistrations.jsx
    │   │   ├── PublicEvent.jsx
    │   │   └── Ticket.jsx
    │   ├── utils/
    │   │   ├── api.js         # Axios configuration
    │   │   └── auth.js         # Auth utilities
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb+srv://chitral:<PASSWORD>@login.p5yvdtm.mongodb.net/event-ticketing
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

**Important**: Replace `<PASSWORD>` with your actual MongoDB Atlas password and set a strong `JWT_SECRET`.

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the frontend directory if you need to change the API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create organizer account
- `POST /api/auth/login` - Login organizer
- `GET /api/auth/me` - Get current user (protected)

### Events (Protected - Organizer Only)
- `POST /api/events` - Create new event
- `GET /api/events` - Get all events for logged-in organizer
- `GET /api/events/:id` - Get event by ID
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Registrations
- `GET /api/registrations/public/event/:id` - Get public event details
- `POST /api/registrations/public/event/:id/register` - Register for event (public)
- `GET /api/registrations/ticket/:ticketId` - Get ticket by ticket ID
- `GET /api/registrations/event/:id` - Get all registrations for event (protected)
- `PUT /api/registrations/:registrationId/status` - Update registration status (protected)

### Health Check
- `GET /api/health` - Server health check

## Database Schemas

### User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: ['organizer'], default: 'organizer')

### Event
- `title` (String, required)
- `description` (String, required)
- `date` (Date, required, must be future date)
- `venue` (String, required)
- `ticketLimit` (Number, required)
- `approvalMode` (String, enum: ['auto', 'manual'], default: 'manual')
- `organizer` (ObjectId, reference to User)

### Registration
- `event` (ObjectId, reference to Event)
- `userName` (String, required)
- `userEmail` (String, required)
- `status` (String, enum: ['pending', 'approved', 'rejected'], default: 'pending')
- `ticketId` (String, unique, auto-generated)
- `createdAt`, `updatedAt` (timestamps)

## Key Features Implementation

### Race Condition Safety
The registration system uses MongoDB transactions to prevent race conditions when checking and updating ticket limits. This ensures that concurrent registration requests cannot exceed the ticket limit.

### Duplicate Prevention
A compound unique index on `event` and `userEmail` prevents duplicate registrations for the same event using the same email address.

### Ticket Limit Enforcement
Ticket limits are enforced at multiple levels:
1. Database validation
2. Service-level checks before registration
3. Transaction-based atomic operations
4. Approval-time validation for manual approval mode

### Security Measures
- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Input validation and sanitization
- CORS configuration
- Environment variable management

## Usage Flow

### Organizer Flow
1. Sign up for an organizer account
2. Log in to access the dashboard
3. Create events with desired configuration
4. View registrations for each event
5. Approve/reject registrations (if manual approval mode)

### User Flow
1. Access public event page using event ID: `/event/:id`
2. Fill in name and email to register
3. If auto-approval: Receive ticket ID immediately
4. If manual approval: Wait for organizer approval
5. Access ticket using ticket ID: `/ticket/:ticketId`

## Development Notes

- The backend uses ES6 modules (`type: "module"` in package.json)
- All async operations use async/await with error handling
- Frontend uses React Router v6
- Tailwind CSS is configured for responsive design
- API responses follow a consistent format: `{ success, message, data }`

## Production Considerations

Before deploying to production:
1. Set strong `JWT_SECRET` environment variable
2. Configure CORS properly for your domain
3. Set up proper MongoDB connection string with credentials
4. Enable HTTPS
5. Set up error logging and monitoring
6. Configure rate limiting
7. Add input sanitization for XSS prevention
8. Set up database backups

## License

ISC

