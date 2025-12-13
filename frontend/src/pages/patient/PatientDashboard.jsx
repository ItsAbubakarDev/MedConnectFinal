import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import './Patient.css';

function PatientDashboard() {
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
        <h1>Welcome, {user?.name || 'Patient'}</h1>
        <p>Manage your appointments and health records</p>
      </div>

      <div className="dashboard-grid">
        <Card title="Quick Actions">
          <div className="quick-actions">
            <Link to="/patient/search-doctors">
              <Button variant="primary" fullWidth>
                Find a Doctor
              </Button>
            </Link>
            <Link to="/patient/medical-records">
              <Button variant="secondary" fullWidth>
                View Medical Records
              </Button>
            </Link>
          </div>
        </Card>

        <Card title="Upcoming Appointments">
          {loading ? (
            <Loading message="Loading appointments..." />
          ) : appointments.length > 0 ? (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-item">
                  <div className="appointment-info">
                    <h4>Dr. {appointment.doctor_name}</h4>
                    <p>{formatDate(appointment.date)}</p>
                    <p>{formatTime(appointment.time)}</p>
                  </div>
                  <span className={`status-badge status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
              <Link to="/patient/appointments" className="view-all-link">
                View all appointments
              </Link>
            </div>
          ) : (
            <p className="empty-state">No upcoming appointments</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default PatientDashboard;
