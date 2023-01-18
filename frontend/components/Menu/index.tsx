import styles from "./index.module.scss";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/svg/logo.svg";
import classNames from "classnames";

export const Menu = () => {
  return (
    <aside className={styles.menuWrapper}>
      <Link href="/" className={styles.logo}>
        <Image
          src={logo}
          alt="Sparkable logo"
        />
      </Link>
      <nav className={""}>
        <Link
          href="/#explore"
          scroll={false}
          className={styles.menuItem}>
          Explore
        </Link>
        <Link
          href=""
          className={classNames(styles.menuItem, styles.disable)}>
          Submit
        </Link>
        <Link
          href="/about"
          className={styles.menuItem}>
          About
        </Link>
      </nav>
      <footer className={styles.menuFooter}>
        <Link 
          href=""
          className={classNames(styles.menuFooterLink, styles.disable)}>
          Contact 
        </Link>
        <Link 
          href=""
          className={classNames(styles.menuFooterLink, styles.disable)}>
          Privacy Policy
        </Link>
      </footer>
    </aside>
  )
}