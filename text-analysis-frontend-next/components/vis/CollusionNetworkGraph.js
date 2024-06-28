import 'bootstrap/dist/css/bootstrap.min.css'
import BarChartD3 from './BarChartD3'

export default function CollusionNetworkGraph(user){

  console.log("CollusionNetworkGraph| user: ",user);

  const transposeDataCollusion = (u) => {
    return u.user.scoreDetails.relations.map(r => ({
        name: r.name,
        value: Math.max(... Object.values(r.collusionScores))
    }))
    .sort((a,b) => b.value-a.value)    
    ;
  }
  
  const processedData = transposeDataCollusion(user)


  return(
    <>
      <div className="card" style={{ "margin": "0 0 1vh 0", "height": "30vh" }}>

        <div className="card-body">

          <BarChartD3 data={processedData}/>

        </div>

      </div>
    </>
  )
}
