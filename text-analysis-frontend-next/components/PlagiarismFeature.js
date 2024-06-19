import React, { useState, useRef } from 'react';
import '@/styles/PlagiarismFeature.css';

const PlagiarismFeature = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const textRef = useRef(null);
  const detailsScoreRef = useRef(null);

  const users = ['Alice', 'Bob', 'Charlie']; // Example user list
  const details = [
    { color: 'red', text: 'Plagiarism' },
    { color: 'blue', text: 'Citations' },
    { color: 'green', text: 'Original Content' },
  ]; // Example details list

  const handleUserClick = (user) => {
    setSelectedUser(user);
    // Update the text or fetch the new content based on the user selection
  };

  const handleHighlightClick = (color) => {
    const element = detailsScoreRef.current.querySelector(`.color-${color}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="container-fluid plagiarismFeature">
      <div className="row">
        <div className="col-md-8 text_selec">
          <div ref={textRef} className="text-content">
            {/* Sample text with highlights */}
            <p>
              This is some sample text with a <span className="highlight red" onClick={() => handleHighlightClick('red')}>highlighted section</span>.
            </p>
            <p>
              Here is another section with a <span className="highlight blue" onClick={() => handleHighlightClick('blue')}>different highlight</span>.
            </p>
          </div>
        </div>
        <div className="col-md-4 user_listing">
          <ul className="list-group">
            {users.map((user, index) => (
              <li key={index} className="list-group-item" onClick={() => handleUserClick(user)}>
                {user}
              </li>
            ))}
          </ul>
          <div className="details_score" ref={detailsScoreRef}>
            {details.map((item, index) => (
              <div key={index} className={`detail-item color-${item.color}`} style={{ backgroundColor: item.color }}>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlagiarismFeature;
