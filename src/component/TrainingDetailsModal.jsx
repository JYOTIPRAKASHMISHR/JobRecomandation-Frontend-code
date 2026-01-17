import React, { useState } from "react";

const TrainingDetailsModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    trainingProgram: "",
    organization: "",
    online: false,
    location: "",
    startDate: "",
    endDate: "",
    currentlyOngoing: false,
    description: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const validateForm = () => {
    const { trainingProgram, organization, startDate, endDate, currentlyOngoing } = form;
    if (!trainingProgram.trim() || !organization.trim() || !startDate || (!currentlyOngoing && !endDate)) {
      alert("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(form);
      onClose();
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: #fff;
          border-radius: 10px;
          padding: 24px 28px;
          width: 100%;
          max-width: 540px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          font-family: 'Segoe UI', sans-serif;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eaeaea;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 20px;
          color: #333;
        }

        .close-button {
          font-size: 24px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          transition: color 0.2s;
        }

        .close-button:hover {
          color: #000;
        }

        .modal-body label {
          display: block;
          margin-bottom: 12px;
          font-size: 14px;
          color: #333;
        }

        .modal-body input[type="text"],
        .modal-body input[type="date"],
        .modal-body textarea {
          width: 100%;
          padding: 10px 12px;
          margin-top: 4px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .modal-body textarea {
          resize: vertical;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 16px 0 12px;
          font-size: 14px;
          color: #444;
        }

        .date-section {
          display: flex;
          gap: 12px;
        }

        .date-section label {
          flex: 1;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .save-button {
          background-color: #007bff;
          color: white;
          padding: 10px 18px;
          font-size: 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .save-button:hover {
          background-color: #005bb5;
        }

        @media (max-width: 600px) {
          .modal-content {
            margin: 0 16px;
            padding: 20px;
          }
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Training Details</h3>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="modal-body">
            <label>
              Training Program *
              <input
                type="text"
                name="trainingProgram"
                placeholder="e.g. Data Science"
                value={form.trainingProgram}
                onChange={handleChange}
              />
            </label>

            <label>
              Organization *
              <input
                type="text"
                name="organization"
                placeholder="e.g. Coursera"
                value={form.organization}
                onChange={handleChange}
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="online"
                checked={form.online}
                onChange={handleChange}
              />
              Online Training
            </label>

            <label>
              Location
              <input
                type="text"
                name="location"
                placeholder="e.g. Delhi"
                value={form.location}
                onChange={handleChange}
                disabled={form.online}
              />
            </label>

            <div className="date-section">
              <label>
                Start Date *
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
              </label>

              <label>
                End Date {!form.currentlyOngoing && '*'}
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  disabled={form.currentlyOngoing}
                />
              </label>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="currentlyOngoing"
                checked={form.currentlyOngoing}
                onChange={handleChange}
              />
              Currently Ongoing
            </label>

            <label>
              Description (optional)
              <textarea
                name="description"
                rows="4"
                placeholder="Describe the training program..."
                value={form.description}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-footer">
            <button onClick={handleSubmit} className="save-button">
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainingDetailsModal;
