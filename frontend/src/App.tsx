import React from 'react';
import { Routes, Route , Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FindUsernamePage from './pages/FindUsernamePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Pills from './pages/Pills';
import Home from './pages/Home';
import PillDetail from './pages/PillDetail';
import Base from './pages/Base';
import Mypage from './pages/Mypage';
import PillsCalendar from './pages/PillsCalendar';
import AdminBase from './pages/AdminBase';
import AdminUsers from './pages/AdminUsers';
import AdminPills from './pages/AdminPills';
import FeedbackBoard from './pages/FeedbackBoard'

const App = () => {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;  
  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/home" : "/base"} replace />} />
      
      <Route path="/" element={<Layout />}>
          <Route path="base" element={<Base />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="pills" element={<Pills />} />
          <Route path="home" element={<Home />} />
          <Route path="pillsCalendar" element={<PillsCalendar />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="pills/:id" element={<PillDetail />} />
          <Route path="adminBase" element={<AdminBase />} />
          <Route path="admin/users" element={<AdminUsers />} />
          <Route path="admin/pills" element={<AdminPills />} />
          <Route path="feedbackBoard" element={<FeedbackBoard />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/findUsernamePage" element={<FindUsernamePage />} />
      <Route path="/changePasswordPage" element={<ChangePasswordPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
