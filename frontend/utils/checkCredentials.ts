import dayjs from "dayjs"
import { quotesClear } from "../utils/quotesClear";
import { storageKeys } from "./storageKeys";

export const checkCredentials = () => {

  if(typeof window === "undefined" || !(window as any)?.sessionStorage){
    return false;
  }
  
  const token = sessionStorage.getItem(storageKeys.token);
  const tokenExpires = sessionStorage.getItem(storageKeys.tokenExpires);

  if (!token || !tokenExpires) return false;

  if(dayjs().isAfter(dayjs(quotesClear(tokenExpires!)))){
    sessionStorage.clear();
    return false;
  }

  else return true;
}


/*
NOTE: to every protected page need to add props: { protected: true }

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  }
}
*/