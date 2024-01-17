import { MdEmail, MdOutlineMenuBook } from "react-icons/md";

const EarningsStatement = () => {
  const handleStatementRequest = (e) => {
    e.preventDefault();
    console.log("Statement Requested");
  };

  return (
    <div className="bg-white md:rounded-md p-4 flex-1">
      <h2 className="text-xl flex items-center gap-2 mb-4">
        <i>
          <MdOutlineMenuBook size={25} />
        </i>
        <span>Statement</span>
      </h2>
      <hr />
      <form
        onSubmit={handleStatementRequest}
        className="flex flex-col justify-center items-center gap-2 py-6"
      >
        <label htmlFor="statement">Please enter your email</label>
        <div className="flex items-center bg-gray-100 rounded-md mb-6">
          <i className="bg-gray-300 p-2 rounded-l-md border-y border-x border-gray-300">
            <MdEmail size={25} />
          </i>
          <input
            type="email"
            id="statement"
            className="rounded-r-md bg-gray-100 p-2 outline-none w-48 border-y border-r border-gray-200"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#6d45a4] text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg"
        >
          Request Statement
        </button>
      </form>
      <hr />
      <p className="text-center py-6">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam nobis
        est, sequi odit similique rem?
      </p>
    </div>
  );
};

export default EarningsStatement;
