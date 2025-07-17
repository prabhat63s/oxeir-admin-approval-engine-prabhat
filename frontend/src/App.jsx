import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard.jsx';
import PrivateRoute from './routes/PrivateRoute';
import MySubmissions from './pages/MySubmissions.jsx';
import SubmitForm from './pages/SubmitForm.jsx';
import CreateUser from './pages/CreateUser.jsx';
import UserList from './pages/UserList.jsx';
import FlagList from './pages/FlagList.jsx';
import MyFlags from './pages/MyFlags.jsx';
import CommonLayout from './layout/CommonLayout.jsx';
import Logs from './pages/Logs.jsx';
import Approve from './pages/Approve.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Layout wrapper */}
        <Route element={<PrivateRoute allowedRoles={['user', 'admin', 'superadmin']} />}>
          <Route element={<CommonLayout />}>
            {/* Admin & Superadmin Routes */}
            <Route element={<PrivateRoute allowedRoles={['admin', 'superadmin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/approve" element={<Approve />} />
              <Route path="/flags" element={<FlagList />} />
            </Route>

            {/* Superadmin Only */}
            <Route element={<PrivateRoute allowedRoles={['superadmin']} />}>
              <Route path="/users" element={<UserList />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/logs" element={<Logs />} />
            </Route>

            {/* User Only */}
            <Route element={<PrivateRoute allowedRoles={['user']} />}>
              <Route path="/my-submissions" element={<MySubmissions />} />
              <Route path="/submit" element={<SubmitForm />} />
              <Route path="/edit/:id" element={<SubmitForm />} />
              <Route path="/my-flags" element={<MyFlags />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<div className="p-10 text-center text-xl">404 - Not Found</div>} />
      </Routes>
    </Router>
  )
}