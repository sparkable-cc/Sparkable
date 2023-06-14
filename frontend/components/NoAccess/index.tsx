import styles from "./index.module.scss";
import Link from "next/link";
import { BackButton } from "../BackButton";

export const NoAccess = () => {
  return (
    <section className={styles.noAccessWrapper}>
      <div className={styles.noAccessMessage}>Sorry, you don't have access.</div>
      <div className={styles.buttonWrapper}>
        <BackButton>Go back</BackButton>
        <span>or</span>
        <Link className={styles.buttonPrimary} href="/auth/signin">SignIn</Link>
      </div>
    </section>
  );
};
