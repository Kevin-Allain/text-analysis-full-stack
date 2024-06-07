import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/page.module.css'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import BarGraph from '@/components/BarGraph'
import BarChartD3 from '@/components/BarChartD3'
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import TextCanvas from '@/components/TextCanvas';
import InteractiveSVGText from '@/components/InteractiveSVGText';
import InteractiveSVGWithD3 from '@/components/InteractiveSVGWithD3';
import CodeEditor from '@/components/CodeEditor';


function App() {
  const [text, setText] = useState('');
  const [prevText, setPrevText] = useState('');
  const [analyzedText, setAnalyzedText] = useState([]);
  const [metaText, setMetaText] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [outputAI, setOutputAI] = useState([]);
  const [isLoadingAI,setIsLoadingAI] = useState(false);

  const [testText, setTestText] = useState("Here is a simple example where each word will have a background color based on its length and some will have borders.");
  
  // If you plan on having the frontend communicate with the backend, you should update the frontend code to use http://backend:5000 when making requests to the backend. This leverages Docker's internal networking.
  const addressBackEnd = "127.0.0.1";
  // const addressBackEnd = "backend";
  console.log("addressBackEnd: ", addressBackEnd);

  // Style to prevent word splitting
  const containerStyle = {
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
  };

  const analyzeText = () => {
    const words = text.split(/\s+/);
    setAnalyzedText([]);
    setProgress(0);
    loadMetaText(); // Call to the backend
    words.forEach((word, index) => {
      setTimeout(() => {
        setAnalyzedText((prev) => [...prev, { word: word, length: word.length }]);
        setProgress(((index + 1) / words.length) * 100);
      }, (index + 1) * 25); // Adjusted for quicker visualization, shorter value means less wait
    });
    loadAIText();
  };

  const loadMetaText = async () => {
    // Reset previous analysis
    setMetaText([]);
    setIsLoadingAI(true);
    try {
      console.log("window.location.href: ", window.location.href);
      const is_localhost = window.location.href.indexOf('localhost');
      const is_127_0_0_1 = window.location.href.indexOf('127.0.0.1');
      const strAnalyze = is_localhost? window.location.href.replace('3000','5000')+'api/analyze' : window.location.href+'api/analyze';
      console.log("strAnalyze: ",strAnalyze);
      // Flask runs on port 5000 by default
      // const response = await fetch(`http://${addressBackEnd}:5000/api/analyze`, { 
      const response = await fetch(strAnalyze, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ text: text }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      setMetaText([data]);
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setIsLoading(false);  // Stop loading regardless of the outcome
    }
  };

  const loadAIText = async () => {
    console.log("loadAIText");
    setOutputAI([]);
    setIsLoadingAI(true);
    try {
      console.log("window.location.href loadAIText: ", window.location.href);
      const is_localhost = window.location.href.indexOf('localhost');
      const is_127_0_0_1 = window.location.href.indexOf('127.0.0.1');
      const strAnalyze = is_localhost? window.location.href.replace('3000','5000')+'api/analyze_t_b' : window.location.href+'api/analyze_t_b';
      console.log("strAnalyze AI Text: ",strAnalyze);
      // Flask runs on port 5000 by default
      const response = await fetch(strAnalyze, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ text: text }),
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const data = await response.json();
      console.log("data loadAIText: ",data)
      setOutputAI(data);
      // setOutputAI(JSON.stringify(data, null, 2)); // Update your state or UI accordingly
      console.log("odd structure type: ", typeof(JSON.stringify(data, null, 2)));
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setIsLoadingAI(false);  // Stop loading regardless of the outcome
    }
  }

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
  const getBackgroundColorAI = (outputAI,index) => {
    const curScore = outputAI.details[index].value, maxScore = Math.max(...outputAI.details.map(a=>a.value)) , minScore = Math.min(...outputAI.details.map(a=>a.value));
    const hue = mapLengthToHue(curScore, minScore, maxScore); // Map length to hue
    const saturation = 70;
    const lightness = 50;
    const alpha = 0.85;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    
  }

  function processText(text) {
    const words = text.split(/\s+/);
    const minLength = Math.min(...words.map(word => word.length));
    const maxLength = Math.max(...words.map(word => word.length));

    // Randomly choose indices to apply border
    const indicesWithBorder = new Set();
    const numberOfBorders = Math.floor(words.length * 0.2); // 20% of words get a border
    while (indicesWithBorder.size < numberOfBorders) {
        const randomIndex = Math.floor(Math.random() * words.length);
        indicesWithBorder.add(randomIndex);
    }

    const styledWords = words.map((word, index) => {
        const backgroundColor = getBackgroundColor(word.length, minLength, maxLength);
        // White text color for contrast
        const style = {
            backgroundColor, color: '#fff', padding: '2px 4px',margin: '2px',display: 'inline-block', border: indicesWithBorder.has(index) ? '2px solid red' : 'none'
        };

        return `<span style="${Object.entries(style).map(([k, v]) => `${k}:${v}`).join(';')}">${word}</span>`;
    });

    return styledWords.join(' ');
}


  const processDataForGraph = (analyzedText) => {
    const lengthMap = new Map();
    analyzedText.forEach(({ length }) => {
      lengthMap.set(length, (lengthMap.get(length) || 0) + 1);
    });
    // Convert Map to array, sort by word length, and format for graphing
    const graphData = Array.from(lengthMap, ([name, value]) => ({
      name: `${name} letters`, // Label for each bar
      value, // Number of words of this length
      letters: name // For sorting
    })).sort((a, b) => a.letters - b.letters); // Sort based on number of letters
  
    return graphData;
  };
  
  const processDiverseScores = (analyzedText) => {
    const data = [
      { name: "Originality", value: 0.7 + Math.random()*0.3 , description: "Originality is assessed with likeliness of words used to be often present in text if generated by AI." },
      { name: "Complexity", value: 0.3+Math.random()*0.6, description: "Complexity recognizes the likeliness of sentence complexity matching what is often found in AI generated texts." },
      { name: "Metadata", value: 0.4 + Math.random()*0.3 , description: "Metadata analysis interprets if the information associated to your document appears suspicious." },
      { name: "Tables/Images", value: 0.2+ Math.random()*0.3, description: "Images and tables from the document uploaded can indicate if content was generated by AI." },
      { name: "Footnotes", value: 0.3+Math.random()*0.4 , description: "Footnotes of documents can contain traces often encountered with text generated by AI.." },
    ];
    const avgvalue  = data.map(a => a.value).reduce((a, b) => a + b) / data.length;
    data.push({"name": "Average score", "value": avgvalue, description:"This score is an average. We recommend looking at the detail for a stronger understanding."});
    return data;
  }

  // Assuming analyzeText has been modified to calculate min and max word lengths
  let minLength = Math.min(...analyzedText.map(w => w.length)); // shortest word length
  let maxLength = Math.max(...analyzedText.map(w => w.length)); // longest word length
  const handleTextChange = (event) => { 
    setPrevText(text); // TODO serious doubt about this approach making sense
    setMetaText('');
    setProgress(0);
    setText(event.target.value); 
  };
  const graphData = processDataForGraph(analyzedText);
  const processedData = processDiverseScores(text);

  return (
    <>
      <Head>
        <title>Text Analysis Docker</title>
      </Head>
      <div className="container-fluid d-flex flex-column min-vh-100">
        <Navbar />
        <div className="container p-5">
          <h1 className="heading-section">Text Analysis </h1>
          <div className="mb-3">
            <label htmlFor="text-input" className="form-label">
              Enter Text
            </label>
            <textarea
              className="form-control"
              id="text-input"
              rows="3"
              onChange={handleTextChange}
            ></textarea>
          </div>
          <button className="btn btn-primary" onClick={analyzeText}>
            Analyze Text
          </button>
          <div className="textSearchOutput">
            <div className="row">
              <div className="col-md-6 overflow-auto" style={containerStyle}>
                {isLoadingAI ? (
                  <>
                    <h3 className="heading-section text-center">Generated Text Probability </h3>
                    <div className="text-center"> <div className="spinner-border text-primary" role="status"/></div>
                  </>
                ) : (
                outputAI.details && (
                  <>
                  <h3 className="heading-section text-center">Generated Text Probability</h3>
                  <h2>Average score: {outputAI.average} </h2>
                  Details:<br/>
                    {outputAI.details && outputAI.details.map((oAI,index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: getBackgroundColorAI(outputAI,index),
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
              </div>
              <div className="col-md-6 overflow-auto" style={containerStyle}>
                {isLoading ? (
                  <>
                    <h3 className="heading-section text-center">
                      Text Metadata
                    </h3>
                    <div className="text-center">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        {/* <span className="sr-only">Loading...</span> */}
                      </div>
                    </div>
                  </>
                ) : (
                  metaText.length > 0 && (
                    <>
                      <h3 className="heading-section text-center">
                        Text Metadata
                      </h3>
                      <div className="meta-data-container">
                        <h4>Sentiment Analysis</h4>
                        <p>
                          <strong>Polarity:</strong>{" "}
                          {metaText[0].sentiment.polarity.toFixed(2)}
                        </p>
                        <p>
                          <strong>Subjectivity:</strong>{" "}
                          {metaText[0].sentiment.subjectivity.toFixed(2)}
                        </p>
                        <h4>Noun Phrases</h4>
                        <ul>
                          {metaText[0].noun_phrases.map((phrase, index) => (
                            <li key={index}>{phrase}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )
                )}
              </div>
            </div>
            {/* <div className="row">
              {isLoadingAI ? ( <> <h3 className="heading-section text-center">AI output</h3> <div className="text-center"> <div className="spinner-border text-primary" role="status"/> </div> </>
              ) : (
                outputAI.details && ( <> <h3 className="heading-section text-center">AI output</h3> <pre>{outputAI.toString()}</pre> </> )
              )}
            </div> */}
            <div className="row">
              {progress === 100 && (
                <>
                  <h3 className="heading-section text-center">Score Graphs</h3>
                  <div style={{ width: "100%", height: "400px" }}>
                    <BarChartD3 data={processedData} />
                  </div>
                  <BarGraph data={graphData} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;
