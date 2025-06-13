# 🎫 Ticketing System – MERN Stack Application

A comprehensive ticketing and customer support management platform designed to streamline issue resolution, team collaboration, and real-time support.

## 🚀 Live Demo

- **Frontend-Client (Vercel)**: [https://client.app](https://vercel.com/lokeshs-projects-f594ae13/ticketing-system-test/HFiJgfcjAEaqTwchrLX5kK8HwZgt)
- **Frontend-Admin (Vercel)**: [https://admin.app](https://ticketing-system-app-1-git-main-lokeshs-projects-f594ae13.vercel.app/)




---

## 🧰 Tech Stack

- **Frontend**: React, Vanilla CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB (via MongoDB Atlas)
- **Hosting**: Vercel (Frontend), Render (Backend)

---

## 🔐 Demo Credentials

### 🧑‍💼 Admin
- **Email**: `admin@example.com`
- **Password**: `admin123`

### 👨‍💻 Team Member
- **Email**: `member@example.com`
- **Password**: `member123`


---

## 📦 Features

### 👥 User Authentication
- Sign-up/Login system
- JWT-based authentication
- Role-based access: Admins and Team Members
- Team members can only register using invited emails
- Multiple admins can manage their own separate teams

### 🖥 Dashboard
- View all tickets
- Filter Resolved / Unresolved tickets
- Ticket Search Functionality
- Assign tickets to team members
- Toggle ticket status

### 📊 Analytics
- Track resolution times
- Team performance metrics
- Status summary charts

### 💬 Live Chat
- Real-time chat interface with users
- Missed chat tagging system
- Chat widget integration
- Chatbot appearance customization

### 👨‍👩‍👧‍👦 Team Management
- Add/Remove team members
- View team list
- Edit team member profiles

### 🧪 Dummy Website
- Mobile responsive page (Hubly site)
- Chatbot widget always active for testing

---

## 🛠 Setup Instructions

### 1. Clone the repository


-git clone https://github.com/lokeshgoud15/Ticketing-System.git
-cd ticketing-system

### 2. Install Dependencies

Client --
- cd frontend/testclient
- npm install
- npm run dev

Server--
- cd ../server
- npm install
- npm run dev


### 3. Create Environment Variables
For the server (server/.env)

- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- CLIENT_URL=http://localhost:3000


## ✨ Key Highlights
- Modular and scalable design

- Secure JWT authentication

- Role-based access control

- Reusable React components

- Real-time features (chat system)

- RESTful API structure
