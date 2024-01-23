import React, { useEffect, useState } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [showDoneMessage, setShowDoneMessage] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        // Increase the progress by 4% each second
        const newProgress = prevProgress + 4;

        // Clear the interval when progress reaches 100%
        if (newProgress >= 100) {
          clearInterval(intervalId);
          setShowDoneMessage(true);

          // Hide the component after 3 seconds
          setTimeout(() => {
            setShowDoneMessage(false);
          }, 4000);
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
        <div className="relative flex items-center justify-center w-full h-5 bg-gray-200 rounded-full my-4">
          <div
            style={{ width: `${progress}%` }}
            className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-800 h-full rounded-full transition-all"
          ></div>
          <span className="z-10 text-white">{progress}%</span>
        </div>
        <p>question are importing please wait....</p>
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
