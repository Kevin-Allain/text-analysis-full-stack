import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import 'bootstrap/dist/css/bootstrap.min.css'

export default function NewCheckWindow(props){
  const [ progress, setProgress ] = useState(0);
  const [ isUploading, setIsUploading ] = useState(0);
  const router = useRouter();

  const handleUpload = () => {
    setIsUploading(prevIsUploading => {
      return 1
    })
  }

  const uploadButton = <div
    onClick={handleUpload}
    className="btn btn-primary"
    style={{'width': '100%'}}
    > 
    Upload and Check 
  </div> 

  const uploadProgress = <div 
    className="progress"
    role='progressbar' 
    >
      <div 
        className='progress-bar progress-bar-striped progress-bar-animated' 
        style={{"width": `${progress}%`, 'fontSize': '1.2em'}}
      >
        Uploading ({progress}%)...
      </div>
  </div>

  useEffect(() => {
    if (isUploading == 1){
      const interval = setInterval(() => {
        const randomIncrement = Math.floor(Math.random() * 50) + 1
        setProgress(prevProgress => {
          let newValue = 0
          if (!isNaN(progress)){
            newValue = prevProgress + randomIncrement
            newValue > 100 ? newValue = 100 : newValue
            if (newValue >= 100){
              router.push("/InitialResults/")
              return
            }
            // console.log(prevProgress+ " + " +randomIncrement + " = " + newValue)
            return newValue
          }
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isUploading, props])


  return(
    <div 
      className="container" 
      style={{ "display": "flex",  'justifyContent': 'center',  'alignItems': 'center',  'height': '80vh' }} >
      <div className="card" style={{'width': '40%'}}>
        <div className="card-header" style={{'textAlign': 'center'}}> New Check </div>
        <div className="card-body">
          <form>
            <div className="mb-3">
              <label htmlFor="institutionInput" className="form-label">Institution</label>
              <input type="text" className="form-control" id="institutionInput" aria-describedby="institutionHelp" placeholder="e.g. City, University of London"/>
            </div>
            <div className="mb-3">
              <label htmlFor="moduleInput" className="form-label">Module</label>
              <input type="text"  className="form-control" id="moduleInput" placeholder="e.g. Programming In Java 23/24" />
            </div> 
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">Name</label>
              <input  type="text" className="form-control" id="nameInput"  placeholder='e.g. Coursework 1' />
            </div> 
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label"></label>
              <input name="file[]" multiple type="file" className="form-control" id="fileInput" />
            </div>          
            
            { isUploading == 0 && uploadButton }
            { isUploading == 1 && uploadProgress }

          </form>
        </div>
      </div>
    </div>
  )
}
