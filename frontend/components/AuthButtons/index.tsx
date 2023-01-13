import styles from "./index.module.scss";
import Link from "next/link";

export const AuthButtons = () => {
  return (
    <div>
      <Link href="/signin" className={styles.logInButton}>Log In</Link>
      <Link href="/signup" className={styles.buttonPrimary}>Sign Up</Link>
    </div>
  )
}