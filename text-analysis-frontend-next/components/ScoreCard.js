import React from 'react';
import { LuLoader } from "react-icons/lu";
import "@/styles/ScoreCard.css";

const ScoreCard = ({ text, color, score }) => {
  const circleStyle = {
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
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    // border: '1px solid #ccc',
  };

  return (
    <div style={containerStyle}>
      <span>{text}</span>
      <div style={circleStyle}>
        {score === "X" ? <LuLoader className="loader-icon" /> : <>{score}</>}
      </div>
    </div>
  );
};

export default ScoreCard;
