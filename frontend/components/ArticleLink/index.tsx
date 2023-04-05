import styles from "./index.module.scss";
import React from "react";
import { useLazyPostViewedLinkByUserDataQuery } from "../../store/api/trackingApi";
import { storageKeys } from "../../utils/storageKeys";

interface Props {
  link: string;
  uuid?: string;
}

export const ArticleLink = ({ link, uuid }: Props) => {
  const [triggerPostViewedLinkByUserData] = useLazyPostViewedLinkByUserDataQuery();

  const onLinkTrack = () => {
    const userUuid = sessionStorage.getItem(storageKeys.userId);

    if (!userUuid || !uuid) return;

    const data = {
      userUuid,
      linkUuid: uuid
    };

    triggerPostViewedLinkByUserData(data);
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
