import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import './Doctor.css';

function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getMyAppointments();
      setAppointments(data.slice(0, 5));
    } catch (error) {
      console.error('Failed to load appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status);
      loadAppointments();
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-profile">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" className="dashboard-profile-img" />
            ) : (
              <div className="dashboard-profile-placeholder">
                <span>{(user?.name || 'D').charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="dashboard-header-text">
            <h1>Welcome, Dr. {user?.name || 'Doctor'}</h1>
            <p>Manage your appointments and availability</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <Card title="Quick Actions">
          <div className="quick-actions">
            <Link to="/doctor/availability">
              <Button variant="primary" fullWidth>
                Manage Availability
              </Button>
            </Link>
            <Link to="/doctor/appointments">
              <Button variant="secondary" fullWidth>
                View All Appointments
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="Recent Appointments">
          {loading ? (
            <Loading message="Loading appointments..." />
          ) : appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <h4>Patient: {appointment.patient_name}</h4>
                    <span className={`status-badge status-${appointment.status}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <p><strong>Date:</strong> {formatDate(appointment.date)}</p>
                    <p><strong>Time:</strong> {formatTime(appointment.time)}</p>
                    <p><strong>Reason:</strong> {appointment.reason}</p>
                  </div>
                  {appointment.status === 'pending' && (
                    <div className="appointment-actions">
                      <Button 
                        variant="primary" 
                        onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                      >
                        Confirm
                      </Button>
                      <Button 
                        variant="danger" 
                        onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No appointments scheduled</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DoctorDashboard;
