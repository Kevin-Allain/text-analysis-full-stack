import React from 'react';

function InteractiveSVGText() {
    const handleClick = (text) => {
        alert(`You clicked on: ${text}`);
    };

    return (
        <svg width="800" height="200" style={{ border: '1px solid black' }}>
            <text
                x="100"
                y="100"
                fontSize="16"
                fill="blue"
                onClick={() => handleClick("Hello SVG!")}
                style={{ cursor: 'pointer' }}
            >
                Hello SVG!
            </text>
        </svg>
    );
}

export default InteractiveSVGText;
