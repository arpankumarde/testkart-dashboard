"use server";

import api from "@/lib/api";
import getToken from "@/lib/getToken";
import { revalidatePath } from "next/cache";

export async function toggleFreeStatus(
  test_id: number,
  id_paid: boolean,
  test_series_id: number
) {
  try {
    await api.put(
      `/api/v1/test-series/test/${test_id}`,
      {
        id: test_id,
        is_paid: id_paid,
      },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );
    revalidatePath(`/teacher/test-series/${test_series_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function unscheduleTest(test_id: number, test_series_id: number) {
  try {
    await api.post(
      `/api/v1/test-series/test/unschedule-test`,
      {
        test_id: test_id,
      },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    revalidatePath(`/teacher/test-series/${test_series_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function scheduleTest(
  test_id: number,
  test_series_id: number,
  scheduled_on: string
) {
  try {
    await api.post(
      `/api/v1/test-series/test/schedule-test`,
      {
        test_id: test_id,
        scheduled_on: scheduled_on,
      },
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    revalidatePath(`/teacher/test-series/${test_series_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteTest(test_id: number, test_series_id: number) {
  try {
    await api.delete(`/api/v1/test-series/test/${test_id}`, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
      },
    });

    revalidatePath(`/teacher/test-series/${test_series_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
