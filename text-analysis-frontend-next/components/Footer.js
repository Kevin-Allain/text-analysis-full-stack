import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer d-flex justify-content-around mt-auto py-3 bg-light">
        <Link className="text-dark" href="/Details">Details</Link>
        <Link className="text-dark" href="/About">About Us</Link>
    </footer>
  );
}
