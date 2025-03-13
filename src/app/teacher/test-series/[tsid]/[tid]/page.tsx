import api from "@/lib/api";
import getToken from "@/lib/getToken";
import Panel from "./Panel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { revalidatePath } from "next/cache";

interface Subject {
  label: string;
  subject_id: number;
  inclued: boolean;
  total_questions: number;
  question_count: number;
}

interface Exam {
  exam_id: number;
  exam: string;
  default_pattern: string;
}

interface TestSeries {
  title: string;
  exam: Exam;
}

interface Test {
  test_id: number;
  test_series_id: number;
  academy_id: number;
  title: string;
  duration: number;
  subjects: Subject[];
  status: number;
  is_deleted: number;
  scheduled_on: string;
  is_scheduled: number;
  is_paid: number;
  createdAt: string;
  updatedAt: string;
  test_sery: TestSeries;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Test[];
}

const Page = async ({
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

    // console.log(data);

    return (
      <div>
        <div className="flex justify-between items-center">
          <h1>{data?.data[0]?.title}</h1>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Rename</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form
                action={async (e) => {
                  "use server";

                  const formData = Object.fromEntries(e.entries());
                  const newTestName = formData["new_test_name"] as string;
                  console.log(newTestName);

                  try {
                    const response = await api.put(
                      `/api/v1/test-series/test/${tid}`,
                      {
                        title: newTestName,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${await getToken()}`,
                        },
                      }
                    );

                    if (response?.data?.success) {
                      console.log("Test renamed successfully");
                      revalidatePath(`/teacher/test-series/${tsid}/${tid}`);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <DialogHeader>
                  <DialogTitle>Rename Test</DialogTitle>
                  <DialogDescription hidden>Rename Test</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Label htmlFor="new_test_name">New Test Name</Label>
                  <Input
                    id="new_test_name"
                    name="new_test_name"
                    defaultValue={data?.data[0]?.title}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit">Save changes</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          Test Series ID: {tsid}, Test ID: {tid}
          <br />
          <h2>Subjects</h2>
          <p>
            {subjects.map((subject) => (
              <span key={subject.subject_id}>
                {subject.label} ({subject.question_count} /{" "}
                {subject.total_questions}),{" "}
              </span>
            ))}
          </p>
        </div>
        <div>
          <Panel test={data?.data[0]} />
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Failed to fetch questions</div>;
  }
};

export default Page;
