import { PropsWithChildren } from "react";
import styles from "./index.module.scss";

interface Props extends PropsWithChildren {
  onCancel?: () => void
}

export const CancelButton = ({ children, onCancel }: Props) => {

  return (
    <button className={styles.cancelButton} onClick={onCancel}>
      {children}
    </button>
  );
};
