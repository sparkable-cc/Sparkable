import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { Menu } from "../../components/Menu";
import { MobileHeader } from "../../components/MobileHeader";
import { AuthButtons } from '../../components/AuthButtons';
import { useRouter } from 'next/router';
import { Footer } from '../../components/Footer';

export const MainLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  if (/auth/.test(router.route)) {
    return (
      <main className={styles.mainWrapper}>
        <Menu />
        <MobileHeader />
        {children}
      </main>
    )
  }

  if (/article/.test(router.route)) {
    return (
      <main className={styles.mainWrapper}>
        <Menu isForcedMobile={true} />
        <MobileHeader isForcedMobile={true} />
        {children}
      </main>
    )
  }
  
  if (/submission\/create/.test(router.route)) {
    return (
      <main className={styles.mainWrapper}>
        <Menu isForcedMobile={true} />
        <MobileHeader isForcedMobile={true} />
        <AuthButtons />
        {children}
      </main>
    )
  }
  
  if (/legal|about/.test(router.route)) {
    return (
      <main className={styles.mainWrapper}>
        <Menu isForcedMobile={true} />
        <MobileHeader isForcedMobile={true} />
        <AuthButtons />
        {children}
        <Footer/>
      </main>
    )
  }

  else {
    return (
      <main className={styles.mainWrapper}>
        <Menu />
        <MobileHeader />
        <AuthButtons />
        {children}
      </main>
    )
  }
}