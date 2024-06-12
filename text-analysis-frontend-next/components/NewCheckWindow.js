import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { FormDataContext } from '@/components/context/FormDataContext'; // Adjust the path
import "bootstrap/dist/css/bootstrap.min.css";

export default function NewCheckWindow(props) {
  const { formData, setFormData } = useContext(FormDataContext);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(0);

  const [institution, setInstitution] = useState(formData.institution);
  const [module, setModule] = useState(formData.module);
  const [name, setName] = useState(formData.name);
  const [files, setFiles] = useState(formData.files);
  const [errors, setErrors] = useState({});

  const router = useRouter();

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

  const validateForm = () => {
    const newErrors = {};
    if (!institution) newErrors.institution = "Institution is required";
    if (!module) newErrors.module = "Module is required";
    if (!name) newErrors.name = "Name is required";
    if (files.length === 0) newErrors.files = "At least one file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedFormData = { institution, module, name, files };
      setFormData(updatedFormData);
      setIsUploading(1);
      // Simulate upload process, then navigate to results
      setTimeout(() => {
        setIsUploading(0);
        console.log("handleSubmit NewCheckWindow | formData ", updatedFormData);
        router.push("/InitialResults");
      }, 3000); // Simulate upload time
    }
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
    if (isUploading === 1) {
      const interval = setInterval(() => {
        const randomIncrement = Math.floor(Math.random() * 50) + 1;
        setProgress((prevProgress) => {
          let newValue = prevProgress + randomIncrement;
          if (newValue > 100) newValue = 100;
          if (newValue >= 100) {
            clearInterval(interval);
            router.push("/InitialResults");
          }
          return newValue;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isUploading, router]);

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
              <input
                type="text"
                className="form-control"
                id="institutionInput"
                aria-describedby="institutionHelp"
                placeholder="e.g. City, University of London"
                value={institution}
                onChange={handleInputChange}
              />
              {errors.institution && (
                <div className="text-danger">{errors.institution}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="moduleInput" className="form-label">
                Module
              </label>
              <input
                type="text"
                className="form-control"
                id="moduleInput"
                placeholder="e.g. Programming In Java 23/24"
                value={module}
                onChange={handleInputChange}
              />
              {errors.module && (
                <div className="text-danger">{errors.module}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="nameInput"
                placeholder="e.g. Coursework 1"
                value={name}
                onChange={handleInputChange}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label">
                Files
              </label>
              <input
                name="file[]"
                multiple
                type="file"
                className="form-control"
                id="fileInput"
                onChange={handleInputChange}
              />
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
