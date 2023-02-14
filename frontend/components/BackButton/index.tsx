import { PropsWithChildren } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

interface Props extends PropsWithChildren {
  directPath?: string
}

export const BackButton = ({ children, directPath }: Props) => {
  const router = useRouter();

  const onClick = () => {
    if(directPath) {
      router.push(directPath);
    } else {
      router.back();
    }
  };

  return (
    <button className={styles.backButton} onClick={onClick}>
      {children}
    </button>
  );
};
