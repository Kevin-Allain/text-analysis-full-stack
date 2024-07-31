import React, { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import '@/styles/UserList.css';

const UserList = ({ users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile }) => {
  const [isListVisible, setIsListVisible] = useState(false);
  const [fileListVisible, setFileListVisible] = useState(false);

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
    setFileListVisible(false);
  };

  const toggleFilesVisibility = () => {
    setFileListVisible(!fileListVisible);
  };

  return (
    <div className="user_listing">
      <button className="btn btn-secondary w-100 mt-1" onClick={toggleListVisibility}>
        Individuals {isListVisible ? <FaArrowUp /> : <FaArrowDown />}
      </button>
      {isListVisible && (
        <ul className="list-group list-animated">
          {users.map((user, index) => (
            <>
            <div style={{ 
              "border": selectedUser === user.name ? 'solid' : "",
              "border-radius": selectedUser === user.name ? '0.5rem' : "",
              "border-width": selectedUser === user.name ? 'thin' : ""
            }}>
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
              {(selectedUser === user.name && fileList) && (
                <li>
                  <button className="btn w-100" onClick={toggleFilesVisibility}>
                    Files {fileListVisible ? <FaArrowUp /> : <FaArrowDown />}
                  </button>
                  <div className="userFileSelection">
                    {fileListVisible &&
                      fileList.map((file, index) => (
                        <button
                          key={index}
                          className={`btn btn-link ${indexFile === index ? 'active' : ''}`}
                          onClick={() => handleFileClick(index)}
                        >
                          {file}
                        </button>
                      ))
                    }
                  </div>
                </li>
              )}
              </div>
            </>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
