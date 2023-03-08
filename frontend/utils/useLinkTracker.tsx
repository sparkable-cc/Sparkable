import { useLazyPostViewedLinkByUserDataQuery } from "../store/api/trackingApi";
import { storageKeys } from "../utils/storageKeys";

export const useLinkTracker = (uuid: string) => {
  const [triggerPostViewedLinkByUserData] = useLazyPostViewedLinkByUserDataQuery();

  return () => {
    const userUuid = sessionStorage.getItem(storageKeys.userId);

    if (!userUuid) return;

    try {
      const data = {
        userUuid,
        linkUuid: uuid
      };

      triggerPostViewedLinkByUserData(data).then((res: any) => {
        if (res?.error) {
          console.error('useLinkTracker hook: ', res?.error?.data?.message)
        }
      });

    } catch (error: any) {
      console.error('useLinkTracker hook: ', error?.message)
    }
  };
}
