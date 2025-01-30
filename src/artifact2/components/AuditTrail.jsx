import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AuditTrail.css';
import Navbar from './Navbar';

const AuditTrail = () => {
  const [auditTrail, setAuditTrail] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/course/audittrail`)
      .then((response) => {
        const sortedData = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first
        setAuditTrail(sortedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to fetch audit trail');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="audit-loading-at">Loading Audit Trail...</div>;
  if (error) return <div className="audit-error-at">{error}</div>;

  return (
    <>
      <div className='MainAt'>
        <Navbar />
        <div className="audit-trail-container-at">
          <h1 className="audit-trail-title-at">Audit Trail</h1>
          <table className="audit-trail-table-at">
            <thead>
              <tr>
                <th>Serial No.</th>
                <th>User ID</th>
                <th>Action</th>
                <th>Date-Time</th>
              </tr>
            </thead>
            <tbody>
              {auditTrail.map((audit) => (
                <tr key={audit.id}>
                  <td>{audit.id}</td>
                  <td>{audit.user_id}</td>
                  <td>{audit.action}</td>
                  <td>{new Date(audit.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AuditTrail;
