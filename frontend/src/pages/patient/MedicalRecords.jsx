import { useState, useEffect } from 'react';
import { medicalRecordService } from '../../services/medicalRecordService';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import './Patient.css';

function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const data = await medicalRecordService.getMyRecords();
      setRecords(data);
    } catch (error) {
      console.error('Failed to load records:', error);
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Medical Records</h1>
        <p>View your medical history and records</p>
      </div>

      {loading ? (
        <Loading message="Loading medical records..." />
      ) : records.length > 0 ? (
        <div className="records-list">
          {records.map((record) => (
            <Card key={record.id}>
              <div className="record-item">
                <div className="record-header">
                  <h3>{record.title}</h3>
                  <span className="record-date">{formatDate(record.date)}</span>
                </div>
                <div className="record-content">
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  <p><strong>Treatment:</strong> {record.treatment}</p>
                  {record.prescription && (
                    <p><strong>Prescription:</strong> {record.prescription}</p>
                  )}
                  {record.notes && (
                    <p><strong>Notes:</strong> {record.notes}</p>
                  )}
                  <p className="record-doctor">Dr. {record.doctor_name}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <p className="empty-state">No medical records found</p>
        </Card>
      )}
    </div>
  );
}

export default MedicalRecords;
