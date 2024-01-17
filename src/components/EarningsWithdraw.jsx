import { MdCurrencyRupee } from "react-icons/md";
import { PiExportFill } from "react-icons/pi";

const EarningsWithdraw = ({ balance }) => {
  const handleWithdrawRequest = (e) => {
    e.preventDefault();
    console.log("Withdraw Requested");
  };

  return (
    <div className="bg-white md:rounded-md p-4 flex-1">
      <h2 className="text-xl flex items-center gap-2 mb-4">
        <i>
          <PiExportFill size={25} />
        </i>
        <span>Withdraw</span>
      </h2>
      <hr />
      <div className="flex flex-col items-center gap-2 py-4">
        <span>Available Balance</span>
        <span className="inline-flex items-center text-4xl font-bold text-gray-700">
          <i className="-mb-0.5">
            <MdCurrencyRupee size={35} />
          </i>
          {balance}
        </span>
      </div>
      <hr />
      <form
        onSubmit={handleWithdrawRequest}
        autoComplete="off"
        autoCorrect="off"
        className="flex flex-col justify-center items-center gap-2 py-4"
      >
        <label htmlFor="withdraw">Enter Amount to withdraw</label>
        <div className="flex items-center bg-gray-100 rounded-md mb-6">
          <i className="bg-gray-300 p-2 rounded-l-md border-y border-x border-gray-300">
            <MdCurrencyRupee size={25} />
          </i>
          <input
            type="number"
            id="withdraw"
            className="rounded-r-md bg-gray-100 p-2 outline-none w-48 border-y border-r border-gray-200"
            min={500}
            max={balance}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#6d45a4] text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg"
        >
          Request Withdraw
        </button>
      </form>
      <hr />
      <p className="text-center pt-4">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam nobis
        est, sequi odit similique rem?
      </p>
    </div>
  );
};

export default EarningsWithdraw;
