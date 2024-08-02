import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaRegFilePdf } from "react-icons/fa6";

const PagePDFExport = () => {

  const saveAsPDF = () => {
    html2canvas(document.body).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 size in mm
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('page.pdf');
    });
  };
  
  return (
      <button 
        style={{"border":"none","background":"none",}}
        onMouseOver={(e) => e.currentTarget.style.color = 'blue'}
        onMouseOut={(e) => e.currentTarget.style.color = 'initial'}              
        onClick={saveAsPDF}>
        <FaRegFilePdf
          style={{"width":"100%","height":"100%","verticalAlign":"text-bottom"}}

        />
      </button>    
  );
};

export default PagePDFExport;
