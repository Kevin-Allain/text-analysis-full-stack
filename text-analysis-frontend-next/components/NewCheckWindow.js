import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import "bootstrap/dist/css/bootstrap.min.css";

export default function NewCheckWindow(props) {
  console.log("NewCheckWindow | props: ", props);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(0);

  const [institution, setInstitution] = useState("");
  const [module, setModule] = useState("");
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const handleUpload = () => {
    setIsUploading((prevIsUploading) => {
      return 1;
    });
  };
  const handleInputChange = (e) => {
    const { id, value, files } = e.target;
    if (id === "fileInput") {
      setFiles(files);
    } else if (id === "institutionInput") {
      setInstitution(value);
    } else if (id === "moduleInput") {
      setModule(value);
    } else if (id === "nameInput") {
      setName(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsUploading(1);
      // Simulate upload process, then navigate to results
      setTimeout(() => {
        setIsUploading(0);
        router.push({
          pathname: "/InitialResults",
          query: { institution, module, name },
        });
      }, 3000); // Simulate upload time
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!institution) newErrors.institution = "Institution is required";
    if (!module) newErrors.module = "Module is required";
    if (!name) newErrors.name = "Name is required";
    if (files.length === 0) newErrors.files = "At least one file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadProgress = (
    <div className="progress" role="progressbar">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        style={{ width: `${progress}%`, fontSize: "1.2em" }}
      >
        {" "}
        Uploading ({progress}%)...{" "}
      </div>
    </div>
  );

  useEffect(() => {
    if (isUploading == 1) {
      const interval = setInterval(() => {
        const randomIncrement = Math.floor(Math.random() * 50) + 1;
        setProgress((prevProgress) => {
          let newValue = 0;
          if (!isNaN(progress)) {
            newValue = prevProgress + randomIncrement;
            newValue > 100 ? (newValue = 100) : newValue;
            if (newValue >= 100) {
              router.push({
                pathname: "/InitialResults",
                query: { institution, module, name },
              });
              return;
            }
            // console.log(prevProgress+ " + " +randomIncrement + " = " + newValue)
            return newValue;
          }
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isUploading, props]);

  return (
    <div
      className="container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <div className="card" style={{ width: "40%" }}>
        <div className="card-header" style={{ textAlign: "center" }}>
          {" "}
          New Check{" "}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="institutionInput" className="form-label">
                Institution
              </label>
              <input type="text" className="form-control" id="institutionInput" aria-describedby="institutionHelp" placeholder="e.g. City, University of London" value={institution} onChange={handleInputChange} />
              {errors.institution && (
                <div className="text-danger">{errors.institution}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="moduleInput" className="form-label"> Module </label>
              <input type="text" className="form-control" id="moduleInput" placeholder="e.g. Programming In Java 23/24" value={module} onChange={handleInputChange} />
              {errors.module && (
                <div className="text-danger">{errors.module}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label"> Name </label>
              <input type="text" className="form-control" id="nameInput" placeholder="e.g. Coursework 1" value={name} onChange={handleInputChange} />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label"> Files </label>
              <input name="file[]" multiple type="file" className="form-control" id="fileInput" onChange={handleInputChange} />
              {errors.files && (
                <div className="text-danger">{errors.files}</div>
              )}
            </div>
            {isUploading === 0 && (
              <button type="submit" className="btn btn-primary">
                Upload
              </button>
            )}
            {isUploading === 1 && <div>Uploading... {uploadProgress}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
