import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

const FAQData = [
  {
    id: 1,
    question: "Question 1",
    answer: "Answer 1",
  },
  {
    id: 2,
    question: "Question 2",
    answer: "Answer 2",
  },
  {
    id: 3,
    question: "Question 3",
    answer: "Answer 3",
  },
  {
    id: 4,
    question: "Question 4",
    answer: "Answer 4",
  },
  {
    id: 5,
    question: "Question 5",
    answer: "Answer 5",
  },
  {
    id: 6,
    question: "Question 6",
    answer: "Answer 6",
  },
];

const SupportAccordion = () => {
  const [faqData, setFaqData] = useState([]);
  const [activeAccordion, setActiveAccordion] = useState(0);

  const toggleAccordion = (id) => {
    setActiveAccordion(id === activeAccordion ? null : id);
  };

  useEffect(() => {
    setFaqData(FAQData);
  }, []);

  return (
    <div className="rounded-md">
      <hr />
      {faqData.map((faq) => (
        <div
          key={faq.id}
          className={`hover:bg-gray-50 ${
            faq.id === activeAccordion ? "bg-gray-100" : ""
          }`}
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleAccordion(faq.id)}
          >
            <h4 className="text-lg font-medium flex-1">{faq.question}</h4>
            <i
              className={`w-6 h-6 flex justify-center items-center transition-transform ${
                faq.id === activeAccordion ? "transform rotate-180" : null
              }`}
            >
              <IoChevronDown />
            </i>
          </div>
          {faq.id === activeAccordion && (
            <div className="p-4">
              <p>{faq.answer}</p>
            </div>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default SupportAccordion;
