const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
    <hr />
      <footer className="flex justify-center items-center p-2 bg-white">
        <div>
          <span>&copy; {currentYear} </span>
          <a
            target="_blank"
            href="https://app.testkart.in"
            className="text-[#6d45a4] font-semibold"
          >
            TestKart Learning Platform Pvt. Ltd.
          </a>
        </div>
      </footer>
    </>
  );
};

export default Footer;
