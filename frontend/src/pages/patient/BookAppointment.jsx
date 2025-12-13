import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import './Patient.css';

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDoctor();
  }, [doctorId]);

  const loadDoctor = async () => {
    try {
      const data = await doctorService.getDoctorById(doctorId);
      setDoctor(data);
    } catch (error) {
      console.error('Failed to load doctor:', error);
      setError('Failed to load doctor information');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await appointmentService.bookAppointment({
        doctor_id: parseInt(doctorId),
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
      });

      navigate('/patient/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading doctor information..." />;
  }

  if (!doctor) {
    return (
      <div className="page-container">
        <Card>
          <p className="error-message">Doctor not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Book Appointment</h1>
        <p>Schedule an appointment with Dr. {doctor.first_name} {doctor.last_name}</p>
      </div>

      <div className="booking-grid">
        <Card title="Doctor Information">
          <div className="doctor-details">
            <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>License:</strong> {doctor.license_number}</p>
            {doctor.bio && <p>{doctor.bio}</p>}
          </div>
        </Card>

        <Card title="Appointment Details">
          <form onSubmit={handleSubmit} className="booking-form">
            {error && <div className="error-alert">{error}</div>}

            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
            />

            <Input
              label="Time"
              type="time"
              name="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />

            <div className="input-group">
              <label htmlFor="reason" className="input-label">
                Reason for Visit <span className="required">*</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="input-field textarea-field"
                placeholder="Describe your symptoms or reason for visit"
                rows="4"
                required
              />
            </div>

            <div className="form-actions">
              <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default BookAppointment;
