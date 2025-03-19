import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 origin-bottom-right bg-[#473ee7] text-[#bebed6f5] hover:text-white hover:bg-[#5048e5] font-bold text-sm p-3 rounded-full shadow-lg hover:shadow-[0px_0px_10px_rgba(255,255,255,0.4)] transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white animate-custom-pulse pulse-element"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </>
  );
}
