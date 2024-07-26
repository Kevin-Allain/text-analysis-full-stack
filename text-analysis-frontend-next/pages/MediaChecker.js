import React, { useState, useEffect, useContext } from "react";
import withAuth from '@/components/WithAuth';
import Head from "next/head";
import HorizontalNav from '@/components/HorizontalNav';
import Navbar from '@/components/NavBar';
import ProductFeatureTitle from '@/components/ProductFeatureTitle';
import { FormDataContext } from "@/components/context/FormDataContext";


const MediaChecker = () => {
  const { formData, setFormData} = useContext(FormDataContext);

    return (
      <>
      <Head>
        <title>Media Checker</title>
      </Head>
      <div className="container-fluid d-flex flex-column min-vh-100">
          <Navbar />
          {/* <h1>Media Checker Page</h1> */}
          <ProductFeatureTitle feature="Media Checker"/>
          <HorizontalNav features={["Image_Analysis", "Video_Analysis", "Audio_Analysis"]} />
        </div>
      </>
    );
  };
  
  export default withAuth(MediaChecker);
  