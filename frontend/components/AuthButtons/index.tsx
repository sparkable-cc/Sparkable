import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./index.module.scss";
import { checkCredentials } from "../../utils/checkCredentials";
import { selectUserName } from "../../store/UIslice";
import { useAppSelector } from "../../store/hooks";
import Router from "next/router";
import classNames from "classnames";

export const AuthButtons = () => {
  const [ isAuth, setAuth ] = useState(false);
  const userName = useAppSelector(selectUserName);
  const nodeRef = useRef(null);

  const onSignOut = () => {
    sessionStorage.clear();
    Router.reload();
  };

  useEffect(() => {
    setAuth(checkCredentials());
  }, [userName]);

  return (
    <div className={styles.authButtons}>
      {isAuth ? (
        <div className={styles.buttonsWrapper} ref={nodeRef}>
          <span className={styles.userName}>
            {userName}
          </span>
          <button
            className={classNames(styles.buttonSecondary, styles.signOutDesktop)}
            onClick={onSignOut}
          >
            Sign out
          </button>
        </div>
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
