import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
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
import WhatsApp from "../../assets/images/whatsapp.svg";
import zaia from "../../assets/images/zaia.svg";
import zapi from "../../assets/images/zapi.png";
import "./embla.css";

const technologies = [
  {
    name: "EvolutionApi",
    svg: <img className="max-h-22 max-w-40" src={evolutionapi} alt="evolutionapi logo" />,
  },
  {
    name: "Activecampaign",
    svg: <img className="max-h-32 max-w-70" src={activecampaign} alt="activecampaign logo" />,
  },
  {
    name: "Make",
    svg: <img className="max-h-22 max-w-40" src={make} alt="make logo" />,
  },
  {
    name: "Botconversa",
    svg: <img className="max-h-32 max-w-50" src={Botconversa} alt="botconversa logo" />,
  },
  {
    name: "clinicorp",
    svg: <img className="max-h-52 max-w-70" src={clinicorp} alt="clinicorp logo" />,
  },
  {
    name: "devzapp",
    svg: <img className="max-h-22 max-w-40" src={devzapp} alt="devzapp logo" />,
  },
  {
    name: "kommo",
    svg: <img className="max-h-20 max-w-40" src={kommo} alt="kommo logo" />,
  },
  {
    name: "zapi",
    svg: <img className="max-h-12 max-w-40" src={zapi} alt="zapi logo" />,
  },
  {
    name: "n8n",
    svg: <img className="max-h-12 max-w-40" src={n8n} alt="n8n logo" />,
  },
  {
    name: "manychat",
    svg: <img className="max-h-32 max-w-50" src={manychat} alt="manychat logo" />,
  },
  {
    name: "rdstation",
    svg: <img className="max-h-22 max-w-40" src={rdstation} alt="rdstation logo" />,
  },
  {
    name: "supabase",
    svg: <img className="max-h-32 max-w-44" src={supabase} alt="supabase logo" />,
  },
  // {
  //   name: "typebot",
  //   svg: <img className="max-h-22 max-w-40" src={typebot} alt="typebot logo" />,
  // },
  {
    name: "zaia",
    svg: <img className="max-h-22 max-w-40" src={zaia} alt="zaia logo" />,
  },
  {
    name: "WhatsApp",
    svg: <img className="max-h-14 max-w-32" src={WhatsApp} alt="WhatsApp logo" />,
  },
  {
    name: "instagram",
    svg: <img className="max-h-32 max-w-60" src={instagram} alt="instagram logo" />,
  },
  {
    name: "google-calendar",
    svg: <img className="max-h-22 max-w-40" src={googlecalendar48} alt="google-calendar-48 logo" />,
  },
  {
    name: "google-sheets",
    svg: <img className="max-h-22 max-w-40" src={googlesheets48} alt="google-sheets-48 logo" />,
  },
];

export function EmblaCarousel() {
  // Inicializa o embla-carousel com auto scroll contínuo
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({ playOnInit: true, speed: 1, stopOnInteraction: false }),
  ]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {technologies.map((tech, index) => (
            <div key={index} className="embla__slide">
              <div className="flex-shrink-0 flex flex-col items-center justify-center rounded-lg h-[150px] min-w-[150px]">
                {tech.svg}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmblaCarousel;
