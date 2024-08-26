import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { FormDataContext } from '@/components/context/FormDataContext';
import { LuLoader } from "react-icons/lu";
import codecheckerData_plagiarism from '@/public/data/codechecker_plagiarism_example.json';
import codecheckerData_ai_detection from '@/public/data/codechecker_ai_detection_example.json';
import codecheckerData_ai_detection_preload from '@/public/data/codechecker_ai_detection_preload.json';
import codecheckerData_collusion from '@/public/data/codechecker_collusion_example.json';

const HorizontalNav = ( props ) => {
  const {features, selectedUser} = props;
  console.log("HorizontalNav | ", {features, selectedUser});
  const router = useRouter();
  const { formData, setFormData } = useContext(FormDataContext);
  let curFeature = router.pathname.replace('/','');
  const handleNavigation = (page) => { router.push(`/${page}`); };
  let score0=null, score1=null, score2=null;
  let color0 = null, color1 = null, color2 = null;
  const colorLowRisk = "#3cc343"; // green
  const colorMediumRisk = "#d97826"; // orange
  const colorHighRisk = "#d2342d"; // red

  if (selectedUser) {
    const aiFilesUser = codecheckerData_ai_detection.data.find(u => u.name === selectedUser).files;
    console.log("HorizontalNav | aiFilesUser: ", aiFilesUser);
    const aiScoreUser = Math.max(...codecheckerData_ai_detection_preload.filter(f => aiFilesUser.includes(f.fileName)).map(f => f.average)).toFixed(2);
    console.log("aiScoreUser : ",aiScoreUser);
    const plagiarismScoreUser = (100*codecheckerData_plagiarism.data.find(d => d.name === selectedUser).globalScore)+"%";
    const similarityScoreUser = (100*codecheckerData_collusion.data.find(d => d.name === selectedUser).globalScore)+"%";
    score0 = features[0]==="AI_Detection"?aiScoreUser:features[0]==="Plagiarism"?plagiarismScoreUser:similarityScoreUser;
    score1 = features[1]==="AI_Detection"?aiScoreUser:features[1]==="Plagiarism"?plagiarismScoreUser:similarityScoreUser;
    score2 = features[2]==="AI_Detection"?aiScoreUser:features[2]==="Plagiarism"?plagiarismScoreUser:similarityScoreUser;

    const numScore0 = Number(score0.split("%")[0])/100, numScore1 = Number(score1.split("%")[0])/100, numScore2 = Number(score2.split("%")[0])/100;
    console.log({numScore0, numScore1, numScore2});

    color0 = numScore0 < 0.33 ? colorLowRisk : numScore0 < 0.66 ? colorMediumRisk : colorHighRisk;
    color1 = numScore1 < 0.33 ? colorLowRisk : numScore1 < 0.66 ? colorMediumRisk : colorHighRisk;
    color2 = numScore2 < 0.33 ? colorLowRisk : numScore2 < 0.66 ? colorMediumRisk : colorHighRisk;
  }

  const circleStyle = (color) => ({
    backgroundColor: color, borderRadius: '50%', width: '40px', height: '40px', minWidth: '40px', minHeight: '40px',
    aspectRatio: '1 / 1', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', cursor: 'pointer',    
  });



  // TODO adapt button to React Bootstrap button to have the variant 
  return (
    <div className="container mb-1">
      <div className="d-flex justify-content-center" >
        <div className="btn-group" role="group" aria-label="Horizontal navigation" style={{"width":"100%"}}>
          <Button 
            // type="button" 
            // className={`btn ${curFeature===features[0]? "btn-secondary" : "btn-primary"}`}
            variant={`${curFeature===features[0]? "dark" : "outline-secondary"}`}
            onClick={() => handleNavigation(features[0])}
            disabled = {curFeature===features[0]}
            style={{
              "display": "inline-flex",
              "align-items": "center",
              "justify-content": "space-evenly"
            }}
          >
            {features[0].replace('_',' ')}
            {score0 && 
              <div style={circleStyle(color0)} >
                {score0 === "X" ? <LuLoader className="loader-icon" /> : <>{score0}</>}
              </div>}
          </Button>
          <Button 
            // type="button"
            // className={`btn ${curFeature===features[1]? "btn-secondary" : "btn-primary"}`}
            variant={`${curFeature===features[1]? "dark": "outline-secondary"}`}
            onClick={() => handleNavigation(features[1])}
            disabled = {curFeature===features[1]}
            style={{
              "display": "inline-flex",
              "align-items": "center",
              "justify-content": "space-evenly"
            }}
          >
            {features[1].replace('_',' ')}
            {score1 && 
              <div style={circleStyle(color1)} >
                {score1 === "X" ? <LuLoader className="loader-icon" /> : <>{score1}</>}
              </div>}
          </Button>
          <Button 
            // type="button" 
            // className={`btn ${curFeature===features[2]? "btn-secondary" : "btn-primary"}`}
            variant={`${curFeature===features[2]? "dark": "outline-secondary"}`}
            onClick={() => handleNavigation(features[2])}
            disabled = {curFeature===features[2]}
            style={{
              "display": "inline-flex",
              "align-items": "center",
              "justify-content": "space-evenly"
            }}
          >
            {features[2].replace('_',' ')}
            {score2 && 
              <div style={circleStyle(color2)} >
                {score2 === "X" ? <LuLoader className="loader-icon" /> : <>{score2}</>}
              </div>
            }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;
