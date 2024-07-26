import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useEffect } from "react";
import { FormDataContext } from "@/components/context/FormDataContext";

import Link from "next/link";
import Head from "next/head";
import Breadcrumb from "@/components/BreadCrumb";
import InitialResultsCard from "@/components/InitialResultsCard";
import ScoreCardPlural from "@/components/ScoreCardPlural";

import ai_detection_data from "@/public/data/codechecker_ai_detection_example.json";
import collusion_data from "@/public/data/codechecker_collusion_example.json";
import plagiarism_data from "@/public/data/codechecker_plagiarism_example.json";
import individuals_history from "@/public/data/codechecker_individual_history_example.json";
import ScoreCardHistory from "./ScoreCardHistory";

export default function DetailsHistoryIndividual({ selectedUser, setSelectedUser }) {
  const { formData } = useContext(FormDataContext);
  const localFiles = JSON.parse(localStorage.files);
  const { institution, module, name } = formData;
  console.log("DetailsHistoryIndividual | formData: ", formData);
  console.log("institution, module, name: ", { institution, module, name });
  
  const historyUser = individuals_history.filter(a => a.name === selectedUser);

  return (
    <>
      <Head>
        <title>{formData?.product && formData?.product} - Check Results</title>
      </Head>
      <div className="row">
        <ol
          className="list-group list-group-flush"
          style={{ height: "calc(100% - 60px)", width: "100%", overflowY: "auto" }}
        >
          {historyUser && historyUser.map((item, index) => (
            <li key={index} className="list-group-item">
              <ScoreCardHistory
                selectedUser={selectedUser}
              />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
