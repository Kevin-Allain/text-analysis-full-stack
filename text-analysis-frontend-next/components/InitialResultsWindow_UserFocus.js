import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FormDataContext } from "@/components/context/FormDataContext";

import Link from "next/link";
import Head from "next/head";
import Breadcrumb from "@/components/BreadCrumb";
import InitialResultsCard from "@/components/InitialResultsCard";
import ScoreCardPlural from "@/components/ScoreCardPlural";

import ai_detection_data from "@/public/data/codechecker_ai_detection_example.json";
import collusion_data from "@/public/data/codechecker_collusion_example.json";
import plagiarism_data from "@/public/data/codechecker_plagiarism_example.json";

// TODO get some results somehow...! At least get props from parent such as file and inputs
export default function InitialResultsWindow_UserFocus(props) {
  // TODO update for this: it will be more robust
  const { formData } = useContext(FormDataContext);
  const localFiles = JSON.parse(localStorage.files);
  const { institution, module, name } = formData;
  console.log("InitialResultsWindow | formData: ", formData);
  console.log("institution, module, name: ", { institution, module, name });

  const colorWorking = "#728a8d"; // grey
  const colorLowRisk = "#3cc343"; // green
  const colorMediumRisk = "#d97826"; // orange
  const colorHighRisk = "#d2342d"; // red

  const breadcrumbLinks = [{ name: `${institution}`, href: `/ViewModulesinstitution=${institution}`, status: "inactive", },
    { name: `${module}`, href: `/ViewChecks?institution=${institution}&module=${module}`, status: "inactive", },
    { name: `${name}`, href: `/InitialResults?institution=${institution}&module=${module}&check_name=${name}`, status: "active", },
  ];

  const getScoreUserSummary = (
    ai_detection_data,
    collusion_data,
    plagiarism_data,
    files,
    features,
    colorWorking,
    colorLowRisk,
    colorMediumRisk,
    colorHighRisk
  ) => {
    // TODO eventually, the names of users and how to get them should be something provided by database!!!
    const users = ai_detection_data.data.map((a) => a.name);
    let aggregateUserScores = [];
    // TODO code that will make queries to get the output...
    for (let i = 0; i < users.length; i++) {
      let curUser = users[i];
      // Get data of ai_detection
      let cur_ai_detection = ai_detection_data.data.filter(
        (a) => a.name === curUser
      );
      // Get data of collusion
      let cur_collusion = collusion_data.data.filter((a) => a.name === curUser);
      // Get data of plagiarism
      let cur_plagiarism = plagiarism_data.data.filter(
        (a) => a.name === curUser
      );

      let colorsRndm = [], scoresRndm = [];
      for (let k = 0; k <3 ; k++){
        const rndLoaded = Math.random();
        const score = Math.random();
        let colorCombination = null;
        let type = null;
        if (rndLoaded < 0.2) { colorCombination = colorWorking; type = "loading";
        } else {
            colorCombination = score < 0.33 ? colorLowRisk : score < 0.66 ? colorMediumRisk : colorHighRisk; 
            type = score < 0.33 ? "lowRisk" : score < 0.66 ? "mediumRisk" : "highRisk";
        }
        colorsRndm.push(colorCombination);
        scoresRndm.push(type==="loading"? "X" : (100*score).toFixed(0));
      }
      aggregateUserScores.push({
        name: curUser,
        ai_detection: cur_ai_detection,
        score_ai: scoresRndm[0],
        color_ai: colorsRndm[0],
        collusion: cur_collusion,
        score_collusion: scoresRndm[1],
        color_collusion: colorsRndm[1],        
        plagiarism: cur_plagiarism,
        score_plagiarism: scoresRndm[2],
        color_plagiarism: colorsRndm[2],
      });
    }
    return aggregateUserScores;
  };


  const userScores = getScoreUserSummary(
    ai_detection_data,
    collusion_data,
    plagiarism_data,
    localFiles,
    ["AI Detection", "Plagiarism", "Collusion"],
    colorWorking,
    colorLowRisk,
    colorMediumRisk,
    colorHighRisk
  );

  return (
    <>
      <Head>
        <title>{formData?.product && formData?.product} - Check Results</title>
      </Head>
      {/* {name && name !== null && (<Breadcrumb breadcrumbLinks={breadcrumbLinks} />)} */}
      <div className="row">
        <ol
          className="list-group list-group-flush"
          style={{ height: "calc(100% - 60px)", width: "100%", overflowY: "auto", }}
        >
          {userScores.map((item, index) => (
            <li key={index} className="list-group-item">
              <ScoreCardPlural
                name={item.name}
                color_ai={item.color_ai}
                score_ai={item.score_ai}
                color_plagiarism={item.color_plagiarism}
                score_plagiarism={item.score_plagiarism}
                color_collusion={item.color_collusion}
                score_collusion={item.score_collusion}
              />
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
