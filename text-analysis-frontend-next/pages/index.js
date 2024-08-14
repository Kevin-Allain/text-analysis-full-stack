// pages/index.js
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import credentials from '../public/credentials.json';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { FormDataContext } from '@/components/context/FormDataContext';



const IndexPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [targetPage, setTargetPage] = useState('');
  const router = useRouter();

  const { formData, setFormData } = useContext(FormDataContext);

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === credentials.username && password === credentials.password) {
      localStorage.setItem('authenticated','true')
      // TODO adapt based on authorizations for user: which product can they access? set more variables to localStorage

      localStorage.setItem("formData", {
        institution: '',
        module: '',
        name: '',
        files: [],
        users:[],
        product: `${targetPage}`
      });
      
      setFormData({
        institution: '',
        module: '',
        name: '',
        files: [],
        users:[],
        product: `${targetPage}`
      });

      localStorage.setItem('product',targetPage);

      router.push(`/${targetPage}`);
    } else {
      alert('Invalid login credentials');
    }
  };

  const openLogin = (page) => {
    setTargetPage(page);
    setShowLogin(true);
  };

  useEffect(() => {
    if (localStorage.formData) { localStorage.formData = null }
    if (localStorage.product) { localStorage.product = null }
  },);

  return (
    <div>
      <Head>
        <style>{`
          .custom-button { transition: background-color 0.3s, color 0.3s; }
          .custom-button:hover { background-color: #0056b3; color: white; }
          .button-container button { font-family: 'Arial', sans-serif; margin: 10px; }
        `}</style>
      </Head>
      <div className="container mt-5">
        <div className="d-flex justify-content-center flex-column align-items-center">
          <h1 className="mb-4">Welcome to the HappyAI App</h1>
          <p>Select the product</p>
          <div className="button-container">
            <button className="btn btn-primary custom-button" onClick={() => openLogin('TextAnalysis')}>
              Text Analysis
            </button>
            <button className="btn btn-primary custom-button" onClick={() => openLogin('CodeChecker')}>
              Code Checker
            </button>
            <button className="btn btn-primary custom-button" onClick={() => openLogin('MediaChecker')}>
              Media Checker
            </button>
            <button className="btn btn-primary custom-button" onClick={() => openLogin('WebsiteChecker')}>
              Website Checker
            </button>
          </div>
        </div>
        {showLogin && (
          <div className="d-flex justify-content-center mt-4">
            <form onSubmit={handleLogin} className="w-50">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
