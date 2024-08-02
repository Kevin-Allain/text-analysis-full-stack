import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import logo from "@/public/img/AI-AWARE-LOGO-WEBSITE-1-BLACK.png";
import { AiOutlineProduct } from "react-icons/ai";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import PagePDFExport from "@/components/export/PagePDFExport";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export default function Navbar() {
  const router = useRouter();
  const [showProducts, setShowProducts] = useState(false);
  const timerRef = useRef(null);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleContactClick = () => {
    router.push("https://aiaware.io/contact");
  };

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
    fontSize: "1rem",
  };
  const iconStyle = {
    fontSize: "1.5rem", // Set a fixed size for all icons
    marginBottom: "5px",
  };

  // Could be updated differently later...?
  const handleDownload = () => {
    saveAsPDF();
  }

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
    <div className="row">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div
          className="container-fluid"
          style={{ marginLeft: "1rem", marginRight: "1rem" }}
        >
          <div
            className="leftPic"
            onClick={handleLogoClick}
            style={{ cursor: "pointer" }}
          >
            <Image src={logo} alt="Logo" />
          </div>
          <div className="ml-auto d-flex align-items-center">
            
          <div
              onClick={handleDownload}
              className="btn btn-link text-decoration-none btn ml-3"
              style={productsButtonStyle}
              onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
              onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
            >
              <LuDownload style={iconStyle} />
              Download
            </div>

            
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="position-relative"
            >
              <div
                className="btn btn-link text-decoration-none"
                style={productsButtonStyle}
                onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
                onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
              >
                <AiOutlineProduct style={iconStyle} />
                Products
              </div>
              {showProducts && (
                <div className="products-dropdown position-absolute mt-2 d-flex flex-column">
                  <Link href="/TextAnalysis" passHref>
                    <div
                      className="btn btn-link text-decoration-none mx-1"
                      style={{
                        "border-bottom-style": "double",
                        "border-bottom-color": "inherit",
                        "border-bottom-right-radius": "0rem",
                        "border-bottom-left-radius": "0rem",
                        "border-bottom-width": "medium",
                      }}
                    >
                      Text Analysis
                    </div>
                  </Link>
                  <Link href="/CodeChecker" passHref>
                    <div
                      className="btn btn-link text-decoration-none mx-1"
                      style={{
                        "border-bottom-style": "double",
                        "border-bottom-color": "inherit",
                        "border-bottom-right-radius": "0rem",
                        "border-bottom-left-radius": "0rem",
                        "border-bottom-width": "medium",
                      }}
                    >
                      Code Checker
                    </div>
                  </Link>
                  <Link href="/MediaChecker" passHref>
                    <div
                      className="btn btn-link text-decoration-none mx-1"
                      style={{
                        "border-bottom-style": "double",
                        "border-bottom-color": "inherit",
                        "border-bottom-right-radius": "0rem",
                        "border-bottom-left-radius": "0rem",
                        "border-bottom-width": "medium",
                      }}
                    >
                      Media Checker
                    </div>
                  </Link>
                  <Link href="/WebsiteChecker" passHref>
                    <div
                      className="btn btn-link text-decoration-none mx-1"
                      style={{
                        "border-bottom-style": "double",
                        "border-bottom-color": "inherit",
                        "border-bottom-right-radius": "0rem",
                        "border-bottom-left-radius": "0rem",
                        "border-bottom-width": "medium",
                      }}
                    >
                      Website Checker
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <div
              onClick={handleContactClick}
              className="btn btn-link text-decoration-none btn ml-3"
              style={productsButtonStyle}
              onMouseOver={(e) => (e.currentTarget.style.color = "blue")}
              onMouseOut={(e) => (e.currentTarget.style.color = "initial")}
            >
              <IoIosHelpCircleOutline style={iconStyle} />
              Contact
            </div>
          </div>
        </div>
      </nav>
      {/* TODO update in different design file */}
      <style jsx>{`
        .leftPic img {
          max-width: 150px; /* Adjust the size as needed */
        }

        .ml-auto {
          margin-left: auto;
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
      `}</style>
    </div>
  );
}
