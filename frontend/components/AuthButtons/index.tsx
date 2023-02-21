import classNames from 'classnames';
import Link from 'next/link';
import { checkCredentials } from '../../utils/checkCredentials';
import styles from './index.module.scss';

export const AuthButtons = () => {
  return (
    <div className={styles.authButtons}>
      {checkCredentials() ? (
        <span className={classNames(styles.userProfileButton, styles.disable)}>
          username
        </span>
      ) : (
        <>
          <Link href="/auth/signin" className={styles.logInButton}>
            Sign In
          </Link>
          <Link href="/auth/signup" className={styles.buttonPrimary}>
            Register
          </Link>
        </>
      )}
    </div>
  );
};
