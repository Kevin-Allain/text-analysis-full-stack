import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from "next/router";
import { useContext } from 'react';
import { FormDataContext } from '@/components/context/FormDataContext';

import Link from 'next/link'
import Head from 'next/head'
import Breadcrumb from "@/components/BreadCrumb"
import InitialResultsCard from "@/components/InitialResultsCard"

// TODO get some results somehow...! At least get props from parent such as file and inputs
export default function InitialResultsWindow(props){
  // TODO update for this: it will be more robust
  const { formData } = useContext(FormDataContext);
  const localFiles = JSON.parse(localStorage.files);
  const { institution, module, name } = formData;
  console.log("InitialResultsWindow | formData: ",formData);
  console.log("institution, module, name: ",{institution, module, name});
  const fileNames = localFiles.map(f => f.name);

  const colorWorking = '#728a8d';     // grey
  const colorLowRisk = '#3cc343';     // green
  const colorMediumRisk = '#d97826';  // orange
  const colorHighRisk = '#d2342d';    // red

  const breadcrumbLinks = [
    { 'name': `${institution}`, 'href': `/ViewModulesinstitution=${institution}`, 'status': 'inactive' },
    { 'name': `${module}`, 'href': `/ViewChecks?institution=${institution}&module=${module}`, 'status': 'inactive' },
    { 'name': `${name}`, 'href': `/InitialResults?institution=${institution}&module=${module}&check_name=${name}`, 'status': 'active' }
  ]


  const getScoreFileFeature = (files,features, colorWorking, colorLowRisk, colorMediumRisk, colorHighRisk) => {
    const arrScores = [];
    files.map(fl => {
      features.map( ft => {
        const rndLoaded = Math.random()
        // TODO eventualy this should call a database! But for now, we will assign made-up values (with potentially display of grey while loading)        
        const score = Math.random();
        let colorCombination = null;
        let type = null;
        if (rndLoaded < 0.20){colorCombination = colorWorking; type="loading"} else {
          colorCombination = score<0.33?colorLowRisk:score<0.66?colorMediumRisk:colorHighRisk;
          type = score<0.33?"lowRisk":score<0.66?"mediumRisk":"highRisk";
        }
        arrScores.push({
          "fileName":fl,
          "feature":ft,
          "score":score,
          "color":colorCombination
        })
      })
    });
    return arrScores
  }

  const arrScores = getScoreFileFeature(localFiles,['AI Detection','Plagiarism','Collusion'], colorWorking, colorLowRisk, colorMediumRisk, colorHighRisk)
  console.log("arrScores: ",arrScores)

  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
      </Head>
      {(name && name !== null) &&
        <Breadcrumb breadcrumbLinks={breadcrumbLinks}/>
      }      
      {/* Works but not sure we want to show it this way... */}
      {/* {localStorage.files && 
              JSON.parse( localStorage.files).map( f =>
                <>
                  <span>{f.name}</span>
                  <br/>
                </>)
      } */}

      <div className="row">
        <InitialResultsCard 
          cardTitle="Collusion"
          redirectLink="/Collusion"
          arrScores={arrScores}
          colorWorking={colorWorking} 
          colorLowRisk={colorLowRisk} 
          colorMediumRisk={colorMediumRisk}
          colorHighRisk={colorHighRisk}
        />
        <InitialResultsCard 
          cardTitle="AI Detection"
          redirectLink="/AI_Detection"
          arrScores={arrScores}
          colorWorking={colorWorking} 
          colorLowRisk={colorLowRisk} 
          colorMediumRisk={colorMediumRisk}
          colorHighRisk={colorHighRisk}          
        />
        <InitialResultsCard 
          cardTitle="Plagiarism"
          redirectLink="/Plagiarism"
          arrScores={arrScores}
          colorWorking={colorWorking} 
          colorLowRisk={colorLowRisk} 
          colorMediumRisk={colorMediumRisk}
          colorHighRisk={colorHighRisk}        
        />
      </div>
    </>
  )
}
