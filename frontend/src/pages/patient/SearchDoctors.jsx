import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import './Patient.css';

function SearchDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    name: '',
    specialization: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async (params = {}) => {
    setLoading(true);
    try {
      const data = await doctorService.searchDoctors(params);
      setDoctors(data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (searchParams.name) params.name = searchParams.name;
    if (searchParams.specialization) params.specialization = searchParams.specialization;
    loadDoctors(params);
  };

  const handleBooking = (doctorId) => {
    navigate(`/patient/book-appointment/${doctorId}`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find a Doctor</h1>
        <p>Search for doctors by name or specialization</p>
      </div>

      <Card>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-inputs">
            <Input
              label="Doctor Name"
              type="text"
              name="name"
              value={searchParams.name}
              onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
              placeholder="Search by name"
            />
            <Input
              label="Specialization"
              type="text"
              name="specialization"
              value={searchParams.specialization}
              onChange={(e) => setSearchParams({ ...searchParams, specialization: e.target.value })}
              placeholder="e.g., Cardiology"
            />
          </div>
          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>
      </Card>

      <div className="results-section">
        {loading ? (
          <Loading message="Searching doctors..." />
        ) : doctors.length > 0 ? (
          <div className="doctors-grid">
            {doctors.map((doctor) => (
              <Card key={doctor.id}>
                <div className="doctor-card">
                  <div className="doctor-info">
                    <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
                    <p className="specialization">{doctor.specialization}</p>
                    {doctor.bio && <p className="bio">{doctor.bio}</p>}
                    <p className="license">License: {doctor.license_number}</p>
                  </div>
                  <Button variant="primary" fullWidth onClick={() => handleBooking(doctor.id)}>
                    Book Appointment
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <p className="empty-state">No doctors found. Try adjusting your search criteria.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export default SearchDoctors;
