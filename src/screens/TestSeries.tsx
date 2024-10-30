import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Loader, Modal } from "../components";
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

const TestSeries = () => {
  const [selectedOption, setSelectedOption] = useState("All series");
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [isModal, setIsModal] = useState("");
  const [modalContent, setIsModalContent] = useState({
    title: "",
    id: "",
  });

  const navigate = useNavigate();

  const getAllTest = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get("/api/v1/test-series");
      if (data) {
        setTests(data.data ?? []);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTestSeries = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await server.delete(`/api/v1/test-series/${id}`);
      if (data) {
        setTests((prev) => prev.filter((item) => item.test_series_id !== id));
        setIsModal("");
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const UnlistTestSeries = async (id) => {
    setIsLoading(true);
    try {
      await server.get(`/api/v1/test-series/${id}/unlist`);
      await getAllTest();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTest();
  }, []);

  const handleDropdownClick = (value, id, title) => {
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

  const getLiveUrlOfTestSeries = (test_series_id) => {
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
      <div className="bg-white rounded-md">
        <div className="flex justify-between p-4 shadow-card">
          <div className="relative">
            <Dropdown
              className="absolute top-0 left-0 text-base translate-y-8 z-40"
              buttonText={selectedOption}
              items={["All series", "Live", "Draft", "Unlisted"]
                .filter((item) => item !== selectedOption)
                .map((label) => ({ label }))}
              handleChange={(val) => setSelectedOption(val)}
            />
          </div>
          <Link
            to="/test-series/add"
            className="bg-[#6d45a4] border border-[#6d45a4] rounded-md text-white px-4 py-1 leading-6"
          >
            Create Test Series
          </Link>
        </div>
        <hr className="mt-1" />
        <div className="bg-white h-full md:h-[calc(100dvh-10rem-0.6rem)] lg:h-[calc(100dvh-12rem-0.6rem)] overflow-auto px-4">
          <table className="table-auto w-full">
            <thead className="sticky top-0 left-0 bg-white">
              <tr className="text-center [&>th]:py-4 [&>th]:px-4 [&>th]:font-medium">
                <th>#</th>
                <th className="text-left">Test series</th>
                <th>No. of tests</th>
                <th>Price</th>
                <th>Students</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
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
                      className="text-center hover:bg-gray-100 border-b border-b-[#e9ecef] [&>td]:py-[15px] [&>td]:px-3 mobile:relative"
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
                          {STATUS_MEANINGS_BY_CODE[status] ?? ""}{" "}
                        </span>
                      </td>
                      <td>
                        <Dropdown
                          items={getOptions(status)?.map((label) => ({
                            label,
                          }))}
                          className={`absolute z-20 -transalate-y-12 bg-white  ${
                            getOptions(status).length > 3
                              ? "top-[25%] right-[25px]"
                              : "top-[40%] right-[15px]"
                          }`}
                          handleChange={(val) =>
                            handleDropdownClick(val, test_series_id, title)
                          }
                        >
                          <BsThreeDotsVertical className="cursor-pointer" />
                        </Dropdown>
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
    </section>
  );
};

export default TestSeries;
