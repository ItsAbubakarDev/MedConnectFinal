import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import './Home.css';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (user) {
        navigate(`/patient/search-doctors?query=${encodeURIComponent(searchQuery)}`);
      } else {
        navigate('/login');
      }
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">🏥 Trusted Healthcare Platform</div>
          <h1 className="hero-title">Find & Book Appointments with Top Doctors</h1>
          <p className="hero-subtitle">
            Connect with verified healthcare professionals, manage your appointments, and access your medical records - all in one secure platform
          </p>

          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search doctors, specializations, or symptoms..."
                className="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="hero-search-button">
              Search Doctors
            </button>
          </form>

          {!user && (
            <div className="hero-cta">
              <Link to="/register">
                <Button variant="primary">Create Free Account</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          )}
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

      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">10,000+</div>
            <div className="stat-label">Active Patients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Verified Doctors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50,000+</div>
            <div className="stat-label">Appointments Completed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2 className="section-title">What Our Users Say</h2>
        <p className="section-subtitle">Trusted by thousands of patients and healthcare professionals</p>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "HealthCare has transformed how I manage my medical appointments. The platform is intuitive, 
              and I love being able to access my medical records anytime, anywhere."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SM</div>
              <div className="author-info">
                <div className="author-name">Sarah Mitchell</div>
                <div className="author-role">Patient</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "As a doctor, this platform has streamlined my practice tremendously. Managing appointments 
              and patient records has never been easier. Highly recommended!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JC</div>
              <div className="author-info">
                <div className="author-name">Dr. James Chen</div>
                <div className="author-role">Cardiologist</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The ease of booking appointments and the quick response from doctors is amazing. 
              I feel more connected to my healthcare than ever before."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MP</div>
              <div className="author-info">
                <div className="author-name">Michael Peterson</div>
                <div className="author-role">Patient</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Excellent platform for managing my pediatric practice. Parents love the convenience, 
              and I appreciate the organized system for tracking patient care."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">EA</div>
              <div className="author-info">
                <div className="author-name">Dr. Emily Anderson</div>
                <div className="author-role">Pediatrician</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Finding specialists has never been easier. The search functionality is great, 
              and I can see doctor availability in real-time. Very impressed!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">LR</div>
              <div className="author-info">
                <div className="author-name">Lisa Rodriguez</div>
                <div className="author-role">Patient</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The security and privacy features give me peace of mind. As a neurologist dealing with 
              sensitive patient data, this platform exceeds my expectations."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">RK</div>
              <div className="author-info">
                <div className="author-name">Dr. Robert Kim</div>
                <div className="author-role">Neurologist</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="partners-section">
        <h2 className="section-title">Our Trusted Partners</h2>
        <p className="section-subtitle">Collaborating with leading healthcare organizations</p>
        
        <div className="partners-grid">
          <div className="partner-card">
            <div className="partner-logo">🏥</div>
            <div className="partner-name">City Medical Center</div>
          </div>
          <div className="partner-card">
            <div className="partner-logo">🏥</div>
            <div className="partner-name">St. Mary's Hospital</div>
          </div>
          <div className="partner-card">
            <div className="partner-logo">🏥</div>
            <div className="partner-name">HealthFirst Clinic</div>
          </div>
          <div className="partner-card">
            <div className="partner-logo">⚕️</div>
            <div className="partner-name">MedTech Solutions</div>
          </div>
          <div className="partner-card">
            <div className="partner-logo">💊</div>
            <div className="partner-name">PharmaCare</div>
          </div>
          <div className="partner-card">
            <div className="partner-logo">🔬</div>
            <div className="partner-name">DiagnosticLab Plus</div>
          </div>
          <div className="partner-card">
            <div className="partner-logo">🏥</div>
            <div className="partner-name">Wellness Medical Group</div>
          </div>
          <div className="partner-card">
            <div className="partner-logo">⚕️</div>
            <div className="partner-name">Healthcare Innovation</div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied patients and healthcare professionals today</p>
          <div className="cta-actions">
            {user ? (
              <Link to={user.role === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}>
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary">Sign Up Now</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
