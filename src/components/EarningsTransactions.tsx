import { useEffect, useState } from "react";
import { useAuth } from "../hooks";
import { server } from "../api";
import { GrTransaction } from "react-icons/gr";
import { RiArrowDropDownLine } from "react-icons/ri";
import { BiLoaderAlt } from "react-icons/bi";

const EarningsTransactions = () => {
  const { logout } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    server
      .get("/api/v1/studio/academy/transaction-report")
      .then((res) => {
        console.log(res.data.data);
        setTransactions(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 401) return logout();
        console.log(err);
        setLoading(false);
      });
  }, []);

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
      <div>
        <div className="h-[22rem] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-white border-b">
              <tr className="text-center">
                <th className="px-4 py-2">Particulars</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Balance</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 hover:[&>*]:text-gray-950 hover:[&>*]:bg-gray-100">
              {transactions.length != 0 ? (
                transactions.map((transaction, key) => (
                  <tr className="text-center border-b" key={key}>
                    <td className="px-4 py-2">
                      {transaction?.title ?? "Untitled Transaction"}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(transaction?.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">₹ {transaction.amount ?? 0}</td>
                    <td className="px-4 py-2">₹ {transaction.balance ?? 0}</td>
                    <td className="px-4 py-2 text-white capitalize text-sm">
                      <span
                        className={`${
                          transaction.status.toLowerCase() == "success"
                            ? "bg-green-600"
                            : transaction.status.toLowerCase() == "pending"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        } px-4 py-1 rounded-full`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="text-center">
                  <td className="px-4 py-2" colSpan="5">
                    {loading ? (
                      <>
                        <span>Loading Transactions</span>
                        {"  "}
                        <BiLoaderAlt
                          className="inline animate-spin"
                          size={20}
                        />
                      </>
                    ) : (
                      "No Transactions Found"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EarningsTransactions;
