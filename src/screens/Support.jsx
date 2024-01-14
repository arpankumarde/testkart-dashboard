import { SupportAccordion } from "../components";
import { GoQuestion } from "react-icons/go";
import { IoTicketOutline } from "react-icons/io5";

const Support = () => {
  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 w-full md:w-96">
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <i className="-mb-0.5">
              <GoQuestion size={25} />
            </i>
            <span>FAQs</span>
          </h2>
          <div className="overflow-y-auto h-80">
            <SupportAccordion />
          </div>
          <button
            type="button"
            className="text-center w-full bg-gray-100 hover:bg-gray-200 mt-4 px-4 py-2 rounded-md"
          >
            View More
          </button>
        </div>
        <div className="bg-white md:rounded-md p-4 flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl flex items-center gap-2">
              <i>
                <IoTicketOutline size={25} />
              </i>
              <span>Support Tickets</span>
            </h2>
            <button
              type="button"
              className="cursor-pointer p-4 py-1.5 rounded-md outline-none bg-[#6d45a4] text-white"
            >
              Raise Ticket
            </button>
          </div>
          <div className="overflow-y-auto h-80">
            <SupportAccordion />
          </div>
          <button className="text-center w-full bg-gray-100 hover:bg-gray-200 mt-4 px-4 py-2 rounded-md">
            View More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Support;
