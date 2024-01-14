import React, { useState, useEffect, useRef , memo} from "react";

const Dropdown = ({ items, buttonText, handleChange, className, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      {buttonText && (
        <button
          onClick={toggleDropdown}
          className="dropdown-button flex justify-center items-center bg-[#545b62] border-t-current py-1 px-2 text-white font-normal"
        >
          {buttonText}
          <svg
            className="w-2.5 h-2.5 ms-1"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
      )}

      {children && <button onClick={toggleDropdown}> {children} </button>}

      {isOpen && (
        <div className={`dropdown-menu bg-white  shadow-card p-1 ${className}`}>
          <ul className="dropdown-list">
            {items.map((item, index) => (
              <>
                <li
                  key={`${item.label - index}`}
                  className={`dropdown-item py-2 px-6 w-full hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer whitespace-nowrap ${item.label ==='Unlist' ? '!text-red-600' :''}`}
                  onClick={() => handleChange(item.label)}
                >
                  {item.label}
                </li>
                {/* divider */}
                {index + 1 !== items.length && (
                  <div className="h-0 my-2 w-full  border-t border-t-[#e9ecef]"></div>
                )}
              </>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default  Dropdown;
