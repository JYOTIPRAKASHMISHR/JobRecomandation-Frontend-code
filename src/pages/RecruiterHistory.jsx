import React, { useEffect, useState } from "react";
import "./RecruiterHistory.css";
import Recruiter from "./Recruiter";

const RecruiterHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState("ALL");

 useEffect(() => {
  fetch("http://localhost:8080/api/applications/history")
    .then(res => res.json())
    .then(data => setHistory(data))
    .catch(err => console.error(err));
}, []);

  const filteredData =
    filter === "ALL"
      ? history
      : history.filter(h => h.status === filter);

  return (
    <div>
      <Recruiter />

      <div className="history-page">
        <h1>📊 Recruitment History</h1>

        {/* FILTER */}
        <div className="filters">
          <button onClick={() => setFilter("ALL")}>All</button>
          <button onClick={() => setFilter("HIRED")}>Hired</button>
          <button onClick={() => setFilter("REJECTED")}>Rejected</button>
        </div>

        {/* TABLE */}
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Job</th>
              <th>Status</th>
              <th>Date</th>
              <th>Offer</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.jobTitle}</td>

                <td className={`status ${item.status}`}>
                  {item.status}
                </td>

               <td>
    {item.actionDate
      ? new Date(item.actionDate).toLocaleDateString()
      : "N/A"}
  </td>

                <td>
                 {(item.status === "HIRED" || item.status === "OFFERED") && (
  <button
    className="offer-btn"
    onClick={() =>
      window.open(
        `http://localhost:8080/api/applications/offer/${item.id}`,
        "_blank"
      )
    }
  >
    Download Offer
  </button>
)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default RecruiterHistory;