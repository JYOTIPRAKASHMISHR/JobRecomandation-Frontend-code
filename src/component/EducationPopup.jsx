import React from 'react';
import './EducationPopup.css';

const EducationPopup = ({ onClose,onAddGraduation,onAddSecondary,onAddDiploma,onAddPhD }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-card">
        <div className="popup-header">
          <h2>Education</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="popup-options">
           <div className="popup-option" onClick={onAddGraduation}>➕ Add graduation/ post graduation</div>
          <div className="popup-option" onClick={onAddSecondary}>➕ Add secondary (X)</div>
         
          <div className="popup-option" onClick={onAddDiploma}>➕ Add diploma</div>
          <div className="popup-option"onClick={onAddPhD}>➕ Add PhD</div>
        </div>
      </div>
    </div>
  );
};

export default EducationPopup;
