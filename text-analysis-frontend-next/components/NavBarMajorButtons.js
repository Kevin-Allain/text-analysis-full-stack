import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import PagePDFExport from "@/components/export/PagePDFExport";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import "@/styles/NavBarMajorButtons.css"

export default function NavBarMajorButtons(props) {

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        color: "black",
        cursor: "pointer",
        // fontSize: "1.25rem",
    };

    return (
        <div
            className="NavBarMajorButtons"
            style={{ "display": "inline-flex" }}
        >
            {/* Download button */}
            <Button
                variant="link"
                className="d-flex align-items-center button-responsive"
                onClick={handleDownload}
                style={productsButtonStyle}
            >
                <LuDownload className="icon-responsive" style={{ fontSize: iconSize }} />
                Download
            </Button>

            {/* Products */}
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="position-relative"
            >
                <Button
                    variant="link"
                    className="d-flex align-items-center button-responsive"
                    style={productsButtonStyle}
                >
                    <AiOutlineProduct className="icon-responsive" style={{ fontSize: iconSize }} />
                    Products
                </Button>
                {showProducts && (
                    <div className="products-dropdown position-absolute mt-2 d-flex flex-column">
                        <Link href="/TextAnalysis" passHref>
                            <div
                                className="btn btn-link text-decoration-none mx-1"
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
                                className="btn btn-link text-decoration-none mx-1"
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
                                className="btn btn-link text-decoration-none mx-1"
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
                                className="btn btn-link text-decoration-none mx-1"
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
            </div>

            {/* Contact */}
            <Button
                variant="link"
                className="d-flex align-items-center button-responsive"
                onClick={handleContactClick}
                style={productsButtonStyle}
            >
                <IoIosHelpCircleOutline className="icon-responsive" style={{ fontSize: iconSize }} />
                Contact
            </Button>
            <style jsx>{`
        .custom-dropdown .dropdown-toggle {
          background-color: white !important; /* Override default styles */
          color: #000; /* Default text color */
          border: none;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .custom-dropdown .dropdown-toggle:hover {
          background-color: #f0f0f0 !important; /* Light gray on hover */
        }
        .custom-color .dropdown-toggle {
          background-color: var(--custom-color) !important; /* Use a CSS variable */
          color: #fff;
        }
        .custom-color .dropdown-toggle:hover {
          filter: brightness(85%);
        }
        .ml-auto {
          margin-left: auto;
        }
      .button-responsive {
        font-size: 1.2rem;
        transition: font-size 0.3s, padding 0.3s;
      }
      .icon-responsive {
        font-size: 1.5rem;
        transition: font-size 0.3s;
      }
      @media (max-width: 992px) {
        .button-responsive {
          font-size: 1rem;
          padding: 0.25rem 0.5rem;
        }
        .icon-responsive {
          font-size: 1.2rem;
        }
      }
      @media (max-width: 768px) {
        .button-responsive {
          font-size: 0.9rem;
          padding: 0.2rem 0.4rem;
        }
        .icon-responsive {
          font-size: 1rem;
        }
      }
      @media (max-width: 576px) {
        .button-responsive {
          font-size: 0.8rem;
          padding: 0.15rem 0.3rem;
        }
        .icon-responsive {
          font-size: 0.8rem;
        }
      }
      .btn-link {
        color: black;
        cursor: pointer;
        font-size: 1.2rem;
      }
      .btn-link:hover {
        color: blue;
      }
      .products-dropdown {
        background: white;
        border: 1px solid #ddd;
        padding: 10px;
        z-index: 1000;
      }
      .products-dropdown .btn-link {
        margin: 5px 0;
      }
      .btn-link.text-decoration-none:hover {
        color: blue;
      }
      .position-relative:hover .products-dropdown {
        display: flex;
      }
      .responsive-dropdown {
        width: 100%;
        @media (min-width: 576px) {
          max-width: 250px; // Adjust for sm screens (similar to xs)
        }
        @media (min-width: 768px) {
          max-width: 300px; // Adjust for md screens
        }
        @media (min-width: 992px) {
          max-width: 350px; // Adjust for lg screens
        }
      }
      `}</style>
        </div>
    )
}