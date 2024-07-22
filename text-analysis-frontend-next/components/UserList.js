import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import '@/styles/UserList.css';

const UserList = ({ users, selectedUser, handleUserClick }) => {
  const [isListVisible, setIsListVisible] = useState(false);

  // TODO ? sort users by score, if it has a metric available. Otherwise... either don't touch or make it alphabetically sorted

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  return (
    <div className="user_listing">
      <button className="btn btn-secondary w-100 mt-1" onClick={toggleListVisibility}>
        Individuals {isListVisible ? <FaArrowUp /> : <FaArrowDown />}
      </button>
      {isListVisible && (
        <ul className="list-group list-animated">
          {users.map((user, index) => (
            <li
              key={index}
              className={`list-group-item d-flex justify-content-between ${selectedUser === user.name ? 'bg-secondary' : ''} ${selectedUser === user.name ? 'text-white' : ''}`}
              onClick={() => handleUserClick(user)}
            >
              <span>{user.name}</span>
              {user.globalScore !== null && 
                <span>{(user.globalScore * 100).toFixed(2)}%</span>
              }
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
