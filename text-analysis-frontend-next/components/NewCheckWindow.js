import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { FormDataContext } from '@/components/context/FormDataContext'; // Adjust the path
import "bootstrap/dist/css/bootstrap.min.css";
import JSZip from 'jszip';

export default function NewCheckWindow(props) {
  const product = props.product;
  const { formData, setFormData } = useContext(FormDataContext);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(0);
  const [institution, setInstitution] = useState(formData?.institution || '');
  const [module, setModule] = useState(formData?.module || '');
  const [name, setName] = useState(formData?.name || '');
  const [files, setFiles] = useState(formData?.files || []);
  const [errors, setErrors] = useState({});
  const [zipError, setZipError] = useState(null);

  const router = useRouter();

  const handleInputChange = async (e) => {
    const { id, value, files } = e.target;
    console.log("handleInputChange: ", { id, value, files });
    if (id === "fileInput") {
      if (files && files.length > 0) {
        const zipValidationResult = await validateZip(files[0]);
        if (zipValidationResult.isValid) {
          setFiles(files);
          setZipError(null);
        } else {
          setFiles([]);
          setZipError(zipValidationResult.error);
        }
      } else {
        setFiles([]);
        setZipError(null);
      }
    } else if (id === "institutionInput") {
      setInstitution(value);
    } else if (id === "moduleInput") {
      setModule(value);
    } else if (id === "nameInput") {
      setName(value);
    }
  };

  const validateZip = async (file) => {
    const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-7z-compressed'];
    if (!validTypes.includes(file.type)) {
      return { isValid: false, error: 'The uploaded file is not a supported zip file.' };
    }
    try {
      const zip = await JSZip.loadAsync(file);
      const folderNames = Object.keys(zip.files).filter((name) => name.endsWith('/'));
      if (folderNames.length === 0) {
        return { isValid: false, error: 'The zip file must contain at least one folder.' };
      }
      for (const folderName of folderNames) {
        console.log("folderName: ", folderName);
        const folderFiles = Object.keys(zip.files).filter((name) => name.startsWith(folderName) && !name.endsWith('/'));
        console.log("folderFiles: ", folderFiles);
        if (folderFiles.length === 0) {
          return { isValid: false, error: `The folder '${folderName}' must contain at least one file.` };
        }
        const subFolders = folderFiles.filter((name) => name.split('/').length > 3);
        console.log("subFolders: ", subFolders);
        if (subFolders.length > 0) {
          return { isValid: false, error: `The folder '${folderName}' contains subfolders, which is not allowed.` };
        }
      }
      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'An error occurred while processing the zip file.' };
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!institution) newErrors.institution = "Institution is required";
    if (!module) newErrors.module = "Module is required";
    if (!name) newErrors.name = "Name is required";
    // TODO prepare a nice explanation for this. Until then, don't worry about forcing users to upload files.
    // if (files.length === 0) newErrors.files = "At least one file is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedFormData = { product, institution, module, name, files };
      setFormData(updatedFormData);
      setIsUploading(1);
      setTimeout(() => {
        setIsUploading(0);
        const filesUploaded = updatedFormData.files;
        let arrObjFile = [];
        for (let i = 0; i < filesUploaded.length; i++) {
          arrObjFile.push({
            "name": filesUploaded.item(i).name,
            "lastModified": filesUploaded.item(i).lastModified,
            "lastModifiedDate": filesUploaded.item(i).lastModifiedDate,
            "size": filesUploaded.item(i).size,
            "type": filesUploaded.item(i).type,
            "webkitRelativePath": filesUploaded.item(i).webkitRelativePath,
          });
        }
        localStorage.setItem("files", JSON.stringify(arrObjFile));
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
        Uploading ({progress}%)...
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
          New Check
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
                Compressed folder
              </label>
              <input
                name="file[]"
                single
                type="file"
                className="form-control"
                id="fileInput"
                onChange={handleInputChange}
              />
              {errors.files && (
                <div className="text-danger">{errors.files}</div>
              )}
              {zipError && (
                <div className="text-danger">{zipError}</div>
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
