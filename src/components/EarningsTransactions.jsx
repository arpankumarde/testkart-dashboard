import { useState } from "react";
import { GrTransaction } from "react-icons/gr";
import { RiArrowDropDownLine } from "react-icons/ri";

const EarningsTransactions = () => {
  const [tab, setTab] = useState("all");

  return (
    <div className="bg-white md:rounded-md p-4 flex-1">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl flex items-center gap-2">
          <i>
            <GrTransaction size={20} />
          </i>
          <span>Transactions</span>
        </h2>
        <div className="relative">
          <select
            name="period"
            defaultValue={"all"}
            className="cursor-pointer border border-gray-200 appearance-none pl-4 pr-8 py-1.5 rounded-md outline-none bg-gray-100 active:bg-gray-200 [&>*]:bg-white"
          >
            <option value="all">All Time</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <i className="pointer-events-none absolute inset-y-0 right-0 pr-1 flex items-center text-[#6d45a4]">
            <RiArrowDropDownLine size={29} />
          </i>
        </div>
      </div>
      <hr />
      <div className="">
        <div className="flex justify-between items-center gap-2 py-4 md:gap-4 [&>*]:rounded-md [&>*]:py-2 [&>*]:w-1/3 [&>*]:text-center [&>*]:cursor-pointer">
          <span
            onClick={() => setTab("all")}
            className={tab == "all" && "bg-[#6d45a4] text-white"}
          >
            All
          </span>
          <span
            onClick={() => setTab("credit")}
            className={tab == "credit" && "bg-[#6d45a4] text-white"}
          >
            Credit
          </span>
          <span
            onClick={() => setTab("debit")}
            className={tab == "debit" && "bg-[#6d45a4] text-white"}
          >
            Debit
          </span>
        </div>
        <div className="h-96 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white">
              <tr className="text-center">
                <th className="px-4 py-2">Particulars</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Balance</th>
                <th className="px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 1</td>
                <td className="px-4 py-2">2022-01-01</td>
                <td className="px-4 py-2">Credit</td>
                <td className="px-4 py-2">₹ 1000</td>
                <td className="px-4 py-2">₹ 50</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 2</td>
                <td className="px-4 py-2">2022-01-02</td>
                <td className="px-4 py-2">Debit</td>
                <td className="px-4 py-2">₹ 950</td>
                <td className="px-4 py-2">₹ 100</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 3</td>
                <td className="px-4 py-2">2022-01-03</td>
                <td className="px-4 py-2">Credit</td>
                <td className="px-4 py-2">₹ 900</td>
                <td className="px-4 py-2">₹ 75</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 4</td>
                <td className="px-4 py-2">2022-01-04</td>
                <td className="px-4 py-2">Debit</td>
                <td className="px-4 py-2">₹ 825</td>
                <td className="px-4 py-2">₹ 125</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 5</td>
                <td className="px-4 py-2">2022-01-05</td>
                <td className="px-4 py-2">Credit</td>
                <td className="px-4 py-2">₹ 900</td>
                <td className="px-4 py-2">₹ 50</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 6</td>
                <td className="px-4 py-2">2022-01-06</td>
                <td className="px-4 py-2">Debit</td>
                <td className="px-4 py-2">₹ 850</td>
                <td className="px-4 py-2">₹ 75</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 7</td>
                <td className="px-4 py-2">2022-01-07</td>
                <td className="px-4 py-2">Credit</td>
                <td className="px-4 py-2">₹ 925</td>
                <td className="px-4 py-2">₹ 100</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 8</td>
                <td className="px-4 py-2">2022-01-08</td>
                <td className="px-4 py-2">Debit</td>
                <td className="px-4 py-2">₹ 825</td>
                <td className="px-4 py-2">₹ 150</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 9</td>
                <td className="px-4 py-2">2022-01-09</td>
                <td className="px-4 py-2">Credit</td>
                <td className="px-4 py-2">₹ 900</td>
                <td className="px-4 py-2">₹ 50</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 10</td>
                <td className="px-4 py-2">2022-01-10</td>
                <td className="px-4 py-2">Debit</td>
                <td className="px-4 py-2">₹ 850</td>
                <td className="px-4 py-2">₹ 75</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 11</td>
                <td className="px-4 py-2">2022-01-11</td>
                <td className="px-4 py-2">Credit</td>
                <td className="px-4 py-2">₹ 925</td>
                <td className="px-4 py-2">₹ 100</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 12</td>
                <td className="px-4 py-2">2022-01-12</td>
                <td className="px-4 py-2">Debit</td>
                <td className="px-4 py-2">₹ 825</td>
                <td className="px-4 py-2">₹ 150</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 13</td>
                <td className="px-4 py-2">2022-01-13</td>
                <td className="px-4 py-2">Credit</td>
                <td className="px-4 py-2">₹ 900</td>
                <td className="px-4 py-2">₹ 50</td>
              </tr>
              <tr className="text-center">
                <td className="px-4 py-2">Dummy Particulars 14</td>
                <td className="px-4 py-2">2022-01-14</td>
                <td className="px-4 py-2">Debit</td>
                <td className="px-4 py-2">₹ 850</td>
                <td className="px-4 py-2">₹ 75</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsTransactions;
