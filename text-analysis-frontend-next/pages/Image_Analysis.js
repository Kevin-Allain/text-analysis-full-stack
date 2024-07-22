import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Head from 'next/head';
import Navbar from '@/components/NavBar';
import Sidebar from '@/components/Sidebar';
import HorizontalNav from '@/components/HorizontalNav';
import { FormDataContext } from '@/components/context/FormDataContext';
import UserList from '@/components/UserList';

export default function Image_Analysis() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { formData, setFormData } = useContext(FormDataContext);

  const users = []; // TODO adapt and change?

  const detailsScoreRef = useRef(null);
  const detailsImage_Analysis = [
    { className: "image_analysis", color: "rgba(216,72,72,0.5)", text: "Image_Analysis 1", indications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { className: "image_analysis2", color: "rgba(72,72,216,0.5)", text: "Image_Analysis 2", indications: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { className: "image_analysis3", color: "rgba(76,216,72,0.5)", text: "Image_Analysis 3", indications: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
  ]; // Example details list

  useEffect(() => {
    const {product, institution, module, name, files} = formData;
    setFormData({product:"MediaChecker", institution:institution, module:module, name:name, files:files});
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user.name);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      simulateUpload();
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const randomIncrement = Math.floor(Math.random() * 20) + 1;
        const newValue = prevProgress + randomIncrement;
        if (newValue >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return newValue;
      });
    }, 500);
  };

  return (
    <>
      <Head>
        <title>{formData?.product && formData?.product} - Image Analysis</title>
      </Head>
      <div className="container-fluid">
        <Navbar />
        <div className="row">
          {/* <Sidebar /> */}
          <div className="col-md-9 text_selec">
            <h1>{formData?.product && formData?.product} - Image Analysis</h1>
            <div className="image-upload-section">
              <input type="file" accept="image/*" onChange={handleImageChange} style={{"marginBottom":"0.5rem"}} />
              {isUploading && (
                <div className="progress my-3">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    style={{ width: `${progress}%` }}
                  >
                    Uploading ({progress}%)
                  </div>
                </div>
              )}
              {image && !isUploading && (
                <div className="uploaded-image-section">
                  <button className="btn btn-primary mb-3" onClick={() => setImage(null)}>
                    Replace Image
                  </button>
                  <img src={image} alt="Uploaded" className="img-fluid" />
                </div>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <HorizontalNav features={["Image_Analysis","Video_Analysis","Audio_Analysis"]}/>
            {/* <UserList users={users} selectedUser={selectedUser} handleUserClick={handleUserClick} />
            <div className="details_score" ref={detailsScoreRef}>
              {detailsImage_Analysis.map((item, index) => (
                <div key={index}>
                  <div className={`detail-item ${item.className}`} style={{ backgroundColor: item.color }} onClick={() => handleDetailClick(item)} >
                    {item.text}
                  </div>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}