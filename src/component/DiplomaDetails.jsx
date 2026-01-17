import React, { useState } from 'react';

const DiplomaDetails = ({ onClose, profile, setProfile }) => {
  const [college, setCollege] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [stream, setStream] = useState('');
  const [scoreType, setScoreType] = useState('Percentage');
  const [score, setScore] = useState('');

  const handleSave = () => {
    const diplomaData = {
      college,
      startYear,
      endYear,
      stream,
      scoreType,
      score,
    };

    setProfile({
      ...profile,
      diploma: diplomaData,
    });

    onClose();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Diploma Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <label style={styles.label}>College</label>
        <input
          type="text"
          placeholder="e.g. IGNOU"
          value={college}
          onChange={(e) => setCollege(e.target.value)}
          style={styles.input}
        />

        <div style={styles.row}>
          <div style={styles.column}>
            <label style={styles.label}>Start Year</label>
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              style={styles.input}
            >
              <option value="">Choose year</option>
              {[...Array(30)].map((_, i) => {
                const year = 2025 - i;
                return (
                  <option key={year} value={year}>{year}</option>
                );
              })}
            </select>
          </div>

          <div style={styles.column}>
            <label style={styles.label}>End Year</label>
            <select
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              style={styles.input}
            >
              <option value="">Choose year</option>
              {[...Array(30)].map((_, i) => {
                const year = 2025 - i;
                return (
                  <option key={year} value={year}>{year}</option>
                );
              })}
            </select>
          </div>
        </div>

        <label style={styles.label}>Stream</label>
        <input
          type="text"
          placeholder="e.g. Computer Science"
          value={stream}
          onChange={(e) => setStream(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>
          Performance Score <span style={styles.recommended}>(Recommended)</span>
        </label>
        <div style={styles.row}>
          <select
            value={scoreType}
            onChange={(e) => setScoreType(e.target.value)}
            style={{ ...styles.input, marginRight: 8 }}
          >
            <option value="Percentage">Percentage</option>
            <option value="CGPA">CGPA</option>
          </select>
          <input
            type="number"
            placeholder={scoreType === 'Percentage' ? 'Out of 100' : 'e.g. 10.0'}
            value={score}
            onChange={(e) => {
              const value = e.target.value;
              if (scoreType === 'Percentage' && value > 100) return;
              setScore(value);
            }}
            style={styles.input}
          />
        </div>

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
  column: {
    flex: 1,
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

export default DiplomaDetails;
