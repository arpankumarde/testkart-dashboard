import { DISCOUNT_TYPE, TEST_SERIES_TYPE } from "../utils/constant";
import Dropdown from "./Dropdown";
import { languages } from "../utils/common";

const TestSeriesForm = ({
  currentExamInfo,
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
}) => {
  return (
    <div className="w-full flex flex-col gap-2 overflow-auto">
      {currentExamInfo && (
        <div>
          <h1>
            <span className="text-[#596780] font-medium text-lg">EXAM: </span>
            <span>{currentExamInfo.exam} </span>{" "}
          </h1>
          <p>
            <span className="text-[#596780] font-medium text-lg">SUBJECTS: </span>
            {currentExamInfo?.default_pattern?.subjects.map(
              ({ subject: currentSubject }, index) => (
                <span key={currentSubject}>
                  {currentSubject}
                  {index + 1 !==
                    currentExamInfo?.default_pattern?.subjects.length && ", "}
                </span>
              )
            )}
          </p>
        </div>
      )}
      <hr className="w-full border-t border-t-[#e9ecef]"></hr>
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
          <label htmlFor="difficulty" className="text-[#596780] font-medium text-lg">
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
        <textarea
          name="description"
          id="description"
          value={description}
          placeholder="Description for test"
          className="w-full outline-none border border-[#ced4da] bg-white p-2 rounded-md resize-none"
          rows={5}
          onChange={(e) => handleChange(e)}
        />
      </div>
      <div className="flex justify-center items-center text-[#596780] [&>div]:flex-1 gap-4">
        <div className="flex flex-col w-[30%] gap-2">
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
        <div className="flex flex-row justify-center w-[30%] gap-2 mt-9 bg-gray-50 border border-gray-300 rounded-md">
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              id="free"
              name="is_paid"
              value={TEST_SERIES_TYPE.Free}
              checked={testSeriesType == TEST_SERIES_TYPE.Free}
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
              checked={testSeriesType == TEST_SERIES_TYPE.Paid}
              onChange={(e) => handleChange(e)}
              className="accent-[#6d45a4]"
            />
            <label htmlFor="paid">Paid</label>
          </div>
        </div>
      </div>
      {testSeriesType == TEST_SERIES_TYPE.Paid && (
        <div className="flex justify-center items-center gap-4 text-[#596780] [&>div]:flex-1 flex-wrap">
          <div className="flex flex-col  gap-2">
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
              value={price}
              placeholder="price for test series"
              className="w-full outline-none border border-gray-300 bg-gray-50 px-2 py-2 rounded-md"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="price"
              className="text-[#596780] font-medium text-lg"
            >
              Discount
            </label>
            <div className="flex">
              <input
                type="number"
                id="discount"
                name="discount"
                value={discount}
                placeholder="discount in percentage"
                className="w-full outline-none border-s border-y border-gray-300 bg-gray-50 px-2 py-2 rounded-s-md"
                onChange={(e) => handleChange(e)}
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
          <div className="flex flex-col  gap-2">
            <label
              htmlFor="price"
              className="text-[#596780] font-medium text-lg"
            >
              Final Price
            </label>
            <input
              type="number"
              id="finalPrice"
              name="price"
              value={finalPrice}
              placeholder=""
              className="w-full outline-none border border-gray-300 bg-gray-50 px-2 py-2 rounded-md"
              onChange={(e) => handleChange(e)}
              disabled={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestSeriesForm;
