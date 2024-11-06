import { useState, useEffect, Fragment } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { server } from "../api";
import { Button, Loader, Modal } from "../components";
import AddQuestion from "../components/AddQuestion";
import UploadQuestion from "../components/UploadQuestion";
import { ADD_QUESTION, DELETE } from "../utils/constant";
import { IoChevronBackOutline } from "react-icons/io5";

const Test = () => {
  const [test, setTest] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [activeSubject, setActiveSubject] = useState(1);
  const [currentSubjectInfo, setCurrentSubjectInfo] = useState({});
  const navigate = useNavigate();
  const params = useParams();
  const [questions, setQuestions] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [question_id, setQuestionId] = useState("");
  const [modal, setModal] = useState("");

  const searchParams = useSearchParams()[0];

  const getTestInfo = async () => {
    setIsLoading(true);
    try {
      const { data } = await server.get(
        `api/v1/test-series/test/${params.test_id}`
      );
      if (data) {
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
  }, [modal]);

  useEffect(() => {
    getAllQuestions();
  }, [test]);

  const getQuestionId = () => {
    const res = questions[activeSubject]?.find(
      ({ index }) => index === currentQuestion - 1
    );
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("subject_id")) {
      setModal("upload");
    }
  }, [searchParams]);

  return (
    <section className="md:p-4 lg:p-8 relative">
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
            getTestInfo();
            getAllQuestions();
          }
        }}
      />
      <UploadQuestion
        isModalOpen={modal === "upload"}
        setIsModalOpen={setModal}
        subject_id={searchParams?.get("subject_id") ?? activeSubject}
      />
      <div className="w-full flex-col p-4 shadow-card bg-white">
        <div className="flex items-center justify-between">
          <div className="relative">
            <p className="flex gap-2 items-center justify-center">
              <Link
                to={`/test-series/${params.series_id}`}
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
              >
                <i>
                  <IoChevronBackOutline size={20} />
                </i>
              </Link>
              <h1 className="font-medium text-lg">{test.title}</h1>
            </p>
          </div>
          <button
            onClick={() => {
              navigate(
                `/test-series/${params.series_id}/test/${params.test_id}/questions?subject_id=${activeSubject}`
              );
            }}
            type="button"
            className="bg-[#6c757d]  text-white border border-[#6c757d] rounded-[3px] text-base px-2 py-1 leading-6 delay-100 ease-in-out"
          >
            Import Questions
          </button>
        </div>
        <div className="flex gap-4 justify-start items-center pt-4 flex-wrap">
          {test?.subjects
            ?.filter(({ inclued }) => inclued)
            .map(({ label, total_questions, question_count, subject_id }) => (
              <Fragment key={subject_id}>
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
              </Fragment>
            ))}
        </div>
      </div>
      <hr />
      <div className="p-6 bg-white w-full md:min-h-[120px]">
        <div className="flex gap-4 justify-center flex-wrap">
          {!!currentSubjectInfo.total_questions &&
            new Array(parseInt(currentSubjectInfo.total_questions))
              ?.fill(null)
              .map((_, i) => (
                <Fragment key={i}>
                  <Button
                    activeTab={
                      !!questions[activeSubject]?.find(
                        ({ index }) => index === i
                      )
                    }
                    buttonText={i + 1}
                    onClick={() => setCurrentQuestion(i + 1)}
                    className="min-w-[100px] h-[28px] flex justify-center items-center rounded-[5px]"
                  />
                </Fragment>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Test;
