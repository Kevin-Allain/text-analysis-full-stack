import styles from "@/app/page.module.css";
import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import CodeEditor from "@/components/CodeEditor";
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import withAuth from "@/components/WithAuth";
import NewCheckWindow from "@/components/NewCheckWindow";
import { FormDataContext } from "@/components/context/FormDataContext";


const CodeChecker = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  // We consider that in this page, we should always have the institution, module, name, etc, set back to ''
  const { formData, setFormData} = useContext(FormDataContext);

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
      <Head>
        <title>Code Checker</title>
      </Head>
        <div className="container-fluid d-flex flex-column min-vh-100">
          <Navbar />
          <div className="row">
            <Sidebar/>
            <div className="col-md-10">
              <h1 className="heading-section text-center">Code Checker</h1>
              <NewCheckWindow product={"CodeChecker"} />
            </div>
          </div>
        </div>
        <Footer />
    </>
  );
};

export default withAuth(CodeChecker);
