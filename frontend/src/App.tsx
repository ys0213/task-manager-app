import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/layouts/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Pills from './pages/Pills';
import PillDetail from './pages/PillDetail';
import Base from './pages/Base';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Base />} />
        <Route path="base" element={<Base />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pills" element={<Pills />} />
        <Route path="pills/:id" element={<PillDetail />} />
        <Route path="admin" element={<AdminUsers />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
