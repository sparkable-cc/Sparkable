import styles from "./index.module.scss";
import Link from "next/link";
import logo from "../../public/svg/logo.svg";
import Image from "next/image";

export const MobileHeader = () => {
  return (
    <header className={styles.mobileHeaderWrapper}>
      <div className={styles.logoWrapper}>
        <button className={styles.hamburger}></button>
        <Link href="/" className={styles.logoLink}>
          <Image
            className={styles.logo}
            src={logo}
            alt="Sparkable logo"
          />
        </Link>
      </div>
      <Link href="/signup" className={styles.buttonPrimary}>Join now</Link>
    </header>
  )
}
