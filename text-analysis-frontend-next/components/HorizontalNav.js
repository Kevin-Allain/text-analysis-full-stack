import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { FormDataContext } from '@/components/context/FormDataContext';

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
  }

  return (
    <div className="container mb-1">
      <div className="d-flex justify-content-center" >
        <div className="btn-group" role="group" aria-label="Horizontal navigation" style={{"width":"100%"}}>
          <button 
            type="button" 
            className={`btn ${curFeature===features[0]? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation(features[0])}
            disabled = {curFeature===features[0]}
          >
            {features[0].replace('_',' ')}
            {score0 && ` - ${score0}`}
          </button>
          <button 
            type="button" 
            className={`btn ${curFeature===features[1]? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation(features[1])}
            disabled = {curFeature===features[1]}
          >
            {features[1].replace('_',' ')}
            {score1 && ` - ${score1}`}
          </button>
          <button 
            type="button" 
            className={`btn ${curFeature===features[2]? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation(features[2])}
            disabled = {curFeature===features[2]}
          >
            {features[2].replace('_',' ')}
            {score2 && ` - ${score2}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;
