import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
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

function App() {
  console.log("API_BASE_URL", import.meta.env.VITE_API_URL);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Base />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
