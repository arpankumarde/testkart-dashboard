const ImportantTipForCreators = () => {
  return (
    <div className="w-full lg:w-[50%] bg-white rounded-md p-5 text-[text-[#596780] flex flex-col gap-4 h-full lg:h-[calc(100dvh-8rem)] mobile:border-t overflow-auto">
      <h1 className="text-center text-xl font-semibold leading-6 text-[#596780] py-2">
        Important Tips for Creators
      </h1>
      <div className="h-0 my-2 w-full border-t border-t-[#e9ecef]"></div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold leading-6 text-[#596780]">
          Cover Photo
        </h2>
        <p className="text-[#596780]">
          It is equally important to deliver the desired intent as it is to
          provide quality test series. Hence, the teachers are requested to put
          a thumbnail/cover photo for their test series here. The thumbnail can
          include information like the name of the exam, the name of the
          creator/educator and the important bullet points related to the test
          series.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold leading-6 text-[#596780]">
          Directions to create an exam
        </h2>
        <ul className="list-inside  list-decimal text-[#596780] flex flex-col gap-2">
          <li>
            Select the Exam you want to prepare the test series for from the
            drop-down menu and click on next.
          </li>
          <li>
            You will be redirected to a webpage where you have to fill the
            necessary details like the Title of your Test Series, the desired
            language you want to create the exam in, the cover photo of your
            test series and the total number of tests included in your
            respective test series.
          </li>
          <li>
            In the Description dialogue box, you can add details about your test
            series and educate students how they will be helpful in building the
            student's knowledge. It can include all the relevant information
            pertaining to the test series being created by you.
          </li>
          <li>Click on Save & Next.</li>
          <li>
            The Test Series is created successfully and know we have to add new
            tests in the Test Series.
          </li>
          <li>
            Click on View Tests from the additional options available and click
            on Add New Test.
          </li>
          <li>
            Here you can specify the Test Title, the duration and set the number
            of questions for each section of the exam.
          </li>
          <li>
            Then after successfully creating the New Test, you have to add
            questions via clicking on the additional options menu.
          </li>
          <li>
            Click on the question number and here you can select the question
            type, and answer options (Click on ‘if this option is the answer’
            for the correct answer). You can also add images for a given
            question.
          </li>
          <li>
            Click on save changes and the question added will be highlighted.
            After entering all the questions, go back and the total number of
            questions should reflect under ‘Questions’ Column.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ImportantTipForCreators;
