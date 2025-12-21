import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";


const Footer = () => {
  const { t } = useTranslation();
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


  const quickLinks = [
    { name: t('footer.quickLinks.home'), path: "/" },
    { name: t('footer.quickLinks.market'), path: "/marketplace" },
    { name: t('footer.quickLinks.howItWorks'), path: "/#how-it-works" },
    { name: t('footer.quickLinks.aboutUs'), path: "/#about" },
    { name: t('footer.quickLinks.contact'), path: "/#contact" }
  ];


  const userLinks = [
    { name: t('footer.forUsers.farmerRegistration'), path: "/signup" },
    { name: t('footer.forUsers.buyerRegistration'), path: "/signup" },
    { name: t('footer.forUsers.sellProduce'), path: "/create-auction" },
    { name: t('footer.forUsers.browseProducts'), path: "/marketplace" },
    { name: t('footer.forUsers.myAuctions'), path: "/my-auctions" }
  ];


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
                {t('footer.description')}
              </p>
              <div className="flex gap-4 pt-2">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#ea7f61] flex items-center justify-center hover:bg-[#d85f3f] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#ea7f61] flex items-center justify-center hover:bg-[#d85f3f] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4 text-white" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full bg-[#ea7f61] flex items-center justify-center hover:bg-[#d85f3f] transition-colors"
                  aria-label="Instagram"
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
              <h4 className="font-bold text-lg text-white">{t('footer.quickLinksTitle')}</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
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
              <h4 className="font-bold text-lg text-white">{t('footer.forUsersTitle')}</h4>
              <ul className="space-y-3">
                {userLinks.map((link) => (
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
              <h4 className="font-bold text-lg text-white">{t('footer.contactTitle')}</h4>
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
                  <span dangerouslySetInnerHTML={{ __html: t('footer.address') }} />
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
              {t('footer.copyright', { year: new Date().getFullYear() })}
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-[#ea7f61] transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="/terms" className="hover:text-[#ea7f61] transition-colors">
                {t('footer.termsOfService')}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};


export default Footer;
