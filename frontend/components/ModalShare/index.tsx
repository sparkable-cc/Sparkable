import { ModalLayout } from "../../layouts/ModalLayout";
import styles from "./index.module.scss";

interface Props {
  isVisible: boolean
  textLink: string
  onCancel: () => void;
}

export const ModalShare = ({ onCancel, isVisible, textLink }: Props) => {

  const onCopy = () => {
    navigator.clipboard.writeText(textLink);
    setTimeout(() => {
      onCancel();
    }, 100);
  };

  const url = new URL(textLink);

  return (
    <ModalLayout title="Share" onCancel={onCancel} isVisible={isVisible}>
      <section className={styles.contentWrapper}>
        <div className={styles.copyString}>
          {url?.hostname || textLink}
        </div>
        <button className={styles.copyButton} onClick={onCopy}>Copy</button>
      </section>
    </ModalLayout>
  );

};
