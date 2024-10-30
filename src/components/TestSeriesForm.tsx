import { DISCOUNT_TYPE, TEST_SERIES_TYPE } from "../utils/constant";
import Dropdown from "./Dropdown";
import { languages } from "../utils/common";
import ReactQuillComponent from "./ReactQuillComponent";

const TestSeriesForm = ({
  title,
  description,
  language,
  difficultyLevel,
  handleChange,
  testSeriesType,
  price,
  finalPrice,
  discount,
  discountType,
  handleDiscountType,
  handleDescUpdate,
}) => {
  return (
    <div className="h-full w-full flex flex-col gap-2 overflow-auto">
      <div className="flex w-full gap-4 justify-center items-center flex-wrap">
        <div className="flex flex-col gap-2 flex-[2] h-28">
          <label htmlFor="title" className="text-[#596780] font-medium text-lg">
            Title
          </label>
          <input
            name="title"
            id="title"
            value={title}
            placeholder="Title for test"
            maxLength={100}
            className="w-full outline-none border border-[#ced4da] bg-white px-2 py-2 rounded-md"
            onChange={(e) => handleChange(e)}
          />
          <span className="text-[#6d45a4] text-sm -mt-1">
            Max 100 characters
          </span>
        </div>
        <div className="flex flex-col gap-2 flex-1 h-28">
          <label
            htmlFor="difficulty"
            className="text-[#596780] font-medium text-lg"
          >
            Difficulty
          </label>
          <select
            onChange={(e) => handleChange(e)}
            id="difficultyLevel"
            name="difficulty_level"
            value={difficultyLevel}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
          >
            {["Easy", "Medium", "Hard"].map((level) => (
              <option value={level} key={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col w-full gap-2">
        <label htmlFor="title" className="text-[#596780] font-medium text-lg">
          Description
        </label>
        <div className="prose">
          <ReactQuillComponent
            value={description}
            setValue={(desc) => handleDescUpdate(desc)}
            container={[
              [{ header: [2, 3, 4, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["clean"],
            ]}
          />
        </div>
        {/* <textarea
          name="description"
          id="description"
          value={description}
          placeholder="Description for test"
          className="w-full outline-none border border-[#ced4da] bg-white p-2 rounded-md resize-none"
          rows={5}
          onChange={(e) => handleChange(e)}
        /> */}
      </div>
      <div className="flex justify-center items-center text-[#596780] [&>div]:flex-1 gap-4 overflow-hidden">
        <div className="flex flex-col gap-2">
          <label htmlFor="language" className="font-medium text-lg">
            Language
          </label>
          <select
            onChange={(e) => handleChange(e)}
            id="language"
            name="language"
            value={language}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md block w-full p-2.5 outline-none"
          >
            {languages.map((_language) => (
              <option value={_language} key={_language}>
                {_language}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-row justify-center gap-2 mt-9 bg-gray-50 border border-gray-300 rounded-md cursor-pointer">
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              id="free"
              name="is_paid"
              value={TEST_SERIES_TYPE.Free}
              checked={Number(testSeriesType) === TEST_SERIES_TYPE.Free}
              onChange={(e) => handleChange(e)}
              className="accent-[#6d45a4]"
            />
            <label htmlFor="free">Free</label>
          </div>

          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="is_paid"
              id="paid"
              value={TEST_SERIES_TYPE.Paid}
              checked={Number(testSeriesType) === TEST_SERIES_TYPE.Paid}
              onChange={(e) => handleChange(e)}
              className="accent-[#6d45a4]"
            />
            <label htmlFor="paid">Paid</label>
          </div>
        </div>
      </div>
      {testSeriesType == TEST_SERIES_TYPE.Paid && (
        <div className="flex justify-center items-center gap-4 text-[#596780] [&>div]:flex-1 flex-wrap overflow-hidden">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="price"
              className="text-[#596780] font-medium text-lg"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price_before_discount"
              value={price ?? 0}
              placeholder="Price"
              className="w-full outline-none border border-gray-300 bg-gray-50 px-2 py-2 rounded-md"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="discount"
              className="text-[#596780] font-medium text-lg"
            >
              Discount
            </label>
            <div className="flex">
              <input
                type="number"
                id="discount"
                name="discount"
                value={discount ?? 0}
                placeholder="Discount"
                className="w-full outline-none border-s border-y border-gray-300 bg-gray-50 px-2 py-2 rounded-s-md"
                onChange={(e) => handleChange(e)}
                min={0}
                max={discountType == "percentage" ? 100 : price}
              />
              <Dropdown
                selectedValue={discountType}
                items={Object.values(DISCOUNT_TYPE).map((label) => ({ label }))}
                className="absolute -bottom-28"
                hideAfterClick={true}
                handleChange={(value) => handleDiscountType(value)}
              >
                <button className="border rounded-e px-2 py-2  border-gray-300 bg-white">
                  {discountType === "percentage" ? "%" : "Rs"}
                </button>
              </Dropdown>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="finalPrice"
              className="text-[#596780] font-medium text-lg"
            >
              Final Price
            </label>
            <input
              type="number"
              id="finalPrice"
              name="price"
              value={finalPrice}
              placeholder="0.00"
              className="w-full outline-none border border-gray-200 bg-gray-200 px-2 py-2 rounded-md"
              disabled={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSeriesForm;
