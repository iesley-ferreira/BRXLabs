import { useEffect, useRef } from "react";
import activecampaign from "../../assets/images/activecampaign.svg";
import Botconversa from "../../assets/images/botconversa.svg";
import clinicorp from "../../assets/images/clinicorp.svg";
import devzapp from "../../assets/images/devzapp.svg";
import evolutionapi from "../../assets/images/evolutionapi.svg";
import googlecalendar48 from "../../assets/images/google-calendar-48.svg";
import googlesheets48 from "../../assets/images/google-sheets-48.svg";
import instagram from "../../assets/images/instagram.png";
import kommo from "../../assets/images/kommo.svg";
import make from "../../assets/images/make.svg";
import manychat from "../../assets/images/manychat.svg";
import n8n from "../../assets/images/n8n.svg";
import rdstation from "../../assets/images/rdstation.svg";
import supabase from "../../assets/images/supabase.svg";
import typebot from "../../assets/images/typebot.svg";
import WhatsApp from "../../assets/images/whatsapp.svg";
import zaia from "../../assets/images/zaia.svg";
import zapi from "../../assets/images/zapi.png";

// Exemplo de array com tecnologias.
const technologies = [
  {
    name: "Activecampaign",
    svg: <img className="max-h-32 max-w-46" src={activecampaign} alt="activecampaign logo" />,
  },
  {
    name: "EvolutionApi",
    svg: <img className="max-h-22 max-w-40" src={evolutionapi} alt="evolutionapi logo" />,
  },
  {
    name: "Make",
    svg: <img className="max-h-22 max-w-40" src={make} alt="make logo" />,
  },
  {
    name: "Botconversa",
    svg: <img className="max-h-22 max-w-40" src={Botconversa} alt="botconversa logo" />,
  },
  {
    name: "clinicorp",
    svg: <img className="max-h-22 max-w-40" src={clinicorp} alt="clinicorp logo" />,
  },
  {
    name: "devzapp",
    svg: <img className="max-h-22 max-w-40" src={devzapp} alt="devzapp logo" />,
  },
  {
    name: "kommo",
    svg: <img className="max-h-22 max-w-40" src={kommo} alt="kommo logo" />,
  },
  {
    name: "zapi",
    svg: <img className="max-h-22 max-w-40" src={zapi} alt="zapi logo" />,
  },
  {
    name: "n8n",
    svg: <img className="max-h-22 max-w-40" src={n8n} alt="n8n logo" />,
  },
  {
    name: "manychat",
    svg: <img className="max-h-22 max-w-40" src={manychat} alt="manychat logo" />,
  },
  {
    name: "rdstation",
    svg: <img className="max-h-22 max-w-40" src={rdstation} alt="rdstation logo" />,
  },
  {
    name: "supabase",
    svg: <img className="max-h-32 max-w-40" src={supabase} alt="supabase logo" />,
  },
  {
    name: "typebot",
    svg: <img className="max-h-22 max-w-40" src={typebot} alt="typebot logo" />,
  },
  {
    name: "zaia",
    svg: <img className="max-h-22 max-w-40" src={zaia} alt="zaia logo" />,
  },
  {
    name: "WhatsApp",
    svg: <img className="max-h-12 max-w-22" src={WhatsApp} alt="WhatsApp logo" />,
  },
  {
    name: "instagram",
    svg: <img className="max-h-22 max-w-40" src={instagram} alt="instagram logo" />,
  },
  {
    name: "google-calendar",
    svg: <img className="max-h-22 max-w-40" src={googlecalendar48} alt="google-calendar-48 logo" />,
  },
  {
    name: "google-sheets",
    svg: <img className="max-h-22 max-w-40" src={googlesheets48} alt="google-sheets-48 logo" />,
  },
  // Adicione outras tecnologias conforme necessário
];

const Carousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;
        // Se chegou ao final, volta para o início
        if (scrollLeft + clientWidth >= scrollWidth) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full p-6 bg-[#6c19ff] rounded-md">
      {/* Container do carousel com rolagem horizontal e barra oculta */}
      <div ref={carouselRef} className="flex space-x-4 overflow-x-auto  scrollbar-hide">
        {technologies.map((tech, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-lg min-w-[150px]"
          >
            {tech.svg}
            {/* <p className="mt-2 text-sm font-medium">{tech.name}</p> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
