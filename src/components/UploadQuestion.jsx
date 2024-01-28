import { useState } from "react";
import { Modal } from "./";
import { server } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import ProgressBar from "./ProgressBar";

const UploadQuestion = ({ isModalOpen, setIsModalOpen, subject_id }) => {
  const [questionFile, setQuestionFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setQuestionFile(file);
  };

  const handleUploadFileToServer = async () => {
    setIsLoading(true);
    try {
      if (questionFile) {
        const formData = new FormData();
        formData.append("file", questionFile);

        const uploadQuestionUrl = `/api/v1/test-series/test/question/import/${params.test_id}?subject_id=${subject_id}`;
        const { data } = await server.post(uploadQuestionUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (data.success) {
          setShowLoader(true);
        }
      } else {
        alert("Please select file to upload");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={"Upload question in Bulk"}
      className={"max-w-full !p-0 [&>div]:!h-dvh !overflow-hidden"}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      onAccept={() => handleUploadFileToServer()}
      onDecline={() =>
        navigate(
          `/test-series/${params.series_id}/test/${params.test_id}/questions`
        )
      }
      saveButtonText={"Upload Docs"}
      isLoading={isLoading}
      footerClassName="absolute right-4 top-0"
      isAddQuestion={true}
      saveButtonDisable={!questionFile}
    >
      <div className="text-[#4e4a4a] flex flex-col items-center h-[76vh]">
        <div className="text-[#4e4a4a] text-center py-10 px-10 border-b border-b-[#4e4a4a] flex flex-col gap-3">
          <h1 className="leading-6 text-xl font-semibold">
            Download the bulk upload template file
          </h1>
          <p>
            This template is a doc file, you have to put all you questions and
            answers in the given format.
            <br />2 questions are given for your reference
          </p>
          <a
            href="/static/docs/template.docx"
            className="text-blue-700"
            download={true}
          >
            template.docx
          </a>
        </div>
        <div className="p-10 text-[#4e4a4a] text-center flex flex-col gap-3">
          <h1 className="leading-6 text-xl font-semibold">
            Please use the template to upload your question
          </h1>
          <input
            type="file"
            id="questionfile"
            name="questionfile"
            onChange={handleFileChange}
            className="p-2 bg-gray-100 rounded-md"
          />
          {showLoader && (
            <ProgressBar
              hideLoader={() => {
                setShowLoader(false);
                window.alert(`your questions are imported successfully please wait for 5 minutes.`)
                setIsModalOpen(false)
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
export default UploadQuestion;
