# ShutterRent

ShutterRent is a full-stack web application for renting photography equipment — browse listings, book gear by the day, and manage everything through an admin dashboard.

Built with the **MERN stack** (MongoDB, Express, React, Node.js), with JWT authentication, role-based access control, and a custom-designed UI.

**[Live Demo](https://shutterrent-ptk.vercel.app)**

Demo account:
- Email: `Demouser@gmail.com`
- Password: `Demouser123`

*(Non-admin account — for admin dashboard access, please request credentials.)*

## Features

- User registration, login, and authentication (JWT + bcrypt password hashing)
- Role-based access control (user vs. admin)
- Browse and filter camera/gear listings by category
- Date-validated booking system with live price calculation and conflict detection
- Admin dashboard: create/edit/delete listings, manage users, manage bookings and their status
- Image upload for listings and user profiles
- Responsive design with a custom charcoal/amber design system

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Auth:** JWT, bcrypt
**File uploads:** Multer + Cloudinary (persistent cloud storage)
**Deployment:** Vercel (frontend), Render (backend)

## Getting Started

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (e.g. from MongoDB Atlas)

### Setup

Clone the repo:
```bash
git clone https://github.com/ptkhaing/shutterrent.git
cd shutterrent
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm run dev
```

**Frontend** (in a separate terminal):
```bash
cd frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Screenshots

<img width="1463" height="805" alt="Screenshot 2026-10-06 at 12 46 19 AM" src="https://github.com/user-attachments/assets/93f600c0-a445-482d-aa0c-f52b9d9da423" />

<img width="1264" height="327" alt="Screenshot 2026-10-06 at 12 47 09 AM" src="https://github.com/user-attachments/assets/d07b1c8e-af7e-47bb-8214-10bac7768444" />


## Project Structure

```
ShutterRent/
├── backend/ # Express API, MongoDB models, auth
└── frontend/ # React app (Vite), Tailwind UI
```


## Acknowledgments

Originally built as part of the CET300 Computing Project, University of Sunderland (2025), and since revised with security fixes, UX improvements, and a full visual redesign.

## License MIT — see [LICENSE](LICENSE) for details.
