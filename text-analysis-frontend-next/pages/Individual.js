import Head from "next/head";

import "bootstrap/dist/css/bootstrap.min.css";
import { useContext, useState } from "react";
import Navbar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import InitialResultsWindow from "@/components/InitialResultsWindow";
import { FormDataContext } from "@/components/context/FormDataContext";
import ScoreCardPlural from "@/components/ScoreCardPlural";

import ai_detection_data from "@/public/data/codechecker_ai_detection_example.json";
import collusion_data from "@/public/data/codechecker_collusion_example.json";
import plagiarism_data from "@/public/data/codechecker_plagiarism_example.json";

export default function Individual(props) {
  console.log("Individual | props: ", props);
  console.log("Individual | localStorage: ", localStorage);
  console.log( "Individual | useContext(FormDataContext): ", useContext(FormDataContext) );
  const { formData, setFormData } = useContext(FormDataContext);
  const colorWorking = "#728a8d"; // grey
  const colorLowRisk = "#3cc343"; // green
  const colorMediumRisk = "#d97826"; // orange
  const colorHighRisk = "#d2342d"; // red

  //   TODO system to adapt for several users
  const userFullName = "Alice Black";

  const testModules = [
    {
      module: "Programming in Java",
      courseworks: [ { name: "Coursework 1", score_ai_detection: "X", score_plagiarism: 67, score_collusion: 28, color_ai_detection: colorWorking,           color_plagiarism: colorHighRisk,           color_collusion: colorLowRisk, }, { name: "Coursework 2", score_ai_detection: 14, score_plagiarism: 9, score_collusion: "X", color_ai_detection: colorLowRisk,           color_plagiarism: colorLowRisk,           color_collusion: colorWorking,           }, { name: "Coursework 3", score_ai_detection: 49, score_plagiarism: 1, score_collusion: 8, color_ai_detection: colorMediumRisk,           color_plagiarism: colorLowRisk,           color_collusion: colorLowRisk,           }, ],
    },
    {
      module: "TypeScript 2024",
      courseworks: [ { name: "Coursework 1", score_ai_detection: 44, score_plagiarism: 66, score_collusion: 98, color_ai_detection: colorMediumRisk, color_plagiarism: colorHighRisk,           color_collusion: colorHighRisk,           }, { name: "Coursework 2", score_ai_detection: 14, score_plagiarism: 69, score_collusion: "X", color_ai_detection: colorLowRisk,           color_plagiarism: colorHighRisk,           color_collusion: colorWorking, }, { name: "Coursework 3", score_ai_detection: 49, score_plagiarism: 16, score_collusion: 8, color_ai_detection: colorMediumRisk,           color_plagiarism: colorLowRisk,           color_collusion: colorLowRisk, },
      ],
    },
    {
      module: "C# 2021",
      courseworks: [ { name: "Coursework 1", score_ai_detection: "X", score_plagiarism: 66, score_collusion: 98, color_ai_detection: colorWorking,           color_plagiarism: colorHighRisk,           color_collusion: colorHighRisk, }, { name: "Coursework 2", score_ai_detection: 14, score_plagiarism: 69, score_collusion: 38, color_ai_detection: colorLowRisk,           color_plagiarism: colorHighRisk,           color_collusion: colorMediumRisk, }, { name: "Coursework 3", score_ai_detection: "X", score_plagiarism: 16, score_collusion: 8, color_ai_detection: colorWorking,           color_plagiarism: colorLowRisk,           color_collusion: colorLowRisk, },
      ],
    },
    {
      module: "Stock Prediction",
      courseworks: [ { name: "Coursework 1", score_ai_detection: 44, score_plagiarism: 66, score_collusion: "X", color_ai_detection: colorMediumRisk,           color_plagiarism: colorHighRisk,           color_collusion: colorWorking, }, { name: "Coursework 2", score_ai_detection: 14, score_plagiarism: "X", score_collusion: 38, color_ai_detection: colorLowRisk,           color_plagiarism: colorWorking,           color_collusion: colorMediumRisk, }, { name: "Coursework 3", score_ai_detection: 49, score_plagiarism: 16, score_collusion: "X", color_ai_detection: colorMediumRisk, color_plagiarism: colorMediumRisk,           color_collusion: colorWorking, },
      ],
    },
  ];

  console.log("testModules: ", testModules);


  return (
    <>
      <Head>
        <title>{formData?.product && formData?.product} - Individual</title>
      </Head>
      <div className="container-fluid">
        <Navbar />
        <div className="row">
          {/* <Sidebar /> */}
          <div className="col-md-12">
            <h3>{userFullName} - Individual Scores</h3>
            <h4>Modules History</h4>
            {testModules.map((a, index) => (
              <>
                <div>{a.module}</div>
                <ol
                    className="list-group list-group-flush"
                    // style={{ height: "calc(100% - 60px)", width: "100%", overflowY: "auto", }}
                >
                    {a.courseworks.map((c,ndx) => (
                        <>
                        <li key={index} className="list-group-item">
                            <ScoreCardPlural
                                name={c.name}
                                color_ai={c.color_ai_detection}
                                score_ai={c.score_ai_detection}
                                color_plagiarism={c.color_plagiarism}
                                score_plagiarism={c.score_plagiarism}
                                color_collusion={c.color_collusion}
                                score_collusion={c.score_collusion}
                                />
                        </li>
                        </>
                    ))}
                </ol>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
