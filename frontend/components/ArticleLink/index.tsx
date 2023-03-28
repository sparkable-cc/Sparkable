import styles from "./index.module.scss";
import React from "react";
import { useLinkTracker } from "../../utils/useLinkTracker";

interface Props {
  link: string;
  uuid?: string;
}

export const ArticleLink = ({ link, uuid }: Props) => {
  const onLinkTrack = () => {
    if (!uuid) return;
    useLinkTracker(uuid);
  };

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={link}
      onClick={onLinkTrack}
      className={styles.articleLink}
    >
      {link}
    </a>
  );
};
