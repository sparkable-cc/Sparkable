import { useState } from "react";
import { ModalLayout } from "../../layouts/ModalLayout";
import styles from "./index.module.scss";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title: string
}

export const ModalNote = ({ title, children }: Props) => {
  const [isVisible, setVisible] = useState(false);
  return (
    <>
      <span className={styles.noteIcon} onClick={() => setVisible(!isVisible)} />
      <ModalLayout
        title={title}
        withTitleIcon={true}
        cancelButtonLabel="Close"
        onCancel={() => setVisible(false)}
        isVisible={isVisible}>
        {children}
      </ModalLayout>
    </>
  )
}