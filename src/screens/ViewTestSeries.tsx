import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Loader, Modal } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import {
  ADD_QUESTION,
  DELETE,
  EDIT_DETAILS,
  STATUS_CODE_BY_STATUS,
  TEST_SERIES_TYPE,
  VIEW_TESTS,
} from "../utils/constant";
import { getOptions } from "../utils/common";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { IoChevronBackOutline } from "react-icons/io5";

const ViewTestSeries = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState<string>("");
  const [tests, setTests] = useState([]);
  const [testDetails, setTestDetails] = useState({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modal, setModal] = useState("");
  const [modalContent, setIsModalContent] = useState({
    title: "",
    id: "",
  });
  const [isPublish, setIsPublish] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const [testData, setTestData] = useState({
    test_series_id: null,
    exam_id: null,
    academy_id: user?.academy?.academy_id,
    title: "",
    duration: 0,
    subjects: [],
  });

  const getAllTestsBySeriesid = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get(
        `/api/v1/test-series/test?series_id=${params.series_id}`
      );
      if (data) {
        setTests(data.data ?? []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnAccept = async () => {
    const payload = {
      test_series_id: testData.test_series_id,
      exam_id: testData.exam_id,
      academy_id: testData.academy_id,
      title: testData.title,
      duration: testData.duration,
      subjects: testData.subjects.map((subject) => {
        return {
          label: subject.subject,
          subject_id: subject.subject_id,
          inclued: subject.inclued,
          total_questions: subject.questions,
        };
      }),
    };
    setIsLoading(true);
    try {
      const { data } = await server.post(`/api/v1/test-series/test`, payload);
      if (data) {
        await getAllTestsBySeriesid();
        setModal("");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add test");
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubjectsArray = (prevSubjects, subjectId, updateFn) => {
    return prevSubjects.map((subject) =>
      subject.subject_id.toString() === subjectId ? updateFn(subject) : subject
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setTestData((prevTestData) => {
      if (type === "checkbox" && name.startsWith("inclued_")) {
        const subjectId = name.replace("inclued_", "");
        const updatedSubjects = updateSubjectsArray(
          prevTestData.subjects,
          subjectId,
          (subject) => ({ ...subject, inclued: checked })
        );

        return { ...prevTestData, subjects: updatedSubjects };
      }

      if (type === "number" && name.startsWith("total_questions_")) {
        const subjectId = name.replace("total_questions_", "");
        const updatedSubjects = updateSubjectsArray(
          prevTestData.subjects,
          subjectId,
          (subject) => ({ ...subject, questions: parseInt(value) })
        );

        return { ...prevTestData, subjects: updatedSubjects };
      }

      return { ...prevTestData, [name]: value };
    });
  };

  useEffect(() => {
    const getTestDetails = async () => {
      setIsLoading(true);
      try {
        const { data } = await server.get(
          `/api/v1/test-series/${params.series_id}`
        );
        if (data) {
          const updatedTestDetails = data.data.exam ?? {};
          setTitle(data.data.title);
          setIsLive(data?.data?.status === STATUS_CODE_BY_STATUS?.Live);
          setTestDetails(updatedTestDetails);
          setTestData((prevTestData) => ({
            ...prevTestData,
            exam_id: updatedTestDetails.exam_id || null,
            test_series_id: params?.series_id || null,
            duration: updatedTestDetails.default_pattern?.exam_duration || null,
            subjects: (updatedTestDetails.default_pattern?.subjects || []).map(
              (subject) => ({
                ...subject,
                inclued: true, // Set default value to true
              })
            ),
          }));
        }
        console.log("tests:", tests);
        console.log("testData", testData);
        console.log("testDetails:\n", testDetails);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch test details");
      } finally {
        setIsLoading(false);
      }
    };

    getTestDetails();
    getAllTestsBySeriesid();
  }, [params?.series_id]);

  const handleDropdownClick = (value: string, id: number, title: string) => {
    switch (value) {
      case EDIT_DETAILS: {
        return;
      }
      case DELETE: {
        setIsModalContent((prev) => ({ ...prev, title, id }));
        return setModal(DELETE);
      }
      case VIEW_TESTS: {
        return navigate(
          `/test-series/${params?.series_id}/test/${id}/questions`
        );
      }
      default: {
        return;
      }
    }
  };

  const deleteTestFromTestSeries = async (id: number) => {
    setIsLoading(true);
    try {
      await server.delete(`/api/v1/test-series/test/${id}`);
      setTests((prev) => prev.filter((item) => item.data.test_id !== id));
      setModal("");
    } catch (error) {
      toast.error("Failed to delete test");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tests.length) {
      const checkTestSeriesIsReadyForPublish = () => {
        const data = tests.find(
          (item) => item.meta.questions_count >= item.meta.total_questions
        );
        setIsPublish(!!data);
      };

      checkTestSeriesIsReadyForPublish();
    }
  }, [tests]);

  const toggleStatus = (id: number) => {
    setTests((prev) =>
      prev.map((test) => {
        if (test.data.test_id?.toString() === id?.toString()) {
          return {
            ...test,
            data: {
              ...test.data,
              is_paid: test.data.is_paid === 0 ? 1 : 0, // Toggle is_paid between 0 and 1
            },
          };
        }

        return test;
      })
    );
  };

  const handleFreeStatusChange = async (id: number) => {
    try {
      setIsLoading(true);
      const currentTest = tests.find(
        (item) => item.data.test_id?.toString() === id?.toString()
      );
      const { data } = await server.put(`api/v1/test-series/test/${id}`, {
        id: currentTest.data.test_id,
        is_paid: currentTest.data.is_paid === 0 ? 1 : 0,
      });
      if (data) {
        toggleStatus(id);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update test status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleStatusChange = async (id: number, value: string) => {
    // check if the date in value is at last 1 hour ahead from now
    if (new Date(value) < new Date(new Date().getTime() + 60 * 60 * 1000)) {
      toast.error("You can only schedule test at least 1 hour ahead from now");
      return;
    }

    try {
      setIsLoading(true);
      const currentTest = tests.find(
        (item) => item.data.test_id?.toString() === id?.toString()
      );
      const { data } = await server.post(
        `api/v1/test-series/test/schedule-test`,
        {
          test_id: currentTest?.data?.test_id,
          scheduled_on: value,
        }
      );
      if (data) {
        await getAllTestsBySeriesid();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule test");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnschedule = async (id: number) => {
    try {
      setIsLoading(true);
      const currentTest = tests.find(
        (item) => item?.data?.test_id?.toString() === id?.toString()
      );
      const { data } = await server.post(
        `api/v1/test-series/test/unschedule-test`,
        {
          test_id: currentTest.data.test_id,
        }
      );
      if (data) {
        await getAllTestsBySeriesid();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to unschedule test");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: string, hoursToAdd = 0) => {
    // if null return empty string
    if (!date) return "";

    let result = new Date(date);
    result.setHours(result.getHours() + hoursToAdd);

    // Convert date into this format: yyyy-MM-ddThh:mm
    return result.toISOString().slice(0, 16);
  };

  return (
    <section className="md:p-4 lg:p-8">
      {isLoading && <Loader />}
      <Modal
        title={`Exam: ${testDetails.exam}`}
        isModalOpen={modal === ADD_QUESTION}
        setIsModalOpen={setModal}
        className={""}
        onAccept={handleOnAccept}
        saveButtonDisable={!testData.title}
      >
        <div className="flex flex-col gap-3 px-4">
          <label className="flex flex-col gap-3 text-sm">
            Test Title
            <input
              className="p-2 border border-blue-400 text-sm"
              type="text"
              name="title"
              id="testTitle"
              placeholder="Enter test title"
              value={testData.title}
              onChange={(e) => handleChange(e)}
            />
          </label>
          <label className="flex flex-col gap-3 text-sm">
            Duration
            <div>
              <input
                className="p-2 border w-1/2 text-sm"
                type="number"
                name="duration"
                id="testDuration"
                value={testData.duration}
                placeholder="enter test duration"
                onChange={(e) => handleChange(e)}
              />
              <span className="ml-4">Minutes</span>
            </div>
          </label>
          <h1 className="text-xs">
            Duration must be in minutes. Maximum duration for this exam type is
            160
          </h1>
        </div>
        <div className="px-4">
          <h1 className="text-base">
            Select which subjects you wanted to be included in this test
          </h1>
          {testData?.subjects?.map((val) => {
            return (
              <div
                className="grid grid-cols-12 items-center gap-5 my-4"
                key={val.subject_id}
              >
                <input
                  className="col-span-1 w-6"
                  type="checkbox"
                  name={`inclued_${val.subject_id}`}
                  onChange={(e) => handleChange(e)}
                  checked={val.inclued}
                />
                <h1 className="font-bold col-span-5 text-sm">{val.subject}</h1>
                <input
                  className="p-2 border w-32 text-sm"
                  type="number"
                  name={`total_questions_${val.subject_id}`}
                  value={val.questions}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            );
          })}
        </div>
      </Modal>
      <Modal
        title="Are you sure?"
        isModalOpen={modal == DELETE}
        setIsModalOpen={setModal}
        isDelete={true}
        onAccept={() => deleteTestFromTestSeries(modalContent.id)}
      >
        <div className="flex justify-center items-center flex-col gap-2 ">
          <h1 className="text-lg font-medium leading-6">
            {modalContent.title}
          </h1>
          <p>Are you sure to delete this test?</p>
        </div>
      </Modal>

      <div className="flex items-center justify-between p-4 shadow-card bg-white flex-wrap gap-4">
        <div className="relative">
          <p className="flex gap-2 items-center justify-center">
            <Link
              to="/test-series"
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
            >
              <i>
                <IoChevronBackOutline size={20} />
              </i>
            </Link>
            <h1 className="font-medium text-lg">{title}</h1>
          </p>
        </div>
        <div className="flex gap-4 justify-center sm:justify-end flex-1">
          <button
            onClick={() => setModal(ADD_QUESTION)}
            className="px-4 py-2 whitespace-nowrap flex justify-center items-center text-white bg-[#6d45a4] rounded-lg"
          >
            Add new Test
          </button>
          {isPublish && !isLive && (
            <Link
              to={`/test-series/${params.series_id}/publish`}
              className="px-4 py-2 whitespace-nowrap flex justify-center items-center bg-green-500 hover:bg-green-600 text-white rounded-lg"
            >
              Publish new Test
            </Link>
          )}
        </div>
      </div>
      <div className="h-fit mobile:min-h-[calc(100dvh-4rem)] lg:h-[calc(100dvh-14rem-0.6rem)] bg-white overflow-auto px-4">
        <table className="table-auto w-full">
          <thead className="sticky top-0 left-0 bg-white z-10">
            <tr className="text-center [&>th]:py-4 [&>th]:px-2 [&>th]:font-medium">
              <th>#</th>
              <th className="min-w-36">Test Title</th>
              <th>Subjects</th>
              <th>Questions</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Free?</th>
              <th>Scheduled At</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {tests.map(
              (
                {
                  data: {
                    title,
                    duration,
                    status,
                    test_series_id,
                    test_id,
                    is_paid,
                    is_scheduled,
                    scheduled_on,
                  },
                  meta,
                },
                index
              ) => {
                console.log(is_scheduled, scheduled_on);
                return (
                  <tr
                    key={index}
                    className="text-center hover:bg-[#eff3f6] border-b border-b-[#e9ecef] [&>td]:py-[15px] [&>td]:px-2 relative"
                  >
                    <td> {index + 1}</td>
                    <td
                      className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/test-series/${test_series_id}/test/${test_id}/questions`
                        )
                      }
                    >
                      {title}
                    </td>
                    <td>{meta?.subjects}</td>
                    <td>{`${meta.questions_count}/${meta.total_questions} `}</td>
                    <td>{duration}</td>
                    {/* <td>
                    <span
                      className={`rounded-full px-4 py-1 text-green-500 cursor-pointer`}
                      onClick={() =>
                        navigate(
                          `/test-series/${test_series_id}/test/${test_id}/questions`
                        )
                      }
                    >
                      View Test
                    </span>
                  </td> */}
                    <td>
                      <span
                        className={`rounded-full px-4 py-1 text-white text-sm ${
                          meta.questions_count >= meta.total_questions
                            ? "bg-[#30d530]"
                            : "bg-[#545b62]"
                        }`}
                      >
                        {meta.questions_count >= meta.total_questions
                          ? "Complete"
                          : "Incomplete"}
                      </span>
                    </td>
                    <td className="text-center w-10">
                      <input
                        id="helper-checkbox"
                        aria-describedby="helper-checkbox-text"
                        type="checkbox"
                        checked={is_paid == TEST_SERIES_TYPE.Free}
                        // disabled={true}
                        disabled={isLoading}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-pointer"
                        onChange={() => handleFreeStatusChange(test_id)}
                      />
                    </td>
                    <td className="flex flex-col gap-1">
                      <input
                        type="datetime-local"
                        value={formatDateTime(scheduled_on)}
                        min={formatDateTime(new Date(), 1)}
                        // disabled={is_scheduled ? false : true}
                        disabled={isLoading}
                        onChange={(e) =>
                          handleScheduleStatusChange(test_id, e.target.value)
                        }
                        className="border border-gray-300 rounded-md p-1 text-center"
                      />
                      <button
                        onClick={() => handleUnschedule(test_id)}
                        className={`text-red-500 hover:text-red-600 cursor-pointer px-4 ${
                          is_scheduled ? "" : "hidden"
                        }`}
                      >
                        Unschedule
                      </button>
                    </td>
                    <td>
                      {/* <Dropdown
                        items={getOptions(status)
                          ?.filter((label) => label !== EDIT_DETAILS)
                          .map((label) => ({ label }))}
                        className={`absolute z-20 bg-white bottom-[3%] right-[25px]`}
                        handleChange={(val) =>
                          handleDropdownClick(val, test_id, title)
                        }
                      >
                        <BsThreeDotsVertical className="cursor-pointer" />
                      </Dropdown> */}

                      <a data-tooltip-id={`tooltip-${test_series_id}`}>
                        <BsThreeDotsVertical className="cursor-pointer mx-auto" />
                      </a>
                      <Tooltip
                        variant="light"
                        id={`tooltip-${test_series_id}`}
                        openOnClick
                        clickable
                        className="drop-shadow-md shadow-lg !rounded-lg !opacity-100 border !p-0 !m-0"
                      >
                        <div>
                          {getOptions(status)?.map((label) => (
                            <>
                              <button
                                key={label}
                                className="block w-40 py-3 text-base px-4 border-[#e9ecef] first:rounded-t-lg last-of-type:rounded-b-lg hover:bg-gray-100"
                                onClick={() =>
                                  handleDropdownClick(
                                    label,
                                    test_series_id,
                                    title
                                  )
                                }
                              >
                                <span
                                  className={
                                    label.toLowerCase() === "delete" ||
                                    label.toLowerCase() === "unlist"
                                      ? "text-red-500"
                                      : undefined
                                  }
                                >
                                  {label}
                                </span>
                              </button>
                              <hr className="last-of-type:hidden" />
                            </>
                          ))}
                        </div>
                      </Tooltip>
                    </td>
                  </tr>
                );
              }
            )}

            {!isLoading && !tests.length && (
              <p className="w-full py-4 text-base px-2 font-medium">
                No Test added yet!
              </p>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ViewTestSeries;
