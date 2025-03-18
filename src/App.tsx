import "./App.css";
import Carousel from "./components/Carousel/Carousel";
import ContactButton from "./components/ContactButton/ContactButton";
import ContactSection from "./components/ContactSection/ContactSection";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import ServicesProvided from "./components/ServicesProvided/ServicesProvided";

function App() {
  return (
    <div className="bg-[#131313] p-4 h-screen">
      <Header />
      <Hero />
      <ContactButton />
      <ServicesProvided />
      <Carousel />
      <HowItWorks />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
