import styles from "@/app/page.module.css";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <main className={styles.main}>
        <div className={styles.description}>About</div>
        <span>This page will provide information about HappyAI.</span>
      </main>
      <Footer />
    </>
  );
}
