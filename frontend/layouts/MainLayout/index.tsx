import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { Menu } from "../../components/Menu";
import { MobileHeader } from "../../components/MobileHeader";
import { AuthButtons } from '../../components/AuthButtons';
import { useRouter } from 'next/router';

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
  
  if (/submission\/create|about/.test(router.route)) {
    return (
      <main className={styles.mainWrapper}>
        <Menu isForcedMobile={true} />
        <MobileHeader isForcedMobile={true} />
        <AuthButtons />
        {children}
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