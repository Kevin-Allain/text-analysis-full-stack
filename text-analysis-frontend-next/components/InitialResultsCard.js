import 'bootstrap/dist/css/bootstrap.min.css';
import { FaWrench } from "react-icons/fa6";
import Link from 'next/link';
import ScoreCard from '@/components/ScoreCard';

export default function InitialResultsCard(props){
  console.log("InitialResultsCard | props: ", props);

  const scores = props.arrScores.filter(x => x.feature === props.cardTitle);
  const avgScore = Math.round(100 * scores.map(x => x.score).reduce((a, b) => a + b, 0) / scores.length);
  const avgColor = (avgScore / 100) < 0.33 ? props.colorLowRisk : (avgScore / 100) < 0.66 ? props.colorMediumRisk : props.colorHighRisk;

  return (
    <div className="col-md-4">
      <div
        className="card"
        style={{ height: "69vh" }}
      >
        <div className="card-header">
          <h5>
            <ScoreCard text={props.cardTitle} color={avgColor} score={avgScore} />
          </h5>
        </div>
        <div
          className="card-body"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "column",
            height: "calc(100% - 80px)"
          }}
        >
          <ol className="list-group list-group-flush" style={{ height: "calc(100% - 60px)", width:"100%", overflowY: "auto" }}>
            {scores.map((item, index) => {
              return (
                <li key={index} className="list-group-item">
                  <ScoreCard 
                    text={item.fileName.name} 
                    color={item.color} 
                    score={item.color === props.colorWorking ? "X" : Math.round(100 * item.score)} 
                    
                  />
                </li>
              );
            })}
          </ol>

          <Link
            className="btn btn-primary"
            style={{ width: "100%" }}
            href={`/${props.redirectLink}`}
          >
            Explore
            {/* <FaWrench /> */}
          </Link>
        </div>
      </div>
    </div>
  );
}
