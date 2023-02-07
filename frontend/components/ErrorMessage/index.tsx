
import { PropsWithChildren } from "react";
import styles from './index.module.scss';

export const ErrorMessage = ({ children }: PropsWithChildren) => (
  <div className={styles.errorMessage}>
    {children}
  </div>
)