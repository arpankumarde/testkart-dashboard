import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks";
import { server } from "../api";
import {
  EarningsOverview,
  EarningsWithdraw,
  EarningsTransactions,
  EarningsBankSettings,
} from "../components";
import { IoIosArrowForward, IoMdWallet } from "react-icons/io";
import { MdCurrencyRupee } from "react-icons/md";

const Earnings = () => {
  const { auth, logout } = useAuth();

  const path = useLocation().pathname.split("/")[2];

  const [earnings, setEarnings] = useState({ wallet: 0, graph: [{}] });

  const getEarningCard = (path = "") => {
    switch (path) {
      case "overview":
        return (
          <EarningsOverview
            graphData={earnings?.graph}
            xKey={"month"}
            barKey={"income"}
          />
        );
      case "withdraw":
        return <EarningsWithdraw balance={earnings?.wallet} />;
      case "transactions":
        return <EarningsTransactions />;
      case "settings":
        return <EarningsBankSettings />;
      default:
        return null;
    }
  };

  useEffect(() => {
    server
      .get("/api/v1/studio/academy/wallet-report")
      .then((res) => {
        if (!res.data.success) {
          alert(res.data.error);
        } else {
          setEarnings(res.data.data);
          console.log(res.data.data);
        }
      })
      .catch((err) => {
        if (err.response.status === 401) return logout();
        console.log(err);
      });
  }, [logout]);

  return (
    <section className="md:p-4 lg:p-8">
      <div className="flex flex-col md:flex-row md:gap-4 lg:gap-8">
        <div className="bg-white md:rounded-md p-4 w-full md:w-80">
          <h2 className="text-xl mb-4 flex items-center justify-center gap-2">
            <i className="-mb-0.5">
              <IoMdWallet size={25} />
            </i>
            <span>TestKart Wallet</span>
          </h2>
          <hr />
          <div className="flex flex-col items-center gap-2 py-8">
            <span>Available Balance</span>
            <span className="inline-flex items-center text-4xl font-bold text-gray-700">
              <i className="-mb-0.5">
                <MdCurrencyRupee size={35} />
              </i>
              {(earnings?.wallet ?? 0).toFixed(2)}
            </span>
          </div>
          <hr />
          <div className="flex flex-col items-stretch pt-4 [&>*]:p-4 [&>*]:rounded-md [&>*]:inline-flex [&>*]:items-center [&>*]:justify-between [&>i]:-mb-0.5 hover:[&>*]:bg-gray-100 [&>*]:text-gray-600 hover:[&>*]:text-gray-950 active:[&>*]:bg-gray-200">
            <Link to="/earnings/overview">
              <span>Overview</span>
              <i>
                <IoIosArrowForward />
              </i>
            </Link>
            <Link to="/earnings/withdraw">
              <span>Withdraw Money</span>
              <i>
                <IoIosArrowForward />
              </i>
            </Link>
            <Link to="/earnings/transactions">
              <span>View Transactions</span>
              <i>
                <IoIosArrowForward />
              </i>
            </Link>
            <Link to="/earnings/settings">
              <span>Bank Settings</span>
              <i>
                <IoIosArrowForward />
              </i>
            </Link>
          </div>
        </div>
        {getEarningCard(path)}
      </div>
    </section>
  );
};

export default Earnings;
