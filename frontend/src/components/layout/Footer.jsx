import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  const footerRef = useRef(null);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setFooterVisible(true);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <footer ref={footerRef} className="bg-[#5c3327] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div 
              className={`space-y-4 ${footerVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
              style={footerVisible ? {
                animation: 'slideUp 0.6s ease-out 0.1s forwards'
              } : {}}
            >
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                <span className="text-xl font-bold text-white">FarmEasy</span>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed">
                Empowering farmers with fair prices and connecting buyers to
                fresh, quality produce directly from the source.
              </p>
              <div className="flex gap-4 pt-2">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#ea7f61] flex items-center justify-center hover:bg-[#d85f3f] transition-colors"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#ea7f61] flex items-center justify-center hover:bg-[#d85f3f] transition-colors"
                >
                  <Twitter className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#ea7f61] flex items-center justify-center hover:bg-[#d85f3f] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div 
              className={`space-y-4 ${footerVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
              style={footerVisible ? {
                animation: 'slideUp 0.6s ease-out 0.2s forwards'
              } : {}}
            >
              <h4 className="font-bold text-lg text-white">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: "Home", path: "/" },
                  { name: "Market", path: "/marketplace" },
                  { name: "How It Works", path: "/#how-it-works" },
                  { name: "About Us", path: "/#about" },
                  { name: "Contact", path: "/#contact" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-[#ea7f61] text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Users */}
            <div 
              className={`space-y-4 ${footerVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
              style={footerVisible ? {
                animation: 'slideUp 0.6s ease-out 0.3s forwards'
              } : {}}
            >
              <h4 className="font-bold text-lg text-white">For Users</h4>
              <ul className="space-y-3">
                {[
                  { name: "Farmer Registration", path: "/signup" },
                  { name: "Buyer Registration", path: "/signup" },
                  { name: "Sell Your Produce", path: "/create-auction" },
                  { name: "Browse Products", path: "/marketplace" },
                  { name: "My Auctions", path: "/my-auctions" }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-[#ea7f61] text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div 
              className={`space-y-4 ${footerVisible ? 'opacity-0 translate-y-4' : 'opacity-0'}`}
              style={footerVisible ? {
                animation: 'slideUp 0.6s ease-out 0.4s forwards'
              } : {}}
            >
              <h4 className="font-bold text-lg text-white">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Mail className="w-4 h-4 text-[#ea7f61]" />
                  <a href="mailto:support@farmeasy.com" className="hover:text-[#ea7f61] transition-colors">
                    support@farmeasy.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-300">
                  <Phone className="w-4 h-4 text-[#ea7f61]" />
                  <a href="tel:+911800XXXXXXX" className="hover:text-[#ea7f61] transition-colors">
                    +91 1800-XXX-XXXX
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-[#ea7f61] mt-0.5" />
                  <span>
                    Agricultural Hub,
                    <br />
                    Phagwara, Punjab, India
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div 
            className={`mt-12 pt-8 border-t border-[#ffffff] flex flex-col md:flex-row justify-between items-center gap-4 ${footerVisible ? 'opacity-0' : 'opacity-0'}`}
            style={footerVisible ? {
              animation: 'fadeIn 0.6s ease-out 0.6s forwards'
            } : {}}
          >
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} FarmEasy. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-[#ea7f61] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[#ea7f61] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
