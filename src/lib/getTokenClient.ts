import { getCookie } from "cookies-next/client";

const getTokenClient = () => {
  return getCookie("tktoken");
};

export default getTokenClient;
