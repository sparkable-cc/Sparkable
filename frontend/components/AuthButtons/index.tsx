import styles from "./index.module.scss";
import Link from "next/link";

interface Props {
  isHidden?: boolean;
}

export const AuthButtons = ({ isHidden }: Props) => {
  if (isHidden) return null;

  return (
    <div className={styles.authButtons}>
      <Link href="/auth/signin" className={styles.logInButton}>Sign In</Link>
      <Link href="/auth/signup" className={styles.buttonPrimary}>Join Now</Link>
    </div>
  );
};
