import React, { useState } from 'react';

const AddSkill = ({ profile, setProfile }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [tempSkills, setTempSkills] = useState('');

  const handleSaveSkills = () => {
    const skillsArray = tempSkills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');

    setProfile(prev => ({
      ...prev,
      skills: [...new Set([...(prev.skills || []), ...skillsArray])]
    }));

    setShowPopup(false);
    setTempSkills('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  return (
    <div className="input-block" style={{ marginBottom: '20px' }}>
      <label style={{ fontWeight: 'bold', fontSize: '16px' }}>Skills:</label>

      {/* Skill tags display */}
      <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {profile.skills?.map((skill, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#e0f3ff',
              color: '#007bff',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #007bff',
            }}
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(skill)}
              style={{
                background: 'transparent',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                color: '#007bff',
                fontSize: '16px',
                lineHeight: '1',
              }}
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Add Skill Button */}
      <button
        onClick={() => setShowPopup(true)}
        style={{
          padding: '8px 16px',
          marginTop: '14px',
          border: 'none',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        + Add Skills
      </button>

      {/* Popup for adding skills */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '25px',
            width: '340px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <h3 style={{ marginBottom: '15px', color: '#007bff' }}>Add Skills</h3>

          <input
            type="text"
            placeholder="e.g. Java, React, SQL"
            value={tempSkills}
            onChange={(e) => setTempSkills(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              backgroundColor: '#e9f7f6',
              fontSize: '14px',
            }}
          />

          <div style={{ textAlign: 'right' }}>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                marginRight: '10px',
                padding: '8px 14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSkills}
              style={{
                padding: '8px 14px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddSkill;
