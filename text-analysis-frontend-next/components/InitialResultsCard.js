import 'bootstrap/dist/css/bootstrap.min.css'
import { FaWrench } from "react-icons/fa6";
import Link from 'next/link'

export default function InitialResultsCard(props){
  // console.log("InitialResultsCard | props: ",props);

  return(
    <div className="col-md-4">
        <div 
          className="card"
          style={{ height: "89vh" }}
        >
          <div className="card-header">
            <h5>{props.cardTitle}</h5>
          </div>
          <div 
            className="card-body"
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              flexDirection: "column"
            }}
          >
            <ol className="list-group list-group-flush">

              {props.statMessages.map((item, index) => {
                return <li key={index} className="list-group-item">
                  {item}
                </li>
              })}
            </ol>
            <Link 
              className="btn btn-primary"
              style={{ width: "100%" }}
            //   href={``}
              href={`/${props.redirectLink}`}
            >
              Explore 
              {/* <FaWrench /> */}
            </Link>
          </div>

        </div>

    </div>

  )
}
