import AOS from "aos";
import "aos/dist/aos.css"; // Importa os estilos do AOS
import { useEffect } from "react";
import "./App.css";
import ContactButton from "./components/ContactButton/ContactButton";
import ContactSection from "./components/ContactSection/ContactSection";
import { EmblaCarousel } from "./components/EmblaCarousel/EmblaCarousel";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import ServicesProvided from "./components/ServicesProvided/ServicesProvided";

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1200, // duração da animação em milissegundos
      once: true, // se true, animação ocorre apenas uma vez
      easing: "ease-in-out",
    });
  }, []);

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
      <EmblaCarousel />
      {/* <Carousel /> */}
      <HowItWorks />
      <section id="contact">
        <ContactSection />
      </section>
      <Footer />
    </div>
  );
}

export default App;
