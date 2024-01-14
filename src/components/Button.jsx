import React from "react";

const Button = ({activeTab , onClick , buttonText , className}) => {
  return (
    <button
      className={`px-3 py-2 ${
        activeTab
          ? "border-1 border-[#6d45a4] bg-[#6d45a4] text-white"
          : " bg-transparent border border-[#6d45a4] text-black"
      } ${className}`}
      onClick={onClick}
    >
     {buttonText}
    </button>
  );
};

export default Button;
