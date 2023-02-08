
export const checkCredentials = () => {
  const token = sessionStorage.getItem("token");
  const tokenExpires = sessionStorage.getItem("token-expires");

  if (!token) return false;

  // TO-DO:
  // check is token does not expire and clear if so
  
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