import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect, useRef, useContext } from 'react';

import Head from 'next/head'
import Navbar from '@/components/NavBar'
import Sidebar from '@/components/Sidebar'
import Breadcrumb from '@/components/BreadCrumb'
import CollusionNetworkGraph from '@/components/vis/CollusionNetworkGraph'
import HorizontalNav from '@/components/HorizontalNav';

import { FormDataContext } from '@/components/context/FormDataContext';

import '@/styles/Collusion.module.css'

export default function Collusion(){
  const { formData, setFormData } = useContext(FormDataContext);

  let checks = [
    {
      "id": 1,
      "institution": "City, University of London",
      "modules": [
        {
          "id": 1,
          "name": "Java 23/24",
          "courseworks": [ { "id": 1, "name": "Coursework 1" } ]
        }
      ]
    }
  ]

  let rankings = [
    {'name': 'Bob', 'score': '99%'}, {'name': 'Sam', 'score': '98%'}, {'name': 'Dave', 'score': '98%'}, {'name': 'Tim', 'score': '97%'}, {'name': 'Dan', 'score': '97%'}, {'name': 'Megan', 'score': '92%'},
  ]

  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
      </Head>

      <div className="container-fluid">

        <Navbar />

        <div className="row">

          <Sidebar checks={checks} />

          <div className="col-md-10">

            <Breadcrumb />
            <HorizontalNav/>          
            <h1> {formData?.product && formData?.product} Collusion - Details</h1>            
            <div className="row">

              <div className="col-md-9">
                <CollusionNetworkGraph />
                <div className="card" style={{ 'height': '28vh' }}>
                  <div className="card-body">
                    <p>Score distribution here</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">

                <h4 style={{ textAlign: "center"}}>Rankings</h4>

                <ul className="list-group">

                  {rankings.map((ranking, index) => (
                    <li 
                      key={index} 
                      className="list-group-item"
                      style={{
                        display: "flex",
                        justifyContent: "space-between"
                      }}
                    >
                      <span>{ranking.name}</span>
                      <span>{ranking.score}</span>
                    </li>
                    )
                  )}
                  
                </ul>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  )
}

