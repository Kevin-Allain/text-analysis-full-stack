import React from 'react';
import { LuLoader } from "react-icons/lu";
import "@/styles/ScoreCard.css";

const ScoreCardPlural = ({ 
    name, color_ai, score_ai, color_plagiarism, score_plagiarism, color_collusion, score_collusion 
}) => {

  const circleStyle = (color) => ({
    backgroundColor: color,
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    minWidth: '40px',
    minHeight: '40px',
    aspectRatio: '1 / 1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',    
  });

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
  };

  const scoresContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
  };

  const scoreItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',    
  };

  const handleClickNavigation = (where) => {
    console.log("handleClickNavigation | where: ",where,", name: ", name);
    window.location.href = where; // Navigate to the specified URL 
  }


  return (
    <div style={containerStyle}>
      <span>{name}</span>
      <div style={scoresContainerStyle}>
        <div style={scoreItemStyle} onClick={() => handleClickNavigation("AI_Detection")}>
          <span>AI Detection</span>
          <div style={circleStyle(color_ai)} >
            {score_ai === "X" ? <LuLoader className="loader-icon"/> : <>{score_ai}</>}
          </div>
        </div>
        <div style={scoreItemStyle} onClick={() => handleClickNavigation("Plagiarism")}>
          <span>Plagiarism</span>
          <div style={circleStyle(color_plagiarism)} >
            {score_plagiarism === "X" ? <LuLoader className="loader-icon" /> : <>{score_plagiarism}</>}
          </div>
        </div>
        <div style={scoreItemStyle} onClick={() => handleClickNavigation("Collusion")}>
          <span>Collusion</span>
          <div style={circleStyle(color_collusion)} >
            {score_collusion === "X" ? <LuLoader className="loader-icon" /> : <>{score_collusion}</>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCardPlural;
