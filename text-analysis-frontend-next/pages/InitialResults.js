import Head from 'next/head'

import 'bootstrap/dist/css/bootstrap.min.css'

import Navbar from "@/components/NavBar";
import Sidebar from "@/components/Sidebar";
import InitialResultsWindow from '@/components/InitialResultsWindow'

// TODO get the values from inputs of form in NewCheckWindow!
export default function InitialResults(props){

    console.log("InitialResults | props: ",props);

  let checks = [
    {
      "id": 1,
      "institution": "City, University of London",
      "modules": [
        {
          "id": 1,
          "name": "Java 23/24",
          "courseworks": [
            {
              "id": 1,
              "name": "Coursework 1"
            }
          ]
        }
      ]

    }
  ]

  return(
    <>
      <Head>
        <title>Code Checker - Initial Results</title>
      </Head>
      <div className='container-fluid'>

        <Navbar />

        <div className='row'>
          <Sidebar checks={checks}/>

          <div className='col-md-10'>
            <InitialResultsWindow />
          </div>

        </div>

      </div>
    </>
  )
}
