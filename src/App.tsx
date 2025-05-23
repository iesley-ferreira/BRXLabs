import AOS from "aos";
import "aos/dist/aos.css"; // Importa os estilos do AOS
import { useEffect } from "react";
import "./App.css";
import ContactButton from "./components/ContactButton/ContactButton";
import ContactSection from "./components/ContactSection/ContactSection";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ServicesProvided from "./components/ServicesProvided/ServicesProvided";
import Toolbox from "./components/Toolbox/Toolbox";
import PricingSection from "./components/PricingSection/PricingSection";

function App() {
  return (
    <div className="bg-[#131313] p-4 h-screen">
      <Header />
      <section id="home">
        <Hero />
      </section>
      <ContactButton />
      <section id="services">
        <ServicesProvided />
      </section>
      <section id="prices">
        <PricingSection />
      </section>
      <Toolbox />
      <section id="metodologia">
        <HowItWorks />
      </section>
      <section id="contact">
        <ContactSection />
      </section>
      <ScrollToTop />
      <Footer />
    </div>
  );
}

export default App;
