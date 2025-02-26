"use server";

import api from "@/lib/api";
import getToken from "@/lib/getToken";

interface Payload {
  academy_id: number;
  academy_name: string;
  display_name: string;
  slug: string;
  logo: string | null;
  contact_email: string;
  website: string | null;
  contact_phone: string;
  about: string | null;
  yt: string | null;
  fb: string | null;
  ig: string | null;
  tw: string | null;
  tg: string | null;
  wp: string | null;
}

interface ApiResponse {
  success: boolean;
  data: {};
}

export async function updateAcademy(payload: Payload) {
  try {
    const { data }: { data: ApiResponse } = await api.post(
      `/api/v1/studio/academy/${payload?.academy_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    console.log(data);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}
