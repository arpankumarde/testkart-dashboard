import React, { useState } from "react";
import Button from "./Button";
import { DELETE } from "../utils/constant";

const Modal = ({
  isModalOpen,
  setIsModalOpen,
  title,
  children,
  onAccept,
  onDecline,
  isDelete,
  isShare,
  isAddQuestion,
  className,
  showDelete,
  onDelete
}) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    // setIsModalOpen(false);
    onAccept();
  };

  const handleDelete = () =>{
    onDelete()
  }

  const handleDecline = () => {
    setIsModalOpen(false);
    onDecline();
  };

  return (
    <div
      className={`${
        isModalOpen ? "fixed" : "hidden"
      } overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center flex w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-black bg-opacity-50`}
    >
      <div className={`relative p-4 w-full max-w-2xl max-h-full ${className}`}>
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              type="button"
              onClick={handleCloseModal}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-2  space-y-4">{children}</div>

          <div
            className={`flex items-center p-4  border-t border-gray-200 rounded-b dark:border-gray-600 gap-4 ${
              isAddQuestion ? "justify-end" : "justify-between "
            }`}
          >
            {/* cancel */}
            {isAddQuestion ? (
              <button
                className="px-3 py-2 text-white bg-[#596780]"
                onClick={handleDecline}
              >
                Close
              </button>
            ) : (
              <Button buttonText={"Cancel"} onClick={handleDecline} />
            )}

            {/* Accept */}
            {(showDelete || isDelete) && (
              <button
                onClick={() => {
                  if (showDelete) {
                    handleDelete()
                  } else {
                    handleAccept();
                  }
                }}
                type="button"
                className="bg-red-500 text-white px-3 py-2 flex justify-center items-center "
              >
                Delete
              </button>
            )}

            {!isDelete && (
              <Button
                buttonText={isShare ? "Share" : "Save changes"}
                activeTab={true}
                onClick={handleAccept}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
