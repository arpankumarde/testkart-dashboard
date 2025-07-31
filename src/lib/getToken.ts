import { getCookie } from "cookies-next";
import { cookies } from "next/headers";

const getToken = async () => {
  return await getCookie("tktoken", { cookies });
};

export default getToken;
