import styles from "./index.module.scss";
import React from "react";
import { useLazyPostViewedLinkByUserDataQuery } from "../../store/api/trackingApi";
import { toast } from "react-toastify";
import { storageKeys } from "../../utils/storageKeys";

interface Props {
  link: string;
  uuid: string;
}

export const ArticleLink = ({ link, uuid }: Props) => {
  const [triggerPostViewedLinkByUserData, { isLoading, data }] = useLazyPostViewedLinkByUserDataQuery();

  const onClick = () => {
    const userUuid = sessionStorage.getItem(storageKeys.userId);
    if (!userUuid) return;

    try {
      const data = {
        userUuid,
        linkUuid: uuid
      };

      triggerPostViewedLinkByUserData(data).then((res: any) => {
        if (res?.error) {
          console.log('res', res)
          toast.error(res?.error?.data?.message);
        }
      });

    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={link}
      onClick={onClick}
      className={styles.articleLink}
    >
      {link}
    </a>
  );
};
