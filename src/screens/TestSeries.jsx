import React, { useEffect, useState } from "react";

import { BsThreeDotsVertical, BsClipboard } from "react-icons/bs";
import { Dropdown, Loader, Modal } from "../components";
import { Link, useNavigate } from "react-router-dom";
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
  Unlisted,
  VIEW_TESTS,
} from "../utils/constant";
import { copyToClipboard, getOptions } from "../utils/common";

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
        console.log(data, "data");
        setTests(data.data ?? []);
      }
    } catch (error) {
      console.log(`Error: getAllTests --- ${error}}`);
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
      console.log(`Error: getAllTests --- ${error}}`);
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
      console.log(`Error: getAllTests --- ${error}}`);
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

      case MODIFY_LISTING:{
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
    <section className="px-[15px] py-3 flex flex-col gap-3 relative">
      {isLoading && <Loader />}

      <Modal
        title="Are  you sure ?"
        isModalOpen={isModal == DELETE}
        setIsModalOpen={setIsModal}
        isDelete={true}
        onAccept={() => deleteTestSeries(modalContent.id)}
        onDecline={()=>{}}
      >
        <div className="flex justify-center items-center flex-col gap-2 ">
          <h1 className="text-lg font-medium leading-6">
            {modalContent.title}
          </h1>
          <p>Are you sure to delete this test series?</p>
        </div>
      </Modal>

      <Modal
        isLoading={isLoading}
        title="Are  you sure ?"
        isModalOpen={isModal == UNLIST}
        setIsModalOpen={setIsModal}
        onAccept={() => UnlistTestSeries(modalContent.id)}
        saveButtonText="Unlist"
        onDecline={()=>{}}
      >
        <div className="flex justify-center items-center flex-col gap-2 ">
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
        <div className="flex justify-center items-center flex-col gap-2 ">
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

      <div className="flex justify-between p-5 shadow-card bg-white">
        <div className="relative">
          <Dropdown
            className="absolute top-0 left-0 text-base min-w-[10rem] translate-y-8 z-40"
            buttonText={selectedOption}
            items={["All series", "Live", "Draft", "Unlisted"]
              .filter((item) => item !== selectedOption)
              .map((label) => ({ label }))}
            handleChange={(val) => setSelectedOption(val)}
          />
        </div>
        <Link to="/test-series/add">
          <button
            type="button"
            className="bg-[#6d45a4] border-1 border-[#6d45a4] rounded-[3px] text-base text-white px-2 py-1 leading-6"
          >
            Create Test Series
          </button>
        </Link>
      </div>
      <div className="px-6 pb-6 bg-white w-full md:h-[340px] overflow-scroll custom-scroll-bar">
        <table className="table-auto w-full bg-white">
          <thead className="border-y border-y-[#e9ecef] bg-white shadow-card sticky top-0 left-0 right-0 z-20">
            <tr className="text-left  [&>th]:py-[15px] [&>th]:px-3 [&>th]:font-medium">
              <th>#</th>
              <th>Test series</th>
              <th>No. of tests</th>
              <th>Price</th>
              <th>Students</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {!!tests.length &&
              filteredTestSeries()?.map(
                (
                  { title, total_tests, price, status, test_series_id },
                  index
                ) => (
                  <tr
                    key={index}
                    className="hover:bg-[#eff3f6] border-b border-b-[#e9ecef] [&>td]:py-[15px] [&>td]:px-3 mobile:relative"
                  >
                    <td>{index + 1}.</td>
                    <td
                      className="cursor-pointer"
                      onClick={() => navigate(`/test-series/${test_series_id}`)}
                    >
                      {title}
                    </td>
                    <td>{total_tests}</td>
                    <td>{price ?? 0}</td>
                    <td>2021</td>
                    <td>
                      <span
                        className={`rounded-full px-4 py-1 text-white ${STATUS_COLOR_BY_STATUS_CODE[status]}`}
                      >
                        {STATUS_MEANINGS_BY_CODE[status] ?? ""}{" "}
                      </span>
                    </td>
                    <td>
                      <Dropdown
                        items={getOptions(status)?.map((label) => ({ label }))}
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
                There is no test added yet.{" "}
              </p>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TestSeries;
