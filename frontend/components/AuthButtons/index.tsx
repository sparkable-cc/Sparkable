import styles from "./index.module.scss";
import Link from "next/link";

export const AuthButtons = () => {
  return (
    <div className={styles.authButtons}>
      <Link href="/signin" className={styles.logInButton}>Sign In</Link>
      <Link href="/signup" className={styles.buttonPrimary}>Join Now</Link>
    </div>
  )
}