import { useState, useEffect } from 'react';
import { availabilityService } from '../../services/availabilityService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import './Doctor.css';

function ManageAvailability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    day_of_week: 'monday',
    start_time: '',
    end_time: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      const data = await availabilityService.getMyAvailability();
      setAvailability(data);
    } catch (error) {
      console.error('Failed to load availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await availabilityService.addAvailability(formData);
      setFormData({
        day_of_week: 'monday',
        start_time: '',
        end_time: '',
      });
      loadAvailability();
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to add availability');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (availabilityId) => {
    if (!confirm('Are you sure you want to delete this availability slot?')) {
      return;
    }

    try {
      await availabilityService.deleteAvailability(availabilityId);
      loadAvailability();
    } catch (error) {
      console.error('Failed to delete availability:', error);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const groupByDay = () => {
    const grouped = {};
    daysOfWeek.forEach(day => {
      grouped[day] = availability.filter(slot => slot.day_of_week === day);
    });
    return grouped;
  };

  const groupedAvailability = groupByDay();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Availability</h1>
        <p>Set your available time slots for appointments</p>
      </div>

      <div className="availability-grid">
        <Card title="Add New Availability">
          <form onSubmit={handleSubmit} className="availability-form">
            {error && <div className="error-alert">{error}</div>}

            <div className="input-group">
              <label htmlFor="day_of_week" className="input-label">
                Day of Week <span className="required">*</span>
              </label>
              <select
                id="day_of_week"
                name="day_of_week"
                value={formData.day_of_week}
                onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                className="input-field"
                required
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="time-inputs">
              <Input
                label="Start Time"
                type="time"
                name="start_time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
              <Input
                label="End Time"
                type="time"
                name="end_time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>

            <Button type="submit" variant="primary" fullWidth disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Availability'}
            </Button>
          </form>
        </Card>

        <Card title="Current Availability">
          {loading ? (
            <Loading message="Loading availability..." />
          ) : (
            <div className="availability-schedule">
              {daysOfWeek.map(day => (
                <div key={day} className="day-section">
                  <h4 className="day-title">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </h4>
                  {groupedAvailability[day] && groupedAvailability[day].length > 0 ? (
                    <div className="time-slots">
                      {groupedAvailability[day].map(slot => (
                        <div key={slot.id} className="time-slot">
                          <span>
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </span>
                          <Button 
                            variant="danger" 
                            onClick={() => handleDelete(slot.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-slots">No availability set</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ManageAvailability;
