import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';

import Head from 'next/head'
import Navbar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Breadcrumb from '@/components/BreadCrumb'
import CollusionSelectionGraph from '@/components/vis/CollusionSelectionGraph'
import HorizontalNav from '@/components/HorizontalNav';
import { FormDataContext } from '@/components/context/FormDataContext';
import '@/styles/Collusion.module.css'
import { fetchFileContent, fetchFileContentToDivs } from '@/utils/FileLoader';
import UserList from '@/components/UserList';
import codecheckerData_collusion from '@/public/data/codechecker_collusion_example.json';


export default function Collusion(){
  const { formData, setFormData } = useContext(FormDataContext);

  const [selectedUser, setSelectedUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [indexFile, setIndexFile] = useState(0);
  const [fileList, setFileList] = useState([]);
  const users = codecheckerData_collusion.data.sort((a, b) => b.globalScore - a.globalScore);
  console.log("globalScore of first: ", codecheckerData_collusion.data[0].globalScore)
  console.log("typeof globalScore of first: ", typeof(codecheckerData_collusion.data[0].globalScore))

  const [fileCollusion1, setFileCollusion1] = useState(null);
  const [fileCollusion2, setFileCollusion2] = useState(null);
  const [contentCollusion1, setContentCollusion1] = useState(null);
  const [contentCollusion2, setContentCollusion2] = useState(null);

  // ----- functions
  const handleUserClick = (user) => { 
    setSelectedUser(user.name); 
    setOtherUser(null);
    setIndexFile(0); // Reset to the first file
  };
  const handleFileClick = (index) => { setIndexFile(index); };
  const TableComponent = ({ inputString, setFileCollusion1, setFileCollusion2 }) => {
    const tableHTML = parseAndGenerateHTMLTable(inputString);
    useEffect(() => {
      const rows = document.querySelectorAll('.clickable-row');
      rows.forEach(row => {
        row.addEventListener('click', () => {
          const file1 = row.getAttribute('data-file1');
          const file2 = row.getAttribute('data-file2');
          setFileCollusion1(file1);
          setFileCollusion2(file2);
        });
      });
    }, [tableHTML]);  
    return ( <div className="container"> 
      <div dangerouslySetInnerHTML={tableHTML} /> 
    </div> );
  };
  const parseAndGenerateHTMLTable = (inputString) => {
    const data = JSON.parse(inputString);
    const users = {};  
    // Parse the input data to collect user files
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const [pair] = [key]; const [part1, part2] = pair.split('|'); const [name1, file1] = part1.split('('); const [name2, file2] = part2.split('(');
        if (!users[name1.trim()]) { users[name1.trim()] = new Set(); }
        if (!users[name2.trim()]) { users[name2.trim()] = new Set(); }
        users[name1.trim()].add(file1.slice(0, -1).trim());
        users[name2.trim()].add(file2.slice(0, -1).trim());
      }
    }  
    const rows = [];  
    // Generate combinations and fetch scores
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const [pair, score] = [key, data[key]]; const [part1, part2] = pair.split('|'); const [name1, file1] = part1.split('('); const [name2, file2] = part2.split('(');
        rows.push({
          name1: name1.trim(), file1: file1.slice(0, -1).trim(),
          name2: name2.trim(), file2: file2.slice(0, -1).trim(),
          score: score
        });
      }
    }
    // Generate HTML table
    // const tableHTML = `<table class="table table-striped"><thead><tr><th>Name 1</th><th>File 1</th><th>Name 2</th><th>File 2</th><th>Score</th></tr></thead><tbody>${rows.map(row => `<tr onclick="setFileCollusions('${row.file1}', '${row.file2}')"><td>${row.name1}</td><td>${row.file1}</td><td>${row.name2}</td><td>${row.file2}</td><td>${row.score}</td></tr>`).join('')}</tbody></table>`;
    const tableHTML = `<table class="table table-striped">
        <thead><tr><th>User 1</th><th>File 1</th><th>User 2</th><th>File 2</th><th>Collusion Score</th></tr></thead>
        <tbody>
          ${rows.map((row, index) => `<tr class="clickable-row" data-file1="${row.file1}" data-file2="${row.file2}" style="cursor: pointer;">
              <td>${row.name1}</td><td>${row.file1}</td><td>${row.name2}</td><td>${row.file2}</td><td>${row.score}</td></tr>`).join('')}
        </tbody>
      </table>`;
    return { __html: tableHTML };
  }

  // ---- useEffect
  const textRef = useRef(null);
  const detailsScoreRef = useRef(null);
  useEffect(() => {
    if (users.length > 0) { setSelectedUser(users[0].name); }
  }, [users]);



  useEffect(() => {
    if (selectedUser) {
      const userData = codecheckerData_collusion.data
        .find(user => user.name === selectedUser);
      if (userData && userData.files.length > 0)
        {setFileList(userData.files);} 
      setOtherUser(null);
    }
  }, [selectedUser, indexFile]);

  useEffect(() => { 
    if (otherUser) {console.log("useEffect Collusion | otherUser: ",otherUser);}
    setFileCollusion1(null);
    setFileCollusion2(null);
 }, [otherUser]);

  useEffect(() => {
    if (fileCollusion1 && fileCollusion2 ){
      let userData1 = codecheckerData_collusion.data.find(user => user.name === selectedUser);
      let userData2 = codecheckerData_collusion.data.find(user => user.name === otherUser);
      console.log("useEffect [fileCollusion1,filecollusion2] | userData1: ",userData1," userData2: ",userData2);
      let indexFile1 = 0; let indexFile2 = 0;

      // fetchFileContent(
      fetchFileContentToDivs(
        fileCollusion1, 
        userData1.scoreDetails[indexFile1], 
        setContentCollusion1,
        // highlightText
      );
      // fetchFileContent(
      fetchFileContentToDivs(
        fileCollusion2, 
        userData2.scoreDetails[indexFile2], 
        setContentCollusion2,
        // highlightText
      )
    }
  },[fileCollusion1,fileCollusion2])


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
            {/* <Breadcrumb /> */} 
            <h1> {formData?.product && formData?.product} Collusion - Details</h1>            
            <div className="row">
              <div className="col-md-9">
                <h4>Summary of collusion between {selectedUser} and others.</h4>
                  {(selectedUser!==null && codecheckerData_collusion.data) && 
                    <CollusionSelectionGraph 
                      user={codecheckerData_collusion.data.find(user => user.name === selectedUser)} 
                      setOtherUser = {setOtherUser}
                      otherUser = {otherUser}
                    />
                  }
                {/* <hr/>
                <h4>Files details</h4><h3>{(selectedUser && codecheckerData_collusion.data) && codecheckerData_collusion.data.find(user => user.name === selectedUser)?.files[indexFile]}</h3>
                <div><u>Files</u>{selectedUser && fileList.map((file, index) => (<button  key={index} className={`btn btn-link ${(indexFile === index) ? 'active' : ''}`} onClick={() => handleFileClick(index)}>{file}</button>))}</div> */}
                {otherUser &&
                  <div className="card" >
                    <div className="card-body">
                      <p>Details about collusion scores for each files combination with {otherUser}.</p>
                      {otherUser &&
                        <>
                          <TableComponent
                            inputString={
                              JSON.stringify(codecheckerData_collusion.data
                                .find(user => user.name === selectedUser)
                                .scoreDetails
                                .relations
                                .filter(a => a.name === otherUser)[0]
                                .collusionScores
                              )}
                            setFileCollusion1={setFileCollusion1}
                            setFileCollusion2={setFileCollusion2}
                          />
                          {/* <div dangerouslySetInnerHTML={parseAndGenerateHTMLTable(JSON.stringify(codecheckerData_collusion.data.find(user => user.name === selectedUser).scoreDetails.relations.filter(a => a.name === otherUser)[0].collusionScores))} /> */}
                          {(fileCollusion1 && fileCollusion2) &&
                            <div className="d-flex justify-content-between mx-3">
                              <div className="w-50">
                                <b>{fileCollusion1}</b><hr />
                                {(contentCollusion1 !== null) &&
                                  contentCollusion1
                                }
                              </div>
                              <div className="vertical-separator" style={{ width: '1px', backgroundColor: '#000', height: '100%', margin: '0 10px' }}></div>
                              <div className="w-50">
                                <b>{fileCollusion2}</b><hr />
                                {(contentCollusion2 !== null) &&
                                  contentCollusion2
                                }
                              </div>
                            </div>
                          }
                        </>
                      }
                    </div>
                  </div>

                }
              </div>

              <div className="col-md-3 right_side">
                <HorizontalNav/>
                <UserList users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} />
                {/* <div className="user_listing">
                  <ul className="list-group">
                    {users.filter(a => a!== selectedUser).map((user, index) => (
                      <li key={index} className={`list-group-item d-flex justify-content-between ${selectedUser === user.name ? 'bg-secondary' : ''}  ${selectedUser === user.name ? 'text-white' : ''}`} onClick={() => handleUserClick(user)} >
                        <span>{user.name}</span>
                        {user.globalScore !== null &&  <span>{(user.globalScore * 100).toFixed(2)}%</span> }
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

