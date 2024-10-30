import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { PiStudentFill } from "react-icons/pi";
import { BiLoaderAlt } from "react-icons/bi";

const Students = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [studentReport, setStudentReport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!user) return navigate("/login");

    server
      .get("/api/v1/studio/academy/student-report")
      .then((res) => {
        setStudentReport(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 flex-1">
          <h2 className="text-xl flex items-center gap-2">
            <i className="p-2">
              <PiStudentFill size={20} />
            </i>
            <span>Students</span>
          </h2>
          <hr className="my-4" />
          <div className="h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-14rem-0.6rem)] overflow-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white border-b">
                <tr className="text-center">
                  <th className="px-4 py-2">#</th>
                  <th className="px-4 py-2">Student ID</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Test Series Bought</th>
                  <th className="px-4 py-2">Amount Spent</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {studentReport.length != 0 ? (
                  studentReport.map((student, index) => (
                    <tr className="text-center border-b" key={index}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(`/students/${student.student_id}`)
                        }
                      >
                        {student.student_id ? student.student_id : "NA"}
                      </td>
                      <td
                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                        onClick={() =>
                          navigate(`/students/${student.student_id}`)
                        }
                      >
                        {student.student_name
                          ? student.student_name
                          : "Untitled"}
                      </td>
                      <td className="px-4 py-2">
                        {student.test_series_purchased
                          ? student.test_series_purchased
                          : 0}
                      </td>
                      <td className="px-4 py-2">
                        {student.total_price ? student.total_price : 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="text-center">
                    <td colSpan={5} className="px-4 py-2">
                      {loading ? (
                        <>
                          <span>Loading Students</span>
                          {"  "}
                          <BiLoaderAlt
                            className="inline animate-spin"
                            size={20}
                          />
                        </>
                      ) : (
                        "No Students found"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Students;
