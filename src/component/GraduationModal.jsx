import React, { useState } from 'react';
import './GraduationModal.css';

const GraduationModal = ({ onClose, profile, setProfile }) => {
  const [college, setCollege] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [degree, setDegree] = useState('');
  const [stream, setStream] = useState('');
  const [percentage, setPercentage] = useState('');

  const handleSave = () => {
    // Validate required fields
    if (!college || !startYear || !endYear || !degree || !stream || !percentage) {
      alert('Please fill all the fields');
      return;
    }

    // Ensure start and end year are not the same
    if (startYear === endYear) {
      alert('Start year and End year must be different');
      return;
    }

    const updatedEducation = {
      college,
      startYear,
      endYear,
      degree,
      stream,
      percentage
    };

    setProfile({
      ...profile,
      graduation: updatedEducation
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content slide-in">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Graduation / Post-Graduation Details</h2>

        <input
          type="text"
          placeholder="e.g. Hindu College"
          className="modal-input"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
        />

        <div className="row">
          <select className="modal-input" value={startYear} onChange={(e) => setStartYear(e.target.value)}>
            <option value="">Start year</option>
            {Array.from({ length: 30 }, (_, i) => {
              const year = 2000 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>

          <select className="modal-input" value={endYear} onChange={(e) => setEndYear(e.target.value)}>
            <option value="">End year</option>
            {Array.from({ length: 30 }, (_, i) => {
              const year = 2000 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="row">
          <input
            type="text"
            placeholder="Degree (e.g. B.Tech, M.Tech)"
            className="modal-input"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
          <input
            type="text"
            placeholder="Stream"
            className="modal-input"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
          />
        </div>

        <div className="info-box">
          <p>
            <strong>Example:</strong> If your degree is B.Sc in Chemistry, then select Bachelor of Science (B.Sc) in <strong>degree</strong> and Chemistry in <strong>stream</strong>.
          </p>
        </div>

       <div className="row">
  <select
    className="modal-input"
    value="Percentage"
    onChange={() => {}} // dummy onChange to silence warning
  >
    <option>Percentage</option>
  </select>
  <input
    type="number"
    placeholder="Out of 100"
    className="modal-input"
    value={percentage}
    onChange={(e) => {
      const val = e.target.value;
      if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
        setPercentage(val);
      }
    }}
  />
</div>


        <button className="save-button" onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default GraduationModal;
