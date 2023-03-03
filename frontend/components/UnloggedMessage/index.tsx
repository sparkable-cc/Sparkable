import styles from "./index.module.scss";
import Link from "next/link";

export const UnloggedMessage = () => {
  return (
    <div className={styles.unloggedWrapper}>
      You have to be logged in to continue
      <div className={styles.buttonsWrapper}>
        <Link className={styles.signInButton} href="/auth/signin">Sign In</Link>
        <Link className={styles.buttonPrimary} href="/auth/signup">Register</Link>
      </div>
    </div>
  );
};
