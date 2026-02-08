// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx7O-Eh-YIHWTTDvx1KCXDTNqX37n-grA",
  authDomain: "student-teacher-booking-311f5.firebaseapp.com",
  projectId: "student-teacher-booking-311f5",
  storageBucket: "student-teacher-booking-311f5.firebasestorage.app",
  messagingSenderId: "1041844488228",
  appId: "1:1041844488228:web:6f1d8d262e577222f170b1",
  measurementId: "G-0RH90CLCTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

# Student-Teacher Booking Appointment System

## 📖 Overview
A web-based appointment booking system that connects students with teachers for scheduling meetings and discussions.

## 🚀 Features
- **Three User Roles:** Admin, Teacher, Student
- **Appointment Booking:** Students can book appointments with teachers
- **Real-time Updates:** Status updates for appointments
- **Messaging System:** In-app messaging for appointments
- **Responsive Design:** Works on all devices
- **Firebase Backend:** Secure authentication and database

## 🛠️ Technologies Used
- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Firebase (Authentication, Firestore)
- **Hosting:** Firebase Hosting (optional)

## 📁 Project Structure
student-teacher-booking/
├── css/
│ └── style.css # All styles
├── js/
│ ├── firebase-config.js # Firebase setup
│ ├── auth.js # Authentication
│ ├── appointments.js # Appointment functions
│ └── logger.js # Logging system
├── pages/
│ ├── login.html # Login page
│ ├── register.html # Registration page
│ ├── dashboard.html # Student dashboard
│ ├── teacher.html # Teacher dashboard
│ └── admin.html # Admin dashboard
├── index.html # Home page
└── README.md # This file

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/student-teacher-booking.git
cd student-teacher-booking