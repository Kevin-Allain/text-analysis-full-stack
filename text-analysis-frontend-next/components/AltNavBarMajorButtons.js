import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import PagePDFExport from "@/components/export/PagePDFExport";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "@/styles/NavBarMajorButtons.css"

export default function AltNavBarMajorButtons(props) {

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
    // TODO
    const handleClickProductChange = (name) =>{
        console.log("handleClickProductChange : ",name);

    }

    // TODO NOT WORKING
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 576) {
                setFontSize('0.9rem');
                setIconSize('1.2rem');
            } else if (width < 768) {
                setFontSize('1rem');
                setIconSize('1.3rem');
            } else if (width < 992) {
                setFontSize('1.1rem');
                setIconSize('1.4rem');
            } else {
                setFontSize('1.25rem');
                setIconSize('1.5rem');
            }
        };

        handleResize(); // Initial call to set sizes based on current window width
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleContactClick = () => { router.push("https://aiaware.io/contact"); };
    const handleMouseEnter = () => {
        clearTimeout(timerRef.current);
        setShowProducts(true);
    };
    const handleMouseLeave = () => {
        timerRef.current = setTimeout(() => {
            setShowProducts(false);
        }, 300); // delay before hiding the dropdown
    };

    const productsButtonStyle = {
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // textDecoration: "none",
        // color: "white",
        cursor: "pointer",
    };

    return (
        <>

            {/* Products */}
            <DropdownButton
                title={"Products"}
                // onClick={toggleInstitution}
                // variant="outline-dark" // Set variant to light
                variant="outline-light"
                style={{ width: "fit-content", "alignItems": "center" }}
                size={"sm"}
            >
                <Dropdown.Item
                    key={"product_text_analysis"}
                    onClick={() => handleClickProductChange("text_analysis")}
                    onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'black'}
                    onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'darkgrey'}
                >
                    <u>Text Analysis</u>
                </Dropdown.Item>
                <Dropdown.Item
                    key={"product_code_checker"}
                    onClick={() => handleClickProductChange("code_checker")}
                    onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'black'}
                    onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'darkgrey'}
                >
                    <u>Code Checker</u>
                </Dropdown.Item>
                <Dropdown.Item
                    key={"product_media_checker"}
                    onClick={() => handleClickProductChange("media_checker")}
                    onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'black'}
                    onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'darkgrey'}
                >
                    <u>Media Checker</u>
                </Dropdown.Item>                
                <Dropdown.Item
                    key={"product_website_checker"}
                    onClick={() => handleClickProductChange("website_checker")}
                    onMouseDown={(e) => e.currentTarget.style.backgroundColor = 'black'}
                    onMouseUp={(e) => e.currentTarget.style.backgroundColor = 'darkgrey'}
                >
                    <u>Website Checker</u>
                </Dropdown.Item>
            </DropdownButton>


            {/* <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="position-relative"
            >
                <Button
                    variant="outline-light"
                    className="d-flex align-items-center button-responsive"
                    size={"sm"}                   
                    style={{"alignItems":"center"}}                     
                >
                    Products <AiOutlineProduct className="icon-responsive" style={{ fontSize: iconSize }} />                    
                </Button>
                {showProducts && (
                    <div className="alt-products-dropdown position-absolute mt-2 d-flex flex-column">
                        <Link href="/TextAnalysis" passHref>
                            <div
                                className="btn alt-btn-link text-decoration-none mx-1"
                                style={{
                                    borderBottomStyle: "double",
                                    borderBottomColor: "inherit",
                                    borderBottomRightRadius: "0rem",
                                    borderBottomLeftRadius: "0rem",
                                    borderBottomWidth: "medium",
                                }}
                            >
                                Text Analysis
                            </div>
                        </Link>
                        <Link href="/CodeChecker" passHref>
                            <div
                                className="btn alt-btn-link text-decoration-none mx-1"
                                style={{
                                    borderBottomStyle: "double",
                                    borderBottomColor: "inherit",
                                    borderBottomRightRadius: "0rem",
                                    borderBottomLeftRadius: "0rem",
                                    borderBottomWidth: "medium",
                                }}
                            >
                                Code Checker
                            </div>
                        </Link>
                        <Link href="/MediaChecker" passHref>
                            <div
                                className="btn alt-btn-link text-decoration-none mx-1"
                                style={{
                                    borderBottomStyle: "double",
                                    borderBottomColor: "inherit",
                                    borderBottomRightRadius: "0rem",
                                    borderBottomLeftRadius: "0rem",
                                    borderBottomWidth: "medium",
                                }}
                            >
                                Media Checker
                            </div>
                        </Link>
                        <Link href="/WebsiteChecker" passHref>
                            <div
                                className="btn alt-btn-link text-decoration-none mx-1"
                                style={{
                                    borderBottomStyle: "double",
                                    borderBottomColor: "inherit",
                                    borderBottomRightRadius: "0rem",
                                    borderBottomLeftRadius: "0rem",
                                    borderBottomWidth: "medium",
                                }}
                            >
                                Website Checker
                            </div>
                        </Link>
                    </div>
                )}
            </div> */}

            {/* Download button */}
            {/* <Button
                className="d-flex button-responsive"
                onClick={handleDownload}
                variant="outline-light" 
                size={"sm"}
                style={{"alignItems":"center"}}
            >
                Download <LuDownload className="icon-responsive" style={{ fontSize: iconSize }} />
            </Button>
 */}
            {/* Contact */}
            <Button
                variant="outline-light"
                className="d-flex align-items-center button-responsive"
                onClick={handleContactClick}
                size={"sm"}
                style={{"alignItems":"center"}}                
            >
                Contact 
                {/* <IoIosHelpCircleOutline className="icon-responsive" style={{ fontSize: iconSize }} /> */}
                
            </Button>

        </>
    )
}