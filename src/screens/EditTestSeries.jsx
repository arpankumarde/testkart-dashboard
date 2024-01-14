import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../api";
import {
  ButtonLoader,
  ImportantTipForCreators,
  Loader,
  TestSeriesForm,
} from "../components";

const EditTestSeries = () => {
  const [testinfo, setTestinfo] = useState({});
  const [isLoading, setIsLoading] = useState();
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

  const { title, description, total_tests, language} = formData;

  const params = useParams();

  const getTestInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get(`/api/v1/test-series/${params.id}`);
      if (data) {
        const currentTest = data?.data;
        setTestinfo(currentTest ?? {});
        setFormData((prev) => ({
          ...prev,
          title: currentTest.title,
          description: currentTest.description,
          language: currentTest.language,
          total_tests: currentTest.total_tests,
          exam_id: currentTest.exam_id,
          academy_id: currentTest.academy_id,
        }));
      }
    } catch (error) {
      console.log(`Error: getTestInfo --- ${error}}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestSeries = async () => {
    try {
      setIsUpdating(true);
      const { data } = await server.put(
        `/api/v1/test-series/${params.id}`,
        formData
      );
    } catch (error) {
      console.log(`Error-updateTestSeries ${error}`);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    getTestInfo();
  }, []);

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="flex md:flex-row flex-col pt-2 gap-4">
      {isLoading && <Loader />}
      <div
        className={`flex  md:w-[50%] flex-col gap-2 items-start  px-5 justiy-start`}
      >
        <div className="flex flex-col gap-2 w-full bg-white shadow-card justify-start items-start p-5">
          <TestSeriesForm
            currentExamInfo={testinfo.exam}
            title={title}
            description={description}
            language={language}
            total_tests={total_tests}
            handleChange={(e) => handleChange(e)}
          />
          <div className="flex justify-between w-full py-2">
            <button
              onClick={() => navigate("/test-series")}
              className="bg-transparent border rounded-[3px]  border-black text-black w-[100px] h-[30px]"
            >
              Cancel
            </button>
            <button
              disabled={isUpdating}
              className="bg-[#6d45a4] border-transparent flex justify-center items-center  rounded-[3px] text-base text-white px-3 py-1 leading-6 whitespace-nowrap min-w-[100px] h-[30px]"
              onClick={() => updateTestSeries()}
            >
              {isUpdating ? <ButtonLoader /> : "Save"}
            </button>
          </div>
        </div>
      </div>
      <ImportantTipForCreators />
    </section>
  );
};

export default EditTestSeries;
