import styles from "@/app/page.module.css";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import CodeEditor from "@/components/CodeEditor";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import withAuth from "@/components/WithAuth";
import NewCheckWindow from "@/components/NewCheckWindow";

const CodeDisplay = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const [prevCode, setPrevCode] = useState("");
  const [analyzedCode, setAnalyzedCode] = useState([]);
  const [metaCode, setMetaCode] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [outputAI, setOutputAI] = useState([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // If you plan on having the frontend communicate with the backend, you should update the frontend code to use http://backend:5000 when making requests to the backend. This leverages Docker's internal networking.
  const addressBackEnd = "127.0.0.1";
  // const addressBackEnd = "backend";
  console.log("addressBackEnd: ", addressBackEnd);

  const analyzeCode = () => {
    setIsLoadingAI(true);

    const words = code.split(/\s+/);
    setAnalyzedCode([]);
    setProgress(0);
    words.forEach((word, index) => {
      setTimeout(() => {
        setAnalyzedCode((prev) => [
          ...prev,
          { word: word, length: word.length },
        ]);
        setProgress(((index + 1) / words.length) * 100);
      }, (index + 1) * 25); // Adjusted for quicker visualization, shorter value means less wait
    });

    setIsLoadingAI(false);
  };

  return (
    <>
      <span>Enter code and our program will analyze it.</span>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your code here..."
        style={{
          width: "100%",
          height: "120px",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      />
      <CodeEditor
        code={code}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <button className="btn btn-primary" onClick={analyzeCode}>
        {" "}
        Analyze Code{" "}
      </button>
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
        progress === 100 && <div>Output...</div>
      )}
    </>
  );
};

export default CodeDisplay;
