import styles from "./index.module.scss";
import Link from "next/link";
import logo from "../../public/svg/logo.svg";
import Image from "next/image";
import { useAppDispatch } from "../../store/hooks";
import { setMenuVisible } from "../../store/UIslice";

export const MobileHeader = () => {
  const dispatch = useAppDispatch();

  const onMenuShow = () => {
    dispatch(setMenuVisible(true));
  };

  return (
    <header className={styles.mobileHeaderWrapper}>
      <div className={styles.logoWrapper}>
        <button className={styles.hamburger} onClick={onMenuShow} />
        <Link href="/" className={styles.logoLink}>
          <Image
            className={styles.logo}
            src={logo}
            alt="Sparkable logo"
          />
        </Link>
      </div>
      <Link href="/auth/signup" className={styles.buttonPrimary}>Join now</Link>
    </header>
  );
};
