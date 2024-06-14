// import React, { createContext, useState } from 'react';

// export const FormDataContext = createContext();

// export const FormDataProvider = ({ children }) => {
//   const [formData, setFormData] = useState({
//     institution: '',
//     module: '',
//     name: '',
//     files: []
//   });

//   return (
//     <FormDataContext.Provider value={{ formData, setFormData }}>
//       {children}
//     </FormDataContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from 'react';

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    institution: '',
    module: '',
    name: '',
    files: []
  });

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('formData');
      if (savedData) {
        setFormData(JSON.parse(savedData));
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('formData', JSON.stringify(formData));
    }
  }, [formData, isLoaded]);

  if (!isLoaded) {
    return null; // or a loading indicator
  }

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
