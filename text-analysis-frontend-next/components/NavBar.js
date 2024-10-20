import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import React, { useState, useRef, useContext } from "react";
import { Dropdown, DropdownButton, Container, Row, Col, Button } from 'react-bootstrap';
import { FormDataContext } from "@/components/context/FormDataContext";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/img/AI-AWARE-LOGO-WEBSITE-1-BLACK.png";
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import PagePDFExport from "@/components/export/PagePDFExport";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import codecheckerData_collusion from '@/public/data/codechecker_collusion_example.json';
import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';
import codecheckerData_ai_detection from '@/public/data/codechecker_ai_detection_example.json';
import codecheckerData_ai_detection_preload from '@/public/data/codechecker_ai_detection_preload.json';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import NavBarMajorButtons from "@/components/NavBarMajorButtons";

export default function Navbar(props) {
  const {users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature} = props;
  console.log("Navbar | props: ",{users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature});
  const { formData } = useContext(FormDataContext);
  const { institution, module, name, files } = formData;
  console.log("Navbar | formData stuff: ", {institution, module, name, files});

  const router = useRouter();

  const [institutionListVisible, setInstitutionListVisible] = useState(false);
  const [moduleListVisible, setModuleListVisible] = useState(false);
  const [nameListVisible, setNameListVisible] = useState(false);  
  const [userListVisible, setUserListVisible] = useState(false);
  const [fileListVisible, setFileListVisible] = useState(false);

  const iconStyle = {
    fontSize: "1.5rem", marginBottom: "5px", // Set a fixed size for all icons
  };

  // TODO feels dirty because only one element...
  const toggleInstitution = () => { setInstitutionListVisible(!institutionListVisible);  }
  const toggleModule = () => { setModuleListVisible(!moduleListVisible);  }
  const toggleName = () => { setNameListVisible(!nameListVisible);  }

  const toggleUser = () => { setUserListVisible(!userListVisible);  }
  const toggleFile = () => { setFileListVisible(!fileListVisible);  }

  const structToLookFilesIn = feature==="AI_Detection"?codecheckerData_ai_detection:feature==="Similarity"?codecheckerData_collusion:codecheckerData_plagiarism;

  const handleLogoClick = () => { router.push("/"); };
  const handleResultsClick = () => {
    router.push("/InitialResults")
  }


  return (
    <Container fluid style={{marginTop:"0.5rem"}}>
      {/* Row for smaller screens */}
      <Row className="d-flex d-md-none w-100">
        <Col
          xs={12}
          className="align-items-center justify-content-evenly"
        >
          <div className="navFolderSets mb-2" style={{ width: "fit-content" }}>
            {name && (
              // {/* {`${institution} | ${module} | ${name}`} */}
              <DropdownButton
                id="dropdown-basic-button"
                title={"Folder Set"}
                variant="outline-dark" // Set variant to light
                onClick={toggleInstitution}
                // custom-dropdown
                // className="individualSelect"
                style={{ width: "auto" }}
                show={institutionListVisible}
              >
                <Dropdown.ItemText>
                  <u>Institution</u>
                </Dropdown.ItemText>
                {[institution].map((institution, index) => (
                  <Dropdown.Item
                    key={index}
                    style={{
                      backgroundColor: "darkgrey",
                      color: "white",
                      border: "solid",
                      borderRadius: "0.5rem",
                    }}
                  >
                    {institution}
                  </Dropdown.Item>
                ))}
                <Dropdown.ItemText>
                  <u>Module</u>
                </Dropdown.ItemText>
                {[module].map((module, index) => (
                  <Dropdown.Item
                    key={index}
                    style={{
                      backgroundColor: "darkgrey",
                      color: "white",
                      border: "solid",
                      borderRadius: "0.5rem",
                    }}
                  >
                    {module}
                  </Dropdown.Item>
                ))}
                <Dropdown.ItemText>
                  <u>Name</u>
                </Dropdown.ItemText>
                {[name].map((name, index) => (
                  <Dropdown.Item
                    key={index}
                    style={{
                      backgroundColor: "darkgrey",
                      color: "white",
                      border: "solid",
                      borderRadius: "0.5rem",
                    }}
                  >
                    {name}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            )}
          </div>
          {users && (
            <div className="navPeopleSets mb-2" style={{ width: "fit-content" }}>
              <DropdownButton
                id="dropdown-basic-button"
                title={`Individual: ${selectedUser}`}
                variant="outline-dark" // Set variant to light

                onClick={toggleUser}
                // custom-dropdown
                // className="individualSelect responsive-dropdown"
                style={{ width: "fit-content" }}
                show={userListVisible}
              >
                {users.map((user, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleUserClick(user)}
                    style={{
                      backgroundColor: selectedUser === user.name ? "darkgrey" : "",
                      color: selectedUser === user.name ? "white" : "",
                      border: selectedUser === user.name ? "solid" : "",
                      borderRadius: selectedUser === user.name ? "0.5rem" : "",
                      borderWidth: selectedUser === user.name ? "thin" : "",
                    }}
                  >
                    {user.name}
                    {user.globalScore !== null && (
                      <span className="float-right">
                        {" - "}
                        {(user.globalScore * 100).toFixed(2)}%
                      </span>
                    )}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          )}
          {fileList && (
            <div className="navFileSets" style={{ width: "fit-content" }}>
              <DropdownButton
                id="dropdown-basic-button"
                title={`File: ${structToLookFilesIn.data.find(
                  (user) => user.name === selectedUser
                )?.files[indexFile]
                  }`}
                onClick={toggleFile}
                variant="outline-dark" // Set variant to light

                style={{ width: "fit-content" }}
                show={fileListVisible}
              >
                {fileList.map((file, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => handleFileClick(index)}
                    style={{
                      backgroundColor: indexFile === index ? "darkgrey" : "",
                      color: indexFile === index ? "white" : "",
                      border: indexFile === index ? "solid" : "",
                      borderRadius: indexFile === index ? "0.5rem" : "",
                      borderWidth: indexFile === index ? "thin" : "",
                    }}
                  >
                    {file}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          )}
        </Col>
        <Col xs={12} > <NavBarMajorButtons/> </Col>
      </Row>
      {/* Row for larger screens */}
      <Row>
        <div
          style={{
            backgroundColor: "rgb(17, 91, 78)",
            color: "white",
            padding: "10px",
            cursor: "pointer",
            border: "solid 1px #fff",
            textAlign: "center",
            width:"170px",
            height:"43px",
            borderRadius: "21.5px",
            marginLeft:"10px",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = 0.9)}
          onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
          onClick={handleResultsClick}
        >
          Back to results
        </div>
      </Row>
      <Row className="w-100 d-none d-md-flex justify-content-center align-items-center">
        <Col md={0} lg={1} className="d-none d-md-block emptyStuff"></Col>
        <Col style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
          <div className="interactionNavBar" style={{ textAlign: "center", display: "flex", alignItems: "center", gap: "10px", paddingLeft: "15px", paddingRight: "15px", marginLeft: "auto", marginRight: "auto" }}>
            {name && (
              <div className="navFolderSets" style={{ width: "fit-content" }}>
                <DropdownButton
                  title={"Folder Set"}
                  onClick={toggleInstitution}
                  variant="outline-dark"
                  style={{ width: "fit-content" }}
                  show={institutionListVisible}
                  size={"sm"}
                >
                  <Dropdown.ItemText>
                    <u>Institution</u>
                  </Dropdown.ItemText>
                  {[institution].map((institution, index) => (
                    <Dropdown.Item
                      key={index}
                      style={{
                        backgroundColor: "darkgrey",
                        color: "white",
                        border: "solid",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {institution}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.ItemText>
                    <u>Module</u>
                  </Dropdown.ItemText>
                  {[module].map((module, index) => (
                    <Dropdown.Item
                      key={index}
                      style={{
                        backgroundColor: "darkgrey",
                        color: "white",
                        border: "solid",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {module}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.ItemText>
                    <u>Name</u>
                  </Dropdown.ItemText>
                  {[name].map((name, index) => (
                    <Dropdown.Item
                      key={index}
                      style={{
                        backgroundColor: "darkgrey",
                        color: "white",
                        border: "solid",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {name}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>Results from:</div>
            {users && (
              <div className="navPeopleSets" style={{ width: "fit-content" }}>
                <DropdownButton
                  id="dropdown-basic-button"
                  title={`Individual: ${selectedUser}`}
                  onClick={toggleUser}
                  variant="outline-dark"
                  style={{ width: "fit-content" }}
                  show={userListVisible}
                  size={"sm"}
                >
                  {users.map((user, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleUserClick(user)}
                      style={{
                        backgroundColor: selectedUser === user.name ? "darkgrey" : "",
                        color: selectedUser === user.name ? "white" : "",
                        border: selectedUser === user.name ? "solid" : "",
                        borderRadius: selectedUser === user.name ? "0.5rem" : "",
                        borderWidth: selectedUser === user.name ? "thin" : "",
                      }}
                      onMouseDown={(e) => e.currentTarget.style.backgroundColor = "black"}
                      onMouseUp={(e) => e.currentTarget.style.backgroundColor = "darkgrey"}
                    >
                      {user.name}
                      {user.globalScore !== null && (
                        <span className="float-right">
                          {" - "}
                          {(user.globalScore * 100).toFixed(2)}%
                        </span>
                      )}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
            )}
            {fileList && (
              <div className="navFileSets" style={{ width: "fit-content" }}>
                <DropdownButton
                  id="dropdown-basic-button"
                  // title={`File: ${structToLookFilesIn.data.find((user) => user.name === selectedUser)?.files[indexFile]}`}
                  title={`File: ${(() => {
                    const fileName = structToLookFilesIn.data.find( (user) => user.name === selectedUser )?.files[indexFile] || '';
                    // Check if the file name contains a '/' and return the part after it
                    return fileName.includes('/')
                      ? fileName.split('/').pop() // Take the part after the last '/'
                      : fileName; // If no '/', return the full file name
                  })()}`}
                  onClick={toggleFile}
                  style={{ width: "fit-content" }}
                  variant="outline-dark"
                  show={fileListVisible}
                  size={"sm"}
                >
                  {fileList.map((file, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleFileClick(index)}
                      style={{
                        backgroundColor: indexFile === index ? "darkgrey" : "",
                        color: indexFile === index ? "white" : "",
                        border: indexFile === index ? "solid" : "",
                        borderRadius: indexFile === index ? "0.5rem" : "",
                        borderWidth: indexFile === index ? "thin" : "",
                      }}
                      onMouseDown={(e) => e.currentTarget.style.backgroundColor = "black"}
                      onMouseUp={(e) => e.currentTarget.style.backgroundColor = "darkgrey"}
                    >
                      {file.split('/').length>1?file.split('/')[1]:file}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </div>
            )}
          </div>
        </Col>
        <Col md={0} lg={1} className="d-none d-md-block emptyStuff"></Col>
      </Row>
      <style jsx>{`
        .custom-dropdown .dropdown-toggle {
          background-color: white !important; /* Override default styles */
          color: #000; /* Default text color */
          border: none;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .custom-dropdown .dropdown-toggle:hover {
          background-color: #f0f0f0 !important; /* Light gray on hover */
        }
        .custom-color .dropdown-toggle {
          background-color: var(--custom-color) !important; /* Use a CSS variable */
          color: #fff;
        }
        .custom-color .dropdown-toggle:hover {
          filter: brightness(85%);
        }
        .ml-auto {
          margin-left: auto;
        }
      .button-responsive {
        font-size: 1.2rem;
        transition: font-size 0.3s, padding 0.3s;
      }
      .icon-responsive {
        font-size: 1.5rem;
        transition: font-size 0.3s;
      }
      @media (max-width: 992px) {
        .button-responsive {
          font-size: 1rem;
          padding: 0.25rem 0.5rem;
        }
        .icon-responsive {
          font-size: 1.2rem;
        }
      }
      @media (max-width: 768px) {
        .button-responsive {
          font-size: 0.9rem;
          padding: 0.2rem 0.4rem;
        }
        .icon-responsive {
          font-size: 1rem;
        }
      }
      @media (max-width: 576px) {
        .button-responsive {
          font-size: 0.8rem;
          padding: 0.15rem 0.3rem;
        }
        .icon-responsive {
          font-size: 0.8rem;
        }
      }
      .btn-link {
        color: black;
        cursor: pointer;
        font-size: 1.2rem;
      }
      .btn-link:hover {
        color: blue;
      }
      .products-dropdown {
        background: white;
        border: 1px solid #ddd;
        padding: 10px;
        z-index: 1000;
      }
      .products-dropdown .btn-link {
        margin: 5px 0;
      }
      .btn-link.text-decoration-none:hover {
        color: blue;
      }
      .position-relative:hover .products-dropdown {
        display: flex;
      }
      .responsive-dropdown {
        width: 100%;
        @media (min-width: 576px) {
          max-width: 250px; // Adjust for sm screens (similar to xs)
        }
        @media (min-width: 768px) {
          max-width: 300px; // Adjust for md screens
        }
        @media (min-width: 992px) {
          max-width: 350px; // Adjust for lg screens
        }
      }
      `}</style>
    </Container>
  );
}

