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

export default function Navbar(props) {
  const {users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature} = props;
  console.log("Navbar | props: ",{users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature});
  const { formData } = useContext(FormDataContext);
  const { institution, module, name, files } = formData;
  console.log("Navbar | formData stuff: ", {institution, module, name, files});
  const router = useRouter();
  const [showProducts, setShowProducts] = useState(false);
  const timerRef = useRef(null);

  const handleLogoClick = () => { router.push("/"); };

  const handleContactClick = () => { router.push("https://aiaware.io/contact"); };

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
    setShowProducts(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setShowProducts(false);
    }, 300); // delay before hiding the dropdown
  };

  const [institutionListVisible, setInstitutionListVisible] = useState(false);
  const [moduleListVisible, setModuleListVisible] = useState(false);
  const [nameListVisible, setNameListVisible] = useState(false);  
  const [userListVisible, setUserListVisible] = useState(false);
  const [fileListVisible, setFileListVisible] = useState(false);

  const productsButtonStyle = {
    display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "black", cursor: "pointer", fontSize: "1rem",
  };
  const iconStyle = {
    fontSize: "1.5rem", marginBottom: "5px", // Set a fixed size for all icons
  };

  // Could be updated differently later...?
  const handleDownload = () => { saveAsPDF(); }
  const saveAsPDF = () => {
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size in mm
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('page.pdf');
    });
  };

  // TODO feels dirty because only one element...
  const toggleInstitution = () => { setInstitutionListVisible(!institutionListVisible);  }
  const toggleModule = () => { setModuleListVisible(!moduleListVisible);  }
  const toggleName = () => { setNameListVisible(!nameListVisible);  }

  const toggleUser = () => { setUserListVisible(!userListVisible);  }
  const toggleFile = () => { setFileListVisible(!fileListVisible);  }

  const structToLookFilesIn = feature==="AI_Detection"?codecheckerData_ai_detection:feature==="Similarity"?codecheckerData_collusion:codecheckerData_plagiarism;

  return (
    <Container fluid>
      <Row className="w-100 align-items-center" style={{ "backgroundColor": "purple", marginLeft: ".15rem", marginRight: ".15rem" }}>
        <Col
          xs={2}
          md={2}
          className="leftPic"
          onClick={handleLogoClick}
          style={{ cursor: "pointer", backgroundColor: "cyan" }}
        >
          <Image src={logo} alt="Logo" className="img-fluid" />
        </Col>
        <Col
  xs={8}
  md={8}
  className="d-flex flex-column align-items-start"
  style={{ backgroundColor: "darkslategray" }}
>
  <div className="navFolderSets mb-2" style={{ width: "100%" }}>
    {name && (
      <DropdownButton
        id="dropdown-basic-button"
        title={
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "inline-block", maxWidth: "100%" }}>
            {`${institution} | ${module} | ${name}`}
          </span>
        }
        onClick={toggleInstitution}
        className="individualSelect"
        style={{ width: "100%" }}
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
    <div className="navPeopleSets mb-2" style={{ width: "100%" }}>
      <DropdownButton
        id="dropdown-basic-button"
        title={`Individual: ${selectedUser}`}
        onClick={toggleUser}
        className="individualSelect"
        style={{ width: "100%" }}
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
    <div className="navFileSets" style={{ width: "100%" }}>
      <DropdownButton
        id="dropdown-basic-button"
        title={`File: ${
          structToLookFilesIn.data.find(
            (user) => user.name === selectedUser
          )?.files[indexFile]
        }`}
        onClick={toggleFile}
        className="individualSelect"
        style={{ width: "100%" }}
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

        <Col
          xs={2}
          md={2}
          className="d-flex justify-content-end align-items-center flex-wrap"
          style={{ backgroundColor: "rosybrown" }}
        >
          <Button
            variant="link"
            className="d-flex align-items-center button-responsive"
            onClick={handleDownload}
            style={productsButtonStyle}
          >
            <LuDownload className="icon-responsive" />
            Download
          </Button>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="position-relative"
          >
            <Button
              variant="link"
              className="d-flex align-items-center button-responsive"
              style={productsButtonStyle}
            >
              <AiOutlineProduct className="icon-responsive" />
              Products
            </Button>
            {showProducts && (
              <div className="products-dropdown position-absolute mt-2 d-flex flex-column">
                <Link href="/TextAnalysis" passHref>
                  <div
                    className="btn btn-link text-decoration-none mx-1"
                    style={{
                      borderBottomStyle: "double",
                      borderBottomColor: "inherit",
                      borderBottomRightRadius: "0rem",
                      borderBottomLeftRadius: "0rem",
                      borderBottomWidth: "medium",
                    }}
                  >
                    Text Analysis
                  </div>
                </Link>
                <Link href="/CodeChecker" passHref>
                  <div
                    className="btn btn-link text-decoration-none mx-1"
                    style={{
                      borderBottomStyle: "double",
                      borderBottomColor: "inherit",
                      borderBottomRightRadius: "0rem",
                      borderBottomLeftRadius: "0rem",
                      borderBottomWidth: "medium",
                    }}
                  >
                    Code Checker
                  </div>
                </Link>
                <Link href="/MediaChecker" passHref>
                  <div
                    className="btn btn-link text-decoration-none mx-1"
                    style={{
                      borderBottomStyle: "double",
                      borderBottomColor: "inherit",
                      borderBottomRightRadius: "0rem",
                      borderBottomLeftRadius: "0rem",
                      borderBottomWidth: "medium",
                    }}
                  >
                    Media Checker
                  </div>
                </Link>
                <Link href="/WebsiteChecker" passHref>
                  <div
                    className="btn btn-link text-decoration-none mx-1"
                    style={{
                      borderBottomStyle: "double",
                      borderBottomColor: "inherit",
                      borderBottomRightRadius: "0rem",
                      borderBottomLeftRadius: "0rem",
                      borderBottomWidth: "medium",
                    }}
                  >
                    Website Checker
                  </div>
                </Link>
              </div>
            )}
          </div>
          <Button
            variant="link"
            className="d-flex align-items-center button-responsive"
            onClick={handleContactClick}
            style={productsButtonStyle}
          >
            <IoIosHelpCircleOutline className="icon-responsive" />
            Contact
          </Button>
        </Col>
      </Row>
      <style jsx>{`
        .ml-auto {
          margin-left: auto;
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
      `}</style>
    </Container>
  );
}

            // <Col
            //   xs={4}
            //   md={2}
            //   className="d-flex justify-content-end align-items-center"
            //   style={{"backgroundColor":"rosybrown"}}
            // >
            //   <div
            //     onClick={handleDownload}
            //     className="btn btn-link text-decoration-none ml-3"
            //     style={productsButtonStyle}
            //     onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
            //     onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
            //   >
            //     <LuDownload style={iconStyle} />
            //     Download
            //   </div>
            //   <div
            //     onMouseEnter={handleMouseEnter}
            //     onMouseLeave={handleMouseLeave}
            //     className="position-relative"
            //   >
            //     <div
            //       className="btn btn-link text-decoration-none"
            //       style={productsButtonStyle}
            //       onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
            //       onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
            //     >
            //       <AiOutlineProduct style={iconStyle} />
            //       Products
            //     </div>
            //     {showProducts && (
            //       <div className="products-dropdown position-absolute mt-2 d-flex flex-column">
            //         <Link href="/TextAnalysis" passHref>
            //           <div
            //             className="btn btn-link text-decoration-none mx-1"
            //             style={{
            //               "border-bottom-style": "double",
            //               "border-bottom-color": "inherit",
            //               "border-bottom-right-radius": "0rem",
            //               "border-bottom-left-radius": "0rem",
            //               "border-bottom-width": "medium",
            //             }}
            //           >
            //             Text Analysis
            //           </div>
            //         </Link>
            //         <Link href="/CodeChecker" passHref>
            //           <div
            //             className="btn btn-link text-decoration-none mx-1"
            //             style={{
            //               "border-bottom-style": "double",
            //               "border-bottom-color": "inherit",
            //               "border-bottom-right-radius": "0rem",
            //               "border-bottom-left-radius": "0rem",
            //               "border-bottom-width": "medium",
            //             }}
            //           >
            //             Code Checker
            //           </div>
            //         </Link>
            //         <Link href="/MediaChecker" passHref>
            //           <div
            //             className="btn btn-link text-decoration-none mx-1"
            //             style={{
            //               "border-bottom-style": "double",
            //               "border-bottom-color": "inherit",
            //               "border-bottom-right-radius": "0rem",
            //               "border-bottom-left-radius": "0rem",
            //               "border-bottom-width": "medium",
            //             }}
            //           >
            //             Media Checker
            //           </div>
            //         </Link>
            //         <Link href="/WebsiteChecker" passHref>
            //           <div
            //             className="btn btn-link text-decoration-none mx-1"
            //             style={{
            //               "border-bottom-style": "double",
            //               "border-bottom-color": "inherit",
            //               "border-bottom-right-radius": "0rem",
            //               "border-bottom-left-radius": "0rem",
            //               "border-bottom-width": "medium",
            //             }}
            //           >
            //             Website Checker
            //           </div>
            //         </Link>
            //       </div>
            //     )}
            //   </div>
            //   <div
            //     onClick={handleContactClick}
            //     className="btn btn-link text-decoration-none btn ml-3"
            //     style={productsButtonStyle}
            //     onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
            //     onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
            //   >
            //     <IoIosHelpCircleOutline style={iconStyle} />
            //     Contact
            //   </div>
            // </Col>


// import "bootstrap/dist/css/bootstrap.min.css";
// import Link from "next/link";
// import React, { useState, useRef, useContext } from "react";
// import { Dropdown, DropdownButton, Container, Row, Col } from 'react-bootstrap';
// import { FormDataContext } from "@/components/context/FormDataContext";
// import { useRouter } from "next/router";
// import Image from "next/image";
// import logo from "@/public/img/AI-AWARE-LOGO-WEBSITE-1-BLACK.png";
// import { AiOutlineProduct } from "react-icons/ai";
// import { IoIosHelpCircleOutline } from "react-icons/io";
// import { LuDownload } from "react-icons/lu";
// import PagePDFExport from "@/components/export/PagePDFExport";
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import codecheckerData_collusion from '@/public/data/codechecker_collusion_example.json';
// import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';
// import codecheckerData_ai_detection from '@/public/data/codechecker_ai_detection_example.json';
// import codecheckerData_ai_detection_preload from '@/public/data/codechecker_ai_detection_preload.json';
// import { FaCaretDown, FaCaretUp } from "react-icons/fa";

// export default function Navbar(props) {
//   const {users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature} = props;
//   console.log("Navbar | props: ",{users, selectedUser, handleUserClick, fileList, handleFileClick, indexFile, feature});
//   const { formData } = useContext(FormDataContext);
//   const { institution, module, name, files } = formData;
//   console.log("Navbar | formData stuff: ", {institution, module, name, files});
//   const router = useRouter();
//   const [showProducts, setShowProducts] = useState(false);
//   const timerRef = useRef(null);

//   const handleLogoClick = () => { router.push("/"); };

//   const handleContactClick = () => { router.push("https://aiaware.io/contact"); };

//   const handleMouseEnter = () => {
//     clearTimeout(timerRef.current);
//     setShowProducts(true);
//   };

//   const handleMouseLeave = () => {
//     timerRef.current = setTimeout(() => {
//       setShowProducts(false);
//     }, 300); // delay before hiding the dropdown
//   };

//   const [institutionListVisible, setInstitutionListVisible] = useState(false);
//   const [moduleListVisible, setModuleListVisible] = useState(false);
//   const [nameListVisible, setNameListVisible] = useState(false);  
//   const [userListVisible, setUserListVisible] = useState(false);
//   const [fileListVisible, setFileListVisible] = useState(false);

//   const productsButtonStyle = {
//     display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", color: "black", cursor: "pointer", fontSize: "1rem",
//   };
//   const iconStyle = {
//     fontSize: "1.5rem", marginBottom: "5px", // Set a fixed size for all icons
//   };

//   // Could be updated differently later...?
//   const handleDownload = () => { saveAsPDF(); }
//   const saveAsPDF = () => {
//     html2canvas(document.body).then((canvas) => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF('p', 'mm', 'a4');
//       const imgWidth = 210; // A4 size in mm
//       const pageHeight = 297;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;
//       let heightLeft = imgHeight;
//       let position = 0;
//       pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//       heightLeft -= pageHeight;
//       while (heightLeft >= 0) {
//         position = heightLeft - imgHeight;
//         pdf.addPage();
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
//       }
//       pdf.save('page.pdf');
//     });
//   };

//   // TODO feels dirty because only one element...
//   const toggleInstitution = () => { setInstitutionListVisible(!institutionListVisible);  }
//   const toggleModule = () => { setModuleListVisible(!moduleListVisible);  }
//   const toggleName = () => { setNameListVisible(!nameListVisible);  }

//   const toggleUser = () => { setUserListVisible(!userListVisible);  }
//   const toggleFile = () => { setFileListVisible(!fileListVisible);  }

//   const structToLookFilesIn = feature==="AI_Detection"?codecheckerData_ai_detection:feature==="Similarity"?codecheckerData_collusion:codecheckerData_plagiarism;

//   return (
//     <div className="row">
//       <nav className="navbar navbar-expand-lg navbar-light">
//         <div
//           className="container-fluid"
//           style={{ marginLeft: "1rem", marginRight: "1rem" }}
//         >
//           <div className="leftPic" onClick={handleLogoClick} style={{ cursor: "pointer" }} >
//             <Image src={logo} alt="Logo" />
//           </div>
          
//           <div className="ml-auto d-flex align-items-center navigations ">
//             <div className="navFolderSets" // style={{"padding-left":"1rem", "padding-right":"1rem", "margin-right":"5rem"}} 
//             >
//               {name && 
//                 <DropdownButton
//                     id="dropdown-basic-button"
//                     title={`${institution} | ${module} | ${name}`} //  ${userListVisible ? <FaCaretUp /> : <FaCaretDown />}`
//                     onClick={toggleInstitution}
//                     className="individualSelect"
//                     style={{ paddingRight: '1rem' }}
//                     show={institutionListVisible}
//                   >
//                     <Dropdown.ItemText><u>Institution</u></Dropdown.ItemText>
//                     {[institution].map((institution, index) => (
//                       <Dropdown.Item
//                         key={index}
//                         // onClick={() => handleUserClick(user)}
//                         style={{
//                           backgroundColor: 'darkgrey',
//                           color: 'white',
//                           border: 'solid',
//                           borderRadius: '0.5rem',
//                           borderWidth: '',
//                         }}
//                       >
//                         {institution}
//                       </Dropdown.Item>
//                     ))}
//                     <Dropdown.ItemText><u>Module</u></Dropdown.ItemText>
//                     {[module].map((module, index) => (
//                       <Dropdown.Item
//                         key={index}
//                         // onClick={() => handleUserClick(user)}
//                         style={{
//                           backgroundColor: 'darkgrey',
//                           color: 'white',
//                           border: 'solid',
//                           borderRadius: '0.5rem',
//                           borderWidth: '',
//                         }}
//                       >
//                         {module}
//                       </Dropdown.Item>
//                     ))}
//                     <Dropdown.ItemText><u>Name</u></Dropdown.ItemText>
//                     {[name].map((name, index) => (
//                       <Dropdown.Item
//                         key={index}
//                         // onClick={() => handleUserClick(user)}
//                         style={{
//                           backgroundColor: 'darkgrey',
//                           color: 'white',
//                           border: 'solid',
//                           borderRadius: '0.5rem',
//                           borderWidth: '',
//                         }}
//                       >
//                         {name}
//                       </Dropdown.Item>
//                     ))}
//               </DropdownButton>
//               }
//             </div>
//             {users && 
//               <>
//                 <div className="navPeopleSets">
//                   <DropdownButton
//                     id="dropdown-basic-button"
//                     title={`Indidivual: ${selectedUser}`} //  ${userListVisible ? <FaCaretUp /> : <FaCaretDown />}`
//                     onClick={toggleUser}
//                     className="individualSelect"
//                     style={{ paddingRight: '1rem' }}
//                     show={userListVisible}
//                   >
//                     {users.map((user, index) => (
//                       <Dropdown.Item
//                         key={index}
//                         onClick={() => handleUserClick(user)}
//                         style={{
//                           backgroundColor: selectedUser === user.name ? 'darkgrey' : '',
//                           color: selectedUser === user.name ? 'white' : '',
//                           border: selectedUser === user.name ? 'solid' : '',
//                           borderRadius: selectedUser === user.name ? '0.5rem' : '',
//                           borderWidth: selectedUser === user.name ? 'thin' : '',
//                         }}
//                       >
//                         {user.name}
//                         {user.globalScore !== null && ( <span className="float-right"> {' - '} {(user.globalScore * 100).toFixed(2)}% </span> )}
//                       </Dropdown.Item>
//                     ))}
//                   </DropdownButton>
//                 </div>
//               </>
//             }
//             {fileList &&
//               <>
//                 <div className="navFileSets">
//                   <DropdownButton
//                     id="dropdown-basic-button"
//                     title={
//                       `File: ${structToLookFilesIn.data.find(user => user.name === selectedUser)?.files[indexFile]}`
//                       }
//                     onClick={toggleFile}
//                     className="individualSelect"
//                     style={{ paddingRight: '1rem' }}
//                     show={fileListVisible}
//                   >
//                     {fileList.map((file, index) => (
//                       <Dropdown.Item
//                         key={index}
//                         onClick={() => handleFileClick(index)}
//                         style={{
//                           backgroundColor: indexFile === index ? 'darkgrey' : '',
//                           color: indexFile === index ? 'white' : '',
//                           border: indexFile === index ? 'solid' : '',
//                           borderRadius: indexFile === index ? '0.5rem' : '',
//                           borderWidth: indexFile === index ? 'thin' : '',
//                         }}
//                       >
//                         {file}
//                       </Dropdown.Item>
//                     ))}
//                   </DropdownButton>
//                 </div>
//               </>
//             }
//           </div>

//           <div className="ml-auto d-flex align-items-center">
//             <div
//               onClick={handleDownload}
//               className="btn btn-link text-decoration-none ml-3"
//               style={productsButtonStyle}
//               onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
//               onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
//             >
//               <LuDownload style={iconStyle} />
//               Download
//             </div>
//             <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="position-relative">
//               <div
//                 className="btn btn-link text-decoration-none"
//                 style={productsButtonStyle}
//                 onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
//                 onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
//               >
//                 <AiOutlineProduct style={iconStyle} />
//                 Products
//               </div>
//               {showProducts && (
//                 <div className="products-dropdown position-absolute mt-2 d-flex flex-column">
//                   <Link href="/TextAnalysis" passHref>
//                     <div
//                       className="btn btn-link text-decoration-none mx-1"
//                       style={{
//                         "border-bottom-style": "double",
//                         "border-bottom-color": "inherit",
//                         "border-bottom-right-radius": "0rem",
//                         "border-bottom-left-radius": "0rem",
//                         "border-bottom-width": "medium",
//                       }}
//                     >
//                       Text Analysis
//                     </div>
//                   </Link>
//                   <Link href="/CodeChecker" passHref>
//                     <div
//                       className="btn btn-link text-decoration-none mx-1"
//                       style={{
//                         "border-bottom-style": "double",
//                         "border-bottom-color": "inherit",
//                         "border-bottom-right-radius": "0rem",
//                         "border-bottom-left-radius": "0rem",
//                         "border-bottom-width": "medium",
//                       }}
//                     >
//                       Code Checker
//                     </div>
//                   </Link>
//                   <Link href="/MediaChecker" passHref>
//                     <div
//                       className="btn btn-link text-decoration-none mx-1"
//                       style={{
//                         "border-bottom-style": "double",
//                         "border-bottom-color": "inherit",
//                         "border-bottom-right-radius": "0rem",
//                         "border-bottom-left-radius": "0rem",
//                         "border-bottom-width": "medium",
//                       }}
//                     >
//                       Media Checker
//                     </div>
//                   </Link>
//                   <Link href="/WebsiteChecker" passHref>
//                     <div
//                       className="btn btn-link text-decoration-none mx-1"
//                       style={{
//                         "border-bottom-style": "double",
//                         "border-bottom-color": "inherit",
//                         "border-bottom-right-radius": "0rem",
//                         "border-bottom-left-radius": "0rem",
//                         "border-bottom-width": "medium",
//                       }}
//                     >
//                       Website Checker
//                     </div>
//                   </Link>
//                 </div>
//               )}
//             </div>
//             <div
//               onClick={handleContactClick}
//               className="btn btn-link text-decoration-none btn ml-3"
//               style={productsButtonStyle}
//               onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
//               onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
//             >
//               <IoIosHelpCircleOutline style={iconStyle} />
//               Contact
//             </div>
//           </div>
//         </div>
//       </nav>
//       <style jsx>{`
//         .ml-auto {
//           margin-left: auto;
//         }
//         .btn-link {
//           color: black;
//           cursor: pointer;
//           font-size: 1.2rem;
//         }
//         .btn-link:hover {
//           color: blue;
//         }
//         .products-dropdown {
//           background: white;
//           border: 1px solid #ddd;
//           padding: 10px;
//           z-index: 1000;
//         }
//         .products-dropdown .btn-link {
//           margin: 5px 0;
//         }
//         .btn-link.text-decoration-none:hover {
//           color: blue;
//         }
//         .position-relative:hover .products-dropdown {
//           display: flex;
//         }
//       `}</style>
//     </div>
//   );
// }


              {/* <div className="institutionSelect" style={{"padding-right":"1rem"}}> {institution} </div>
              <div className="moduleSelect" style={{"padding-left":"1rem", "padding-right":"1rem"}}> {module} </div>
              <div className="nameSelect" style={{"padding-left":"2rem", "padding-right":"1rem"}}> {name} </div> */}
