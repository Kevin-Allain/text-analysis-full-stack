import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { FormDataContext } from '@/components/context/FormDataContext';
import { gray } from 'd3';

const HorizontalNav = () => {
  const router = useRouter();
  const { formData, setFormData } = useContext(FormDataContext);
  let curFeature = router.pathname.replace('/','');

  const handleNavigation = (page) => {
      router.push(`/${page}`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center">
        <div className="btn-group" role="group" aria-label="Horizontal navigation">
          <button 
            type="button" 
            className={`btn ${curFeature==='Collusion'? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation('Collusion')}
            disabled = {curFeature==='Collusion'}
          >
            Collusion
          </button>
          <button 
            type="button" 
            className={`btn ${curFeature==='AI_Detection'? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation('AI_Detection')}
            disabled = {curFeature==='AI_Detection'}
          >
            AI Detection
          </button>
          <button 
            type="button" 
            className={`btn ${curFeature==='Plagiarism'? "btn-secondary" : "btn-primary"}`}
            onClick={() => handleNavigation('Plagiarism')}
            disabled = {curFeature==='Plagiarism'}
          >
            Plagiarism
          </button>
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;
