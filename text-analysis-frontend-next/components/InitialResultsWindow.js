import 'bootstrap/dist/css/bootstrap.min.css'
import { useRouter } from "next/router";
import { useContext } from 'react';
import { FormDataContext } from '@/components/FormDataContext';

import Link from 'next/link'
import Head from 'next/head'
import Breadcrumb from "@/components/BreadCrumb"
import InitialResultsCard from "@/components/InitialResultsCard"

// TODO get some results somehow...! At least get props from parent such as file and inputs
export default function InitialResultsWindow(props){
    // console.log("InitialResultsWindow | props: ",props);
    // const { formData } = useContext(FormDataContext);
    // console.log("InitialResultsWindow | formData: ",formData);

    // TODO update for this: it will be more robust
    // const { formData } = useContext(FormDataContext);
    // console.log("InitialResultsWindow | formData: ",formData);
    // first approach
    const router = useRouter();
    // console.log("router: ", router)
    // console.log("router.asPath: ", router.asPath)

    const { institution, module, name } =   Object.keys(router.query).length !== 0 
        ? router.query
        : {
            // institution : router.asPath.split('?')[1].split('&')[0].split('=')[1],module : router.asPath.split('?')[1].split('&')[1].split('=')[1], name : router.asPath.split('?')[1].split('&')[2].split('=')[1]
            institution : null,
            module : null,
            name: null
        };
    // console.log("institution, module, name: ",{institution, module, name});

    let collusionStatMessages_collusion = [
      "On average, any submission has 50% collusion.",
      "abcd123.py by James has the highest score of 82%.",
      "abcd123.py by Samantha has 14 matches out of 20 with an average score of 52%."
    ]
    let collusionStatMessages_plagiarism = [
      "On average, any submission has 50% plagiarism.",
      "abcd123.py by James has the highest score of 82%.",
      "abcd123.py by Samantha has 14 matches out of 20 with an average score of 52%."
    ]
    let collusionStatMessages_ai_detection = [
      "On average, any submission has 50% on ai detection.",
      "abcd123.py by James has the highest score of 82%.",
      "abcd123.py by Samantha has 14 matches out of 20 with an average score of 52%."
    ]

  const breadcrumbLinks = [
    {
      'name': `${institution}`,
      'href': `/ViewModulesinstitution=${institution}`,
      'status': 'inactive'
    },
    {
      'name': `${module}`,
      'href': `/ViewChecks?institution=${institution}&module=${module}`,
      'status': 'inactive'
    },
    {
      'name': `${name}`,
      'href': `/InitialResults?institution=${institution}&module=${module}&check_name=${name}`,
      'status': 'active'
    }
  ]

  return (
    <>
      <Head>
        <title>Code Checker - Check Results</title>
      </Head>

      {(name && name !== null) &&
        <Breadcrumb breadcrumbLinks={breadcrumbLinks}/>
      }
      
      <div className="row">
        <InitialResultsCard 
          cardTitle="Collusion"
          statMessages={collusionStatMessages_collusion}
          redirectLink="/Collusion"
        />
        <InitialResultsCard 
          cardTitle="AI Detection"
          statMessages={collusionStatMessages_ai_detection}
          redirectLink="/AI_Detection"
        />
        <InitialResultsCard 
          cardTitle="Plagiarism"
          statMessages={collusionStatMessages_plagiarism}
          redirectLink="/Plagiarism"
        />
      </div>
    </>
  )
}
