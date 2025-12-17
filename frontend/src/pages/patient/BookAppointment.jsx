import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { availabilityService } from '../../services/availabilityService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import './Patient.css';

function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState('');
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDoctorData();
  }, [doctorId]);

  const loadDoctorData = async () => {
    try {
      const [doctorData, availabilityData, appointmentsData] = await Promise.all([
        doctorService.getDoctorById(doctorId),
        availabilityService.getDoctorAvailability(doctorId),
        appointmentService.getMyAppointments().catch(() => [])
      ]);
      setDoctor(doctorData);
      setAvailability(availabilityData);
      setBookedAppointments(appointmentsData);
      generateAvailableSlots(availabilityData, appointmentsData);
    } catch (error) {
      console.error('Failed to load doctor data:', error);
      setError('Failed to load doctor information');
    } finally {
      setLoading(false);
    }
  };

  const getDayOfWeek = (dateString) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const generateTimeSlots = (startTime, endTime, interval = 30) => {
    const slots = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const timeSlot = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
      slots.push(timeSlot);
      
      currentMinute += interval;
      if (currentMinute >= 60) {
        currentHour += 1;
        currentMinute -= 60;
      }
    }
    
    return slots;
  };

  const generateAvailableSlots = (availabilityData, appointmentsData) => {
    const slots = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Generate slots for next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = getDayOfWeek(dateString);
      
      // Find availability for this day
      const dayAvailability = availabilityData.filter(slot => slot.day_of_week === dayOfWeek);
      
      if (dayAvailability.length > 0) {
        dayAvailability.forEach(avail => {
          const timeSlots = generateTimeSlots(avail.start_time, avail.end_time);
          
          timeSlots.forEach(time => {
            // Check if this slot is already booked
            const isBooked = appointmentsData.some(apt => 
              apt.doctor_id === doctorId && 
              apt.date === dateString && 
              apt.time === time &&
              (apt.status === 'pending' || apt.status === 'confirmed')
            );
            
            if (!isBooked) {
              slots.push({
                date: dateString,
                time: time,
                dayOfWeek: dayOfWeek,
                dateObj: date
              });
            }
          });
        });
      }
    }
    
    setAvailableSlots(slots);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowReasonModal(true);
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot || !reason.trim()) {
      setError('Please provide a reason for your visit');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await appointmentService.bookAppointment({
        doctor_id: doctorId,
        date: selectedSlot.date,
        time: selectedSlot.time,
        reason: reason,
      });

      navigate('/patient/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to book appointment');
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const groupSlotsByDate = () => {
    const grouped = {};
    availableSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
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

  const groupedSlots = groupSlotsByDate();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Book Appointment</h1>
        <p>Select an available time slot with Dr. {doctor.first_name} {doctor.last_name}</p>
      </div>

      <div className="booking-grid">
        <Card title="Doctor Information">
          <div className="doctor-details">
            <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
            <p><strong>Specialization:</strong> {doctor.specialization}</p>
            <p><strong>License:</strong> {doctor.license_number}</p>
            {doctor.bio && <p>{doctor.bio}</p>}
            
            {availability.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4>Available Hours:</h4>
                <div style={{ marginTop: '10px' }}>
                  {availability.map((slot, index) => (
                    <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      <strong style={{ textTransform: 'capitalize' }}>{slot.day_of_week}:</strong>{' '}
                      {slot.start_time} - {slot.end_time}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Available Time Slots">
          {error && <div className="error-alert" style={{marginBottom: '16px'}}>{error}</div>}

          {availability.length === 0 && (
            <div className="info-alert" style={{padding: '12px', backgroundColor: '#FFF4E5', border: '1px solid #FFE0B2', borderRadius: '4px', color: '#E65100'}}>
              This doctor has not set their availability yet. Please try again later or choose another doctor.
            </div>
          )}

          {availability.length > 0 && availableSlots.length === 0 && (
            <div className="info-alert" style={{padding: '12px', backgroundColor: '#FFF4E5', border: '1px solid #FFE0B2', borderRadius: '4px', color: '#E65100'}}>
              No available slots for the next 14 days. Please check back later.
            </div>
          )}

          {availableSlots.length > 0 && (
            <div className="slots-container">
              {Object.keys(groupedSlots).map(date => (
                <div key={date} className="date-group">
                  <h4 className="date-header">{formatDate(date)}</h4>
                  <div className="time-slots-grid">
                    {groupedSlots[date].map((slot, index) => (
                      <button
                        key={index}
                        className="time-slot-button"
                        onClick={() => handleSlotClick(slot)}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </Card>
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="modal-overlay" onClick={() => !submitting && setShowReasonModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Appointment</h3>
            <p>
              <strong>Date:</strong> {formatDate(selectedSlot.date)}<br />
              <strong>Time:</strong> {selectedSlot.time}
            </p>
            
            <div className="input-group">
              <label htmlFor="reason" className="input-label">
                Reason for Visit <span className="required">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-field textarea-field"
                placeholder="Describe your symptoms or reason for visit"
                rows="4"
                autoFocus
              />
            </div>

            {error && <div className="error-alert">{error}</div>}

            <div className="modal-actions">
              <Button variant="outline" onClick={() => !submitting && setShowReasonModal(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleBookAppointment} disabled={submitting || !reason.trim()}>
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
