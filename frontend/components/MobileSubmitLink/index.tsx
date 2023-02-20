import styles from "./index.module.scss";
import Link from "next/link";

export const MobileSubmitLink = () => {
  return (
    <div className={styles.submitLinkMobile}>
      <div className={styles.submitText}>
        What is the most <strong>insightful</strong> piece of content you have encountered recently?
      </div>
      <Link className={styles.submitButton} href="/submission/create">Submit a Link</Link>
    </div>
  )
}