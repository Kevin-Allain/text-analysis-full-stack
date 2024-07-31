import Head from "next/head";

import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState } from "react";
import Navbar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import InitialResultsWindow from "@/components/InitialResultsWindow";
import { FormDataContext } from "@/components/context/FormDataContext";
import InitialResultsWindow_UserFocus from "@/components/InitialResultsWindow_UserFocus";
import ProductFeatureTitle from "@/components/ProductFeatureTitle";

// TODO get the values from inputs of form in NewCheckWindow!
export default function InitialResults(props) {
  console.log("InitialResults | props: ", props);
  console.log("InitialResults | localStorage: ", localStorage);
  console.log("InitialResults | useContext(FormDataContext): ",useContext(FormDataContext));

  // let checks = [ { "id": 1, "institution": "City, University of London", "modules": [ { "id": 1, "name": "Java 23/24", "courseworks": [ { "id": 1, "name": "Coursework 1" } ] } ]  } ]
  const { formData, setFormData} = useContext(FormDataContext);
  // For some reason, this is not working... 
  // const {loadedFiles, setLoadedFiles} = useState(typeof localStorage.files === "string"? JSON.parse(localStorage.files):localStorage.files);

  return (
    <>
      <Head>
        <title>{formData?.product && formData?.product} - Initial Results</title>
      </Head>
      <div className="container-fluid">
        <Navbar />
        <div className="row">
          <div className="col-md-3 ">
            <Sidebar />
          </div>
          <div className="col-md-9">
            {/* <h3>{formData?.product && formData?.product} - Initial Results</h3> */}
            <ProductFeatureTitle feature="Initial Results" product={formData?.product} />
            {/* <InitialResultsWindow /> */}
            <InitialResultsWindow_UserFocus />
          </div>
        </div>
      </div>
    </>
  );
}
