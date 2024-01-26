import React from "react";
import { ButtonLoader } from "./Loader";

const Button = ({activeTab , onClick , buttonText , className , isLoading , disabled=false}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`md:px-3 md:py-2 p-1 min-w-[80px] md:min-w-[120px] flex justify-center items-center rounded-md  ${
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
