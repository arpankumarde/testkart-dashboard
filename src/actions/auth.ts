"use server";

import api from "@/lib/api";

interface Academy {
  academy_id: number;
  academy_name: string;
  display_name: string;
  slug: string;
  logo: string;
  contact_email: string;
  website: string;
  contact_phone: string;
  about: string;
  yt: string;
  fb: string;
  ig: string;
  tw: string;
  tg: string;
  wp: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  teacher_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  roles: string[];
  academy: Academy;
}

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    type: "TEACHER";
    token: string;
    user: User;
  };
};

export interface SignupPayload {
  academy_name: string;
  academy_email: string;
  academy_phone: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

interface SignupResponse {
  success: boolean;
  data: object;
}

export async function login(payload: { email: string; password: string }) {
  try {
    const { data }: { data: AuthResponse } = await api.post(
      "/api/v1/auth/login",
      {
        email: payload?.email,
        password: payload?.password,
        type: "TEACHER",
      }
    );

    return { data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function signup(payload: SignupPayload) {
  try {
    const { data }: { data: SignupResponse } = await api.post(
      "/api/v1/studio/academy/register",
      payload
    );

    return { data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function verifyTeacher(payload: { email: string; code: string }) {
  try {
    const { data }: { data: SignupResponse } = await api.post(
      "/api/v1/studio/academy/verify-email",
      payload
    );

    return { data };
  } catch (error) {
    console.error(error);
    return { error };
  }
}
