import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Task summary card */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Tasks</h2>
          <p>You have 5 tasks in total.</p>
        </div>

        {/* Upcoming deadlines card */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Upcoming Deadlines</h2>
          <p>3 tasks are due soon.</p>
        </div>

        {/* Completed tasks card */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Completed</h2>
          <p>2 tasks have been completed.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
