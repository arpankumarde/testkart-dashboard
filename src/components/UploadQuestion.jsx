import React, { useState } from "react";
import Modal from "./Modal";
import { server } from "../api";
import { useParams } from "react-router-dom";

const UploadQuestion = ({ isModalOpen, setIsModalOpen, subject_id }) => {
  const [questionFile, setQuestionFile] = useState(null);
  const [isLoading , setIsLoading] = useState(false)

  const params = useParams();
  console.log(params, "paramss");
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setQuestionFile(file);
  };

  const handleUploadFileToServer = async () => {
    setIsLoading(true)
      try {

        if (questionFile) {
          const formData = new FormData();
          formData.append("file", questionFile);
    
          const uploadQuestionUrl = `/api/v1/test-series/test/question/import/${params.test_id}?subject_id=${subject_id}`;
          const { data } = await server.post(uploadQuestionUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', 
            },
          });
          if(data.success){
            window.alert(data.message)
            setIsModalOpen(false)
          }
        }else{
          window.alert(`please select file to upload`)
        }
      } catch (error) {
        console.log(`Error handleUploadFileToServer::` ,error)
      }finally{
        setIsLoading(false)

      }
  };

  return (
    <Modal
      title={"Upload question in bulk"}
      className={"max-w-full !p-0 [&>div]:!h-screen !overflow-hidden"}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      onAccept={() => handleUploadFileToServer()}
    >
      <div className="text-[#4e4a4a] flex flex-col items-center h-[78vh]">
        <div className="text-[#4e4a4a] text-center py-10 px-10 border-b border-b-[#4e4a4a] flex flex-col gap-3">
          <h1 className="leading-6 text-xl font-semibold">
            Download the bulk upload template file
          </h1>
          <p>
            This template is a doc file, you have to put all you questions and
            answers in the given format 2 questions are given for your refrence
          </p>
          <a href="" className="text-blue-700">
            template.docx
          </a>
        </div>
        <div className="p-10 text-[#4e4a4a] text-center flex flex-col gap-3">
          <h1 className=" leading-6 text-xl font-semibold">
            Please use the template to upload your question
          </h1>
          <input
            type="file"
            id="questionfile"
            name="questionfile"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </Modal>
  );
};
export default UploadQuestion;
