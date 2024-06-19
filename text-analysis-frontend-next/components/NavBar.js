import 'bootstrap/dist/css/bootstrap.min.css'
import Link from "next/link";
import React, { useContext } from 'react';
import { useRouter } from 'next/router';


export default function Navbar(){
  const router = useRouter();

  return (
    <div className="row">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <h3 className="black-link" >HappyAI Analysis v0.0.2</h3>
        </div>
      </nav>
    </div>
  )
}
