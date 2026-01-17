import React, { useState } from 'react';

const ProjectDetailsModal = ({ onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [ongoing, setOngoing] = useState(false);
  const [description, setDescription] = useState('');
  const [projectLink, setProjectLink] = useState('');

  const handleSave = () => {
    const projectData = {
      title,
      startMonth,
      endMonth: ongoing ? 'Ongoing' : endMonth,
      description,
      projectLink,
    };
    onSave(projectData);
    onClose();
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #ffffff;
          width: 100%;
          max-width: 500px;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
          position: relative;
          font-family: 'Segoe UI', sans-serif;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .modal-header h2 {
          font-size: 20px;
          font-weight: 600;
          color: #333;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .close-btn:hover {
          color: #000;
        }

        label {
          font-size: 14px;
          color: #333;
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
        }

        .input-field {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 18px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
          box-sizing: border-box;
        }

        textarea {
          resize: vertical;
          min-height: 80px;
        }

        .date-row-enhanced {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .date-input-group {
          flex: 1;
          min-width: 150px;
          display: flex;
          flex-direction: column;
        }

        .date-input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
          transition: border 0.3s;
        }

        .date-input:focus {
          border-color: #00aaff;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 170, 255, 0.1);
        }

        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .save-btn {
          width: 100%;
          background-color: #007bff;
          color: white;
          padding: 12px;
          font-size: 15px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .save-btn:hover {
          background-color: #0056b3;
        }

        .optional {
          font-size: 12px;
          font-weight: normal;
          color: #777;
        }

        @media (max-width: 480px) {
          .modal-content {
            padding: 20px;
          }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Project Details</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            className="input-field"
            placeholder="e.g. Optical Character Recognition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="date-row-enhanced">
            <div className="date-input-group">
              <label htmlFor="startMonth">Start Month</label>
              <input
                id="startMonth"
                type="month"
                className="date-input"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />
            </div>
            <div className="date-input-group">
              <label htmlFor="endMonth">End Month</label>
              <input
                id="endMonth"
                type="month"
                className="date-input"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                disabled={ongoing}
              />
            </div>
          </div>

          <div className="checkbox-row">
            <input
              id="ongoing"
              type="checkbox"
              checked={ongoing}
              onChange={(e) => setOngoing(e.target.checked)}
            />
            <label htmlFor="ongoing">Currently Ongoing</label>
          </div>

          <label htmlFor="description">
            Description <span className="optional">(Optional)</span>
          </label>
          <textarea
            id="description"
            className="input-field"
            placeholder="Describe your project..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="projectLink">
            Project Link <span className="optional">(Optional)</span>
          </label>
          <input
            id="projectLink"
            type="url"
            className="input-field"
            placeholder="e.g. https://myproject.com"
            value={projectLink}
            onChange={(e) => setProjectLink(e.target.value)}
          />

          <button className="save-btn" onClick={handleSave}>Save Project</button>
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsModal;
