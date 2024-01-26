import React, { useEffect, useState } from "react";

const ProgressBar = ({hideLoader}) => {
  const [progress, setProgress] = useState(0);
  const [showDoneMessage, setShowDoneMessage] = useState(false);

  const resetProgress = () => {
    setProgress(0);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;

        // Clear the interval when progress reaches 100%
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setShowDoneMessage(true);

          // Hide the component after 3 seconds
          setTimeout(() => {
            resetProgress()
            setShowDoneMessage(false);
            hideLoader?.()
          }, 2000);
        }

        return newProgress;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {progress < 100 && (
        <div>
        <div className="relative flex items-center justify-center w-full h-4 bg-gray-200 rounded-full my-4">
          <div
            style={{ width: `${progress}%` }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-800 h-full rounded-full transition-all"
          ></div>
          <span className="z-10 text-white">{progress}%</span>
        </div>
        <p className="text-lg text-blue-500 leading-6 font-medium">question are importing please wait....</p>
        </div>
      )}

      {showDoneMessage && (
        <div>
          <span className="text-green-500 font-medium text-lg">New Questions are imported Successfully</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
