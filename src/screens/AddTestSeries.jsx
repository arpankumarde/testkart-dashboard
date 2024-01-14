import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../api";
import {
  ButtonLoader,
  ImportantTipForCreators,
  Loader,
  TestSeriesForm,
} from "../components";

const AddTestSeries = () => {
  const [step, setStep] = useState(1);
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [currentExamInfo, setCurrentExamInfo] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
    total_tests: "",
    exam_id: "",
    academy_id: 1,
  });

  const { title, description, total_tests, language, exam_id } = formData;

  const getAllExams = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get("/api/v1/exams/parsed");
      if (data) {
        setExams(data.data ?? []);
      }
    } catch (error) {
      console.log(`Error: getAllExams --- ${error}}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllExams();
  }, []);

  const addTestSeries = async () => {
    try {
      setIsUpdating(true);
      await server.post(`/api/v1/test-series`, formData);
      navigate("/test-series");
    } catch (error) {
      console.log(`Error while adding test-series ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNextClick = () => {
    if (step === 1) return setStep(2);
    addTestSeries();
  };

  const handleChange = ({ target }) => {
    try {
      const { name, value } = target;
      if (name === "exam_id") {
        const currentExam = exams.find(
          ({ exam_id }) => exam_id == target.value
        );

        setCurrentExamInfo(currentExam);
      }
      setFormData((prev) => ({ ...prev, [name]: value }));
    } catch (error) {
      console.log(error, "error");
    }
  };

  console.log(currentExamInfo, "currrn", formData);
  return (
    <section className="flex md:flex-row flex-col pt-2 gap-4">
      {isLoading && <Loader />}
      <div
        className={`flex  md:w-[50%] flex-col gap-2 items-start  px-5 ${
          step === 1 ? "justify-center" : "justify-start"
        }`}
      >
        <div className="flex flex-col gap-2 w-full bg-white shadow-card justify-start items-start p-5">
          {step === 1 && (
            <div className="w-full">
              <label
                for="default"
                class="block mb-2  text-gray-900 dark:text-white  font-semibold text-lg text-center"
              >
                Select an exam to proceed
              </label>
              <select
                value={exam_id}
                name="exam_id"
                onChange={(e) => handleChange(e)}
                id="default"
                class="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
              >
                <option value={""} disabled>
                  Please select exam to proceed
                </option>
                {exams.map(({ exam, exam_id }) => (
                  <option key={exam_id} value={exam_id}>
                    {exam}
                  </option>
                ))}
              </select>
            </div>
          )}
          {step === 2 && (
            <TestSeriesForm
              currentExamInfo={currentExamInfo}
              title={title}
              description={description}
              language={language}
              total_tests={total_tests}
              handleChange={(e) => handleChange(e)}
            />
          )}
          <div className="flex justify-between w-full py-2">
            <button
              className="bg-transparent border rounded-[3px]  border-black text-black w-[100px] h-[30px]"
              onClick={() => {
                if (step === 1) {
                  return navigate("/test-series");
                } else {
                  return setStep(1);
                }
              }}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              onClick={() => handleNextClick()}
              disabled={step === 1 ? !formData.exam_id : false}
              className="bg-[#6d45a4] border-transparent flex justify-center items-center  rounded-[3px] text-base text-white px-3 py-1 leading-6 whitespace-nowrap min-w-[100px] h-[30px]"
            >
              {isUpdating ? (
                <ButtonLoader />
              ) : step === 1 ? (
                "Next"
              ) : (
                "Save & Next"
              )}
            </button>
          </div>
        </div>
      </div>
      <ImportantTipForCreators />
    </section>
  );
};

export default AddTestSeries;
