import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { FormDataContext } from '@/components/context/FormDataContext';

const HorizontalNav = ({features}) => {
  const router = useRouter();
  const { formData, setFormData } = useContext(FormDataContext);
  let curFeature = router.pathname.replace('/','');
  const handleNavigation = (page) => { router.push(`/${page}`); };

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
          </button>
          <button 
            type="button" 
            className={`btn ${curFeature===features[1]? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation(features[1])}
            disabled = {curFeature===features[1]}
          >
            {features[1].replace('_',' ')}
          </button>
          <button 
            type="button" 
            className={`btn ${curFeature===features[2]? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation(features[2])}
            disabled = {curFeature===features[2]}
          >
            {features[2].replace('_',' ')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;
