import { PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { Menu } from "../../components/Menu";
import { MobileHeader } from "../../components/MobileHeader";
import { AuthButtons } from '../../components/AuthButtons';
import { useRouter } from 'next/router'

export const MainLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  const hideAuthButtons = () => {
    return router.route.includes('auth');
  }

  return (
    <main className={styles.mainWrapper}>
      <Menu />
      <MobileHeader />
      <AuthButtons isHidden={hideAuthButtons()} />
      {children}
    </main>
  )
}