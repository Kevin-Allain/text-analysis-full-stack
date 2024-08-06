import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import InitialResultsWindow from "@/components/InitialResultsWindow";
import { FormDataContext } from "@/components/context/FormDataContext";
import InitialResultsWindow_UserFocus from "@/components/InitialResultsWindow_UserFocus";
import ProductFeatureTitle from "@/components/ProductFeatureTitle";
import UserList from "@/components/UserList";

import ai_detection_data from "@/public/data/codechecker_ai_detection_example.json";
import collusion_data from "@/public/data/codechecker_collusion_example.json";
import plagiarism_data from "@/public/data/codechecker_plagiarism_example.json";
import individuals_history from "@/public/data/codechecker_individual_history_example.json";
import DetailsHistoryIndividual from "@/components/DetailsHistoryIndividual";
import PagePDFExport from "@/components/export/PagePDFExport";


export default function IndividualHistory(props) {
  console.log("IndividualHistory | props: ", props);
  console.log("IndividualHistory | localStorage: ", localStorage);
  console.log("IndividualHistory | useContext(FormDataContext): ", useContext(FormDataContext));
  
  const { formData, setFormData } = useContext(FormDataContext);
  const users = ai_detection_data.data.sort((a, b) => b.name - a.name);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();
  const { name } = router.query;

  useEffect(() => {
    if (name && individuals_history.some(user => user.name === name)) {
      setSelectedUser(name);
    } else if (users.length > 0) {
      setSelectedUser(users[0].name);
    }
  }, [name, users]);

  const handleUserClick = (user) => { setSelectedUser(user.name); };

  return (
    <>
      <Head>
        <title>{selectedUser && selectedUser} - Individual History</title>
      </Head>
      <div className="container-fluid ">
      {/* TODO make user selection possible...?! */}
        <Navbar  />
        <div className="row">
          {/* <div className="col-md-2">
            <UserList users={users} selectedUser={selectedUser} handleUserClick={handleUserClick}/>
          </div> */}
          {/* <div className="col-md-9 lg-10 scoreCardHistory"> */}
          <div className="col">
            {/* <PagePDFExport/> */}
            <ProductFeatureTitle feature="Individual History" product={selectedUser}/>
            <DetailsHistoryIndividual selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
          </div>
        </div>
      </div>
    </>
  );
}
