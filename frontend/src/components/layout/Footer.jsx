const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} FarmEasy. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Empowering farmers with better prices
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;