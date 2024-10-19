import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head'
import Navbar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Breadcrumb from '@/components/BreadCrumb'
import CollusionSelectionGraph from '@/components/vis/CollusionSelectionGraph'
import HorizontalNav from '@/components/HorizontalNav';
import ProductFeatureTitle from '@/components/ProductFeatureTitle';
import ModularTitle from '@/components/ModularTitle';
import { FormDataContext } from '@/components/context/FormDataContext';
import codecheckerData_ai_detection from '@/public/data/codechecker_ai_detection_example.json';
import codecheckerData_ai_detection_preload from '@/public/data/codechecker_ai_detection_preload.json';

import codecheckerData_ai_detection_News_article_results from '@/public/data/Daryl/Human/results/News_article_results.json';
// import codecheckerData_ai_detection_Daryl from '@/public/data/Daryl/all_results.json';
// import codecheckerData_ai_detection_Daryl from '@/public/data/Daryl/all_results_manually_altered.json';
// FINE but we want to consider alternative transformation on detail as well
// import codecheckerData_ai_detection_Daryl from '@/public/data/Daryl/all_results_inverted_tipped.json';
// we try "value"
// import codecheckerData_ai_detection_Daryl from '@/public/data/Daryl/all_results_inverted_tipped_detail.json';

import codecheckerData_ai_detection_Daryl from '@/public/data/Daryl/all_results_inverted_tipped_detail_late.json';
// TODO communicate about issue: all average are 0 or super close to 0
// import codecheckerData_ai_detection_Daryl from '@/public/data/Daryl/dataset_results_filename_fix.json';

import LegendQuant from '@/components/vis/LegendQuant';
import LegendBinned from '@/components/vis/LegendBinned';
import UserList from '@/components/UserList';
import BlackBar from '@/components/BlackBar';
import { calculateOpacity, getBinFromScore } from '@/utils/UtilsMath';

import ScrollGraph from '@/components/ScrollGraph'
import ScrollGraphAggregate from '@/components/ScrollGraphAggregate';
import '@/styles/AI_Detection.css';

const numberBoxStyle = {
  width: '32px', height: '32px', padding: '6px', objectFit: 'contain', borderRadius: '5px', border: 'solid 1px #115b4e', backgroundColor: '#252525', color: 'white', textAlign: 'center', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
};
const numberGridStyle = {
  display: 'flex', justifyContent: 'space-between', width: '50%', paddingTop: '1em'
};

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
  const [maxBin, setMaxBin] = useState(4);
  const [selectedBinIndex, setSelectedBinIndex] = useState(null);
  const { formData, setFormData } = useContext(FormDataContext);

  // const users = codecheckerData_plagiarism.data.sort((a, b) => b.globalScore - a.globalScore);
  const users = codecheckerData_ai_detection.data.sort( (a,b) => b.name - a.name );
  const oddTabChar='ĉ', oddSpaceChar='Ġ', oddNewLineChar='Ċ', oddEndLineChar='č';
  
  // const colorBases = ["white","#d0dedc","#719c95","#115b4e"]
  // const colorBases = ["white","rgba(208, 222, 220,.90)","rgba(113, 156, 149,.90)","rgba(17, 91, 78,.90)"]
  // Change with light green
  // const colorBases = ["white", "rgba(208, 222, 220,.90)", "rgba(72,127,117,.90)", "rgba(17,152,127,0.90)"]
  const colorBases = [ "white", "#d5e2e0", "#9fbdb7", "#528c82" ]
  const foldersWithResults = ['Anthropic', 'Anthropic_dp','GPT 4o','GPT 4o_dp','Human'];

  // ---- functions
  const fetchFileContent = async (fileName, usePreload = true) => {
    console.log("fetchFileContent | fileName: ",fileName);
    const old_baseFolders = fileName.indexOf("/")!== -1? `Daryl/` : 'codechecker_files';
    try {
      const response = await fetch(`/data/${old_baseFolders}/${fileName}`);
      if (usePreload) {
        console.log("codecheckerData_ai_detection_preload: ", codecheckerData_ai_detection_preload,", fileName: ",fileName);
        console.log("¬ ¬ ¬ codecheckerData_ai_detection_Daryl: ", codecheckerData_ai_detection_Daryl);

        // select preloaded output
        // TODO we make the assumption of a single file. Later it will have to be based on unique identifier.
        let ai_preload_file = codecheckerData_ai_detection_preload.filter(a => a.fileName === fileName)[0]; 
        // TODO this is a test. We will update later
        if (fileName.indexOf("/")!== -1){
          let model = fileName.split('/')[0];
          let actualFile = fileName.split('/')[1];
          console.log("## fileName: ", fileName,", and model: ", model,", actualFile: ",actualFile);
          console.log("need to check the second part of filename. the first fileName.split is: ", fileName.split('/')[1]);
          // ai_preload_file = codecheckerData_ai_detection_News_article_results.filter(a => a.fileName === fileName.split('/')[1]);
          ai_preload_file = codecheckerData_ai_detection_Daryl.filter(a => a.fileName === fileName.split('/')[1])[0];
        }
        console.log("ai_preload_file: ",ai_preload_file);
        setOutputAI(ai_preload_file);
      } else {
        if (response.ok) {
          // first, load the file
          const textFile = await response.text();
          console.log("textFile: ",textFile);
          // second, call the AI
          loadAIText(textFile);
        } else { setFileContent("Error loading file content."); }
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content.");
    }
  };

  function contentFromAI(array) {
    console.log("contentFromAI(array :",array);
    // Helper function to replace special characters
    const replaceSpecialCharacters = (text) => { return text.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n').replace(/ĉ/g, '\t').replace(/č/g,'', /\u00e2\u0122/g,'"', /\u013e/g,'"'); };
    let resultString = '';
    array.forEach(item => { resultString += replaceSpecialCharacters(item.text); });
    return resultString;
  }
  
  function transformDataToScoreDetails(name, numSubmissions, files, data, originalText) {
    // Helper function to replace special characters
    const replaceSpecialCharacters = (text) => { return text.replace(/Ġ/g, ' ').replace(/Ċ/g, '\n').replace(/ĉ/g, '\t').replace(/č/g,'', /\u00e2\u0122/g,'"', /\u013e/g,'"'); };  
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
        if (startIndex === -1) { startIndex = previousEndIndex + 1; }
      }
      const endIndex = startIndex + modifiedText.length - 1;
      previousEndIndex = endIndex;  
      return { type: 'ai_detection', range: [startIndex, endIndex], score: detail.value, text: modifiedText };
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
      // Change of ports based on latest changes from Pravija
      const portToReplace = '5001' // user to be 5000; Flask runs on port 5000 by default
      let strAnalyze = is_localhost
        ? window.location.href
          .replace("TextAnalysis",'').replace("AI_Detection",'').replace("3000", portToReplace)
          + "api/analyze_t_b"
        : window.location
          .replace("TextAnalysis",'').replace("AI_Detection",'').href 
          + "api/analyze_t_b";

      if (strAnalyze.includes("?name")) { let split = (strAnalyze.toString()).split("/"); strAnalyze = split[0] + '//' + split[2] + '/api/' + split[4]; }
      const response = await fetch(strAnalyze, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: textFile }), });
      if (!response.ok) throw new Error("Network response was not ok.");

      const data = await response.json();
      setOutputAI(data);
    } catch (error) {
      console.error("Error during API call:", error);
    } finally { setIsLoadingAI(false); }
  };

  // const highlightText_quant = (text, scoreDetails, binning = false, numBin = 10) => {
  //   let highlightedText = text;
  //   let sizeOffset = 0;
  //   console.log("highlightText_quant | scoreDetails: ", {scoreDetails, binning, numBin});
  //   let allScores = scoreDetails.map(a => a.score);
  //   let minScore = Math.min(...allScores), maxScore = Math.max(...allScores);
  //   scoreDetails.forEach(detail => {
  //     const { type, range, score } = detail;
  //     const opacity = calculateOpacity(score.toFixed(2), minScore, maxScore, binning, numBin);
  //     const binIndex = binning ? getBinFromScore(score.toFixed(2), minScore, maxScore, numBin) : 0;
  //     const binClass = "bin_" + binIndex;
  //     const highlightStart = `<span class="highlight ${type} ${binClass}" score="${score}" ${binning ? `data-bin="${binIndex}"` : ''} 
  //       style="background-color: rgba(0, 100, 0, ${opacity});">`;
  //     const highlightEnd = "</span>";
  //     const start = range[0];
  //     const end = range[1];
  //     highlightedText =
  //       highlightedText.slice(0, start + sizeOffset) +
  //       highlightStart +
  //       highlightedText.slice(start + sizeOffset, end + sizeOffset + 1) +
  //       highlightEnd +
  //       highlightedText.slice(end + sizeOffset + 1);
  //     sizeOffset += highlightStart.length + highlightEnd.length;
  //   });
  //   return highlightedText;
  // };

  // const highlightText_quant_binned = (text, scoreDetails, binning = false, numBin = 4) => {
  //   let highlightedText = text;
  //   console.log("highlightText_quant_binned | scoreDetails: ", { scoreDetails, binning, numBin, text });
  //   // TODO update the code so that minScores and maxScores are based on all content!
  //   let scoresTotal = [];
  //   codecheckerData_ai_detection_Daryl.map(a => scoresTotal = scoresTotal.concat(a.details.map(b => b.value) ) );
  //   console.log("~~~~ scoresTotal: ", scoresTotal);
  //   let averagesTotal = [];
  //   codecheckerData_ai_detection_Daryl.map(a => averagesTotal = averagesTotal.concat([a.average]) );
  //   console.log("~~~~ averagesTotal: ", averagesTotal);

  //   // Extract all scores and find the minimum and maximum
  //   let allScores = scoreDetails.map(a => a.score);
  //   // let minScore = Math.min(...allScores);
  //   // let maxScore = Math.max(...allScores);
  //   let maxScore = Math.max(...scoresTotal);
  //   // let maxScore = Math.max(...averagesTotal);
  
  //   // Function to determine the background color based on the score
  //   const getBinnedColor = (score) => {
  //     // Define bin thresholds based on the min and max scores
  //     const bin1 = maxScore * 0.75; // Highest bin
  //     const bin2 = maxScore * 0.5;  // Mid-high bin
  //     const bin3 = maxScore * 0.25; // Mid-low bin  
  //     // Assign color based on which bin the score falls into
  //     if (score >= bin1) { return colorBases[3]; } else if (score >= bin2) { return colorBases[2]; } else if (score >= bin3) { return colorBases[1]; } else { return colorBases[0]; }
  //   };
  //   // Create the highlight span with the appropriate background color
  //   // const highlightStart = `<span class="highlight ${type}" score="${score}" style="background-color: ${backgroundColor};" line-height: 1.15;" "wrap-around:break-word" >`;
  //   //   // style="background-color: ${backgroundColor}; color: ${backgroundColor === colorBases[3] ? 'lightgray' : 'black'}; line-height: 1.15;">`;
  //   //   // "color: ${backgroundColor === colorBases[3] ? 'black' : 'black'}; "
  //   // const highlightEnd = "</span>";

  //   let currentLine = 1;  // Start line numbering
  //   let sizeOffset = 0;   // Track text size adjustment
  //   scoreDetails.forEach((detail) => {
  //     const { type, range, score } = detail;
  //     const backgroundColor = getBinnedColor(score);
  //     const highlightStart = `<span 
  //       class="highlight ${type} line-${currentLine}" 
  //       score="${score}" 
  //       style="background-color: ${backgroundColor}; line-height: 1.15; word-wrap: break-word; word-break: break-word;"
  //     >`;
  //     const highlightEnd = "</span>";
  //     const start = range[0];
  //     const end = range[1];

  //     console.log("highlightedText.slice(start + sizeOffset, end + sizeOffset + 1): ", highlightedText.slice(start + sizeOffset, end + sizeOffset + 1));

  //     // Insert the highlight span into the text
  //     highlightedText =
  //       highlightedText.slice(0, start + sizeOffset) +
  //       highlightStart +
  //       highlightedText.slice(start + sizeOffset, end + sizeOffset + 1) +
  //       highlightEnd +
  //       highlightedText.slice(end + sizeOffset + 1);
  //     sizeOffset += highlightStart.length + highlightEnd.length;
  //     // Check the content between spans to detect line breaks or empty spans
  //     const textBetween = highlightedText.slice(start + sizeOffset, end + sizeOffset);
  //     // Check for actual line breaks (\n)
  //     const newLineBreaks = textBetween.match(/(\r\n|\n|\r)/g) || [];
  //     if (newLineBreaks.length > 0) {
  //       currentLine += newLineBreaks.length;  // Increment by the number of line breaks found
  //     } else {
  //       // Check if the span is completely empty or contains only non-breaking spaces (&nbsp;)
  //       const isEmptySpan = textBetween.trim() === '' || textBetween === '&nbsp;';
  //       if (isEmptySpan) {
  //         currentLine++;  // Only increment line number for empty spans or spans with only &nbsp;
  //       }
  //     }
  //   });
    
  //   return highlightedText;    
  // };

  const highlightText_quant_binned = (text, scoreDetails, binning = false, numBin = 4) => {
    console.log("highlightText_quant_binned | scoreDetails: ", { scoreDetails, binning, numBin });
    let sizeOffset = 0;
    let highlightedText = text;
    let scoresTotal = [];
    codecheckerData_ai_detection_Daryl.map(a => scoresTotal = scoresTotal.concat(a.details.map(b => b.value) ) );
    console.log("~~~~ scoresTotal: ", scoresTotal);
    let averagesTotal = [];
    codecheckerData_ai_detection_Daryl.map(a => averagesTotal = averagesTotal.concat([a.average]) );
    console.log("~~~~ averagesTotal: ", averagesTotal);  
    // Extract all scores and find the minimum and maximum
    let allScores = scoreDetails.map(a => a.score);
    let maxScore = Math.max(...scoresTotal);
    // Function to determine the background color based on the score
    const getBinnedColor = (score) => {
      // 1- Highest bin // 2- Mid-high bin // 3- Mid-low bin
      const bin1 = maxScore * 0.75; const bin2 = maxScore * 0.5; const bin3 = maxScore * 0.25; 
      // Assign color based on which bin the score falls into
      if (score >= bin1) { return colorBases[3]; } else if (score >= bin2) { return colorBases[2]; } else if (score >= bin3) { return colorBases[1]; } else { return colorBases[0]; }
    };
  
    // Step 1: Detect all occurrences of \n in the text and store their indexes
    let newLineIndexes = [];
    for (let i = 0; i < highlightedText.length; i++) { if (highlightedText[i] === '\n') { newLineIndexes.push(i); } }  
    // Add the last character position to newLineIndexes
    if (highlightedText.length > 0) { newLineIndexes.push(highlightedText.length - 1); }  
    console.log("Detected newline positions: ", newLineIndexes);
    let spansWithNewLines = []; // To track spans that should contain \n
    let lineNumber = 1;         // Initialize line number counter
  
    scoreDetails.forEach((detail, index) => {
      const { type, range, score } = detail;
      const backgroundColor = getBinnedColor(score);
      // Step 2: Add a unique index to each span and add the line number to every span
      let additionalClass = `span-index-${index} line-${lineNumber}`; // Unique index class and line number for each span
      // Step 3: Check if the current span overlaps with a \n position
      let spanContainsNewLine = newLineIndexes.some(newLineIndex => {
        return newLineIndex >= range[0] && newLineIndex <= range[1]; // Check if \n is within the span's range
      });
  
      // Add the "backslashNewLine" class and line number if the span contains a \n
      if (spanContainsNewLine) {
        additionalClass += ` backslashNewLine`;
        spansWithNewLines.push(index);   // Keep track of which spans have the new line
        lineNumber++;  // Increment line number for each new line detected
      }
      const highlightStart = `<span 
        class="highlight ${type} ${additionalClass}" score="${score}" 
        style="background-color: ${backgroundColor}; line-height: 1.15; word-wrap: break-word; word-break: break-word;"
      >`;
      const highlightEnd = "</span>";
      const start = range[0];
      const end = range[1];
  
      // Update the highlighted text by inserting the span tags
      highlightedText =
        highlightedText.slice(0, start + sizeOffset) +
        highlightStart +
        highlightedText.slice(start + sizeOffset, end + sizeOffset + 1) +
        highlightEnd +
        highlightedText.slice(end + sizeOffset + 1);
  
      sizeOffset += highlightStart.length + highlightEnd.length;
    });
    console.log("Spans with new lines: ", spansWithNewLines);
    return highlightedText;
  };
          
  const handleUserClick = (user) => { setSelectedUser(user.name); setIndexFile(0); };
  const handleHighlightClick = (e,className) => { console.log("handleHighlightClick | e: ",e,"className: ",className); };
  const handleFileClick = (index) => { setIndexFile(index); };
  const scrollToLine = (lineNumber) => {
    console.log("scrollToLine | lineNumber: ",lineNumber);
    const lineElement = document.querySelector(`.line-${lineNumber}`);
    console.log("scrollToLine | lineElement: ",lineElement);
    if (lineElement) { lineElement.scrollIntoView({ behavior: 'smooth' }); }
  }

  // ---- useEffect
  const textRef = useRef(null);
  const detailsScoreRef = useRef(null);
  useEffect(() => {
    if (users.length > 0) {setSelectedUser(users[0].name);}
  }, [users]);

  useEffect(() => {
    if (selectedUser) {
      const userData = codecheckerData_ai_detection.data.find(user => user.name === selectedUser);

      if (userData && userData.files.length > 0) {
        setFileList(userData.files);
        fetchFileContent(userData.files[indexFile]);
      }
    }
  }, [selectedUser, indexFile]);

  
  useEffect(() => {
    console.log("textRef.current: ", textRef.current);
    // TODO assess whether we need to keep. Seems not to work sometimes    
    if (textRef.current) {
      console.log('ParentComponent | Initial scrollHeight:', textRef.current.scrollHeight);
      const highlights = textRef.current.querySelectorAll('.highlight');
      highlights.forEach(span => {
        span.addEventListener('click', (e) => {
          handleHighlightClick(e,span.className.split(' ')[1]);
        });
      });
    }

    // Addition for markers


  }, [fileContent, maxScoreAI, textRef.current]); // seems like it is the textRef.current that needs to be called for the querySelector to work

  useEffect(() => {
    // fetchContent gets content, but then it's once the AI is loaded that we load fileContent with highlights and everything.
    console.log("-- useEffect outputAI -- selectedUser: ",selectedUser);
    if (selectedUser && outputAI && outputAI.details) {
      // TODO check why can't be changed to codecheckerData_ai_detection without an error
      const userData = codecheckerData_ai_detection.data.find(user => user.name === selectedUser);
      // const fileName = userData.files[indexFile], 
      // let scoreDetails = userData.scoreDetails[indexFile];
      // console.log("useEffect [outputAI] |scoreDetails: ",scoreDetails);

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
      // setFileContent( highlightText_quant(originalText, resultScore.scoreDetails, true, maxBin) );
      setFileContent( highlightText_quant_binned(originalText, resultScore.scoreDetails, true, maxBin) )
      let allScores = resultScore.scoreDetails.map(a => a.score);
      let minScore = Math.min(...allScores), maxScore = Math.max(...allScores);  
      setMinScoreAI(minScore); 
      setMaxScoreAI(maxScore);
      console.log("useEffect | minScore: ", minScore,", maxScore: ",maxScore)
    } else {
      console.log("Check | selectedUser: ",selectedUser,", outputAI: ",outputAI,", outputAI.scoreDetails: ",outputAI.scoreDetails);
    }
  },[outputAI])


  // Update for ScrollGraph rectangle
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScrollPositionChange = (relativePosition) => {
    // Find the main scrollable element by its class name
    const textElement = document.querySelector('.card.overflow-y-scroll.mainContent');
    if (!textElement) { console.error("Main scrollable element is not available."); return; }
    // Use a slight delay to ensure the content is fully rendered
    setTimeout(() => {
        // Find the pre element within the main scrollable element
        const preElement = textElement.querySelector('pre');
        if (!preElement) { console.error("pre element is not available."); return; }
        const childElements = Array.from(preElement.children);
        if (childElements.length > 0) {
            const targetIndex = Math.floor(relativePosition * (childElements.length - 1));
            const targetElement = childElements[targetIndex];
            // Scroll the target element into view
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Wait for scroll to complete (using a timeout is not the best method, but it works for smooth scrolling)
            setTimeout(() => {
                // After scroll completes, calculate the scroll ratio
                const scrollTop = textElement.scrollTop;
                const scrollHeight = textElement.scrollHeight - textElement.clientHeight; // Scrollable height
                if (scrollHeight > 0) {
                    const scrollRatio = scrollTop / scrollHeight;
                    console.log("Scroll ratio (after scrolling):", scrollRatio);
                    setScrollPosition(scrollRatio);
                } else { console.error("Content is not scrollable, cannot calculate scroll ratio."); }
            }, 500); // Wait for 500ms to ensure scrolling is done
        } else { console.error("No child elements found inside pre."); }
    }, 100); // Delay to ensure the content is fully rendered
  };
 

  const handleScroll = () => {
    const textElement = textRef.current;
    const scrollTop = textElement.scrollTop;
    const scrollHeight = textElement.scrollHeight - textElement.clientHeight;
    const relativePosition = scrollTop / scrollHeight;
    setScrollPosition(relativePosition);
  };

  const blackBarRef = useRef(null);
  const navbarRef = useRef(null);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState('auto');


  useEffect(() => {
    const textElement = textRef.current;
    if (textElement !== null) {
      textElement.addEventListener('scroll', handleScroll);
      // Clean up the event listener on component unmount
      return () => { textElement.removeEventListener('scroll', handleScroll); };
    }
  }, []);

  // useEffect for vertical height of main component
  useEffect(() => {
    const updateContentHeight = () => {
      // Get the height of BlackBar and Navbar
      const blackBarHeight = blackBarRef.current ? blackBarRef.current.offsetHeight : 0;
      const navbarHeight = navbarRef.current ? navbarRef.current.offsetHeight : 0;
      // Calculate the available height for the content div
      const totalHeight = window.innerHeight;
      const remainingHeight = totalHeight - blackBarHeight - navbarHeight;
      console.log("Calculated height: ",remainingHeight);
      // Apply the calculated height to the content div
      setContentHeight(`${remainingHeight}px`);
    };
    // Run on initial render and when the window is resized
    updateContentHeight();
    window.addEventListener('resize', updateContentHeight);
    console.log("changing heights. contentHeight: ",contentHeight);
    // Cleanup event listener on component unmount
    return () => { window.removeEventListener('resize', updateContentHeight); };
  }, []);

  // Styles
  const containerStyle = { height: `${0.94 * Number(contentHeight.split("px")[0])}px`, maxHeight: `${0.94 * Number(contentHeight.split("px")[0])}px`, display: 'flex', overflow: 'hidden', };
  const markerAreaStyle = { width: '33px', backgroundColor: '#f0f0f0', };
  const textContentStyle = { fontSize: '25px', fontFamily: 'Poppins, sans-serif', fontWeight: '500', letterSpacing: '-1.5px', color: '#252525', overflow: 'visible', whiteSpace: 'pre-wrap', wordBreak: 'break-word', width: 'calc(100% - 33px)', };

  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Sofia"/>
        <link href="https://fonts.googleapis.com/css?family=Poppins" rel="stylesheet"/>
      </Head>
      <Container fluid style={{"overflow-y":"hidden"}}>
        <Row>
          <div ref={blackBarRef} style={{background:"black"}}>
            <BlackBar users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} fileList={fileList} handleFileClick={handleFileClick} indexFile={indexFile} feature={"AI_Detection"} />
          </div>
          <div ref={navbarRef}>
            <Navbar users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} fileList={fileList} handleFileClick={handleFileClick} indexFile={indexFile} feature={"AI_Detection"} />
          </div>
          <Col md={0} lg={1} className="d-none d-md-block emptyStuff" ></Col>
          <Col 
            md={12} 
            lg={10} 
            className="content" 
            style={{ marginLeft: 'auto', marginRight: 'auto', paddingLeft: '15px', paddingRight: '15px', height: contentHeight, maxHeight: contentHeight, }}
            ref={contentRef}
          >
            <Row style={{ border:" solid #eae9e9 thin", borderRadius:"20px", height:"95%", backgroundColor:"#f1f1f1", margin: "10px 0 0 18px", // used to be "28px 0 0 18px",
              padding: "5px 5px 5px 5px", // used to be "44px 65px 34px 50px"
            }}>
              {/* <HorizontalNav features={["Similarity", "AI_Detection", "Plagiarism"]} selectedUser={selectedUser} colorBases={colorBases} /> */}
              <Col lg={8} md={8} sm={12} className="mb-3 biggerContent" >
                {isLoadingAI ? (
                  <>
                    <h5 className="heading-section text-center">
                      Calculating AI Detection Score{" "}
                    </h5>
                    <div className="text-center"> <div className="spinner-border text-primary" role="status" /> </div>
                  </>
                ) : (
                    outputAI.details && (
                      <>
                        {/* 
                      <div className="card overflow-x-scroll overflow-y-scroll mainContent" style={{ height: (0.94*Number(contentHeight.split("px")[0]))+"px", maxHeight:(0.94*Number(contentHeight.split("px")[0]))+"px", }}>
                          <div className="card-body" style={{ fontSize: 25, fontFamily: 'Poppins', fontWeight: 'Medium',  letterSpacing: '-1.5px', color: '#252525'}} >
                            <div ref={textRef} className="text-content">
                                <pre style={{ fontFamily: 'Poppins, sans-serif', fontSize: '25px', fontWeight: '500', letterSpacing: '-1.5px', color: '#252525', overflow: "visible", whiteSpace: "pre-wrap", wrapAround:'break-word', }} dangerouslySetInnerHTML={{ __html: fileContent }} />
                            </div>
                        </div>
                      </div> 
                      */}
                        <div className="card overflow-x-scroll overflow-y-scroll mainContent" style={{
                          height: `${0.94 * Number(contentHeight.split("px")[0])}px`,
                          maxHeight: `${0.94 * Number(contentHeight.split("px")[0])}px`,
                        }}>
                          <div className="card-body" style={{ display: 'flex', fontSize: '25px', fontFamily: 'Poppins', fontWeight: 'Medium', letterSpacing: '-1.5px', color: '#252525' }}>

                            {/* Marker Area */}
                            <div className="markerArea" style={markerAreaStyle}>
                              {/* Add marker content here, for example: */}
                              {/* TODO this is actual line... and not line \n Need to adapt */}
                              <div style={numberBoxStyle}>1</div>
                              <div style={numberBoxStyle}>2</div>
                              <div style={numberBoxStyle}>3</div>
                              <div style={numberBoxStyle}>4</div>
                              <div style={numberBoxStyle}>5</div>
                            </div>

                            {/* Text Content Area */}
                            <div ref={textRef} className="text-content" style={textContentStyle}>
                              <pre
                                style={{
                                  fontFamily: 'Poppins, sans-serif',
                                  fontSize: '25px',
                                  fontWeight: '500',
                                  letterSpacing: '-1.5px',
                                  color: '#252525',
                                  overflow: 'visible',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                }}
                                dangerouslySetInnerHTML={{ __html: fileContent }}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                  ))}
              </Col>
              {outputAI.details &&
                <Col lg={1} md={1} sm={12} className="scrollContent"
                  style={{
                    height: (0.93 * Number(contentHeight.split("px")[0])) + "px", // Dynamically set the height
                    maxHeight: (0.93 * Number(contentHeight.split("px")[0])) + "px",
                    overflowY: 'auto' // Enable scrolling when content exceeds the height
                  }}
                >
                  <ScrollGraphAggregate
                    data={outputAI.details}
                    globalData={codecheckerData_ai_detection_Daryl}
                    width="400"
                    height="600"
                    onScrollPositionChange={handleScrollPositionChange}
                    scrollRatio={scrollPosition}
                    colorBases={colorBases}
                  />                  
                </Col>
              }
              <Col lg={3} md={3} sm={12} className="smallerContent"  style={{ display: 'flex', flexDirection: 'column' }}>
                {outputAI.average && (
                  <div className='score_big' style={{width: "100%", color: "black", backgroundColor: "#f2f2f2", padding: "0.15rem", borderRadius: "0.5rem", }} >
                    <Row style={{ height: "60px", fontSize: "xx-large" }}>
                      <Col lg={8} md={8} style={{ alignContent: "center", fontSize: "2vw"}}>
                        AI Score: {Math.floor(100*outputAI.average.toFixed(2))}
                      </Col>
                      <Col lg={4} md={4}>
                        <div className="rectanglesScores" style={{ display: "flex", alignItems: "flex-end", gap: "2px", maxWidth:"100px", height: "60px", }}>
                          {[...Array(7)].map((_, i) => (
                            <div
                              key={`rect-${i}`}
                              style={{
                                width: "calc(100% / 7 - 2px)",
                                height: `${(i + 1) / 7 * 100}%`,
                                backgroundColor: `${Math.round(outputAI.average.toFixed(2)*7)<=i? "#f1f1f1":"#115b4e"}`,
                                border: "1px solid #115b4e",
                                borderRadius: "4.5px"
                              }}
                            />
                          ))}
                        </div>
                      </Col>
                    </Row>
                    <Row style={{margin:"37px 15px 19px 0px","font-size":"20px", }}>The colours below represent the text that corresponds with the level of AI</Row>
                    <Row style={{"font-size":"20px",}}>
                      <div className="rectIndex" index={1} style={{ display: "flex", alignItems: "center", width: "95%", maxWidth:"95%", height: "38px", margin: "5px 0px 5px 5px", padding: "5px", objectFit: "contain", borderRadius: "5px", border: "1px solid rgb(17, 91, 78)", backgroundColor: "rgb(255, 255, 255)" }} 
                      >
                        <div style={{ width: "20px", height: "20px", marginRight: "10px", border: "1px solid #115b4e", borderRadius: "5px", backgroundColor: colorBases[3] }}></div> AI </div>
                      <div className="rectIndex" index={2} style={{ display: "flex", alignItems: "center", width: "95%", maxWidth:"95%", height: "38px", margin: "5px 0px 5px 5px", padding: "5px", objectFit: "contain", borderRadius: "5px", border: "1px solid rgb(17, 91, 78)", backgroundColor: "rgb(255, 255, 255)" }} 
                      >
                        <div style={{ width: "20px", height: "20px", marginRight: "10px", border: "1px solid #115b4e", borderRadius: "5px", backgroundColor: colorBases[2] }}></div> Highly likely AI </div>
                      <div className="rectIndex" index={3} style={{ display: "flex", alignItems: "center", width: "95%", maxWidth:"95%", height: "38px", margin: "5px 0px 5px 5px", padding: "5px", objectFit: "contain", borderRadius: "5px", border: "1px solid rgb(17, 91, 78)", backgroundColor: "rgb(255, 255, 255)" }} 
                      >
                        <div style={{ width: "20px", height: "20px", marginRight: "10px", border: "1px solid #115b4e", borderRadius: "5px",  backgroundColor: colorBases[1]}} ></div> Ambiguous </div>
                      <div
                        className="rectIndex" index={4} style={{ display: "flex", alignItems: "center", width: "95%", maxWidth:"95%", height: "38px", margin: "5px 0px 5px 5px", padding: "5px", objectFit: "contain", borderRadius: "5px", border: "1px solid rgb(17, 91, 78)", backgroundColor: "rgb(255, 255, 255)" }}
                      >
                        <div style={{ width: "20px", height: "20px", marginRight: "10px", border: "1px solid #115b4e", borderRadius: "5px", backgroundColor: colorBases[0] }} ></div> Human </div>
                    </Row>
                    <Row>
                      {/* TODO update with selection of worst lines */}
                      <span style={{"font-size":"20px","padding-top":"1em"}} class="Click-the-numbers-below-to-see-the-top-5-highest-density-areas">
                        Click the numbers below to see the top 5 highest density areas of AI-generated text.
                      </span>
                      <div style={numberGridStyle}>
                        <div style={numberBoxStyle} onClick={() => scrollToLine(1)}>1</div>
                        <div style={numberBoxStyle} onClick={() => scrollToLine(2)}>2</div>
                        <div style={numberBoxStyle} onClick={() => scrollToLine(3)}>3</div>
                        <div style={numberBoxStyle} onClick={() => scrollToLine(4)}>4</div>
                        <div style={numberBoxStyle} onClick={() => scrollToLine(5)}>5</div>
                      </div>
                    </Row>
                  </div>
                )}
                <div>
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={0} lg={1} className="d-none d-md-block emptyStuff"></Col>
        </Row>
      </Container>
    </>
  )
}

