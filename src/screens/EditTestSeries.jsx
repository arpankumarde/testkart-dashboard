import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import {
  ButtonLoader,
  ImportantTipForCreators,
  Loader,
  TestSeriesForm,
} from "../components";
import { DISCOUNT_TYPE, TEST_SERIES_TYPE } from "../utils/constant";

const EditTestSeries = () => {
  const [testinfo, setTestinfo] = useState({});
  const [isLoading, setIsLoading] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    language: "",
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
          exam_id: currentTest.exam_id,
          academy_id: currentTest.academy_id,
          is_paid: currentTest.is_paid,
          price_before_discount: currentTest.price_before_discount,
          price: currentTest.price_before_discount,
          difficulty_level: currentTest.difficulty_level,
          discount: currentTest.discount,
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
    const { name, value } = target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (["discount", "price"].includes) {
      calculateFinalPrice();
    }
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
            handleChange={(e) => handleChange(e)}
            difficultyLevel={difficulty_level}
            testSeriesType={is_paid}
            price={price_before_discount}
            finalPrice={price}
            discount={discount}
            discountType={discountType}
            handleDiscountType={(value) => {
              setFormData((prev) => ({ ...prev, discountType: value }));
              return calculateFinalPrice();
            }}
          />
          <div className="flex justify-between w-full py-2">
            <button
              onClick={() => navigate("/test-series")}
              className="bg-transparent border rounded-[3px]  border-black text-black w-[100px] h-[30px]"
            >
              Cancel
            </button>
            <button
              disabled={isUpdating || !title || !description}
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
