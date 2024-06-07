import styles from "@/app/page.module.css";
import Footer from "@/components/Footer";

export default function Details() {
  return (
    <>
      <div>
        <div className={styles.description}>Details</div>
        <span>This page will provide details about our products.</span>
        <hr />
        Hosted on Docker.
      </div>
      <Footer />
    </>
  );
}
