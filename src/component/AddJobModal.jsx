import React, { useState } from 'react';

const AddJobModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    designation: '',
    profile: '',
    organization: '',
    location: '',
    isRemote: false,
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const validateForm = () => {
    const {
      designation,
      profile,
      organization,
      location,
      startDate,
      endDate,
      currentlyWorking
    } = form;

    if (
      !designation.trim() ||
      !profile.trim() ||
      !organization.trim() ||
      !location.trim() ||
      !startDate ||
      (!currentlyWorking && !endDate)
    ) {
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
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .modal-content {
          background-color: #fff;
          padding: 24px;
          border-radius: 10px;
          width: 100%;
          max-width: 520px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 20px;
        }

        .close-button {
          font-size: 24px;
          border: none;
          background: none;
          cursor: pointer;
          color: #333;
        }

        .modal-body input[type="text"],
        .modal-body input[type="date"],
        .modal-body textarea {
          width: 100%;
          padding: 10px;
          margin: 8px 0 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .modal-body textarea {
          resize: vertical;
        }

        .date-section {
          display: flex;
          gap: 12px;
        }

        .date-section label {
          flex: 1;
          display: flex;
          flex-direction: column;
          font-size: 14px;
        }

        .pro-tip-box {
          background-color: #f1f9ff;
          border-left: 4px solid #007bff;
          padding: 12px;
          font-size: 13px;
          border-radius: 6px;
          margin: 10px 0;
        }

        .pro-tip-box ul {
          margin-top: 6px;
          padding-left: 18px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .save-button {
          background-color: #007bff;
          color: white;
          padding: 8px 16px;
          font-size: 14px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.2s ease-in-out;
        }

        .save-button:hover {
          background-color: #0056b3;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          margin: 6px 0 12px;
        }

        .required {
          color: red;
          margin-left: 2px;
        }
      `}</style>

      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Job Details</h3>
            <button onClick={onClose} className="close-button">&times;</button>
          </div>

          <div className="modal-body">
            <input
              name="designation"
              type="text"
              placeholder="e.g. Software Engineer *"
              value={form.designation}
              onChange={handleChange}
              required
            />
            <input
              name="profile"
              type="text"
              placeholder="e.g. Operations *"
              value={form.profile}
              onChange={handleChange}
              required
            />
            <input
              name="organization"
              type="text"
              placeholder="e.g. Internshala *"
              value={form.organization}
              onChange={handleChange}
              required
            />
            <input
              name="location"
              type="text"
              placeholder="e.g. Mumbai *"
              value={form.location}
              onChange={handleChange}
              required
            />

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isRemote"
                checked={form.isRemote}
                onChange={handleChange}
              />
              Is work from home
            </label>

            <div className="date-section">
              <label>
                Start Date<span className="required">*</span>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                End Date{!form.currentlyWorking && <span className="required">*</span>}
                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  disabled={form.currentlyWorking}
                  required={!form.currentlyWorking}
                />
              </label>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="currentlyWorking"
                checked={form.currentlyWorking}
                onChange={handleChange}
              />
              Currently working here
            </label>

            <label style={{ fontWeight: 'bold', marginTop: '16px' }}>
              Description <span style={{ fontWeight: 'normal' }}>(Optional)</span>
            </label>

            <div className="pro-tip-box">
              <strong>Pro tip:</strong>
              <ul>
                <li>Mention key responsibilities, results, recognition, etc.</li>
                <li>Use action verbs: Built, Led, Drove, etc.</li>
                <li>Use numbers/percentages where possible</li>
                <li>Keep it to 3–4 points</li>
              </ul>
            </div>

            <textarea
              name="description"
              rows="5"
              placeholder="Write your job description here..."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button className="save-button" onClick={handleSubmit}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddJobModal;
