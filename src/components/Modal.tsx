import { Button } from ".";

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
  onDelete,
  saveButtonText = "Save changes",
  isLoading,
  saveButtonDisable = false,
}) => {
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    // setIsModalOpen(false);
    onAccept();
  };

  const handleDelete = () => {
    onDelete();
  };

  const handleDecline = () => {
    setIsModalOpen(false);
    onDecline();
  };

  const ModalFooter = ({ className }: { className?: string }) => (
    <div
      className={`flex items-center py-2 border-t border-gray-200 rounded-b gap-4 justify-between ${className}`}
    >
      <Button buttonText={"Cancel"} onClick={handleDecline} />

      {/* Accept */}
      {(showDelete || isDelete) && (
        <button
          onClick={() => {
            if (showDelete) {
              handleDelete();
            } else {
              handleAccept();
            }
          }}
          type="button"
          className="bg-red-500 text-white min-w-[80px] md:min-w-[120px] p-1 md:px-3 md:py-2 flex justify-center items-center rounded-md"
        >
          Delete
        </button>
      )}

      {!isDelete && (
        <Button
          disabled={saveButtonDisable}
          isLoading={isLoading}
          buttonText={isShare ? "Share" : saveButtonText}
          activeTab={true}
          onClick={handleAccept}
        />
      )}
    </div>
  );
  return (
    <div
      className={`${
        isModalOpen ? "fixed" : "hidden"
      } overflow-y-auto overflow-x-hidden top-0 right-0 left-0 z-50 justify-center items-center flex w-full md:inset-0 h-screen max-h-full bg-black bg-opacity-50`}
    >
      <div className={`relative p-4 w-full max-w-2xl max-h-full ${className}`}>
        <div className="relative bg-white rounded-lg shadow p-2">
          <div
            className={`flex p-2 border-b rounded-t flex-wrap ${
              isAddQuestion
                ? "flex-col md:flex-row md:items-center"
                : "items-center justify-between"
            }`}
          >
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            {isAddQuestion ? (
              <ModalFooter className={"!justify-end flex-1 !border-t-0"} />
            ) : (
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
            )}
          </div>

          <div
            className={`px-2 space-y-4 ${
              isAddQuestion
                ? "h-[calc(100dvh-15rem)] md:h-[calc(100dvh-1rem)] overflow-auto"
                : ""
            }`}
          >
            {children}
          </div>
          <ModalFooter className={`${isAddQuestion ? "!hidden" : "!flex"}`} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
