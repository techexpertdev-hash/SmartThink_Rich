import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>SmartThink Rich Dashboard</h1>
      <p>Welcome to the Advanced Trading Platform</p>
      <div className="dashboard-grid">
        <div className="card">Portfolio Overview</div>
        <div className="card">Recent Trades</div>
        <div className="card">Watchlist</div>
        <div className="card">Alerts</div>
      </div>
    </div>
  );
};

export default Dashboard;
