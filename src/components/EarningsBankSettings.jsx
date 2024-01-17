import { useState } from "react";
import { BsBank2 } from "react-icons/bs";
import { RiArrowDropDownLine } from "react-icons/ri";
import { server } from "../api";

const EarningsBankSettings = () => {
  const [bank, setBank] = useState({
    preAccount: "",
    account: "",
    ifsc: "",
    type: "current",
    name: "",
  });

  const handleUpdateBankSettings = (e) => {
    e.preventDefault();
    if (
      bank.preAccount === "" ||
      bank.account === "" ||
      bank.ifsc === "" ||
      bank.name === ""
    ) {
      return alert("Please fill all the fields");
    }
    if (bank.preAccount != bank.account) {
      return alert("Account Numbers in both the fields do not match");
    }

    console.log("Bank Settings Updated");

    setBank({
      preAccount: "",
      account: "",
      ifsc: "",
      type: "current",
      name: "",
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
        className="flex flex-col justify-center items-center gap-2 py-6"
      >
        <div className="flex items-center justify-between w-full md:w-96">
          <label htmlFor="account-number1">Account Number</label>
          <input
            type="number"
            id="account-number1"
            name="account-number1"
            className="rounded-md bg-gray-100 p-2 outline-none w-48 border border-gray-200"
            required
            value={bank.preAccount}
            onChange={(e) => setBank({ ...bank, preAccount: e.target.value })}
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
            value={bank.account}
            onChange={(e) => setBank({ ...bank, account: e.target.value })}
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
            onChange={(e) => setBank({ ...bank, ifsc: e.target.value })}
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
      <hr />
      <p className="text-center pt-2">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam nobis
        est, sequi odit similique rem?
      </p>
    </div>
  );
};

export default EarningsBankSettings;
