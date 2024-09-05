import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { useRouter } from "next/router";
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import PagePDFExport from "@/components/export/PagePDFExport";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "@/styles/NavBarMajorButtons.css"



export default function AltNavBarMajorButtons(props) {
    const router = useRouter();

    const [fontSize, setFontSize] = useState('1.25rem');
    const [iconSize, setIconSize] = useState('1.5rem');

    const [showProducts, setShowProducts] = useState(false);
    const timerRef = useRef(null);

    // Could be updated differently later...?
    const handleDownload = () => { saveAsPDF(); }
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

  // Toggle product dropdown visibility
  const toggleProductDropdown = () => {
    setShowProducts(!showProducts);
  };

  const handleClickProductChange = (name) => {
    console.log("handleClickProductChange : ", name);
    if (name === "code_checker") {
      router.push("/CodeChecker");
    } else if (name === "text_analysis") {
      router.push("/TextAnalysis");
    } else if (name === "media_checker") {
      router.push("/MediaChecker");
    } else {
      router.push("/WebsiteChecker");
    }
  };

  const handleContactClick = () => {
    router.push("https://aiaware.io/contact");
  };

  return (
        <>
            {/* Products Dropdown */}
            <div style={{ display: "inline-block", position: "relative" }}>
                <div
                    onClick={toggleProductDropdown}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        padding: "10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                        textAlign: "center",
                        width:"200px",
                        border: showProducts ? "1px solid white" : "none", // Add conditional border here
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                >
                    Products <IoIosArrowDown />
                </div>

                {/* Dropdown menu (conditionally rendered) */}
                {showProducts && (
                    <div
                        style={{
                            backgroundColor: "black",
                            position: "absolute",
                            top: "100%",
                            left: "0",
                            zIndex: 1,
                            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
                            padding: "10px",
                            borderRadius: "5px",
                            width: "200px",
                        }}
                    >
                        <div
                            key={"product_text_analysis"}
                            style={{ color: "white", padding: "10px", cursor: "pointer" }}
                            onClick={() => handleClickProductChange("text_analysis")}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                        >
                            <u>Text Analysis</u>
                        </div>
                        <div
                            key={"product_code_checker"}
                            style={{ color: "white", padding: "10px", cursor: "pointer" }}
                            onClick={() => handleClickProductChange("code_checker")}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                        >
                            <u>Code Checker</u>
                        </div>
                        <div
                            key={"product_media_checker"}
                            style={{ color: "white", padding: "10px", cursor: "pointer" }}
                            onClick={() => handleClickProductChange("media_checker")}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                        >
                            <u>Media Checker</u>
                        </div>
                        <div
                            key={"product_website_checker"}
                            style={{ color: "white", padding: "10px", cursor: "pointer" }}
                            onClick={() => handleClickProductChange("website_checker")}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseDown={(e) => (e.currentTarget.style.backgroundColor = "black")}
                            onMouseUp={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                        >
                            <u>Website Checker</u>
                        </div>
                    </div>
                )}
            </div>

            {/* Contact Button */}
            <div
                style={{
                    backgroundColor: "black",
                    color: "white",
                    padding: "10px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    textAlign: "center",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#6e7174")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "black")}
                onClick={handleContactClick}
            >
                Contact
            </div>
        </>
    );
}
