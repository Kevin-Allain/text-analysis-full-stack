import 'bootstrap/dist/css/bootstrap.min.css'
import Link from "next/link";

export default function Navbar(){
  return (
    <div className="row">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          {/* <Link className="black-link" href="/">AI Text Analysis</Link> */}
          <h3 className="black-link" href="/">HappyAI Analysis v0.0.2</h3>
        </div>
      </nav>
    </div>
  )
}
