import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

import EnquiryForm from './pages/EnquiryForm'
import EnquiryDetails from './pages/EnquiryDetails'
import EnquiryList from './pages/EnquiryList'
import EnquiryHistoryDetails from './pages/EnquiryHistoryDetails'
import AdminLogin from './pages/AdminLogin'
import StudentsList from './pages/StudentsList'
import StudentDetails from './pages/StudentDetails'
import UsersList from './pages/UsersList'
import UserDetails from './pages/UserDetails'
import Profile from './pages/Profile'
import Home from './pages/Home'
import Layout from './components/Layout'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/enquiry/new" element={
          <ProtectedRoute>
            <EnquiryForm />
          </ProtectedRoute>
        } />
        <Route path="/enquiry/:id" element={
          <ProtectedRoute>
            <EnquiryDetails />
          </ProtectedRoute>
        } />
        <Route path="/enquiries" element={
          <ProtectedRoute>
            <EnquiryList />
          </ProtectedRoute>
        } />
        <Route path="/enquiry/:id/history/:historyId" element={
          <ProtectedRoute>
            <EnquiryHistoryDetails />
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute>
            <StudentsList />
          </ProtectedRoute>
        } />
        <Route path="/student/:id" element={
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <UsersList />
          </ProtectedRoute>
        } />
        <Route path="/user/:id" element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
