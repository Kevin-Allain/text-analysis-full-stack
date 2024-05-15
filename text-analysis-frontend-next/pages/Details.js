import styles from "@/app/page.module.css";

export default function Details() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>Details</div>
      <span>This page will provide details about our products.</span>
      <hr/>
      Hosted on Docker.
    </main>
  );
}
