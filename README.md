# Admin Approval Engine 🚦  
**Project Repository:** `oxeir-admin-approval-engine-prabhat`  
**Live Preview:** [https://oxeir-admin-approval-engine-prabhat.vercel.app/login](https://oxeir-admin-approval-engine-prabhat.vercel.app/login)

## 🔍 Overview
The **Admin Approval Engine** is a robust moderation system built to streamline content approval workflows for platforms hosting user-submitted Jobs, Courses, Webinars, and Projects. Designed for **superadmins and admins**, this system helps enforce quality control, platform credibility, and compliance with standards.

---

## 🔧 Tech Stack

### Frontend
- React.js (with Context API for state management)
- Tailwind CSS (for styling)
- Lucide Icons (UI enhancement)
- Recharts (for analytics/charts)
- React Router DOM

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Express-validator
- CORS 

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/prabhat63s/oxeir-admin-approval-engine-prabhat.git
cd oxeir-admin-approval-engine-prabhat
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Add your MongoDB URI, JWT secrets, etc.
npm start # or npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Vite-based setup
```

---

## 🚀 Deployment

This project is **live and production-ready** using:

- **Frontend:** Vercel (auto-deploy from GitHub)
- **Backend:** Render (Express + MongoDB)
- **Database:** MongoDB Atlas (cloud)

---

## ⭐ Key Features

### ✅ Admin Panel
- Dashboard with Approval Stats & Weekly Activity (Approvals & Rejections)
- Approval page with tabs: Job, Course, Webinar, Project
- Item cards with:
  - Title & submitter info
  - Full details modal
  - Approve/Reject actions with comment
  - Status tag

### 🔎 Filters & Search
- Filter by status, email, type, date range
- Escalated-only toggle
- CSV export per tab

### 📊 Analytics
- Flag statistics (Bar, and Line Charts)
- Logs with filters and pagination

### 📬 Notifications
- Auto-emails on approval/rejection (Nodemailer-ready)
- Escalation trigger after 7 days unreviewed

### 🔐 Security & Roles
- Role-based access: Only superadmins/admins
- Action logging
- Input validation

---

## 📁 Folder Structure

```bash
oxeir-admin-approval-engine-prabhat/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── approvalController.js
│   │   ├── authController.js
│   │   ├── flagController.js
│   │   ├── logController.js
│   │   ├── submissionController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── validateMiddleware.js
│   ├── models/
│   │   ├── ApprovalQueue.js
│   │   ├── Flag.js
│   │   ├── Item.js
│   │   ├── Log.js
│   │   └── User.js
│   ├── routes/
│   │   ├── approvalRoutes.js
│   │   ├── authRoutes.js
│   │   ├── logRoutes.js
│   │   ├── superadminRoutes.js
│   │   └── userRoutes.js
│   ├── script/
│   │   └── autoEscalate.js
│   ├── seeder/
│   │   └── createSuperAdmin.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── generateToken.js
│   │   └── sendMail.js
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── api/
│   │   └── axios.js
│   ├── components/
│   │   ├── ActivityChart.jsx
│   │   ├── ApprovalCard.jsx
│   │   ├── ApprovalModal.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── DownloadCSV.jsx
│   │   ├── FlagButton.jsx
│   │   └── StatusBarChart.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── layout/
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Approve.jsx
│   │   ├── CreateUser.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FlagList.jsx
│   │   ├── Login.jsx
│   │   ├── Logs.jsx
│   │   ├── MyFlags.jsx
│   │   ├── MySubmissions.jsx
│   │   └── UserList.jsx
│   ├── routes/
│   │   └── PrivateRoute.jsx
│   └── utils/
│       └── validators.jsx 
└── README.md
```

---

## 📮 Postman Collection

A Postman collection Link:
🔗 [Postman](https://www.postman.com/aerospace-physicist-4820752/public/collection/ty0udiq/admin-approval-engine?action=share&creator=29675929)

---

## 🧑‍💻 Author

**Prabhat Singh**  
MERN Developer @ Orlank Technology Pvt Ltd  
🔗 [LinkedIn](https://www.linkedin.com/in/prabhat-singh63/)

---

## 📢 Contribution & Feedback

Feel free to fork and contribute. Pull requests are welcome.

For feedback, reach out via issues or [prabhat6914@gmail.com](mailto:prabhat6914@gmail.com)