import styles from "../app/page.module.css";

export default function Stuff() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>Stuff</div>
    </main>
  );
}


// Misc - Disregarded code from AI_Detection

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




    // // FOR MARKER POSITION
  // useEffect(() => {
  //   const adjustMarkerPositions = () => {
  //     const markerElements = document.querySelectorAll('.markerArea div');
  //     // TODO update for lines with worst scores
  //     const lineElements = document.querySelectorAll('.line-1, .line-2, .line-3, .line-4, .line-5');      
  //     let previousBottom = 0;
  //     // Adjust each marker's position based on the corresponding line's position
  //     markerElements.forEach((marker, index) => {
  //       if (lineElements[index]) {
  //         const lineTop = lineElements[index].offsetTop;          
  //         // Calculate the margin-top by subtracting the previous marker's bottom position
  //         const marginTop = lineTop - previousBottom;
  //         marker.style.marginTop = `${marginTop}px`;
  //         // Update the bottom position of the current marker for the next iteration
  //         previousBottom = lineTop + marker.offsetHeight;
  //       }
  //     });
  //   };
  //   // Adjust markers after content is rendered
  //   adjustMarkerPositions();
  //   // Listen to window resize events to recalculate positions if the window is resized
  //   window.addEventListener('resize', adjustMarkerPositions);
  //   return () => { window.removeEventListener('resize', adjustMarkerPositions); };
  // }, [fileContent]);  // Re-run whenever fileContent changes
