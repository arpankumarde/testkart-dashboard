import React, { useEffect, useState } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { Dropdown, Loader } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../api";
import {
  EDIT_DETAILS,
  MODIFY_LISTING,
  STATUS_COLOR_BY_STATUS_CODE,
  STATUS_MEANINGS_BY_CODE,
  VIEW_TESTS,
} from "../utils/constant";
import { getOptions } from "../utils/common";
import { IoMdArrowRoundBack } from "react-icons/io";

const ViewTestSeries = () => {
  const [selectedOption, setSelectedOption] = useState("All Series");
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const navigate = useNavigate();
  const params = useParams();

  const getAllTestsBySeriesid = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get(
        `/api/v1/test-series/test?series_id=${params.series_id}`
      );
      if (data) {
        console.log(data, "data");
        setTests(data.data ?? []);
      }
    } catch (error) {
      console.log(`Error: getAllTestsBySeriesid  --- ${error}}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllTestsBySeriesid();
  }, []);

  const handleDropdownClick = (value, id) => {
    switch (value) {
      case EDIT_DETAILS: {
        return navigate(`/test-series/edit/${id}`);
      }
      // Add more cases if needed
      default: {
        return;
      }
    }
  };

  return (
    <section className="px-[15px] py-3 flex flex-col gap-3">
      {isLoading && <Loader />}
      <div className="flex justify-between p-5 shadow-card bg-white">
        <div className="relative">
          <p className="flex gap-2 items-center justify-center">
            <IoMdArrowRoundBack
              size={24}
              onClick={() => navigate("/test-series")}
              className="cursor-pointer"
            />
            <h1 className="font-medium text-lg">
              {tests[0]?.data?.test_sery?.title}
            </h1>
          </p>
        </div>
        <Link to="/test-series/add">
          <button
            type="button"
            className="hover:bg-[#6c757d] hover:text-white bg-transparent border border-[#6c757d] rounded-[3px] text-base px-2 py-1 leading-6 delay-100 ease-in-out"
          >
            {MODIFY_LISTING}
          </button>
        </Link>
      </div>
      <div className="p-6 bg-white w-full md:h-[340px] overflow-scroll custom-scroll-bar">
        <table className="table-auto w-full relative">
          <thead className="border-y border-y-[#e9ecef] ">
            <tr className="text-left  [&>th]:py-[15px] [&>th]:px-3 [&>th]:font-medium">
              <th>#</th>
              <th>Test title</th>
              <th>Subjects</th>
              <th>Questions</th>
              <th>Duration</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tests.map(
              (
                {
                  data: { title, duration, status, test_series_id, test_id },
                  meta,
                },
                index
              ) => (
                <tr
                  key={index}
                  className="hover:bg-[#eff3f6] border-b border-b-[#e9ecef] [&>td]:py-[15px] [&>td]:px-3"
                >
                  <td> {index + 1}</td>
                  <td
                    className="cursor-pointer"
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
                  <td>
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

export default ViewTestSeries;
