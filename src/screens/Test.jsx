import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../api";
import { Button, Loader, Modal } from "../components";
import { IoMdArrowRoundBack } from "react-icons/io";
import AddQuestion from "../components/AddQuestion";
import { ADD_QUESTION, DELETE } from "../utils/constant";
import UploadQuestion from "../components/UploadQuestion";

const Test = () => {
  const [test, setTest] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [activeSubject, setActiveSubject] = useState(1);
  const [currentSubjectInfo, setCurrentSubjectInfo] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const [questions, setQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [question_id, setQuestionId] = useState("");
  const [modal, setModal] = useState("");

  const getTestInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get(
        `api/v1/test-series/test/${params.test_id}`
      );
      if (data) {
        console.log(data, "data");
        const currentTest = data.data?.[0];
        setTest(currentTest ?? {});
        if (currentTest) {
          const includedSubjects = currentTest.subjects.filter(
            ({ inclued }) => inclued
          );

          setActiveSubject(includedSubjects[0]?.subject_id ?? "");
          setCurrentSubjectInfo(includedSubjects[0]);
          await getAllQuestions();
        }
      }
    } catch (error) {
      console.log(`Error: getAllTests --- ${error}}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getAllQuestions = async () => {
    try {
      const allQuestions = test?.subjects
        .filter(({ inclued }) => inclued)
        .map(async ({ subject_id }) => {
          const { data } = await server.get(
            `api/v1/test-series/test/question?test_id=${params.test_id}&subject_id=${subject_id}`
          );

          if (data.data) {
            console.log(data.data.question ?? []);
            const response = data.data.questions ?? [];
            return { [subject_id]: response };
          }
          return { [subject_id]: [] };
        });

      const data = await Promise.all(allQuestions);

      const questionsObject = await data.reduce(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setQuestions(questionsObject);
    } catch (error) {}
  };

  useEffect(() => {
    getTestInfo();
  }, []);

  useEffect(() => {
    getAllQuestions();
  }, [test]);

  const getQuestionId = () => {
    const res = questions[activeSubject]?.find(
      ({ index }) => index === currentQuestion - 1
    );
    console.log(res, "ress");
    setQuestionId(res?.question_id);
    return res?.question_id ?? null;
  };

  useEffect(() => {
    getQuestionId();
  }, [questions, currentQuestion]);

  const deleteQuestionFromtest = async () => {
    setIsLoading(true);
    try {
      await server.delete(`api/v1/test-series/test/question/${question_id}`);
      setQuestions((prev) => ({
        ...prev,
        [activeSubject]: questions[activeSubject]?.filter(
          ({ index }) => index != currentQuestion - 1
        ),
      }));
      setModal("");
    } catch (error) {
      console.log(`Error: deleteTestFromTestSeries --- ${error}}`);
    } finally {
      setIsLoading(false);
    }
  };
  //

  console.log(questions, "okk");
  return (
    <section className="px-[15px] py-3 flex flex-col gap-3">
      {isLoading && <Loader />}
      <AddQuestion
        title={`${
          !!questions[activeSubject]?.find(
            ({ index }) => index === currentQuestion
          )
            ? "Edit Question"
            : "Add Question"
        } ${currentQuestion} in ${currentSubjectInfo.label}`}
        isAddQuestion={!!currentQuestion}
        currentQuestion={currentQuestion}
        subject_id={activeSubject}
        setIsAddQuestion={() => setCurrentQuestion("")}
        question_id={question_id}
        onChange={(type, fn) => {
          if (type === DELETE) {
            deleteQuestionFromtest();
            fn(false);
          } else {
            getAllQuestions();
          }
        }}
      />
      <UploadQuestion isModalOpen={modal==='upload'} setIsModalOpen={setModal} subject_id={activeSubject} />
      <div className="w-full flex-col p-5 shadow-card bg-white">
        <div className="flex justify-between">
          <div className="relative">
            <p className="flex gap-2 items-center justify-center">
              <IoMdArrowRoundBack
                size={24}
                className="cursor-pointer"
                onClick={() => navigate(`/test-series/${params.series_id}`)}
              />
              <h1 className="font-medium text-lg">{test.title}</h1>
            </p>
          </div>
          <button
            onClick={() => setModal("upload")}
            type="button"
            className="bg-[#6c757d]  text-white border border-[#6c757d] rounded-[3px] text-base px-2 py-1 leading-6 delay-100 ease-in-out"
          >
            Import Questions
          </button>
        </div>
        <div className="flex gap-4 justify-start items-center py-4 flex-wrap">
          {test?.subjects
            ?.filter(({ inclued }) => inclued)
            .map(({ label, total_questions, question_count, subject_id }) => (
              <Button
                activeTab={activeSubject === subject_id}
                buttonText={`${label} (${question_count}/${total_questions})`}
                onClick={() => {
                  setActiveSubject(subject_id);
                  const currentSubject = test.subjects.find(
                    ({ subject_id: id }) => subject_id === id
                  );
                  setCurrentSubjectInfo(currentSubject);
                }}
              />
            ))}
        </div>
      </div>

      <div className="p-6 bg-white w-full md:min-h-[120px]">
        <div className="flex gap-4 justify-start flex-wrap">
          {!!currentSubjectInfo.total_questions &&
            new Array(parseInt(currentSubjectInfo.total_questions))
              ?.fill(null)
              .map((_, i) => (
                <Button
                  activeTab={
                    !!questions[activeSubject]?.find(({ index }) => index === i)
                  }
                  buttonText={i + 1}
                  onClick={() => setCurrentQuestion(i + 1)}
                  className="min-w-[100px] h-[28px] flex justify-center items-center rounded-[5px]"
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default Test;
