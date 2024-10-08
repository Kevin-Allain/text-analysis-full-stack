import React from 'react';
import { LuLoader } from "react-icons/lu";
import "@/styles/ScoreCard.css";
import individuals_history from "@/public/data/codechecker_individual_history_example.json"

const ScoreCardHistory = ({ selectedUser }) => {
  const colorLowRisk = "#3cc343"; // green
  const colorMediumRisk = "#d97826"; // orange
  const colorHighRisk = "#d2342d"; // red
  const historyUser = individuals_history.filter(a => a.name === selectedUser)[0];

  if (!historyUser) { return <div>User not found</div>; }

  const circleStyle = (color) => ({ backgroundColor: color, borderRadius: '50%', width: '40px', height: '40px', minWidth: '40px', minHeight: '40px', aspectRatio: '1 / 1', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', cursor: 'pointer', });
  const containerStyle = { display: 'flex', flexDirection: 'column', width: '100%', padding: '10px', };
  const moduleContainerStyle = { marginBottom: '20px', };
  const courseworkStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '10px 0', };
  const scoresContainerStyle = { display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '70%', };
  const scoreItemStyle = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', };

  // Navigate to the specified URL
  const handleClickNavigation = (where) => { window.location.href = where; };

  const getColor = (score) => {
    if (score < 33) return colorLowRisk;
    if (score < 66) return colorMediumRisk;
    return colorHighRisk;
  };

  return (
    <div style={containerStyle}>
      {Object.entries(historyUser.modules).map(([moduleName, courseworks]) => (
        <div key={moduleName} style={moduleContainerStyle}>
          <h3>{moduleName}</h3>
          {Object.entries(courseworks).map(([courseworkTitle, scores]) => (
            <div key={courseworkTitle} style={courseworkStyle}>
              <span>{courseworkTitle}</span>
              <div style={scoresContainerStyle}>
                <div style={scoreItemStyle}
                  onClick={() => handleClickNavigation("AI_Detection")}
                  onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'initial'}
                >
                  <span>AI Detection</span>
                  <div style={circleStyle(getColor(scores.AI_Detection))}>
                    {scores.AI_Detection}
                  </div>
                </div>
                <div style={scoreItemStyle} onClick={() => handleClickNavigation("Plagiarism")}
                  onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'initial'}
                >
                  <span>Plagiarism</span>
                  <div style={circleStyle(getColor(scores.Plagiarism))}>
                    {scores.Plagiarism}
                  </div>
                </div>
                <div style={scoreItemStyle} onClick={() => handleClickNavigation("Similarity")}
                  onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'initial'}>
                  <span>Similarity</span>
                  <div style={circleStyle(getColor(scores.Collusion))}>
                    {scores.Collusion}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScoreCardHistory;
