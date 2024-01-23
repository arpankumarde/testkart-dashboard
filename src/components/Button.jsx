import React from "react";
import { ButtonLoader } from "./Loader";

const Button = ({activeTab , onClick , buttonText , className , isLoading}) => {
  return (
    <button
      disabled={isLoading}
      className={`px-3 py-2 min-w-[120px] flex justify-center items-center  ${
        activeTab
          ? "border-1 border-[#6d45a4] bg-[#6d45a4] text-white"
          : " bg-transparent border border-[#6d45a4] text-black"
      } ${className}`}
      onClick={onClick}
    >
     {isLoading ?  <ButtonLoader /> : buttonText}
    </button>
  );
};

export default Button;
