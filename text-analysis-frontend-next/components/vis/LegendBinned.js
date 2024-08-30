import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { calculateOpacity, getBinFromScore } from '@/utils/UtilsMath';

const LegendBinned = ({ minScore, maxScore, numBins, onSelectBin, selectedBin }) => {
  const binSize = (maxScore - minScore) / numBins;

  return (
    <div className="container mt-4">
      <h5>Legend</h5>
      <div className="d-flex align-items-center">
        <span>{minScore.toFixed(2)}</span>
        <div className="d-flex flex-grow-1 mx-2">
          {Array.from({ length: numBins }, (_, binIndex) => {
            const binStart = minScore + binIndex * binSize;
            const binEnd = binStart + binSize;
            const opacity = calculateOpacity(binStart, minScore, maxScore, true, numBins);
            return (
              <div
                key={binIndex}
                index={binIndex}
                onClick={() => onSelectBin(binIndex, binStart, binEnd)}
                style={{
                  flex: 1,
                  height: '20px',
                  backgroundColor: `rgba(0, 100, 0, ${opacity})`, // Change from red to dark green
                  cursor: 'pointer',
                  border: selectedBin === binIndex ? '2px solid black' : '1px solid #ddd',
                  binIndex: `${binIndex}`
                }}
                title={`Range: ${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`}
              ></div>
            );
          })}
        </div>
        <span>{maxScore.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default LegendBinned;
