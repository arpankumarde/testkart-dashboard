import api from "@/lib/api";
import getToken from "@/lib/getToken";

interface TestSeries {
  title: string;
  price: number;
  is_paid: number;
}

interface PurchaseData {
  test_series_id: number;
  purchase_time: string;
  test_sery: TestSeries;
}

interface ApiResponse {
  success: boolean;
  data: PurchaseData[];
}

const Page = async ({
  params,
}: {
  params: Promise<{ student_id: number }>;
}) => {
  try {
    const { student_id } = await params;
    const { data }: { data: ApiResponse } = await api.get(
      `/api/v1/studio/academy/student-report/${student_id}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    return (
      <div>
        <h1 className="text-2xl">Student Details</h1>

        <div>
          <table>
            <thead>
              <tr>
                <th>Test Series</th>
                <th>Price</th>
                <th>Purchase Time</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((purchase, index) => (
                <tr key={index}>
                  <td>{purchase.test_sery.title}</td>
                  <td>{purchase.test_sery.price}</td>
                  <td>{purchase.purchase_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Failed to load student data</div>;
  }
};

export default Page;
