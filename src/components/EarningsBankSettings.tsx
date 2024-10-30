import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks";
import { server } from "../api";
import { BsBank2 } from "react-icons/bs";
import { RiArrowDropDownLine } from "react-icons/ri";

const EarningsBankSettings = () => {
  const { logout } = useAuth();

  const [bank, setBank] = useState({
    account_number: "",
    confirm_account_number: "",
    ifsc: "",
    branch: "",
    type: "current",
    name: "",
  });

  const getBranch = (code = "") => {
    if (code.length == 11) {
      axios
        .get(`https://ifsc.razorpay.com/${code}`)
        .then((res) => {
          console.log(res.data);
          let branch = (res.data?.BANK + ", " + res.data?.BRANCH)
            .toLowerCase()
            .split(" ")
            .map((word) => word[0].toUpperCase() + word.slice(1))
            .join(" ");
          setBank({
            ...bank,
            ifsc: code,
            branch: branch,
          });
        })
        .catch((err) => {
          console.log(err.response);
          if (err.response.status === 404) return alert("Invalid IFSC Code");
        });
    }
  };

  const handleUpdateBankSettings = (e) => {
    e.preventDefault();
    if (
      bank.account_number === "" ||
      bank.confirm_account_number === "" ||
      bank.ifsc === "" ||
      bank.branch === "" ||
      bank.name === ""
    ) {
      return alert("Please fill all the fields");
    }
    if (bank.account_number != bank.confirm_account_number) {
      return alert("Account Numbers in both the fields do not match");
    }

    server
      .post("/api/v1/studio/academy/bank", bank)
      .then((res) => {
        if (!res.data.success) return alert(res.data.error);
        alert("Bank Settings Updated");
        setBank({
          account_number: "",
          confirm_account_number: "",
          ifsc: "",
          branch: "",
          type: "current",
          name: "",
        });
      })
      .catch((err) => {
        if (err.response.status === 401) return logout();
        console.log(err.response);
      });
  };

  return (
    <div className="bg-white md:rounded-md p-4 flex-1">
      <h2 className="text-xl flex items-center gap-2 mb-4">
        <i>
          <BsBank2 size={25} />
        </i>
        <span>Bank Settings</span>
      </h2>
      <hr />
      <form
        onSubmit={handleUpdateBankSettings}
        className="flex flex-col justify-center items-center gap-2 py-2"
      >
        <div className="flex items-center justify-between w-full md:w-96">
          <label htmlFor="account-number1">Account Number</label>
          <input
            type="number"
            id="account-number1"
            name="account-number1"
            className="rounded-md bg-gray-100 p-2 outline-none w-48 border border-gray-200"
            required
            value={bank.account_number}
            onChange={(e) =>
              setBank({ ...bank, account_number: e.target.value })
            }
          />
        </div>
        <div className="flex items-center justify-between w-full md:w-96">
          <label htmlFor="account-number2">Confirm Account Number</label>
          <input
            type="password"
            id="account-number2"
            name="account-number2"
            className="rounded-md bg-gray-100 p-2 outline-none w-48 border border-gray-200"
            required
            value={bank.confirm_account_number}
            onChange={(e) =>
              setBank({ ...bank, confirm_account_number: e.target.value })
            }
          />
        </div>
        <div className="flex items-center justify-between w-full md:w-96">
          <label htmlFor="ifsc">IFSC</label>
          <input
            type="text"
            id="ifsc"
            className="rounded-md bg-gray-100 p-2 outline-none w-48 border border-gray-200"
            required
            value={bank.ifsc}
            min={11}
            max={11}
            minLength={11}
            maxLength={11}
            onChange={(e) => {
              setBank({ ...bank, ifsc: e.target.value.toUpperCase().trim() });
              getBranch(e.target.value.toUpperCase().trim());
            }}
          />
        </div>
        <div className="flex items-center justify-between w-full md:w-96">
          <label htmlFor="branch">Branch</label>
          <input
            type="text"
            id="branch"
            className="rounded-md bg-gray-100 p-2 outline-none w-48 border border-gray-200"
            required
            value={bank.branch}
            disabled
          />
        </div>
        <div className="flex items-center justify-between w-full md:w-96">
          <label htmlFor="account-type">Account Type</label>
          <div className="relative">
            <select
              name="period"
              defaultValue={bank.type}
              className="cursor-pointer border border-gray-200 w-48 appearance-none pl-4 pr-8 py-1.5 rounded-md outline-none bg-gray-100 active:bg-gray-200 [&>*]:bg-white"
              id="account-type"
              required
              onChange={(e) => setBank({ ...bank, type: e.target.value })}
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
            </select>
            <i className="pointer-events-none absolute inset-y-0 right-0 pr-1 flex items-center text-[#6d45a4]">
              <RiArrowDropDownLine size={29} />
            </i>
          </div>
        </div>
        <div className="flex items-center justify-between w-full md:w-96 mb-4">
          <label htmlFor="name">Account Holder name</label>
          <input
            type="text"
            id="name"
            className="rounded-md bg-gray-100 p-2 outline-none w-48 border border-gray-200"
            required
            value={bank.name}
            onChange={(e) => setBank({ ...bank, name: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="bg-[#6d45a4] text-white px-4 py-2 rounded-md shadow-md hover:shadow-lg"
        >
          Update Bank Settings
        </button>
      </form>
    </div>
  );
};

export default EarningsBankSettings;
