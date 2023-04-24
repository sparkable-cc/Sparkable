import classNames from "classnames";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import logo from "../../public/svg/logo.svg";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { AuthButtons } from "../AuthButtons";
import { ActiveLink } from "../ActiveLink";
import {
  selectIsMenuVisible,
  selectUserName,
  setMenuVisible,
} from "../../store/UIslice";
import { checkCredentials } from "../../utils/checkCredentials";
import { SubmitLink } from "../SubmitLink";
import styles from "./index.module.scss";

interface Props {
  isForcedMobile?: boolean;
}

export const Menu = ({ isForcedMobile }: Props) => {
  const isVisible = useAppSelector(selectIsMenuVisible);
  const userName = useAppSelector(selectUserName);
  const [ isAuth, setAuth ] = useState(false);
  const dispatch = useAppDispatch();
  const nodeRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    setAuth(checkCredentials());
  }, [userName]);

  const onMenuHide = () => {
    dispatch(setMenuVisible(false));
  };

  return (
    <>
      <CSSTransition
        nodeRef={nodeRef}
        in={isVisible}
        timeout={400}
        classNames={{
          enterActive: styles.enterActive,
          enterDone: styles.enterDone,
          exitActive: styles.exitActive,
          exitDone: styles.exitDone,
        }}
      >
        <aside
          ref={nodeRef}
          className={classNames(styles.menuWrapper, {
            [styles.forcedMobile]: isForcedMobile,
          })}
        >
          <div className={styles.logoWrapper}>
            <button className={styles.closeButton} onClick={onMenuHide} />
            <Link href="/" className={styles.logo} onClick={onMenuHide}>
              <Image src={logo} alt="Sparkable logo" />
            </Link>
          </div>
          <nav className={styles.menu}>
            <ActiveLink
              href="/#explore"
              scroll={false}
              activeClassName={styles.active}
              onClick={onMenuHide}
              className={classNames(styles.menuItem, styles.explore)}
            >
              Explore
            </ActiveLink>
            <ActiveLink
              onClick={onMenuHide}
              activeClassName={styles.active}
              href="/about"
              className={classNames(styles.menuItem, styles.about)}
            >
              About
            </ActiveLink>
            {/* TEMPORARY HIDEN */}
            {/* {
              isAuth &&
              <>
                <div className={styles.menuSeparator}></div>
                <ActiveLink
                  onClick={onMenuHide}
                  activeClassName={styles.active}
                  href="/submissions"
                  className={classNames(styles.menuItem, styles.submissions)}
                >
                  My Submissions
                </ActiveLink>
                <ActiveLink
                  onClick={onMenuHide}
                  activeClassName={styles.active}
                  href="/bookmarks"
                  className={classNames(styles.menuItem, styles.bookmarks)}
                >
                  My Bookmarks
                </ActiveLink>
                <ActiveLink
                  onClick={onMenuHide}
                  activeClassName={styles.active}
                  href="/votings"
                  className={classNames(styles.menuItem, styles.votings)}
                >
                  My Votings
                </ActiveLink>
              </>
            } */}

          </nav>
          <footer className={styles.menuFooter}>
            <SubmitLink />
            <div className={styles.authButtonsWrapper}>
              <AuthButtons />
            </div>
            <Link
              href="/legal/privacy-policy#footer"
              onClick={onMenuHide}
              className={classNames(styles.menuFooterLink)}
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
      <CSSTransition
        nodeRef={overlayRef}
        in={isVisible}
        timeout={400}
        classNames={{
          enterActive: styles.enterActive,
          enterDone: styles.enterDone,
          exitActive: styles.exitActive,
          exitDone: styles.exitDone,
        }}
      >
        <div ref={overlayRef} onClick={onMenuHide} className={styles.overlay} />
      </CSSTransition>
    </>
  );
};
