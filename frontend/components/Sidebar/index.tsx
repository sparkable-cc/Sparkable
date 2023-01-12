import styles from "./index.module.scss";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/svg/logo.svg";

export const Sidebar = () => {
  return (
    <aside className={styles.sidebarWrapper}>
      <Link href="/" className={styles.logo}>
        <Image
          src={logo}
          alt="Sparkable logo"
        />
      </Link>
      <nav className={styles.menuWrapper}>
        <Link
          href=""
          className={styles.menuItem}>
          Explore
        </Link>
        <Link
          href=""
          className={styles.menuItem}>
          Submit
        </Link>
        <Link
          href=""
          className={styles.menuItem}>
          About
        </Link>
      </nav>
      <footer className={styles.sidebarFooter}>
        <Link 
          href=""
          className={styles.sidebarFooterLink}>
          Contact 
        </Link>
        <Link 
          href=""
          className={styles.sidebarFooterLink}>
          Privacy Policy
        </Link>
      </footer>
    </aside>
  )
}