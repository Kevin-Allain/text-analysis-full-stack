import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';

import Head from 'next/head'
import Navbar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Breadcrumb from '@/components/BreadCrumb'
import CollusionNetworkGraph from '@/components/vis/CollusionNetworkGraph'
import HorizontalNav from '@/components/HorizontalNav';

import { FormDataContext } from '@/components/context/FormDataContext';
import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';


export default function AI_Detection(){
  // ---- useState
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [indexFile, setIndexFile] = useState(0);
  const [fileList, setFileList] = useState([]);

  const [outputAI, setOutputAI] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const { formData, setFormData } = useContext(FormDataContext);

  const users = codecheckerData_plagiarism.data.sort((a, b) => b.globalScore - a.globalScore);
  const details = [
    { className: "plagiarism", color: "rgba(216,72,72,0.5)", text: "Plagiarism 1", indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { className: "plagiarism2", color: "rgba(72,72,216,0.5)", text: "Plagiarism 2", indications: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { className: "plagiarism3", color: "rgba(76,216,72,0.5)", text: "Plagiarism 3", indications: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  ]; // Example details list

  // ---- functions
  const fetchFileContent = async (fileName, scoreDetails) => {
    try {
      const response = await fetch(`/data/codechecker_files/${fileName}`);
      if (response.ok) {
        // first, load the file
        const textFile = await response.text();

        // TODO verify if we put the details already in scoreDetails

        // second, call the AI
        loadAIText(textFile);

        console.log("fetchFileContent |scoreDetails: ",scoreDetails);

        // TODO third, make transposition so that output can be highlighted
        // TODO ---- incorporate this code so that we make the transition from data.details to scoreDetails (we'll do highlighting after)     
        // Example usage
        const name = "Leo";
        const numSubmissions = 7;
        const files = ["PredatorMovement.cs", "PreyEvading.cs"];
        // dataTest is supposed to be like outputAI
        const dataTest = { average: 0.599, details: [ { text: "Ċ", value: 0.79 }, { text: 'st', value: 0.76 }, { text: 'ories', value: 0.36 }, { text: "Ġof", value: 0.02 }, { text: "Ġfairy", value: 0.02 }, { text: "Ġtales", value: 0.02 }, { text: "Ġlike", value: 0.72 }, { text: "Ġthis", value: 0.02 }, { text: "Ġare", value: 0.02 }, { text: "Ġnice", value: 0.02 }, { text: "Ċ", value: 0.79 }, { text: "Ċ", value: 0.79 }, { text: 'Right?', value: 0.76 }, ] };
        // originalText is supposed to be like the content of the file
        const originalText = "\nStories of fairy tales like this are nice\n\nRight?.";      
        const result = transformDataToScoreDetails(name, numSubmissions, files, dataTest, originalText);
        console.log("result transformDataToScoreDetails: ",result);

        let detailsAI = null;
        // fourth, apply highlight
        // setFileContent(highlightText(text, detailsAI));
        setFileContent(textFile); // TODO Will have to be updated... maybe with result
      } else {
        setFileContent("Error loading file content.");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content.");
    }
  };


  function transformDataToScoreDetails(name, numSubmissions, files, data, originalText) {
    // Helper function to replace special characters
    const replaceSpecialCharacters = (text) => { return text.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n'); };  
    // Initialize the start of the range
    let previousEndIndex = -1;
  
    // Transform the details array with range calculation
    const transformedDetails = data.details.map((detail, index) => {
      const modifiedText = replaceSpecialCharacters(detail.text);
      let startIndex;
      if (modifiedText === '\n') {
        startIndex = previousEndIndex + 1;
      } else {
        startIndex = originalText.indexOf(modifiedText, previousEndIndex + 1);
        if (startIndex === -1) {
          console.warn(`Text fragment "${modifiedText}" not found in the original text.`);
          startIndex = previousEndIndex + 1;
        }
      }
      const endIndex = startIndex + modifiedText.length - 1;
      previousEndIndex = endIndex;  
      return {
        type: 'ai_detection', range: [startIndex, endIndex], score: detail.value, text: modifiedText
      };
    });
    // Construct the new object
    const scoreDetails = {
      name: name, globalScore: data.average, numSubmissions: numSubmissions, files: files, scoreDetails: transformedDetails
    };  
    return scoreDetails;
  } 

  const loadAIText = async (textFile) => {
    console.log("loadAIText");
    setOutputAI([]);
    setIsLoadingAI(true);
    try {
      console.log("window.location.href loadAIText: ", window.location.href);
      const is_localhost = window.location.href.indexOf("localhost");
      const is_127_0_0_1 = window.location.href.indexOf("127.0.0.1");
      const strAnalyze = is_localhost
        ? window.location.href
          .replace("TextAnalysis",'').replace("AI_Detection",'').replace("3000", "5000") 
          + "api/analyze_t_b"
        : window.location
          .replace("TextAnalysis",'').replace("AI_Detection",'').href 
          + "api/analyze_t_b";
      console.log("strAnalyze AI Text: ", strAnalyze);
      // Flask runs on port 5000 by default
      const response = await fetch(strAnalyze, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textFile }),
      });
      if (!response.ok) throw new Error("Network response was not ok.");
      const data = await response.json();
      console.log("data loadAIText: ", data);
      setOutputAI(data);
      // setOutputAI(JSON.stringify(data, null, 2)); // Update your state or UI accordingly
      console.log("odd structure type: ", typeof JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error during API call:", error);
    } finally {
      setIsLoadingAI(false); // Stop loading regardless of the outcome
    }
  };
  // Map word length to hue (0-360)
  const mapLengthToHue = (length, minLength, maxLength) => {
    const range = maxLength - minLength;
    const scale = length - minLength;
    // Assuming a hue range from 240 (blue) to 0 (red)
    return 240 - (scale / range) * 240;
  };
  const getBackgroundColor = (length) => {
    const hue = mapLengthToHue(length, minLength, maxLength); // Map length to hue
    const saturation = 70;
    const lightness = 50;
    const alpha = 0.85;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };
  const getBackgroundColorAI = (outputAI, index) => {
    const curScore = outputAI.details[index].value,
      maxScore = Math.max(...outputAI.details.map((a) => a.value)),
      minScore = Math.min(...outputAI.details.map((a) => a.value));
    const hue = mapLengthToHue(curScore, minScore, maxScore); // Map length to hue
    const saturation = 70;
    const lightness = 50;
    const alpha = 0.85;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  };

  const handleUserClick = (user) => { setSelectedUser(user.name); setIndexFile(0); // Reset to the first file
  };

  const handleFileClick = (index) => {
    setIndexFile(index);
  };
  

  // ---- useEffect
  const textRef = useRef(null);
  const detailsScoreRef = useRef(null);
  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0].name);
    }
  }, [users]);

  useEffect(() => {
    if (selectedUser) {
      const userData = codecheckerData_plagiarism.data.find(user => user.name === selectedUser);
      if (userData && userData.files.length > 0) {
        setFileList(userData.files);
        fetchFileContent(userData.files[indexFile], userData.scoreDetails[indexFile]);
      }
    }
  }, [selectedUser, indexFile]);

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



  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
      </Head>
      <div className="container-fluid">
        <Navbar />
        <div className="row">
          <Sidebar/>
          <div className="col-md-10">
          <HorizontalNav/>          
            <h1> {formData?.product && formData?.product} AI_Detection - Details</h1>
            <div className="row">
              <div className="col-md-7">
               <Breadcrumb />
               <>
                <div>
                  Submission from {selectedUser} with a score of {codecheckerData_plagiarism.data.find(user => user.name === selectedUser)?.globalScore}. Number of submissions: {codecheckerData_plagiarism.data.find(user => user.name === selectedUser)?.numSubmissions}.
                </div>
                <div>
                  <u>Files</u>
                  {selectedUser && 
                    fileList.map((file, index) => (
                      <button key={index} className={`btn btn-link ${indexFile === index ? 'active' : ''}`} onClick={() => handleFileClick(index)}>
                        {file}
                      </button>
                    ))
                  }
                </div>
                <h4>
                  {(selectedUser && codecheckerData_plagiarism.data) &&
                    codecheckerData_plagiarism.data.find(user => user.name === selectedUser)?.files[indexFile]
                  }
                </h4>
                </>
               {isLoadingAI ? (
                <>
                  <h3 className="heading-section text-center">
                    Generated Text Probability{" "}
                  </h3>
                  <div className="text-center">
                    {" "}
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                </>
                ) : (
                  outputAI.details && (
                <>
                  <h3 className="heading-section text-center">
                    Generated Text Probability
                  </h3>
                  <h2>Average score: {outputAI.average} </h2>
                  Details:
                  <br />
                  {outputAI.details &&
                    outputAI.details.map((oAI, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: getBackgroundColorAI(
                            outputAI,
                            index
                          ),
                          color: "#fff",
                          padding: "2px 4px",
                          margin: "2px",
                          display: "inline-block",
                        }}
                      >
                        {oAI.text}{" "}
                      </span>
                    ))}
                </>
                ))}
                <div className="card">
                  <div className="card-body">
                    {/* <p>Score distribution here</p> */}
                    <div ref={textRef} className="text-content">
                      <pre dangerouslySetInnerHTML={{ __html: fileContent }} />
                    </div>
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
                {/* TODO maybe put some sort of legend here... */}
                {/* <div className="details_score" ref={detailsScoreRef}>
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
                          {(selectedUser && codecheckerData.data) && 
                            <>
                              <a href={codecheckerData.data.find(user => user.name === selectedUser)
                                ?.scoreDetails[indexFile].find(sc => sc.type === item.className).source} target="_blank" rel="noopener noreferrer">
                                  {codecheckerData.data
                                    .find(user => user.name === selectedUser)?.scoreDetails[indexFile]
                                      .find(sc => sc.type === item.className).source}
                              </a>
                              <hr/>
                            </>
                          }
                          {item.indications}
                        </div>
                      )}
                    </div>
                  ))}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

