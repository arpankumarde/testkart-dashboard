import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader, Modal } from "../components";
import { server } from "../api";
import {
  DELETE,
  EDIT_DETAILS,
  LIST_ON_TESTKART,
  MODIFY_LISTING,
  SHARE,
  STATUS_CODE_BY_STATUS,
  STATUS_COLOR_BY_STATUS_CODE,
  STATUS_MEANINGS_BY_CODE,
  UNLIST,
  VIEW_TESTS,
} from "../utils/constant";
import { copyToClipboard, getOptions } from "../utils/common";
import { BsThreeDotsVertical, BsClipboard } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { Tooltip } from "react-tooltip";

interface TestSeries {
  test_series_id: number;
  exam_id: number;
  academy_id: number;
  title: string;
  language: string;
  hash: string;
  description: string;
  cover_photo: string | null;
  total_tests: number;
  free_tests: number | null;
  price: number;
  price_before_discount: number;
  discount: number | null;
  discountType: "percentage" | "amount" | null;
  is_paid: number;
  status: number;
  difficulty_level: string;
  is_purchased: number;
  is_deleted: number;
  createdAt: string;
  updatedAt: string;
  students_joined: number;
}

interface TestSeriesResponse {
  success: boolean;
  data: TestSeries[];
}

interface ModalContent {
  title: string;
  id: number;
}

const TestSeries = () => {
  const [selectedOption, setSelectedOption] = useState<string>("All Series");
  const [tests, setTests] = useState<TestSeries[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModal, setIsModal] = useState("");
  const [modalContent, setIsModalContent] = useState<ModalContent>({
    title: "",
    id: 0,
  });

  const navigate = useNavigate();

  const getAllTest = async () => {
    setIsLoading(true);
    try {
      const { data }: { data: TestSeriesResponse } = await server.get(
        "/api/v1/test-series"
      );
      if (data) {
        setTests(data.data ?? []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTestSeries = async (id: number) => {
    setIsLoading(true);
    try {
      const { data } = await server.delete(`/api/v1/test-series/${id}`);
      if (data) {
        setTests((prev) => prev.filter((item) => item.test_series_id !== id));
        setIsModal("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const UnlistTestSeries = async (id: number) => {
    setIsLoading(true);
    try {
      await server.get(`/api/v1/test-series/${id}/unlist`);
      await getAllTest();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTest();
  }, []);

  const handleDropdownClick = (value: string, id: number, title: string) => {
    switch (value) {
      case VIEW_TESTS: {
        return navigate(`/test-series/${id}`);
      }
      case EDIT_DETAILS: {
        return navigate(`/test-series/edit/${id}`);
      }
      case DELETE: {
        setIsModalContent((prev) => ({ ...prev, title, id }));
        return setIsModal(DELETE);
      }
      case SHARE: {
        setIsModalContent((prev) => ({ ...prev, title, id }));
        return setIsModal(SHARE);
      }

      case UNLIST: {
        setIsModalContent((prev) => ({ ...prev, title, id }));
        return setIsModal(UNLIST);
      }

      case LIST_ON_TESTKART: {
        return navigate(`/test-series/${id}/publish`);
      }

      case MODIFY_LISTING: {
        return navigate(`/test-series/${id}/publish`);
      }

      // Add more cases if needed
      default: {
        return;
      }
    }
  };

  const getLiveUrlOfTestSeries = (test_series_id: number) => {
    const currentTest = tests.find(
      (item) => item?.test_series_id?.toString() === test_series_id?.toString()
    );
    return `https://testkart.in/test-series/${currentTest?.hash}`;
  };

  const filteredTestSeries = () => {
    if (STATUS_CODE_BY_STATUS[selectedOption] !== undefined) {
      return tests.filter(
        ({ status }) => status === STATUS_CODE_BY_STATUS[selectedOption]
      );
    } else {
      return tests;
    }
  };

  return (
    <section className="md:p-4 lg:p-8 relative">
      {isLoading && <Loader />}

      <Modal
        title="Are you sure?"
        isModalOpen={isModal == DELETE}
        setIsModalOpen={setIsModal}
        isDelete={true}
        onAccept={() => deleteTestSeries(modalContent.id)}
        onDecline={() => {}}
      >
        <div className="flex justify-center items-center flex-col gap-2">
          <h1 className="text-lg font-medium leading-6">
            {modalContent.title}
          </h1>
          <p>Are you sure to delete this test series?</p>
        </div>
      </Modal>

      <Modal
        isLoading={isLoading}
        title="Are you sure?"
        isModalOpen={isModal == UNLIST}
        setIsModalOpen={setIsModal}
        onAccept={() => UnlistTestSeries(modalContent.id)}
        saveButtonText="Unlist"
        onDecline={() => {}}
      >
        <div className="flex justify-center items-center flex-col gap-2">
          <h1 className="text-lg font-medium leading-6">
            {modalContent.title}
          </h1>
          <p>Are you sure to Unlist this test series?</p>
        </div>
      </Modal>

      <Modal
        title={SHARE}
        isModalOpen={isModal == SHARE}
        setIsModalOpen={setIsModal}
        isShare={true}
      >
        <div className="flex justify-center items-center flex-col gap-2">
          <h1 className="text-lg font-medium leading-6">
            {modalContent.title}
          </h1>
          <p>Your test series is live and ready to be purchased by students</p>
          <div className="flex w-full justify-center items-center">
            <input
              type="text"
              disabled={true}
              className="outline-none bg-[#e9ecef] flex-1 px-3 py-2"
              value={getLiveUrlOfTestSeries(modalContent.id)}
            />
            <p
              className="flex justify-center items-center bg-white px-3 py-[10px] border shadow-card cursor-pointer"
              onClick={() =>
                copyToClipboard(getLiveUrlOfTestSeries(modalContent.id))
              }
            >
              <BsClipboard />
            </p>
          </div>
        </div>
      </Modal>

      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md flex-1">
          <div className="flex justify-between items-center p-4">
            <div className="relative inline-block">
              <select
                id="select"
                name="select"
                onChange={(e) => setSelectedOption(e.target.value)}
                value={selectedOption}
                className="cursor-pointer appearance-none border border-[#6d45a4] rounded-md py-1 pl-3 pr-10 text-gray-700 focus:outline-none"
              >
                <option value="All series">All series</option>
                <option value="Live">Live</option>
                <option value="Draft">Draft</option>
                <option value="Unlisted">Unlisted</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <IoMdArrowDropdown className="text-[#6d45a4]" />
              </div>
            </div>

            <Link
              to="/test-series/add"
              className="bg-[#6d45a4] border border-[#6d45a4] rounded-md text-white px-4 py-1"
            >
              Create Test Series
            </Link>
          </div>
          <hr className="mx-4" />
          <div className="h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-12rem-0.6rem)] overflow-auto px-4">
            <table className="w-full">
              <thead className="w-full sticky top-0 left-0 bg-white border-b">
                <tr className="text-center [&>th]:py-2 [&>th]:px-4 [&>th]:font-normal">
                  <th>#</th>
                  <th className="text-left w-max">Test series</th>
                  <th>No. of tests</th>
                  <th>Price</th>
                  <th>Students</th>
                  <th>Status</th>
                  <th>Options</th>
                </tr>
              </thead>

              <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
                {!!tests.length &&
                  filteredTestSeries()?.map(
                    (
                      {
                        title,
                        total_tests,
                        price,
                        status,
                        test_series_id,
                        students_joined,
                      },
                      index
                    ) => (
                      <tr
                        key={index}
                        className="text-center hover:bg-gray-100 border-b border-b-[#e9ecef] [&>td]:py-4 [&>td]:px-4 mobile:relative"
                      >
                        <td>{index + 1}.</td>
                        <td
                          className="text-left text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          onClick={() =>
                            navigate(`/test-series/${test_series_id}`)
                          }
                        >
                          {title ?? "Untitled"}
                        </td>
                        <td>{total_tests ?? 0}</td>
                        <td>{price ?? 0}</td>
                        <td>{students_joined ?? 0}</td>
                        <td>
                          <span
                            className={`rounded-full px-4 py-1 text-white ${STATUS_COLOR_BY_STATUS_CODE[status]}`}
                          >
                            {STATUS_MEANINGS_BY_CODE[status] ?? ""}
                          </span>
                        </td>
                        <td>
                          <a data-tooltip-id={`tooltip-${test_series_id}`}>
                            <BsThreeDotsVertical className="cursor-pointer mx-auto" />
                          </a>
                          <Tooltip
                            variant="light"
                            id={`tooltip-${test_series_id}`}
                            openOnClick
                            clickable
                            className="drop-shadow-lg shadow-lg !rounded-lg !opacity-100 border !p-0 !m-0"
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
                    )
                  )}

                {!isLoading && !tests.length && (
                  <p className="w-full py-4 text-base px-2 font-medium">
                    No test series found!
                  </p>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestSeries;
