import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import React, { useState, useRef, useContext } from "react";
import { Dropdown, DropdownButton, Container, Row, Col, Button } from 'react-bootstrap';
import { FormDataContext } from "@/components/context/FormDataContext";
import { useRouter } from "next/router";
import Image from "next/image";
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
import AltNavBarMajorButtons from "@/components/AltNavBarMajorButtons";

export default function FooterBar(props) {
  const {users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature} = props;
  console.log("FooterBar | props: ",{users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature});
  const { formData } = useContext(FormDataContext);
  const { institution, module, name, files } = formData;
  console.log("FooterBar | formData stuff: ", {institution, module, name, files});

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

  return (
    <Container fluid style={{background:"black", color:"white"}}>
      {/* Row for smaller screens */}
      {/* <Row className="d-flex d-md-none w-100">
        <Col
          xs={12}
          className="align-items-center justify-content-evenly"
        >
          <div className="navFolderSets mb-2" style={{ width: "fit-content" }}>
            {name && (
              <DropdownButton
                id="dropdown-basic-button"
                title={"Folder Set"}
                variant="outline-dark" // Set variant to light
                onClick={toggleInstitution}
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
        <Col xs={12}>
          <NavBarMajorButtons/>
        </Col>
      </Row> */}
      <Row className="w-100 align-items-center mt-1 mb-1" >
        <Col  
            style={{display:"inline-flex"}}
        >
          <div className="navFolderSets" style={{ width: "fit-content" }}>
            {name && (
              <DropdownButton
                title={ "Folder Set" }
                onClick={toggleInstitution}
                // variant="outline-dark" // Set variant to light
                variant="outline-light"
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
            )}
          </div>
          {users && (
            <div className="navPeopleSets" style={{ width: "fit-content" }}>
              <DropdownButton
                id="dropdown-basic-button"
                title={`Individual: ${selectedUser}`}
                onClick={toggleUser}
                // variant="outline-dark" // Set variant to light
                variant="outline-light"
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
                    onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'black'}
                    onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'darkgrey'}
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
                style={{ width: "fit-content" }}
                // variant="outline-dark" // Set variant to light
                variant="outline-light"
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
                    onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'black'}
                    onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'darkgrey'}
                  >
                    {file}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </div>
          )}
        </Col>
        <Col style={{display:"inline-flex", justifyContent:"end"}}>
          <AltNavBarMajorButtons/>
        </Col>
      </Row>
    </Container>
  );
}

