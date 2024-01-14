const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-4 bg-white shadow-card">
      <div>
      &#169; 2024  <span className="font-semibold text-lg">Test Kart </span> - Crafted with <span style={{color:'red', fontSize:25}} className="mx-1">&hearts;</span>by <a target="_blank" href="https://app.testkart.in" className="text-blue-500 cursor-pointer">TestKart Learning Platform Pvt. Ltd.</a>
      </div>

    </footer>
  );
};

export default Footer;
