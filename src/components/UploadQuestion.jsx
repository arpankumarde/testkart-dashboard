import React, { useState } from "react";
import Modal from "./Modal";

const UploadQuestion = ({isModalOpen , setIsModalOpen}) => {
  return (
    <Modal
      title={"Upload question in bulk"}
      className={"max-w-full !p-0 [&>div]:!h-screen !overflow-hidden"}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
    >
      <div className="text-[#4e4a4a] flex flex-col items-center h-[82vh]">
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
          <input type="file" id="questionfile" name="questionfile" />
        </div>
      </div>
    </Modal>
  );
};

export default UploadQuestion;
