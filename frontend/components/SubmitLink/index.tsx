import styles from "./index.module.scss";
import Link from "next/link";

export const SubmitLink = () => (
  <div className={styles.submitLinkWrapper}>
    <div className={styles.submitLinkText}>
      What is the most insightful piece of content you have encountered recently?
    </div>
    <Link className={styles.buttonPrimary} href="/submission/create">Submit a link</Link>
  </div>
);
