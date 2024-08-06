import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
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
import ProductFeatureTitle from '@/components/ProductFeatureTitle';
import ModularTitle from '@/components/ModularTitle';

export default function Similarity() {
  const { formData, setFormData } = useContext(FormDataContext);

  const [selectedUser, setSelectedUser] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [indexFile, setIndexFile] = useState(0);
  const [fileList, setFileList] = useState([]);
  const users = codecheckerData_collusion.data.sort((a, b) => b.globalScore - a.globalScore);
  console.log("globalScore of first: ", codecheckerData_collusion.data[0].globalScore)
  console.log("typeof globalScore of first: ", typeof (codecheckerData_collusion.data[0].globalScore))

  const [fileSimilarity1, setFileSimilarity1] = useState(null);
  const [fileSimilarity2, setFileSimilarity2] = useState(null);
  const [contentSimilarity1, setContentSimilarity1] = useState(null);
  const [contentSimilarity2, setContentSimilarity2] = useState(null);

  const [showMenuOtherUser, setShowMenuOtherUser] = useState(false);
  const toggleOtherUser = () => { setShowMenuOtherUser(!showMenuOtherUser); }

  const [selectedFiles, setSelectedFiles] = useState({ file1: null, file2: null });


  // ----- functions
  const handleUserClick = (user) => {
    setSelectedUser(user.name);
    setOtherUser(null);
    setIndexFile(0); // Reset to the first file
  };
  const TableComponent = ({ inputString, setFileSimilarity1, setFileSimilarity2 }) => {
    const tableHTML = parseAndGenerateHTMLTable(inputString);
    useEffect(() => {
      const rows = document.querySelectorAll('.clickable-row');
      rows.forEach(row => {
        row.addEventListener('click', () => {
          const file1 = row.getAttribute('data-file1');
          const file2 = row.getAttribute('data-file2');
          setFileSimilarity1(file1);
          setFileSimilarity2(file2);
          setSelectedFiles({ file1, file2 });
        });
      });

      // Setting the style
      rows.forEach(row => {
        const file1 = row.getAttribute('data-file1');
        const file2 = row.getAttribute('data-file2');
        if (file1 === selectedFiles.file1 && file2 === selectedFiles.file2) {
          row.style.border = '2px solid black';
        } else {
          row.style.border = 'none';
        }
      });

    }, [tableHTML]);
    return (
    // <div className="container">
    <Container>
      <div style={{"overflow-x":"scroll"}} dangerouslySetInnerHTML={tableHTML} />
    </Container>
    // </div>
    );
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
          score: (100 * score).toFixed(2) + "%"
        });
      }
    }
    // Generate HTML table
    // const tableHTML = `<table class="table table-striped"><thead><tr><th>Name 1</th><th>File 1</th><th>Name 2</th><th>File 2</th><th>Score</th></tr></thead><tbody>${rows.map(row => `<tr onclick="setFileSimilaritys('${row.file1}', '${row.file2}')"><td>${row.name1}</td><td>${row.file1}</td><td>${row.name2}</td><td>${row.file2}</td><td>${row.score}</td></tr>`).join('')}</tbody></table>`;
    const tableHTML = `<table class="table table-striped">
        <thead>
          <tr>
            <th>Individual 1</th>
            <th>File 1</th>
            <th>Individual 2</th>
            <th>File 2</th>
            <th>Similarity Score</th>
          </tr>
        </thead>
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
      if (userData && userData.files.length > 0) { setFileList(userData.files); }
      setOtherUser(null);
    }
  }, [selectedUser, indexFile]);

  useEffect(() => {
    if (otherUser) { console.log("useEffect Similarity | otherUser: ", otherUser); }
    setFileSimilarity1(null);
    setFileSimilarity2(null);
  }, [otherUser]);

  useEffect(() => {
    if (fileSimilarity1 && fileSimilarity2) {
      let userData1 = codecheckerData_collusion.data.find(user => user.name === selectedUser);
      let userData2 = codecheckerData_collusion.data.find(user => user.name === otherUser);
      console.log("useEffect [fileSimilarity1,filesimilarity2] | userData1: ", userData1, " userData2: ", userData2);
      let indexFile1 = 0; let indexFile2 = 0;

      // fetchFileContent(
      fetchFileContentToDivs(
        fileSimilarity1,
        userData1.scoreDetails[indexFile1],
        setContentSimilarity1,
        // highlightText
      );
      // fetchFileContent(
      fetchFileContentToDivs(
        fileSimilarity2,
        userData2.scoreDetails[indexFile2],
        setContentSimilarity2,
        // highlightText
      )
    }
  }, [fileSimilarity1, fileSimilarity2])


  return (
    <>
      <Head>
        <title>Similarity</title>
      </Head>
      <Container fluid>
        <Row>
          <Navbar users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} feature={"Similarity"} />
          <Col md={0} lg={1} className="d-none d-md-block emptyStuff" ></Col>
          <Col md={12} lg={10} className="content" style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: '1400px',  // Set a maximum width for large screens
            paddingLeft: '15px',
            paddingRight: '15px',
          }}
          >
            <Row>        
              <HorizontalNav features={["Similarity", "AI_Detection", "Plagiarism"]} selectedUser={selectedUser}/>      
              <Col lg={9} md={8} sm={12} className="mb-3 biggerContent" >
                {/* <ProductFeatureTitle feature="Individual History" product={selectedUser} /> */}
                {(selectedUser !== null && codecheckerData_collusion.data) &&
                  <>
                    <div className="otherUserSets">
                      <DropdownButton
                        id="dropdown-basic-button"
                        title={
                          `${otherUser ? ("Similarity with " + otherUser) : "Select other user to compare similarity"}`
                        }
                        onClick={toggleOtherUser}
                        isExpanded={true}
                        className="btn otherIndividualSelect"
                        // size="lg"
                        // align={{ lg: 'end' }}
                        style={{ "minWidth": '100% !important' }} // Ensures it takes priority
                        show={showMenuOtherUser}
                      >
                        {codecheckerData_collusion.data.find(user => user.name === selectedUser)
                          .scoreDetails.relations.map((relation, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() => setOtherUser(relation.name)}
                              style={{
                                backgroundColor: relation.name === otherUser ? 'darkgrey' : '',
                                color: relation.name === otherUser ? 'white' : '',
                                border: relation.name === otherUser ? 'solid' : '',
                                borderRadius: relation.name === otherUser ? '0.5rem' : '',
                                borderWidth: relation.name === otherUser ? 'thin' : '',
                                width: "100%"
                              }}
                            >
                              {relation.name}
                            </Dropdown.Item>
                          ))}
                      </DropdownButton>
                    </div>
                  </>
                }
                {otherUser &&
                  <div className="card" >
                    <div className="card-body">
                      <p>Details about similarity scores for each files combination with {otherUser}.</p>
                      <p>Select a row in the table to compare two files.</p>
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
                            setFileSimilarity1={setFileSimilarity1}
                            setFileSimilarity2={setFileSimilarity2}
                          />
                          {(fileSimilarity1 && fileSimilarity2) &&
                            <div className="d-flex justify-content-between mx-3">
                              <div className="w-50">
                                <b>Filename:{" "} {fileSimilarity1}</b><hr />
                                {(contentSimilarity1 !== null) && contentSimilarity1}
                              </div>
                              <div className="vertical-separator" style={{ width: '1px', backgroundColor: '#000', height: '100%', margin: '0 10px' }}></div>
                              <div className="w-50">
                                <b>Filename:{" "} {fileSimilarity2}</b><hr />
                                {(contentSimilarity2 !== null) && contentSimilarity2}
                              </div>
                            </div>
                          }
                        </>
                      }
                    </div>
                  </div>
                }
              </Col>
              <Col lg={3} md={4} sm={12} className="smallerContent">
                {/* <Sidebar /> */}
                {selectedUser &&
                  (<div className='score_big' style={{ "width": "100%", "color": "black", "background-color": "#f2f2f2", "padding": "0.5rem", "font-size": "larger", "border-radius": "0.5rem" }}>
                    Submission from <u>{selectedUser}</u>.{" "}<br />
                    Worst Similarity Score:{" "}{(100 * codecheckerData_collusion.data.find(user => user.name === selectedUser)?.globalScore).toFixed(2) + "%"} <br />
                    Number of submissions: {codecheckerData_collusion.data.find(user => user.name === selectedUser)?.numSubmissions}.
                  </div>)
                }
              </Col>
            </Row>
          </Col>
          <Col md={0} lg={1} className="d-none d-md-block emptyStuff"></Col>
        </Row>
      </Container>
    </>
  )
}
