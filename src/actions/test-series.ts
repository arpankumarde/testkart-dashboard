"use server";

import api from "@/lib/api";
import getToken from "@/lib/getToken";
import { revalidatePath } from "next/cache";

export async function createTestSeries(payload: {
  title: string;
  description: string;
  language: string;
  exam_id: number;
  academy_id: number;
  difficulty_level: string;
  is_paid: number;
  price_before_discount: number;
  discount: number;
  price: number;
  discountType: string;
}) {
  try {
    const {
      data,
    }: {
      data: {
        success: boolean;
        data: {
          hash: string;
          status: number;
          is_purchased: number;
          is_deleted: number;
          test_series_id: number;
          title: string;
          description: string;
          language: string;
          exam_id: string;
          academy_id: number;
          difficulty_level: string;
          is_paid: number;
          price_before_discount: number;
          discount: number;
          price: number;
          discountType: string;
          updatedAt: string;
          createdAt: string;
        };
      };
    } = await api.post("/api/v1/test-series", payload, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    revalidatePath("/teacher/test-series");

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function editTestSeries(
  payload: {
    title: string;
    description: string;
    language: string;
    academy_id: number;
    difficulty_level: string;
    is_paid: number;
    price_before_discount: number;
    discount: number;
    price: number;
    discountType: string;
  },
  test_series_id: number
) {
  try {
    const {
      data,
    }: {
      data: {
        success: boolean;
        data: {
          hash: string;
          status: number;
          is_purchased: number;
          is_deleted: number;
          test_series_id: number;
          title: string;
          description: string;
          language: string;
          exam_id: string;
          academy_id: number;
          difficulty_level: string;
          is_paid: number;
          price_before_discount: number;
          discount: number;
          price: number;
          discountType: string;
          updatedAt: string;
          createdAt: string;
        };
      };
    } = await api.put(`/api/v1/test-series/${test_series_id}`, payload, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    revalidatePath("/teacher/test-series");

    return { success: true, data };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function deleteTestSeries(tsid: number) {
  try {
    const res = await api.delete(`/api/v1/test-series/${tsid}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    console.log(res.data);

    revalidatePath("/teacher/test-series");
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}
