import 'bootstrap/dist/css/bootstrap.min.css'
import BarChartD3 from './BarChartD3'

// TODO pass setOtherUser attribute, so that when clicking on it, we can adapt details underneath graph
export default function CollusionSelectionGraph({ user, setOtherUser }){

  console.log("CollusionSelectionGraph| user: ",user
    ,", user.scoreDetails: ",user.scoreDetails
    ,", setOtherUser: ",setOtherUser);

  const transposeDataCollusion = (u) => {
    return u.scoreDetails.relations.map(r => ({
        name: r.name,
        value: Math.max(... Object.values(r.collusionScores)),
        description: JSON.stringify(r.collusionScores)
    }))
    .sort((a,b) => b.value-a.value)    
    ;
  }
  
  const processedData = transposeDataCollusion(user)

  return(
    <>
      <div className="card" style={{"margin": "0 0 1vh 0", "height": "30vh", "width": "100%" }}>
        <div className="card-body" style={{"margin": "-2vh 0 0 0"}}>
          <BarChartD3 data={processedData} selectBar={setOtherUser}/>
        </div>
      </div>
    </>
  )
}
