import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
import Head from 'next/head';
import Navbar from '@/components/NavBar';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/BreadCrumb';
import HorizontalNav from '@/components/HorizontalNav';
import { FormDataContext } from '@/components/context/FormDataContext';
import '@/styles/PlagiarismFeature.css';
import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';
import { fetchFileContent } from '@/utils/FileLoader';
import UserList from '@/components/UserList';
import ProductFeatureTitle from '@/components/ProductFeatureTitle';
import ModularTitle from '@/components/ModularTitle';
import BlackBar from '@/components/BlackBar';
import FooterBar from "@/components/FooterBar"

export default function Plagiarism() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [indexFile, setIndexFile] = useState(0);
  const [fileList, setFileList] = useState([]);

  const { formData, setFormData } = useContext(FormDataContext);

  const textRef = useRef(null);
  const detailsScoreRef = useRef(null);
  const users = codecheckerData_plagiarism.data.sort((a, b) => b.globalScore - a.globalScore);
  const detailsPlagiarism = [
    { className: "plagiarism", color: "rgba(216,72,72,0.5)", text: "Plagiarism 1", indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { className: "plagiarism2", color: "rgba(72,72,216,0.5)", text: "Plagiarism 2", indications: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { className: "plagiarism3", color: "rgba(76,216,72,0.5)", text: "Plagiarism 3", indications: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  ]; // Example details list

  useEffect(() => {
    if (users.length > 0) {
      setSelectedUser(users[0].name);
    }
  }, [users]);

  useEffect(() => {
    console.log("useEffect triggered | selectedUser:", selectedUser, "indexFile:", indexFile);
    if (selectedUser) {
      const userData = codecheckerData_plagiarism.data.find(user => user.name === selectedUser);
      if (userData && userData.files.length > 0) {
        setFileList(userData.files);
        fetchFileContent(
          userData.files[indexFile],
          userData.scoreDetails[indexFile],
          setFileContent,
          highlightText
        );
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

  const highlightText = (text, scoreDetails) => {
    let highlightedText = text;
    let sizeOffset = 0;
    // console.log("Plagiarism / highlightText | text: ",text,", scoreDetails: ",scoreDetails);
    scoreDetails.forEach(detail => {
      const { type, range } = detail;
      const detailInfo = detailsPlagiarism.find(d => d.className === type);
      const highlightStart = `<span class="highlight ${type}" style="background-color: ${detailInfo.color}">`;
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
    console.log("User clicked:", user);
    setSelectedUser(user.name);
    setIndexFile(0); // Reset to the first file
  };

  const handleFileClick = (index) => {
    console.log("File clicked:", index);
    setIndexFile(index);
  };

  const handleHighlightClick = (className) => {
    const element = detailsScoreRef.current.querySelector(`.${className}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDetailClick = (detail) => {
    setSelectedDetail(detail.className === selectedDetail ? null : detail.className);
  };

  const stickyColumn = {
    position: "sticky",
    top: 0,
    zIndex: 10,
    height: "90vh",
    overflowY: "auto",
    // backgroundColor: "#f8f9fa", // Just for visibility
  };


  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
      </Head>
      <Container fluid>
        <Row>
          <BlackBar users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} fileList={fileList} handleFileClick={handleFileClick} indexFile={indexFile} feature={"Plagiarism"} />
          <Navbar users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} fileList={fileList} handleFileClick={handleFileClick} indexFile={indexFile} feature={"Plagiarism"} />
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
              <HorizontalNav features={["Similarity", "AI_Detection", "Plagiarism"]} selectedUser={selectedUser} />
              <Col lg={9} md={8} sm={12} className="mb-3 biggerContent" >
                {/* Used to be fine, but if we want to export output, then we need everything in one page...? */}
                <div className="card overflow-y-scroll" style={{ "height": "75vh" }}>
                  {/* <div className="card"> */}
                  <div className="card-body">
                    <div className="text-content">
                      <pre dangerouslySetInnerHTML={{ __html: fileContent }} />
                    </div>
                  </div>
                </div>
                {/* </div> */}
              </Col>
              {/* <div style={stickyColumn} className="col-md-3"> */}
              <Col lg={3} md={4} sm={12} className="smallerContent">
                <div>
                  {/* Submission from {selectedUser} with a score of {codecheckerData_plagiarism.data.find(user => user.name === selectedUser)?.globalScore}. */}
                  <div className='score_big' style={{ "width": "100%", "color": "black", "background-color": "#f2f2f2", "padding": "0.5rem", "font-size": "larger", "border-radius": "0.5rem" }}>
                    {/* TODO set the name into a link to personal record? */}
                    Submission from <u>{selectedUser}</u><br />
                    User Plagiarism Score:{" "}{(100 * codecheckerData_plagiarism.data.find(user => user.name === selectedUser)?.globalScore).toFixed(2) + "%"} <br />
                    Number of submissions: {codecheckerData_plagiarism.data.find(user => user.name === selectedUser)?.numSubmissions}
                  </div>
                </div>
                <div className="details_score" ref={detailsScoreRef}>
                  {detailsPlagiarism.map((item, index) => (
                    <div key={index}>
                      <div
                        className={`detail-item ${item.className}`}
                        style={{ backgroundColor: item.color }}
                        onClick={() => handleDetailClick(item)}
                      >
                        {item.text}
                      </div>
                      {selectedDetail === item.className && (
                        <div className="detail-indications">
                          {(selectedUser && codecheckerData_plagiarism.data) &&
                            <>
                              <a href={codecheckerData_plagiarism.data.find(user => user.name === selectedUser)
                                ?.scoreDetails[indexFile].find(sc => sc.type === item.className)?.source} target="_blank" rel="noopener noreferrer">
                                {codecheckerData_plagiarism.data
                                  .find(user => user.name === selectedUser)?.scoreDetails[indexFile]
                                  .find(sc => sc.type === item.className)?.source}
                              </a>
                              <hr />
                            </>
                          }
                          {item.indications}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Col>
          <Col md={0} lg={1} className="d-none d-md-block emptyStuff"></Col>
        </Row>
        <FooterBar/>
      </Container>
    </>
  );
}
