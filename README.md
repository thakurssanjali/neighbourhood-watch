# Neighborhood Watch

A full-stack community management platform that helps neighborhoods stay connected, informed, and safe through incident reporting, event management, and community guidelines.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure Details](#project-structure-details)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- **User Authentication** - Secure login/registration with JWT tokens
- **Incident Reporting** - Report neighborhood incidents with categories and descriptions
- **Incident Tracking** - Monitor incident status (Pending → Actioning → Resolved)
- **Event Discovery** - Browse and attend community events
- **Community Guidelines** - View important community rules and announcements
- **Members Directory** - Connect with other community members
- **Contact Support** - Send messages to community administrators
- **User Dashboard** - Personalized dashboard for managing incidents and profile

### Admin Features
- **Admin Dashboard** - Centralized control panel for community management
- **Incident Management** - Review, update status, and add remarks to incidents
- **Event Management** - Create and manage community events
- **Community Guidelines** - Post and manage community guidelines and announcements
- **User Management** - View and manage community members
- **Admin Controls** - Full administrative capabilities

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
neighborhood-watch/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── App.jsx                 # Main app component with routing
│   │   ├── main.jsx                # Entry point
│   │   ├── index.css               # Global styles
│   │   ├── components/
│   │   │   └── PageLoader.jsx      # Loading indicator component
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing/home page
│   │   │   ├── Login.jsx           # User login
│   │   │   ├── Register.jsx        # User registration
│   │   │   ├── ForgotPassword.jsx  # Password reset
│   │   │   ├── UserDashboard.jsx   # User dashboard
│   │   │   ├── AdminDashboard.jsx  # Admin dashboard
│   │   │   ├── Members.jsx         # Community members
│   │   │   ├── About.jsx           # About page
│   │   │   ├── Contact.jsx         # Contact form
│   │   │   └── ReportIncident.jsx  # Incident reporting
│   │   ├── redux/
│   │   │   ├── store.js            # Redux store configuration
│   │   │   └── incidentSlice.js    # Incident state management
│   │   └── services/               # API services
│   ├── public/
│   │   └── images/
│   │       └── event-gifs/         # Event category images
│   ├── vite.config.js              # Vite configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── postcss.config.js           # PostCSS configuration
│   ├── eslint.config.js            # ESLint rules
│   ├── package.json                # Frontend dependencies
│   ├── index.html                  # HTML entry point
│   └── README.md                   # Frontend documentation
│
├── server/                          # Express backend application
│   ├── index.js                    # Server entry point
│   ├── config/
│   │   └── db.js                   # MongoDB connection config
│   ├── models/
│   │   ├── User.js                 # User data model
│   │   ├── Incident.js             # Incident data model
│   │   ├── Event.js                # Event data model
│   │   ├── CommunityGuideline.js   # Guideline data model
│   │   ├── ContactMessage.js       # Contact message data model
│   │   └── PasswordResetRequest.js # Password reset data model
│   ├── routes/
│   │   ├── authRoutes.js           # Authentication endpoints
│   │   ├── userRoutes.js           # User endpoints
│   │   ├── incidentRoutes.js       # Incident endpoints
│   │   ├── eventRoutes.js          # Event endpoints
│   │   ├── adminRoutes.js          # Admin endpoints
│   │   ├── communityGuidelineRoutes.js  # Guideline endpoints
│   │   └── contactRoutes.js        # Contact endpoints
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── adminMiddleware.js      # Admin role verification
│   ├── package.json                # Backend dependencies
│   └── .env                        # Environment variables (not tracked)
│
├── README.md                       # Project overview (this file)
├── .gitignore                      # Git ignore rules
└── .env.example                    # Example environment variables
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas cloud account)
- **Git** for version control

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/neighborhood-watch.git
cd neighborhood-watch
```

### 2. Install Backend Dependencies
```bash
cd server
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../client
npm install
```

### 4. Return to Root Directory
```bash
cd ..
```

## 🔐 Environment Variables

### Backend (.env in server/)
Create a `.env` file in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neighborhood-watch
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**Note:** For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neighborhood-watch
```

### Frontend (.env in client/)
If needed, create a `.env` file in the `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## ▶️ Running the Application

### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173 (or displayed in terminal)
```

### Option 2: Run from Root (requires concurrent-install)

```bash
npm install -g concurrently
concurrently "cd server && npm run dev" "cd client && npm run dev"
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### User Endpoints
- `GET /users/public` - Get all public members
- `GET /users/:id` - Get user profile
- `PUT /users/:id` - Update user profile

### Incident Endpoints
- `POST /incidents` - Report new incident
- `GET /incidents` - Get all incidents
- `GET /incidents/:id` - Get incident details
- `PUT /incidents/:id` - Update incident (admin)
- `DELETE /incidents/:id` - Delete incident (admin)

### Event Endpoints
- `POST /events` - Create event
- `GET /events` - Get all events
- `GET /events/public` - Get public events
- `GET /events/:id` - Get event details
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Community Guideline Endpoints
- `POST /guidelines` - Create guideline (admin)
- `GET /guidelines` - Get all guidelines
- `GET /guidelines/public` - Get public guidelines
- `PUT /guidelines/:id` - Update guideline (admin)
- `DELETE /guidelines/:id` - Delete guideline (admin)

### Contact Endpoints
- `POST /contact` - Send contact message
- `GET /contact` - Get all messages (admin)

### Admin Endpoints
- `GET /admin/users` - Get all users
- `PUT /admin/users/:id` - Manage users
- `GET /admin/statistics` - Get platform statistics

## 📦 Building for Production

### Backend
```bash
cd server
npm start
```

### Frontend
```bash
cd client
npm run build
npm run preview
```

## 🔧 Development Commands

### Frontend
```bash
cd client
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
cd server
npm run dev      # Start with nodemon
npm start        # Start production
```

## 🌐 Deployment

### Frontend Deployment Options
- **Vercel** - Recommended for Vite projects
- **Netlify** - Drag & drop deployment
- **GitHub Pages** - Free hosting
- **AWS S3 + CloudFront** - Scalable solution

### Backend Deployment Options
- **Heroku** - Easy Node.js hosting
- **Railway** - Modern hosting platform
- **AWS EC2** - Full control VPS
- **DigitalOcean** - Affordable cloud hosting
- **Render** - Free tier available

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🙏 Acknowledgments

- React and Vite communities
- Express.js and MongoDB communities
- All contributors and supporters

---

**Made with ❤️ for safer neighborhoods**

Last Updated: December 2025
