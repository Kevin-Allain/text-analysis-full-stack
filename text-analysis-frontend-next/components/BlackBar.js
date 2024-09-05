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
import logo from "@/public/img/AI-AWARE-LOGO-WEBSITE-1.png";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import codecheckerData_collusion from '@/public/data/codechecker_collusion_example.json';
import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';
import codecheckerData_ai_detection from '@/public/data/codechecker_ai_detection_example.json';
import codecheckerData_ai_detection_preload from '@/public/data/codechecker_ai_detection_preload.json';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

import NavBarMajorButtons from "@/components/NavBarMajorButtons";
import AltNavBarMajorButtons from "@/components/AltNavBarMajorButtons";

export default function BlackBar(props) {
  const {users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature} = props;
  console.log("BlackBar | props: ",{users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature});
  const { formData } = useContext(FormDataContext);
  const { institution, module, name, files } = formData;
  console.log("BlackBar | formData stuff: ", {institution, module, name, files});

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

  const handleLogoClick = () => { router.push("/"); };


  const structToLookFilesIn = feature==="AI_Detection"?codecheckerData_ai_detection:feature==="Similarity"?codecheckerData_collusion:codecheckerData_plagiarism;

  return (
    <Container fluid style={{background:"black", color:"white", paddingTop:"0.15rem", paddingBottom:"0.15rem"}}>
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
          xs={2}
          md={2}
          className="leftPic"
          onClick={handleLogoClick}
          style={{ cursor: "pointer"}}
        >
          <Image src={logo} alt="Logo" className="img-fluid" style={{ paddingBottom:"0.25rem",paddingTop:"0.25rem", width:"150px"}} />
        </Col>        
        <Col style={{display:"inline-flex", justifyContent:"end"}}>
          <AltNavBarMajorButtons/>
        </Col>
      </Row>
    </Container>
  );
}

