import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { DISCOUNT_TYPE, TEST_SERIES_TYPE } from "../utils/constant";
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
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "English",
    exam_id: "",
    academy_id: user?.academy?.academy_id,
    difficulty_level: "Easy",
    is_paid: TEST_SERIES_TYPE.Free,
    price_before_discount: 0,
    discount: 0,
    price: 0,
    discountType: "percentage",
  });

  const {
    title,
    description,
    language,
    exam_id,
    difficulty_level,
    is_paid,
    price,
    discount,
    price_before_discount,
    discountType,
  } = formData;

  const getAllExams = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get("/api/v1/exams/parsed");
      if (data) {
        setExams(data.data ?? []);
      }
    } catch (error) {
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
      const { data } = await server.post(`/api/v1/test-series`, formData);
      if (data?.data?.test_series_id) {
        return navigate(`/test-series/${data?.data?.test_series_id}`);
      }
      navigate("/test-series");
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNextClick = () => {
    if (step === 1) return setStep(2);
    addTestSeries();
  };

  const calculateFinalPrice = () => {
    setFormData((prev) => {
      const discountPrice =
        prev.discountType === DISCOUNT_TYPE.PERCENTAGE
          ? (prev.price_before_discount * (100 - prev.discount)) / 100
          : prev.price_before_discount - prev.discount;
      return { ...prev, price: discountPrice };
    });
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

      if (["discount", "price_before_discount"].includes) {
        calculateFinalPrice();
      }
    } catch (error) {}
  };

  return (
    <section className="md:p-4 lg:p-8 flex flex-col lg:flex-row md:gap-4 lg:gap-8">
      {isLoading && <Loader />}
      <div
        className={`flex w-full lg:w-[50%] flex-col gap-2 items-start ${
          step === 1 ? "justify-center" : "justify-start"
        }`}
      >
        <div className="flex flex-col gap-2 w-full h-full lg:h-[calc(100dvh-8rem)] rounded-md bg-white shadow-card justify-center items-start p-4 overflow-auto">
          {step === 1 && (
            <div className="w-full">
              <label
                htmlFor="default"
                className="block mb-2 text-gray-900 font-semibold text-lg text-center"
              >
                Select an exam to proceed
              </label>
              <select
                value={exam_id}
                name="exam_id"
                onChange={(e) => handleChange(e)}
                id="default"
                className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg block w-full p-2.5 outline-none"
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
              difficultyLevel={difficulty_level}
              testSeriesType={is_paid}
              price={price_before_discount}
              finalPrice={price}
              discount={discount}
              discountType={discountType}
              handleChange={(e) => handleChange(e)}
              handleDiscountType={(value) => {
                setFormData((prev) => ({ ...prev, discountType: value }));
                return calculateFinalPrice();
              }}
            />
          )}
          <div className="flex justify-between w-full pt-2">
            <button
              className="bg-transparent border rounded-md border-[#6d45a4] text-black w-28 h-8"
              onClick={() => {
                if (step === 1) {
                  return navigate("/test-series");
                } else {
                  getAllExams();
                  return setStep(1);
                }
              }}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            <button
              onClick={() => handleNextClick()}
              disabled={
                step === 1
                  ? !exam_id
                  : step === 2
                  ? !title || !description
                  : false
              }
              className="bg-[#6d45a4] border-transparent flex justify-center items-center rounded-md text-base text-white px-4 py-1 leading-6 whitespace-nowrap min-w-28 h-8"
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
