import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/svg/logo.svg";
import classNames from "classnames";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { selectIsMenuVisible, setMenuVisible } from "../../store/UIslice";
import { CSSTransition } from "react-transition-group";
import { useRef } from "react";
import { checkCredentials } from "../../utils/checkCredentials";
import { selectUserName } from "../../store/UIslice";
import Router from "next/router";

interface Props {
  isForcedMobile?: boolean
}

export const Menu = ({ isForcedMobile }: Props) => {
  const isVisible = useAppSelector(selectIsMenuVisible);
  const userName = useAppSelector(selectUserName);
  const [ isAuth, setAuth ] = useState(false);
  const dispatch = useAppDispatch();
  const nodeRef = useRef(null);

  const onSignOut = () => {
    sessionStorage.clear();
    Router.reload();
  };

  useEffect(() => {
    setAuth(checkCredentials());
  }, [userName]);

  const onMenuHide = () => {
    dispatch(setMenuVisible(false));
  };

  return (
    <CSSTransition
      nodeRef={nodeRef} in={isVisible} timeout={400} classNames={{
        enterActive: styles.enterActive,
        enterDone: styles.enterDone,
        exitActive: styles.exitActive,
        exitDone: styles.exitDone,
      }}
    >
      <aside ref={nodeRef} className={classNames(styles.menuWrapper, { [styles.forcedMobile]: isForcedMobile })}>
        <div className={styles.logoWrapper}>
          <button className={styles.closeButton} onClick={onMenuHide} />
          <Link href="/" className={styles.logo} onClick={onMenuHide}>
            <Image
              src={logo}
              alt="Sparkable logo"
            />
          </Link>
        </div>
        <nav className="">
          <Link
            href="/#explore"
            scroll={false}
            onClick={onMenuHide}
            className={styles.menuItem}
          >
            Explore
          </Link>
          <Link
            href="/submission/create"
            onClick={onMenuHide}
            className={classNames(styles.menuItem)}
          >
            Submit
          </Link>
          <Link
            onClick={onMenuHide}
            href="/about"
            className={styles.menuItem}
          >
            About
          </Link>
          <span className={styles.authButton}>
            {isAuth ?
              <button
                className={styles.buttonOutlined}
                onClick={onSignOut}
              >
                Sign out
              </button> :
              <Link
                href="/auth/signin"
                onClick={onMenuHide}
                className={classNames(styles.buttonPrimary, styles.sizeXl)}
              >
                Sign In
              </Link>
            }
          </span>
        </nav>
        <footer className={styles.menuFooter}>
          <Link
            href=""
            onClick={onMenuHide}
            className={classNames(styles.menuFooterLink, styles.disable)}
          >
            Contact
          </Link>
          <Link
            href="/legal/privacy-policy"
            onClick={onMenuHide}
            className={classNames(styles.menuFooterLink)}
          >
            Privacy Policy
          </Link>
        </footer>
      </aside>
    </CSSTransition>
  );
};
