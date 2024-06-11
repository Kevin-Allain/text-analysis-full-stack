import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from "next/router";
// import { useContext } from 'react';
// import { FormDataContext } from '../path/to/FormDataContext';

import Link from 'next/link'
import Head from 'next/head'
import Breadcrumb from "@/components/BreadCrumb"
import InitialResultsCard from "@/components/InitialResultsCard"

// TODO get some results somehow...! At least get props from parent such as file and inputs
export default function InitialResultsWindow(props){
    console.log("InitialResultsWindow | props: ",props);

    // TODO update for this: it will be more robust
    // const { formData } = useContext(FormDataContext);
    // console.log("InitialResultsWindow | formData: ",formData);
    // first approach
    const router = useRouter();
    console.log("router: ", router)
    console.log("router.asPath: ", router.asPath)

    const { institution, module, name } =   Object.keys(router.query).length !== 0 
        ? router.query
        : {
            // institution : router.asPath.split('?')[1].split('&')[0].split('=')[1],
            // module : router.asPath.split('?')[1].split('&')[1].split('=')[1],
            // name : router.asPath.split('?')[1].split('&')[2].split('=')[1]
            institution : null,
            module : null,
            name: null
        };

    console.log("institution, module, name: ",{institution, module, name});

  let collusionStatMessages = [
    "On average, any submission has 50% collusion.",
    "abcd123.py by James has the highest score of 82%.",
    "abcd123.py by Samantha has 14 matches out of 20 with an average score of 52%."
  ]

  const breadcrumbLinks = [
    {
      'name': 'City, University of London',
      'href': '/ViewModules?institution=city_university_of_london',
      'status': 'inactive'
    },
    {
      'name': 'Java 23/24',
      'href': '/ViewChecks?institution=city_university_of_london&module=java_2324',
      'status': 'inactive'
    },
    {
      'name': 'Coursework 1',
      'href': '/InitialResults?institution=city_university_of_london&module=java_2324&check_name=coursework_1',
      'status': 'active'
    }
  ]

  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
      </Head>

      <Breadcrumb breadcrumbLinks={breadcrumbLinks}/>
      
      <div className="row">

        <InitialResultsCard 
          cardTitle="Collusion"
          statMessages={collusionStatMessages}
          redirectLink="/Collusion"
        />

        <InitialResultsCard 
          cardTitle="AI Detection"
          statMessages={collusionStatMessages}
          redirectLink="/ai-detection"
        />

        <InitialResultsCard 
          cardTitle="Plagiarism"
          statMessages={collusionStatMessages}
          redirectLink="/plagiarism"
        />



      </div>
    </>
  )
}
