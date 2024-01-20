import React, { useEffect, useState } from "react";
import { MdCancel } from "react-icons/md";
import ReactQuillComponet from "./ReactQuill";
import Modal from "./Modal";
import { useParams } from "react-router-dom";
import { server } from "../api";
import Loader from "./Loader";

const optionInitialState = [
  {
    option: "",
    is_correct: false,
  },
]

const AddQuestion = ({
  isAddQuestion,
  setIsAddQuestion,
  currentQuestion,
  subject_id,
  title,
  question_id,
  onChange
}) => {
  const [question_type, setQuestionType] = useState("MCQ-S");
  const [question, setQuestion] = useState("");
  const [solution, setSolution] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();

  const [options, setOptions] = useState(optionInitialState);
  const handleChange = (index) => {
    const isCorrectOptionExist = options.find((item) => item.is_correct);

    const newOptions = [...options];
    const currentOption = newOptions[index];

    if (isCorrectOptionExist && currentOption.is_correct) {
      newOptions[index].is_correct = !newOptions[index].is_correct;
    } else if (isCorrectOptionExist) {
      return alert(`you can only select 1 correct option`);
    } else {
      newOptions[index].is_correct = true;
    }
    return setOptions(newOptions);
  };

  const clearState = () => {
    setOptions([])
    setQuestion('')
    setSolution('')
  }

  const handleValueChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index].option = value;
    setOptions(newOptions);
  };

  const handleDelete = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const addQuestionRequest = async () => {
    const formData = {
      index: currentQuestion - 1,
      options,
      question,
      question_type,
      solution,
      subject_id,
      test_id: params.test_id,
    };
    try {
      setIsLoading(true);

      if (question_id) {
        await server.put(
          `/api/v1/test-series/test/question/${question_id}`,
          formData
        );
      } else {
        await server.post("/api/v1/test-series/test/question", formData);
      }
      await  onChange()
      setIsAddQuestion('')
      clearState()
    } catch (error) {
      console.log(error, "error while adding Question:" ,error);
    } finally {
      setIsLoading(false);
    }
  };

  const getQuestionInfo = async () => {
    try {
      console.log(question_id, "quu");
      if (question_id) {
        setIsLoading(true);
        const { data } = await server.get(
          `/api/v1/test-series/test/question/${question_id}`
        );
        if (data.data) {
          const currentQuestion = data?.data?.question;
          setQuestion(currentQuestion.question);
          setQuestionType(currentQuestion.question_type);
          setOptions(JSON.parse(currentQuestion.options));
          setSolution(currentQuestion.solution);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getQuestionInfo();
  }, [question_id]);

  return (
    <Modal
      title={title}
      isModalOpen={isAddQuestion}
      setIsModalOpen={setIsAddQuestion}
      className={"max-w-full !p-0"}
      onAccept={() => addQuestionRequest()}
      onDecline={() => setIsAddQuestion()}
      isAddQuestion={true}
    >
      {isLoading && <Loader />}
      <div className="flex w-full bg-white ">
        <div className="w-[50%] p-5 overflow-scroll h-[75vh] lg:h-[80vh] custom-scroll-bar">
          <div className="flex flex-col gap-3">
            <div className="flex gap-4 items-center">
              <p className="whitespace-nowrap text-lg font-medium">
                Question Type
              </p>
              <select
                onChange={(e) => setQuestionType(e.target.value)}
                id="language"
                name="language"
                value={question_type}
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
              >
                <option value="MCQ-S" className="">
                  MCQ-SingleSelect
                </option>
              </select>
            </div>
            <p className="text-lg font-medium">Question :</p>
            <ReactQuillComponet
              value={question}
              setValue={(e) => setQuestion(e)}
            />
            {options?.map((item, index) => (
              <div className="flex flex-col gap-4" key={index}>
                <div className="flex justify-between">
                  <h1 className="text-lg font-medium">Option {index + 1}</h1>
                  <MdCancel
                    size={25}
                    onClick={() => handleDelete(index)}
                    className="cursor-pointer"
                  />
                </div>
                <ReactQuillComponet
                  value={item.option}
                  setValue={(e) => handleValueChange(e, index)}
                />
                <div
                  className="w-full flex gap-2"
                  onClick={() => handleChange(index)}
                  role="button"
                >
                  <input
                    type="checkbox"
                    name="checked"
                    checked={item.is_correct ? true : false}
                  />
                  <span>if this option is correct</span>
                </div>
              </div>
            ))}

            <button
              className="bg-[#596780] px-3 py-2 text-white font-semibold w-[200px]"
              onClick={() =>
                setOptions((prev) => [
                  ...prev,
                  {
                    option: "",
                    is_correct: false,
                  },
                ])
              }
            >
              Add more options
            </button>
            <div>
              <p className="text-lg font-semibold">Solution:</p>
              <ReactQuillComponet
                value={solution}
                setValue={(val) => setSolution(val)}
              />
            </div>
          </div>
        </div>
        <div className="w-[50%] p-5">
          <div className="min-h-[200px]">
            <h1 className="text-lg font-medium leading-6">Question:</h1>
            <p dangerouslySetInnerHTML={{ __html: question }}></p>
          </div>
          <div className="min-h-[200px]">
            <h1 className="text-lg font-medium leading-6">Options:</h1>
            <div className="flex gap-2 flex-wrap">
              {options
                .filter(({ option: _option }) => !!_option.length)
                .map(({ option }, index) => (
                  <label
                    key={index}
                    className="flex gap-2 w-[40%] font-medium text-lg"
                  >
                    <input
                      type="radio"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => setSelectedOption(option)}
                    />
                    <p dangerouslySetInnerHTML={{ __html: option }}></p>
                  </label>
                ))}
            </div>
          </div>
          <div className="min-h-[200px]">
            <h1 className="text-lg font-medium leading-6">Solution:</h1>
            <p dangerouslySetInnerHTML={{ __html: solution }}></p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddQuestion;
