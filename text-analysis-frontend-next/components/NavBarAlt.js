import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import logo from '@/public/img/AI-AWARE-LOGO-WEBSITE-1.png';

export default function Navbar(){
  const router = useRouter();
  console.log(logo); // /logo.84287d09.png
  return (
    <div className="row">
      <nav 
        className="navbar navbar-expand-lg navbar-light" 
        style={{"background-image": "linear-gradient(to right, rgb(0,0,0), rgb(0, 49, 102))"}}
      >
        <div className="container-fluid">
          {/* <h3 className="black-link" >HappyAI Analysis v0.0.2</h3> */}
          <Image src={logo} alt="Logo"/>
        </div>
      </nav>
    </div>
  )
}
