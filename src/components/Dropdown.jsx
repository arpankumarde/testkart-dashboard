import { useState, useEffect, useRef, Fragment } from "react";

const Dropdown = ({
  items,
  buttonText,
  handleChange,
  className,
  children,
  hideAfterClick = false,
  selectedValue,
}) => {
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
          className="dropdown-button flex justify-center items-center border-[#6d45a4] border py-1 px-4 font-normal rounded-md"
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
        <div className={`dropdown-menu bg-white shadow-card p-1 ${className}`}>
          <ul className="dropdown-list">
            {items.map((item, index) => (
              <Fragment key={item.label}>
                <li
                  key={`${item.label - index}`}
                  className={`dropdown-item py-2 px-6 w-full hover:bg-gray-100 cursor-pointer whitespace-nowrap ${
                    item.label === "Unlist" ? "!text-red-600" : ""
                  } ${selectedValue === item.label && "text-[#833ee4]"}`}
                  onClick={() => {
                    handleChange(item.label);
                    if (hideAfterClick) {
                      setIsOpen(false);
                    }
                  }}
                >
                  {item.label}
                </li>
                {/* divider */}
                {index + 1 !== items.length && (
                  <div className="h-0 my-2 w-full  border-t border-t-[#e9ecef]"></div>
                )}
              </Fragment>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
