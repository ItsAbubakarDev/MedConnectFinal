import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to HealthCare</h1>
          <p className="hero-subtitle">
            Your trusted platform for managing medical appointments and health records
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}>
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Appointment Booking</h3>
            <p>Schedule appointments with qualified doctors in just a few clicks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Verified Doctors</h3>
            <p>Connect with licensed and experienced healthcare professionals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Medical Records</h3>
            <p>Access and manage your medical history securely in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your health information is protected with enterprise-grade security</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
