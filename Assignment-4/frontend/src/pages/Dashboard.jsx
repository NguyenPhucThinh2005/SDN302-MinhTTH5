import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { logout } from '../redux/authSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div>
      {/* Header matching the screenshot */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2>Dashboard</h2>
        <div>Welcome, {user?.username}</div>
      </div>
      
      {/* Navigation Menu */}
      <div className="bg-light p-2 mb-4">
        <ul className="nav">
          <li className="nav-item">
            <Link className="nav-link text-secondary" to="/dashboard">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-secondary" to="/dashboard/quiz">Quiz</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-secondary" to="#">Article</Link>
          </li>
          <li className="nav-item">
            <button className="nav-link btn btn-link text-secondary text-decoration-none" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
