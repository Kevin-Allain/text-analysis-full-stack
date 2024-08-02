import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';

import Head from 'next/head'
import Navbar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Breadcrumb from '@/components/BreadCrumb'
import CollusionSelectionGraph from '@/components/vis/CollusionSelectionGraph'
import HorizontalNav from '@/components/HorizontalNav';
import ProductFeatureTitle from '@/components/ProductFeatureTitle';
import ModularTitle from '@/components/ModularTitle';
import { FormDataContext } from '@/components/context/FormDataContext';
// TODO update this to use codecheckerData_ai_detection
import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';
import codecheckerData_ai_detection from '@/public/data/codechecker_ai_detection_example.json';
import codecheckerData_ai_detection_preload from '@/public/data/codechecker_ai_detection_preload.json';
import LegendQuant from '@/components/vis/LegendQuant';
import LegendBinned from '@/components/vis/LegendBinned';
import UserList from '@/components/UserList';
import { calculateOpacity, getBinFromScore } from '@/utils/UtilsMath';

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
  const [maxBin, setMaxBin] = useState(10);
  const [selectedBinIndex, setSelectedBinIndex] = useState(null);

  const { formData, setFormData } = useContext(FormDataContext);

  // const users = codecheckerData_plagiarism.data.sort((a, b) => b.globalScore - a.globalScore);
  const users = codecheckerData_ai_detection.data.sort( (a,b) => b.name - a.name );
  const oddTabChar='ĉ', oddSpaceChar='Ġ', oddNewLineChar='Ċ', oddEndLineChar='č';

  // ---- functions
  const fetchFileContent = async (fileName, scoreDetails, usePreload = true) => {
    try {
      const response = await fetch(`/data/codechecker_files/${fileName}`);
      if (usePreload) {
        console.log("codecheckerData_ai_detection_preload: ", codecheckerData_ai_detection_preload,", fileName: ",fileName);
        // select preloaded output
        // TODO we make the assumption of a single file. Later it will have to be based on unique identifier.
        let ai_preload_file = codecheckerData_ai_detection_preload.filter(a => a.fileName === fileName)[0]; 
        console.log("ai_preload_file: ",ai_preload_file);
        setOutputAI(ai_preload_file);
      } else {
        if (response.ok) {
          // first, load the file
          const textFile = await response.text();
          // console.log("textFile: ",textFile);
          // second, call the AI
          loadAIText(textFile);
        } else {
          setFileContent("Error loading file content.");
        }
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content.");
    }
  };

  function contentFromAI(array) {
    console.log("contentFromAI(array :",array);
    // Helper function to replace special characters
    const replaceSpecialCharacters = (text) => { return text.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n').replace(/ĉ/g, '\t').replace(/č/g,''); };
    let resultString = '';
    array.forEach(item => { resultString += replaceSpecialCharacters(item.text); });
    return resultString;
  }
  
  function transformDataToScoreDetails(name, numSubmissions, files, data, originalText) {
    // Helper function to replace special characters
    const replaceSpecialCharacters = (text) => { return text.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n').replace(/ĉ/g, '\t').replace(/č/g,''); };  
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
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: textFile }),
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

  const highlightText_quant = (text, scoreDetails, binning = false, numBin = 10) => {
    let highlightedText = text;
    let sizeOffset = 0;
    console.log("Plagiarism / highlightText_quant | scoreDetails: ", {scoreDetails, binning, numBin});
    let allScores = scoreDetails.map(a => a.score);
    let minScore = Math.min(...allScores), maxScore = Math.max(...allScores);

    scoreDetails.forEach(detail => {
      const { type, range, score } = detail;
      const opacity = calculateOpacity(score.toFixed(2), minScore, maxScore, binning, numBin);
      const binIndex = binning ? getBinFromScore(score.toFixed(2), minScore, maxScore, numBin) : 0;
      const binClass = "bin_" + binIndex;
      const highlightStart = `<span class="highlight ${type} ${binClass}" score="${score}" ${binning ? `data-bin="${binIndex}"` : ''} style="background-color: rgba(255, 0, 0, ${opacity});">`;
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
  };

  const handleUserClick = (user) => { 
    setSelectedUser(user.name); setIndexFile(0); 
  };
  const handleHighlightClick = (e,className) => { console.log("handleHighlightClick | e: ",e,"className: ",className); };
  const handleFileClick = (index) => { setIndexFile(index); };

  const handleSelectBin = (binIndex) => {
    console.log("handleSelectBin | binIndex: ",binIndex);
    setSelectedBinIndex(binIndex);
    // Remove borders from all highlighted spans
    const allSpans = textRef.current.querySelectorAll('.highlight');
    allSpans.forEach(span => { span.style.border = 'none'; });
    // Add a solid border to the selected bin's spans
    const selectedSpans = textRef.current.querySelectorAll(`.bin_${binIndex}`);
    selectedSpans.forEach(span => { span.style.border = '2px solid black'; });
  };

  // ---- useEffect
  const textRef = useRef(null);
  const detailsScoreRef = useRef(null);
  useEffect(() => {
    if (users.length > 0) {setSelectedUser(users[0].name);}
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

  // TODO assess whether we need to keep. Seems not to work sometimes
  useEffect(() => {
    console.log("textRef.current: ", textRef.current);
    if (textRef.current) {
      const highlights = textRef.current.querySelectorAll('.highlight');
      highlights.forEach(span => {
        span.addEventListener('click', (e) => {
          handleHighlightClick(e,span.className.split(' ')[1]);
        });
      });
    }
  }, [fileContent, maxScoreAI, textRef.current]); // seems like it is the textRef.current that needs to be called for the querySelector to work

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
      console.log("transformDataToScoreDetails resultScore: ",resultScore,", ¬ outputAI: ",outputAI);
      // fourth, apply highlight
      setFileContent(
        highlightText_quant(originalText, resultScore.scoreDetails, true, maxBin)
      );
      let allScores = resultScore.scoreDetails.map(a => a.score);
      let minScore = Math.min(...allScores), maxScore = Math.max(...allScores);  
      setMinScoreAI(minScore); 
      setMaxScoreAI(maxScore);
      console.log("useEffect | minScore: ", minScore,", maxScore: ",maxScore)
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
          <div className="col-md-9">
              {/* <ProductFeatureTitle feature="AI Detection" product={formData?.product}/> */}
              <ModularTitle title={"File Name: "+codecheckerData_ai_detection.data.find(user => user.name === selectedUser)?.files[indexFile]}/>
              <HorizontalNav features={["Similarity", "AI_Detection", "Plagiarism"]} />
               {/* <Breadcrumb /> */}
               {isLoadingAI ? (
                <>
                  <h5 className="heading-section text-center">
                    Calculating AI Detection Score{" "}
                    {/* TODO fix eventually */}
                    {/* {(selectedUser!==null && indexFile) && `for user: ${selectedUser}, file name: ${codecheckerData_ai_detection.data.find(user => user.name === selectedUser)?.files[indexFile]}`} */}
                  </h5>
                  <div className="text-center"> <div className="spinner-border text-primary" role="status"/> </div>
                </>
                ) : (
                  outputAI.details && (
                <>
                  {/* <h3 className="heading-section text-center"> Generated Text Probability </h3> */}
                  {/* <h2>Average score: {outputAI.average.toFixed(2)} </h2> */}
                  {/* {(minScoreAI && maxScoreAI) && <LegendQuant minScore={minScoreAI} maxScore={maxScoreAI} /> } */}
                  {/* {outputAI.details && outputAI.details.map((oAI, index) => ( <span key={index} style={{ backgroundColor: getBackgroundColorAI( outputAI, index ), color: "#fff", padding: "2px 4px", margin: "2px", display: "inline-block", }} > {oAI.text}{" "} </span> ))} */}
                  {/* <span>The score produced by our AI is indicative of the probability of the content being generated by a generative AI. Do note that high scores are no guarantee of content generated by AI, nor low ones guarantee content was made by a human. You should judge the content based on the context.</span> */}
                  
                  {/* <div className="card overflow-y-scroll" style={{"height":"75vh"}}> */}
                  <div className="card">
                    <div className="card-body">
                      <div ref={textRef} className="text-content">
                        <pre dangerouslySetInnerHTML={{ __html: fileContent }} />
                      </div>
                    </div>
                  </div>
                </>
                ))}

          </div>
          <div className="col-md-3 right_side">
            <Sidebar/>
            <UserList
              users={users}
              selectedUser={selectedUser}
              handleUserClick={handleUserClick}
              fileList={fileList}
              handleFileClick={handleFileClick}
              indexFile={indexFile}              
            />
            {outputAI.average &&
              (<div className='score_big' style={{ "width": "100%", "color": "white", "background-color": "red", "padding": "0.5rem", "font-size": "larger", "border-radius": "0.5rem" }}>
                AI Detection Score:{" "}{outputAI.average.toFixed(2)} <br />
                Submission from {selectedUser}.{" "}<br />
                Number of submissions: {codecheckerData_ai_detection.data.find(user => user.name === selectedUser)?.numSubmissions}.
              </div>)
            }
            <div className='legend'>
              {(minScoreAI && maxScoreAI) &&
                <LegendBinned
                  minScore={minScoreAI}
                  maxScore={maxScoreAI}
                  numBins={maxBin}
                  onSelectBin={handleSelectBin}
                  selectedBin={selectedBinIndex} />
              }
              {selectedBinIndex !== null && (
                <div className="mt-3">
                  <h5>Selected Bin</h5>
                  <p>
                    Bin {selectedBinIndex + 1}: {(minScoreAI + selectedBinIndex * (maxScoreAI - minScoreAI) / maxBin).toFixed(2)} -{' '}
                    {(minScoreAI + (selectedBinIndex + 1) * (maxScoreAI - minScoreAI) / maxBin).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
            <>
              <div>
              </div>
              {/* TODO consider how we want to apply the idea we had of disabled={isLoadingAI} | Not necessary with fake data, but valuable later. */}
              {/* <div style={{ "vertical-align": "middle" }}> <u>Files</u> {selectedUser && fileList.map((file, index) => ( <button key={index} className={`btn btn-link ${(indexFile === index) ? 'active' : ''} ${(indexFile === index) ? 'text-secondary' : ''}`} onClick={() => handleFileClick(index)} disabled={isLoadingAI} > {file} </button> ))} </div> */}
            </>

          </div>
        </div>
      </div>
    </>
  )
}

