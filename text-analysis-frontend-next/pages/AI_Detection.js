import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';

import Head from 'next/head'
import Navbar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Breadcrumb from '@/components/BreadCrumb'
import CollusionSelectionGraph from '@/components/vis/CollusionSelectionGraph'
import HorizontalNav from '@/components/HorizontalNav';

import { FormDataContext } from '@/components/context/FormDataContext';
// TODO update this to use codecheckerData_ai_detection
import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';
import codecheckerData_ai_detection from '@/public/data/codechecker_ai_detection_example.json';
import LegendQuant from '@/components/vis/LegendQuant';

export default function AI_Detection(){
  // ---- useState
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [indexFile, setIndexFile] = useState(0);
  const [fileList, setFileList] = useState([]);
  const [outputAI, setOutputAI] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const [minScoreAI,setMinScoreAI] = useState(null)
  const [maxScoreAI,setMaxScoreAI] = useState(null)

  const { formData, setFormData } = useContext(FormDataContext);


  // const users = codecheckerData_plagiarism.data.sort((a, b) => b.globalScore - a.globalScore);
  const users = codecheckerData_ai_detection.data.sort( (a,b) => b.name - a.name );
  const oddTabChar='ĉ', oddSpaceChar='Ġ', oddNewLineChar='Ċ';

  // ---- functions
  const fetchFileContent = async (fileName, scoreDetails) => {
    try {
      const response = await fetch(`/data/codechecker_files/${fileName}`);
      if (response.ok) {
        // first, load the file
        const textFile = await response.text();
        console.log("textFile: ",textFile);
        // second, call the AI
        loadAIText(textFile);
      } else {
        setFileContent("Error loading file content.");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content.");
    }
  };

  function contentFromAI(array) {
    console.log("contentFromAI(array :",array);
    // Helper function to replace special characters
    const replaceSpecialCharacters = (text) => { return text.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n').replace(/ĉ/g, '\t'); };
    let resultString = '';
    array.forEach(item => { resultString += replaceSpecialCharacters(item.text); });
    return resultString;
  }
  

  function transformDataToScoreDetails(name, numSubmissions, files, data, originalText) {
    // Helper function to replace special characters
    const replaceSpecialCharacters = (text) => { return text.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n').replace(/ĉ/g, '\t'); };  
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
      name: name, globalScore: data.average, numSubmissions: numSubmissions, files: [files], scoreDetails: transformedDetails
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

  const highlightText_quant = (text, scoreDetails) => {
    let highlightedText = text;
    let sizeOffset = 0;
    console.log("Plagiarism / highlightText_quant | scoreDetails: ",scoreDetails);
    let allScores = scoreDetails.map(a => a.score);
    let minScore = Math.min(...allScores), maxScore = Math.max(...allScores);

    // Function to calculate opacity based on score
    const calculateOpacity = (score, min, max) => {
      if (min === max) return 0.90; // Handle the case where all scores are the same
      return 0.05 + ((score - min) / (max - min)) * 0.85;
    };


    scoreDetails.forEach(detail => {
      const { type, range, score } = detail;
      const opacity = calculateOpacity(score, minScore, maxScore);
      // TODO find how to compute color here... reuse previous function?
      const highlightStart = `<span class="highlight ${type}" style="background-color: rgba(255, 0, 0, ${opacity});" >`; // style="background-color: ${detailInfo.color}"
      const highlightEnd = "</span>";
      const start = range[0];
      const end = range[1];
      highlightedText =
        highlightedText.slice(0, start + sizeOffset) +
        highlightStart +
        highlightedText.slice(start + sizeOffset, end + sizeOffset + 1) +
        highlightEnd +
        highlightedText.slice(end + sizeOffset + 1);
      sizeOffset += highlightStart.length + highlightEnd.length;
    });
    return highlightedText;
  }

  const handleUserClick = (user) => { setSelectedUser(user.name); setIndexFile(0); // Reset to the first file
  };

  const handleHighlightClick = (className) => {
    console.log("handleHighlightClick | className: ",className);
    // const element = detailsScoreRef.current.querySelector(`.${className}`);
    // if (element) { element.scrollIntoView({ behavior: "smooth" }); }
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
      // TODO check why can't be changed to codecheckerData_ai_detection without an error
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


  useEffect(() => {
    // fetchContent gets content, but then it's once the AI is loaded that we load fileContent with highlights and everything.
    console.log("-- useEffect outputAI --");
    if (selectedUser && outputAI && outputAI.details) {
      // TODO check why can't be changed to codecheckerData_ai_detection without an error
      const userData = codecheckerData_plagiarism.data.find(user => user.name === selectedUser);
      const fileName = userData.files[indexFile], scoreDetails = userData.scoreDetails[indexFile];
      console.log("fetchFileContent |scoreDetails: ",scoreDetails);

      // TODO third, make transposition so that output can be highlighted
      // TODO ---- incorporate this code so that we make the transition from data.details to scoreDetails (we'll do highlighting after)     
      // Example usage
      const name = selectedUser;
      const numSubmissions = codecheckerData_ai_detection.data.find(a => a.name===selectedUser).numSubmissions ;
      const files = userData.files;
      // dataTest is supposed to be like outputAI
      // const dataTest = { average: 0.599, details: [ { text: "Ċ", value: 0.79 }, { text: 'St', value: 0.76 }, { text: 'ories', value: 0.36 }, { text: "Ġof", value: 0.02 }, { text: "Ġfairy", value: 0.02 }, { text: "Ġtales", value: 0.02 }, { text: "Ġlike", value: 0.72 }, { text: "Ġthis", value: 0.02 }, { text: "Ġare", value: 0.02 }, { text: "Ġnice", value: 0.02 }, { text: "Ċ", value: 0.79 }, { text: "Ċ", value: 0.79 }, { text: 'Right?', value: 0.76 }, ] };
      // originalText is supposed to be like the content of the file
      const originalText = contentFromAI(outputAI.details)
      const resultScore = transformDataToScoreDetails(name, numSubmissions, files, outputAI, originalText);
      console.log("transformDataToScoreDetails resultScore: ",resultScore,
        ", ¬ outputAI: ",outputAI);
      // fourth, apply highlight
      setFileContent(highlightText_quant(originalText, resultScore.scoreDetails));
      let allScores = resultScore.scoreDetails.map(a => a.score);
      let minScore = Math.min(...allScores), maxScore = Math.max(...allScores);  
      setMinScoreAI(minScore); 
      setMaxScoreAI(maxScore);
      console.log("useEffect | minScore: ", minScore,", maxScore: ",maxScore)
      // setFileContent(originalText); // TODO Will have to be updated... maybe with result    
    } else {
      console.log("Check | selectedUser: ",selectedUser,", outputAI: ",outputAI,", outputAI.scoreDetails: ",outputAI.scoreDetails);
    }
  },[outputAI])


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
              {/* <div className="col-md-7"> */}
              <div className="col-md-9">
               <Breadcrumb />
               <>
                <div>
                  Submission from {selectedUser}.  
                  {/* TODO update this... codecheckerData_ai_detection has null on globalScore for now... */}
                   {/* with a score of {codecheckerData_ai_detection.data.find(user => user.name === selectedUser)?.globalScore}.  */}
                   Number of submissions: {codecheckerData_ai_detection.data.find(user => user.name === selectedUser)?.numSubmissions}.
                   
                </div>
                <div>
                  <u>Files</u>
                  {selectedUser && 
                    fileList.map((file, index) => (
                      <button 
                        key={index} 
                        className={`btn btn-link ${(indexFile === index) ? 'active' : ''}`} 
                        onClick={() => handleFileClick(index)}
                        disabled={isLoadingAI}
                      >
                        {file}
                      </button>
                    ))
                  }
                </div>
                <h4>
                  {(selectedUser && codecheckerData_ai_detection.data) &&
                    codecheckerData_ai_detection.data.find(user => user.name === selectedUser)?.files[indexFile]
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
                  {(minScoreAI && maxScoreAI) &&
                    <LegendQuant minScore={minScoreAI} maxScore={maxScoreAI} />
                  }
                  {/* {outputAI.details && outputAI.details.map((oAI, index) => ( <span key={index} style={{ backgroundColor: getBackgroundColorAI( outputAI, index ), color: "#fff", padding: "2px 4px", margin: "2px", display: "inline-block", }} > {oAI.text}{" "} </span> ))} */}
                  <div className="card">
                    <div className="card-body">
                      {/* <p>Score distribution here</p> */}
                      <div ref={textRef} className="text-content">
                        <pre dangerouslySetInnerHTML={{ __html: fileContent }} />
                      </div>
                    </div>
                  </div>
                </>
                ))}
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
                        {user.globalScore !== null && 
                          <span>{(user.globalScore * 100).toFixed(2)}%</span>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
                {/* TODO maybe put some sort of legend here... */}
                <div className='legend'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

