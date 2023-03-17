import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { Menu } from "../../components/Menu";
import { useRouter } from 'next/router';
import { Footer } from '../../components/Footer';
import { TopBar } from '../../components/TopBar';

export const MainLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  if (/auth/.test(router.route)) {
    return (
      <>
        <TopBar isShortVoitingBanner={true} />
        <main className={styles.mainWrapper}>
          <Menu />
          {children}
        </main>
      </>
    )
  }

  if (/article/.test(router.route)) {
    return (
      <>
        <TopBar isForcedMobile />
        <main className={styles.mainWrapper}>
          <Menu isForcedMobile={true} />
          {children}
        </main>
      </>
    )
  }

  if (/submission\/create/.test(router.route)) {
    return (
      <>
        <TopBar isForcedMobile isAuthButtonsVisible />
        <main className={styles.mainWrapper}>
          <Menu isForcedMobile={true} />
          {children}
        </main>
      </>
    )
  }

  if (/legal|about/.test(router.route)) {
    return (
      <>
        <TopBar isForcedMobile={true} isAuthButtonsVisible={true} />
        <main className={styles.mainWrapper}>
          <Menu isForcedMobile={true} />
          {children}
          <Footer />
        </main>
      </>
    )
  }

  else {
    return (
      <>
        <TopBar isAuthButtonsVisible={true} isShortVoitingBanner={true} />
        <main className={styles.mainWrapper}>
          <Menu />
          {children}
        </main>
      </>
    )
  }
}