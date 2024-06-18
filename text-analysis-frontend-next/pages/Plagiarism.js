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

  const users = codecheckerData.data
  .sort((a, b) => b.globalScore - a.globalScore);

  const details = [
    { className: "plagiarism", 
      color: "rgb(216,72,72)", 
      text: "Plagiarism 1", 
      indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { className: "plagiarism2", 
      color: "rgb(72,72,216)", 
      text: "Plagiarism 2", 
      indications: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { className: "plagiarism3", 
      color: "rgb(76,216,72)", 
      text: "Plagiarism 3", 
      indications: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
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
        fetchFileContent(userData.files[0],userData.scoreDetails['file1']);
      }
    }
  }, [selectedUser]);

  useEffect(() => {
    if (textRef.current) {
      const highlights = textRef.current.querySelectorAll('.highlight');
      highlights.forEach(span => {
        span.addEventListener('click', () => {
          console.log("useEffect fileContent | span: ",span,", span.className: ",span.className);
          handleHighlightClick(span.className.split(' ')[1]);
        });
      });
    }
  }, [fileContent]);


  const fetchFileContent = async (fileName, scoreDetails) => {
    try {
      const response = await fetch(`/data/codechecker_files/${fileName}`);
      if (response.ok) {
        const text = await response.text();
        console.log("fetchFileContent | text: ",text);
        setFileContent(highlightText(text, scoreDetails));
      } else {
        setFileContent("Error loading file content.");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content.");
    }
  };

  // const highlightText = (text) => {
  //   const lines = text.split('\n');
  //   const highlightedLines = lines.map(line => {
  //     const words = line.split(' '); 
  //     const highlightedWords = words.map(word => {
  //       const random = Math.random();
  //       let highlightClass = "";
  //       if (random < 0.1) {
  //         highlightClass = "plagiarism";
  //       } else if (random < 0.2) {
  //         highlightClass = "plagiarism2";
  //       } else if (random < 0.3) {
  //         highlightClass = "plagiarism3";
  //       }
  //       if (highlightClass) {
  //         const detail = details.find(d => d.className === highlightClass);
  //         return `<span class="highlight ${highlightClass}" style="background-color: ${detail.color}">${word}</span>`;
  //       }
  //       return word;
  //     });
  //     return highlightedWords.join(' ');
  //   });
  //   return highlightedLines.join('\n');
  // };

  const highlightText = (text, scoreDetails) => {
    let highlightedText = text;

    let sizeOffset = 0;

    scoreDetails.forEach(detail => {
      console.log("highlightText | highlightedText: ",highlightedText)
      const { type, range } = detail;
      const detailInfo = details.find(d => d.className === type);
      console.log("highlightText | detailInfo: ", detailInfo);
      console.log("highlightText | sizeOffset: ",sizeOffset)
      const highlightStart = `<span class="highlight ${type}" style="background-color: ${detailInfo.color}">`;
      const highlightEnd = "</span>";
      const start = range[0];
      const end = range[1];
      // switched to text instead of highlightedText... but probably going to mess up and only keep the last one fine?
      highlightedText =
        highlightedText.slice(0, start + sizeOffset) +
        highlightStart +
        highlightedText.slice(start + sizeOffset, end + sizeOffset + 1) +
        highlightEnd +
        highlightedText.slice(end + sizeOffset + 1);
      
      sizeOffset+= highlightStart.length + highlightEnd.length;
    });
    return highlightedText;
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
            {/* TODO click to change file */}
            {selectedUser && 
            <p>{codecheckerData.data.find(user => user.name === selectedUser).files.toString()}</p>
            }
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
