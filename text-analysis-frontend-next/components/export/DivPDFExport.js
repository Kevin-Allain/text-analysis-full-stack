import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaRegFilePdf } from "react-icons/fa6";

const DivPDFExport = () => {
  const saveDivAsPDF = () => {
    const divToExport = '';
    const classToExport = 'col-md-10';

    const input = document.getElementsByClassName(classToExport)[0];
    html2canvas(input).then((canvas) => {
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

      pdf.save('div-content.pdf');
    });
  };

  return (
      <button style={{"border":"none","background":"none","margin-bottom":"0.25rem"}} onClick={saveDivAsPDF}><FaRegFilePdf/></button>
  );
};

export default DivPDFExport;
