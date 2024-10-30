import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { DISCOUNT_TYPE, TEST_SERIES_TYPE } from "../utils/constant";
import { ButtonLoader, Loader, TestSeriesForm } from "../components";

const AddTestSeries = () => {
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
        data.data.sort((a, b) => a.exam.localeCompare(b.exam));
        setExams(data?.data ?? []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllExams();
  }, []);

  const addTestSeries = async () => {
    console.log("OnABV", formData);
    try {
      let localFormData = { ...formData };
      localFormData.is_paid = Number(localFormData.is_paid);

      if (localFormData.is_paid === TEST_SERIES_TYPE.Free) {
        console.log("re");
        localFormData.price = 0;
        localFormData.price_before_discount = 0;
        localFormData.discount = 0;
      } else {
        localFormData.price = Number(parseFloat(formData.price).toFixed(2));
        localFormData.price_before_discount = Number(
          parseFloat(formData.price_before_discount).toFixed(2)
        );
        localFormData.discount = Number(
          parseFloat(formData.discount).toFixed(2)
        );
      }

      console.log("price_before_discount", localFormData.price_before_discount);
      console.log("onAdd", localFormData);

      if (localFormData?.discountType === DISCOUNT_TYPE.PERCENTAGE) {
        if (localFormData?.discount < 0 || localFormData?.discount > 100) {
          return alert("Discount percentage should be between 0 and 100.");
        }
      } else if (localFormData?.discountType === DISCOUNT_TYPE.AMOUNT) {
        if (
          localFormData?.discount < 0 ||
          localFormData?.discount > localFormData?.price_before_discount
        ) {
          return alert(
            "Discount amount should be between 0 and the price before discount."
          );
        }
      }

      setIsUpdating(true);

      const { data } = await server.post(`/api/v1/test-series`, localFormData);

      if (data?.data?.test_series_id) {
        return navigate(`/test-series/${data?.data?.test_series_id}`);
      }
      navigate("/test-series");
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateFinalPrice = () => {
    setFormData((prev) => {
      const discountPrice =
        prev.discountType === DISCOUNT_TYPE.PERCENTAGE
          ? (prev.price_before_discount * (100 - prev.discount)) / 100
          : prev.price_before_discount - prev.discount;
      return { ...prev, price: Number(parseFloat(discountPrice).toFixed(2)) };
    });
  };

  const handleChange = ({ target }) => {
    try {
      const { name, value } = target;

      if (name === "exam_id") {
        const currentExam = exams.find(({ exam_id }) => exam_id == value);

        setCurrentExamInfo(currentExam);
      }
      setFormData((prev) => ({ ...prev, [name]: value }));

      // if (["discount", "price_before_discount"].includes) {
      //   calculateFinalPrice();
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDescUpdate = (desc) => {
    setFormData((prev) => ({ ...prev, description: desc }));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      price_before_discount: Number(parseInt(price_before_discount, 10)),
      discount: Number(discount),
      discountType: discountType,
    }));

    calculateFinalPrice();
  }, [discountType, discount, price_before_discount]);

  return (
    <section className="md:p-4 lg:p-8 flex flex-col lg:flex-row md:gap-4 lg:gap-8">
      {isLoading && <Loader />}
      <div className="bg-white h-full lg:h-[calc(100dvh-8rem)] flex w-full flex-col lg:flex-row gap-2 items-start rounded-md shadow-card">
        <div className="flex flex-col gap-2 w-full lg:w-1/2 h-full justify-between items-start p-4 lg:p-6 overflow-auto border-r">
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

            <div className="space-y-3">
              {currentExamInfo?.exam && (
                <p>
                  <span className="text-black font-bold">EXAM: </span>
                  <span>{currentExamInfo?.exam}</span>
                </p>
              )}
              {currentExamInfo?.default_pattern?.subjects && (
                <p>
                  <span className="text-black font-bold">SUBJECTS: </span>
                  {currentExamInfo?.default_pattern?.subjects?.map(
                    ({ subject: currentSubject }, index) => (
                      <span key={currentSubject}>
                        {currentSubject.trim()}
                        {index + 1 !==
                          currentExamInfo?.default_pattern?.subjects.length &&
                          ", "}
                      </span>
                    )
                  )}
                </p>
              )}
            </div>
          </div>

          <div className="hidden lg:flex justify-between w-full pt-2">
            <button
              className="bg-transparent border rounded-md border-[#6d45a4] text-black w-28 h-8"
              onClick={() => {
                return navigate("/test-series");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full items-end justify-between gap-4 flex-1 p-4 h-full lg:p-6 overflow-hidden">
          <TestSeriesForm
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
            handleDescUpdate={handleDescUpdate}
          />
          <div className="flex justify-between lg:justify-end w-full pt-2">
            <button
              className="lg:hidden bg-transparent border rounded-md border-[#6d45a4] text-black w-28 h-8"
              onClick={() => {
                return navigate("/test-series");
              }}
            >
              Cancel
            </button>

            <button
              onClick={addTestSeries}
              disabled={!exam_id || !title || !description}
              className="bg-[#6d45a4] border-transparent flex justify-center items-center rounded-md text-base text-white px-4 py-1 leading-6 whitespace-nowrap min-w-28 h-8"
            >
              {isUpdating ? <ButtonLoader /> : "Save & Next"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddTestSeries;
