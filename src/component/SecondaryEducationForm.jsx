import React, { useState } from 'react';

const SecondaryEducationForm = ({ onClose, profile, setProfile }) => {
  const [status, setStatus] = useState('');
  const [year, setYear] = useState('');
  const [board, setBoard] = useState('');
  const [scoreType, setScoreType] = useState('Percentage');
  const [scoreValue, setScoreValue] = useState('');
  const [school, setSchool] = useState('');

  const handleSave = () => {
    const updatedEducation = {
      status,
      year,
      board,
      scoreType,
      scoreValue,
      school,
    };

    setProfile({
      ...profile,
      secondaryeducation: updatedEducation,
    });

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Secondary (X) details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <p style={styles.label}>Matriculation status</p>
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="Pursuing"
              checked={status === 'Pursuing'}
              onChange={() => setStatus('Pursuing')}
            />
            <span style={styles.radioText}>Pursuing</span>
          </label>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="status"
              value="Completed"
              checked={status === 'Completed'}
              onChange={() => setStatus('Completed')}
            />
            <span style={styles.radioText}>Completed</span>
          </label>
        </div>

        <label style={styles.label}>Year of completion</label>
        <select style={styles.input} value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Choose year</option>
          {[...Array(25)].map((_, i) => (
            <option key={i} value={2000 + i}>
              {2000 + i}
            </option>
          ))}
        </select>

        <label style={styles.label}>Board</label>
        <input
          type="text"
          placeholder="e.g. CBSE"
          value={board}
          onChange={(e) => setBoard(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>
          Performance score <span style={styles.recommended}>(Recommended)</span>
        </label>
        <div style={styles.row}>
          <select
            style={{ ...styles.input, marginRight: 8 }}
            value={scoreType}
            onChange={(e) => setScoreType(e.target.value)}
          >
            <option value="Percentage">Percentage</option>
            <option value="CGPA">CGPA</option>
          </select>
          <input
            type="text"
            placeholder={scoreType === 'Percentage' ? 'Out of 100' : 'e.g. 10.0'}
            value={scoreValue}
            onChange={(e) => setScoreValue(e.target.value)}
            style={styles.input}
          />
        </div>

        <label style={styles.label}>School</label>
        <input
          type="text"
          placeholder="e.g. Delhi Public School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          style={styles.input}
        />

        <div style={styles.buttonContainer}>
          <button style={styles.saveButton} onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '90%',
    maxWidth: 500,
    fontFamily: 'Segoe UI, sans-serif',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    lineHeight: 1,
  },
  title: {
    fontWeight: 600,
    fontSize: 20,
  },
  label: {
    fontWeight: 500,
    marginBottom: 4,
    marginTop: 16,
    fontSize: 14,
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
    marginBottom: 12,
    marginTop: 8,
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  radioText: {
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  recommended: {
    fontSize: '12px',
    color: '#888',
    marginLeft: 4,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  saveButton: {
    backgroundColor: '#009EF7',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: 6,
    cursor: 'pointer',
  },
};

export default SecondaryEducationForm;
