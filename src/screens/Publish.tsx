import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import { DISCOUNT_TYPE, TEST_SERIES_TYPE } from "../utils/constant";
import { copyToClipboard } from "../utils/common";
import { Button, ButtonLoader, Loader, Modal } from "../components";
import { BsClipboard } from "react-icons/bs";

const Publish = () => {
  const { series_id } = useParams();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState();
  const [isLiveModal, setIsLiveModal] = useState(false);
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
    hash: "",
    discountType: "percentage",
    cover_photo: undefined,
  });
  const [isSubmitting, setIsSubmmiting] = useState(false);

  const { title, price, discount, cover_photo, hash } = formData;

  const navigate = useNavigate();

  const verifyTestSeries = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get(
        `/api/v1/test-series/${series_id}/verify`
      );
      if (!data.success) {
        alert("test series is not verified for listing");
        navigate(`/test-series/${series_id}`);
      }
      setFormData({ ...data.data.test_series[0], discountType: "percentage" });
      console.log(data, "dataa");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    verifyTestSeries();
  }, []);

  const calculateFinalPrice = () => {
    setFormData((prev) => {
      const discountPrice =
        prev.discountType === DISCOUNT_TYPE.PERCENTAGE
          ? (prev.price_before_discount * (100 - prev.discount)) / 100
          : prev.price_before_discount - prev.discount;

      console.log(discountPrice, "okk");
      return { ...prev, price: discountPrice };
    });
  };

  const handleChange = async ({ target }) => {
    try {
      const { name, value, files } = target;
      console.log(name, value, "ookk");
      setFormData((prev) => ({
        ...prev,
        [name]: name === "cover_photo" ? files[0] : value,
      }));

      if (["discount", "price_before_discount"].includes(name)) {
        calculateFinalPrice();
      }
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handlePublishSeries = async () => {
    try {
      setIsSubmmiting(true);
      const newFormData = new FormData();
      newFormData.append("free_tests", 1);
      newFormData.append("price", price);
      newFormData.append("discount", discount);
      newFormData.append("file", cover_photo);

      const { data } = await server.post(
        `/api/v1/test-series/${series_id}/publish`,
        newFormData
      );
      if (data) {
        setIsLiveModal(true);
      }
    } catch (error) {
      console.log(`error::`, error.message);
    } finally {
      setIsSubmmiting(false);
    }
  };

  console.log(cover_photo, "coverrPhoto", typeof cover_photo);

  return (
    <div className="flex flex-col md:flex-row [&>div]:flex-1 p-5">
      {isLoading && <Loader />}

      <Modal
        title={"Live"}
        isModalOpen={isLiveModal}
        setIsModalOpen={setIsLiveModal}
        isShare={true}
      >
        <div className="flex justify-center items-center flex-col gap-2 ">
          <h1 className="text-lg font-medium leading-6">{title}</h1>
          <p>Your test series is live and ready to be purchased by students</p>
          <div className="flex w-full justify-center items-center">
            <input
              type="text"
              disabled={true}
              className="outline-none bg-[#e9ecef] flex-1 px-3 py-2"
              value={`https://testkart.in/test-series/${hash}`}
            />
            <p
              className="flex justify-center items-center bg-white px-3 py-[10px] border shadow-card cursor-pointer"
              onClick={() =>
                copyToClipboard(`https://testkart.in/test-series/${hash}`)
              }
            >
              <BsClipboard />
            </p>
          </div>
        </div>
      </Modal>
      <div className="shadow-card bg-white border p-5 flex flex-col gap-2 text-[#596780]">
        <div className="py-4 border-b border-b-[#596780]">
          <h1>{title}</h1>
        </div>
        <div className="flex items-center justify-center gap-4 w-full border-b border-b-[#596780] py-4">
          <div className="flex flex-col gap-2 flex-[2]">
            <p>Cover Image</p>
            <p>Please add a attractive cover image</p>
          </div>
          <div className="p-2 border border-[#596780] flex-1 w-[200px] rounded-md overflow-hidden">
            <input
              type="file"
              name="cover_photo"
              onChange={(e) => handleChange(e)}
              className="overflow-hidden"
            />
          </div>
        </div>
        {/* <div className="py-4 border-b border-b-[#596780] flex flex-col gap-4">
          <div className="flex gap-2 justify-between w-full">
            <p className="text-lg font-medium leading-6">
              Selling Price for your test series
            </p>
            <div className="flex h-10 ">
              <p className="bg-[#e9ecef] border border-[#ced4da] flex justify-center items-center px-2 w-8">
                ₹
              </p>
              <input
                type="number"
                name="price"
                value={price}
                className="outline-none p-4 bg-white border w-32"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between w-full">
            <p className="text-lg font-medium leading-6">Any Discount</p>
            <div className="flex h-10 ">
              <p className="bg-[#e9ecef] border border-[#ced4da] flex justify-center items-center px-2">
                %
              </p>
              <input
                type="number"
                name="discount"
                value={discount}
                className="outline-none p-4 bg-white border w-32"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-between w-full">
            <p className="text-lg font-medium leading-6">Display Price</p>
            <p className="flex gap-2">
              <span>Rs</span>{" "}
              <p>{(Math.round(price / 1.09) ?? 0).toFixed(2)}</p>
            </p>
          </div>
          <div className="flex gap-2 justify-between w-full">
            <p className="text-lg font-medium leading-6">Platform Fee</p>
            <p className="flex gap-2">
              <span className="font-semibold text-lg">₹</span>{" "}
              <p>{price / 5}</p>
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-between w-full py-2">
          <p className="text-lg font-medium leading-6">You will Receive</p>
          <p className="flex gap-2">
            <span className="font-semibold text-lg">₹</span>{" "}
            <p>{(Math.round(price / 1.09) ?? 0).toFixed(2) - price / 5}</p>
          </p>
        </div> */}
        <div className="flex gap-2 justify-between w-full py-2">
          <Button
            buttonText="Cancel"
            className={"rounded-md"}
            onClick={() => navigate(`/test-series/${series_id}`)}
          />
          <button
            type="button"
            onClick={() => handlePublishSeries()}
            className="bg-[#30d530] px-4 py-2 flex justify-center items-center text-white rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? <ButtonLoader /> : "List on TestKart"}
          </button>
        </div>
      </div>
      <div className="flex justify-center items-center py-4">
        {cover_photo && (
          <img
            src={
              typeof cover_photo === "string"
                ? cover_photo
                : URL.createObjectURL(cover_photo)
            }
            alt="cover-photo"
            className="object-cover h-[200px] w-[400px]"
          />
        )}
      </div>
    </div>
  );
};

export default Publish;
