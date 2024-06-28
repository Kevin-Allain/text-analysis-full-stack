import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';

import Head from 'next/head'
import Navbar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Breadcrumb from '@/components/BreadCrumb'
import CollusionNetworkGraph from '@/components/vis/CollusionNetworkGraph'
import HorizontalNav from '@/components/HorizontalNav';
import { FormDataContext } from '@/components/context/FormDataContext';
import '@/styles/Collusion.module.css'

import codecheckerData_collusion from '@/public/data/codechecker_collusion_example.json';


export default function Collusion(){
  const { formData, setFormData } = useContext(FormDataContext);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [indexFile, setIndexFile] = useState(0);
  const [fileList, setFileList] = useState([]);
  const users = codecheckerData_collusion.data.sort((a, b) => b.worstScore - a.worstScore);
  console.log("worstScore of first: ", codecheckerData_collusion.data[0].worstScore)
  console.log("typeof worstScore of first: ", typeof(codecheckerData_collusion.data[0].worstScore))


  // ----- functions 
  const fetchFileContent = async (fileName, scoreDetails) => {
    try {
      const response = await fetch(`/data/codechecker_files/${fileName}`);
      if (response.ok) {
        // first, load the file
        const textFile = await response.text();
        console.log("textFile: ",textFile);
        // second, call the AI
        // loadAIText(textFile);
        setFileContent(textFile);
      } else {
        setFileContent("Error loading file content.");
      }
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content.");
    }
  };

  const handleUserClick = (user) => { setSelectedUser(user.name); setIndexFile(0); // Reset to the first file
  };
  const handleFileClick = (index) => { setIndexFile(index); };


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
      const userData = codecheckerData_collusion.data.find(user => user.name === selectedUser);
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
          <Sidebar />
          <div className="col-md-10">
            <Breadcrumb />
            <HorizontalNav/>          
            <h1> {formData?.product && formData?.product} Collusion - Details</h1>            
            <div className="row">

              <div className="col-md-9">
                <h4>Summary of collusion between {selectedUser} and others.</h4>
                  {(selectedUser && codecheckerData_collusion.data) && 
                    <CollusionNetworkGraph user={codecheckerData_collusion.data.find(user => user.name === selectedUser)} />
                  }


                <hr/>
                <h4>File details</h4>
                <h3>
                  {(selectedUser && codecheckerData_collusion.data) &&
                    codecheckerData_collusion.data.find(user => user.name === selectedUser)?.files[indexFile]
                  }
                </h3>
              <div>
                  <u>Files</u>
                  {selectedUser && 
                    fileList.map((file, index) => (
                      <button 
                        key={index} 
                        className={`btn btn-link ${(indexFile === index) ? 'active' : ''}`} 
                        onClick={() => handleFileClick(index)}
                        // disabled={isLoadingAI}
                      >
                        {file}
                      </button>
                    ))
                  }
                </div>

                <div className="card" style={{ 'height': '30vh' }}>
                  <div className="card-body">
                    <p>Details about collusion scores here.</p>
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
                        {user.worstScore !== null && 
                          <span>{(user.worstScore * 100).toFixed(2)}%</span>
                        }
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

