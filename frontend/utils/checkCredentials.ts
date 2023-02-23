import dayjs from "dayjs"

export const checkCredentials = () => {

  if(typeof window === "undefined" || !(window as any)?.sessionStorage){
    return false;
  }
  
  const token = sessionStorage.getItem("token");
  const tokenExpires = sessionStorage.getItem("token-expires");

  if (!token) return false;

  if(dayjs().isAfter(dayjs(tokenExpires))){
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