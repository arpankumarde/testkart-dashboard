import getToken from "@/lib/getToken";
import { ApiResponse } from "../page";
import api from "@/lib/api";
import Importer from "./_components/Importer";
import { Separator } from "@/components/ui/separator";

const page = async ({
  params,
}: {
  params: Promise<{ tsid: string; tid: string }>;
}) => {
  try {
    const { tsid, tid } = await params;

    if (!tsid || !tid) {
      return <div>Error: Missing Test Series ID or Test ID</div>;
    }

    const { data }: { data: ApiResponse } = await api.get(
      `/api/v1/test-series/test/${tid}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      }
    );

    const subjects = data.data[0].subjects.filter((s) => s.inclued);

    console.log(subjects);

    return (
      <div className="p-2 md:p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Import Questions for:{" "}
          <span className="text-primary">{data?.data[0]?.title}</span>
        </h1>

        <div className="text-muted-foreground">
          <span className="font-medium mr-2">Test Series ID:</span>
          {tsid}
        </div>
        <div className="text-muted-foreground">
          <span className="font-medium mr-2">Test ID:</span>
          {tid}
        </div>

        <Separator className="border-1 border-primary my-4" />

        <Importer subjects={subjects} tsid={Number(tsid)} tid={Number(tid)} />
      </div>
    );
  } catch (error) {
    return <div>Failed to fetch subjects. Try again later.</div>;
  }
};

export default page;
