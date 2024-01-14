import React from 'react'

const TestSeriesForm = ({currentExamInfo , title , description , total_tests , language , handleChange}) => {
  return (
    <div className="w-full flex flex-col gap-3">
    {currentExamInfo && <div className="flex flex-col gap-1">
      <h1> EXAM : <span className='ml-1'>{currentExamInfo.exam} </span> </h1>
      <p>
        <span className='mr-1'> SUBJECTS : </span>
        {currentExamInfo?.default_pattern?.subjects.map(({ subject: currentSubject } , index) => (
          <span>{currentSubject}  { index+1 !== currentExamInfo?.default_pattern?.subjects.length && ','} </span>
        ))}
      </p>
    </div>}
    <div className="h-0 my-2 w-full  border-t border-t-[#e9ecef]"></div>
    <div className="flex flex-col w-full gap-2">
      <label
        htmlFor="title"
        className="text-[#596780] font-medium text-lg"
      >
        Write a title for your test series
      </label>
      <input
        name="title"
        id="title"
        value={title}
        placeholder="title for test"
        className="w-full outline-none border border-[#ced4da] bg-white px-2 py-2"
        onChange={(e) => handleChange(e)}
      />
    </div>
    <div className="flex justify-center items-center gap-4 text-[#596780]">
      <div className="flex flex-col w-[30%] gap-2">
        <label
          for="language"
          className=" dark:text-white  font-medium text-lg"
        >
          Language
        </label>
        <select
          onChange={(e) => handleChange(e)}
          id="language"
          name="language"
          value={language}
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 outline-none"
        >
          <option value="en" className="">
            English
          </option>
          <option value="hi">Hindi</option>
        </select>
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <label
          htmlFor="testscount"
          className=" font-medium text-lg text-[#596780]"
        >
          Total number of tests in this series
        </label>
        <input
          type="number"
          name="total_tests"
          id="testscount"
          value={total_tests}
          placeholder="6"
          className="px-2 py-2  border border-[#ced4da] outline-none"
          onChange={(e) => handleChange(e)}
        />
      </div>
    </div>
    <div className="flex flex-col w-full gap-2">
      <label
        htmlFor="title"
        className="text-[#596780]  font-medium text-lg"
      >
        Description
      </label>
      <textarea
        name="description"
        id="description"
        value={description}
        placeholder="description for test"
        className="w-full outline-none border border-[#ced4da] bg-white p-2"
        rows={6}
        onChange={(e) => handleChange(e)}
      />
    </div>
  </div>
  )
}

export default TestSeriesForm