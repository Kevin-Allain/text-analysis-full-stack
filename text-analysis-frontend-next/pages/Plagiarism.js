import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from '@/components/NavBar';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/BreadCrumb';

// import '@/Collusion.module.css';
import '@/styles/PlagiarismFeature.css';
import codecheckerData from '@/public/data/codechecker_plagiarism_example.json';

export default function Plagiarism() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const textRef = useRef(null);
  const detailsScoreRef = useRef(null);

  // const users = [
  //   { name: "Alice", globalScore: 0.45 }, { name: "Bob", "globalScore": 0.48 }, { name: "Charlie", "globalScore": 0.85 }, { name: "David", "globalScore": 0.65 }, { name: "Ethan", "globalScore": 0.95 }, { name: "Francis", "globalScore": 0.22 }, { name: "Gale", "globalScore": 0.42 }, { name: "Hugo", "globalScore": 0.45 }, { name: "Ines", "globalScore": 0.15 }, { name: "Julian", "globalScore": 0.45 }, { name: "Karim", "globalScore": 0.35 }, { name: "Leo", "globalScore": 0.41 }, { name: "Maxim", "globalScore": 0.12 }
  // ].sort((a, b) => b.globalScore - a.globalScore); // Sort users by globalScore

  const users = codecheckerData.data
  .sort((a, b) => b.globalScore - a.globalScore);

  const details = [
    { className: "plagiarism", color: "rgb(216,72,72)", text: "Plagiarism", indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { className: "citations", color: "rgb(72,72,216)", text: "Citations", indications: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { className: "original_content", color: "rgb(76,216,72)", text: "Original Content", indications: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  ]; // Example details list

  // useEffect(() => { if (users.length > 0) { setSelectedUser(users[0]); }}, []);

  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0].name);
    }
  }, [users]);

  useEffect(() => {
    if (selectedUser) {
      const userData = codecheckerData.data.find(user => user.name === selectedUser);
      console.log("useEffect | userData: ",userData,", selectedUser: ",selectedUser);
      console.log("useEffect | codecheckerData: ",codecheckerData);
      if (userData && userData.files.length > 0) {
        fetchFileContent(userData.files[0]);
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    if (textRef.current) {
      const highlights = textRef.current.querySelectorAll('.highlight');
      highlights.forEach(span => {
        span.addEventListener('click', () => {
          handleHighlightClick(span.className.split(' ')[1]);
        });
      });
    }
  }, [fileContent]);


  const fetchFileContent = async (fileName) => {
    try {
      const response = await fetch(`/data/codechecker_files/${fileName}`);
      if (response.ok) {
        const text = await response.text();
        setFileContent(highlightText(text));
      } else {
        setFileContent("Error loading file content.");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content.");
    }
  };

  const highlightText = (text) => {
    const lines = text.split('\n');
    const highlightedLines = lines.map(line => {
      const words = line.split(' ');
      const highlightedWords = words.map(word => {
        const random = Math.random();
        let highlightClass = "";
        if (random < 0.1) {
          highlightClass = "plagiarism";
        } else if (random < 0.2) {
          highlightClass = "citations";
        } else if (random < 0.3) {
          highlightClass = "original_content";
        }
        if (highlightClass) {
          const detail = details.find(d => d.className === highlightClass);
          return `<span class="highlight" style="background-color: ${detail.color}">${word}</span>`;
        }
        return word;
      });
      return highlightedWords.join(' ');
    });
    return highlightedLines.join('\n');
  };

  const handleUserClick = (user) => {
    console.log("handleUserClick | user: ",user,", selectedUser: ",selectedUser);
    setSelectedUser(user.name);
    // Update the text or fetch the new content based on the user selection
  };

  const handleHighlightClick = (className) => {
    console.log("handleHighlightClick | className: ",className);
    const element =
      detailsScoreRef.current.querySelector(`.${className}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail.className === selectedDetail ? null : detail.className);
  };

  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
      </Head>
      <div className="container-fluid">
        <Navbar />
        <div className="row">
          <Sidebar />
          <div className="col-md-7 text_selec">
            <h1>Plagiarism</h1>
            <Breadcrumb />
            <h4>
              {(selectedUser && codecheckerData.data) && 
                codecheckerData.data.find(user => user.name === selectedUser)?.files[0]
              }
            </h4>
            <div ref={textRef} className="text-content">
              <div ref={textRef} className="text-content">
                <pre dangerouslySetInnerHTML={{ __html: fileContent }} />
              </div>
            </div>
          </div>
          <div className="col-md-3 right_side">
            <div className="user_listing">
              <ul className="list-group">
                {users.map((user, index) => (
                  <li
                    key={index}
                    className={`list-group-item d-flex justify-content-between ${selectedUser === user.name ? 'bg-secondary' : ''}  ${selectedUser === user.name ? 'text-white' : ''}`}
                    onClick={() => handleUserClick(user)}
                  >
                    <span>{user.name}</span>
                    <span>{(user.globalScore * 100).toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="details_score" ref={detailsScoreRef}>
              {details.map((item, index) => (
                <div key={index}>
                  <div
                    className={`detail-item ${item.className}`}
                    style={{ backgroundColor: item.color }}
                    onClick={() => handleDetailClick(item)}
                  >
                    {item.text}
                  </div>
                  {selectedDetail === item.className && (
                    <div className="detail-indications">
                      {item.indications}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
