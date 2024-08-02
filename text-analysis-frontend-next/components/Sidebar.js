import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState } from 'react';
import { FormDataContext } from "@/components/context/FormDataContext";
import { usePathname } from 'next/navigation'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaCaretDown, FaCaretUp } from "react-icons/fa";


export default function Sidebar() {
  const { formData } = useContext(FormDataContext);
  const { institution, module, name, files } = formData;

  console.log("SideBar | institution, module, name, files: ", {institution, module, name, files});
  const arrayFiles = Array.from(files);
  console.log("SideBar | arrayFiles: ", arrayFiles);

  const pathname = usePathname()
  console.log("SideBar | pathname: ",pathname)

  const [fileListVisible, setFileListVisible] = useState(false);
  const toggleFilesVisibility = () => {
    setFileListVisible(!fileListVisible);
  };



  if (arrayFiles.length > 0) {
    return (
      // <div className="col-md-2" style={{ padding: 0 }}>
      <div style={{"padding":"0","width":"100%"}}>
        <ul
          className="list-group list-group-flush" style={{ borderRight: "1px solid #eee",}}> {/* // minHeight: "90vh", maxHeight: "90vh",  */}
          <li
            className="list-group-item"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Your File Sets</span>
            {/* TODO make a system to store folder structure */}
            {/* <a href="/NewFile Set" className="btn btn-sm btn-outline-primary" disabled={true}> New File Set </a> */}
          </li>
          <li key={"sb_" + institution + "_" + module + "_" + name} className="list-group-item" >
            {institution}
            <ul className="list-group">
              <li key={module} className="list-group-item">
                {module}
                <ul className="list-group">
                  <li key={name} className="list-group-item">
                    {name}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  } 
  else if (module){
    return (
      // <div className="col-md-2" style={{ padding: 0 }}>
      <div style={{"padding":"0","width":"100%"}}>
      <button className="btn btn-secondary w-100 mt-1" onClick={toggleFilesVisibility}>
        Your File Sets {fileListVisible ? <FaCaretUp /> : <FaCaretDown />}
      </button>
      {fileListVisible && (      
        <ul
          className="list-group list-group-flush"
          style={{
            borderRight: "1px solid #eee",
            // minHeight: "90vh",
            // maxHeight: "90vh",
          }}
        >
          <li
            className="list-group-item"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* TODO make a system to store folder structure */}            
            {/* <a href="/NewFile Set" className="btn btn-sm btn-outline-primary"> New File Set </a> */}
          </li>
          <li key={"sb_" + institution + "_" + module + "_" + name} className="list-group-item" >
            {institution}
            <ul className="list-group">
              <li key={module} className="list-group-item">
                {module}
                <ul className="list-group">
                  <li key={name} className="list-group-item">
                    {name}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      )}
      </div>
    );    
  }
  else {
    return (
      // <div className="col-md-2" style={{ padding: 0 }}>
      <div style={{"padding":"0","width":"100%"}}>
        <ul
          className="list-group
          list-group-flush"
          style={{
            borderRight: "1px solid #eee",
            // minHeight: "90vh",
            // maxHeight: "90vh",
          }}
        >
          <li
            className="list-group-item"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Your File Sets</span>
            {/* <button type="button" className="btn btn-sm btn-outline-primary">
              New File Set
            </button> */}
          </li>
          <li
            className="list-group-item"
            style={{
              // height: "85vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#666",
              textAlign: "center",
            }}
          >
            Upload your files on the right to get started.
          </li>
        </ul>
      </div>
    );
  }
}
