import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';
import './Navbar.css';

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">+</span> MedConnect
        </Link>

        <div className="navbar-menu">
          {user ? (
            <>
              <Link to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'} className="nav-link">
                Dashboard
              </Link>
              {user.role === 'patient' && (
                <>
                  <Link to="/patient/search-doctors" className="nav-link">
                    Find Doctors
                  </Link>
                  <Link to="/patient/appointments" className="nav-link">
                    Appointments
                  </Link>
                  <Link to="/patient/medical-records" className="nav-link">
                    Records
                  </Link>
                </>
              )}
              {user.role === 'doctor' && (
                <>
                  <Link to="/doctor/appointments" className="nav-link">
                    Appointments
                  </Link>
                  <Link to="/doctor/availability" className="nav-link">
                    Availability
                  </Link>
                </>
              )}
              <button 
                className="user-menu-trigger"
                onClick={goToProfile}
              >
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="user-avatar-img" />
                ) : (
                  <span className="user-avatar">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="user-name">{user.name || user.email}</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
