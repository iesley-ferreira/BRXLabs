import {
  faArrowsRotate,
  faClock,
  faHeadset,
  faPhoneVolume,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
type Lead = {
  nome: string;
  whatsapp: string;
  follow_up_atual: string;
  atendente: string;
};

export default function Followups() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const carregarLeads = async () => {
      try {
        const res = await fetch(`${API_URL}/webhook/7eb96068-cd4c-4a3c-b172-847aee3998d2`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Erro ao carregar leads.");

        const data = await res.json();
        setLeads(data);
      } catch (e) {
        setErro("Erro ao buscar dados dos leads.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    carregarLeads();
  }, [API_URL]);

  function formatWhatsApp(wpp: string | undefined | null): string {
    if (typeof wpp !== "string") return "—";
    const cleaned = wpp.replace(/[^\d]/g, "");
    const ddd = cleaned.substring(2, 4);
    const number = cleaned.substring(4);
    return `(${ddd}) 9 ${number.substring(0, 4)}-${number.substring(4, 8)}`;
  }

  const handleAtendeuClick = (lead: Lead, index: number) => {
    const modal = document.getElementById("modal-confirm")!;
    const span = document.getElementById("lead-name")!;
    span.textContent = lead.nome || "este lead";
    modal.classList.remove("hidden");

    const confirmBtn = document.getElementById("confirm-yes")!;
    const cancelBtn = document.getElementById("confirm-no")!;
    const row = document.querySelector(`.lead-row[data-index="${index}"]`)!;

    const confirmHandler = async () => {
      try {
        const res = await fetch(`${API_URL}/webhook/536176ab-e9c2-4346-ab54-52d1c38df3e0`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            whatsapp: lead.whatsapp,
            nome: lead.nome,
            atendente: lead.atendente,
          }),
        });
        if (res.ok) row.remove();
        else alert("Erro ao enviar para o servidor.");
      } catch (e) {
        alert("Erro ao conectar com o servidor.");
        console.error(e);
      } finally {
        modal.classList.add("hidden");
        confirmBtn.removeEventListener("click", confirmHandler);
        cancelBtn.removeEventListener("click", cancelHandler);
      }
    };

    const cancelHandler = () => {
      modal.classList.add("hidden");
      confirmBtn.removeEventListener("click", confirmHandler);
      cancelBtn.removeEventListener("click", cancelHandler);
    };

    confirmBtn.addEventListener("click", confirmHandler);
    cancelBtn.addEventListener("click", cancelHandler);
  };

  if (loading) return <div className="text-white text-center mt-10">Carregando...</div>;
  if (erro) return <div className="text-red-500 text-center mt-10">{erro}</div>;

  return (
    <div className="min-h-screen bg-[#252527] text-white p-8">
      <div className="flex justify-center mb-8">
        <img
          className="w-38 h-auto"
          src="https://gestaoimpacto.com/wp-content/uploads/elementor/thumbs/logo-qvb3n1n3js2tdttv87c468ku3jg5jqltf0a5cij2i2.webp"
          alt="Logo"
        />
      </div>
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold">Leads das últimas 96h</h1>
      </div>

      <div className="container mx-auto">
        <div className="bg-[#2d2d30] rounded-lg shadow-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-4 p-4 bg-[#323235] font-semibold text-lg border-b border-[#404043]">
            <div>Nome</div>
            <div>WhatsApp</div>
            <div>Follow-up Atual</div>
            <div>Atendente</div>
            <div className="text-center">Atualizar</div>
          </div>
          <div className="grid md:hidden grid-cols-2 gap-4 p-4 bg-[#323235] font-semibold text-md border-b border-[#404043] uppercase text-gray-400 tracking-wide">
            <div>Lead</div>
            <div className="text-center">Atualizar</div>
          </div>

          <div id="table-body">
            {leads.map((lead, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_auto] md:grid-cols-5 gap-4 p-4 border-b border-[#404043] odd:bg-[#2b2b2d] even:bg-[#3d3d3f] hover:bg-[#aa633d4d] transition-colors lead-row"
                data-index={index}
              >
                <div>
                  <div className="md:hidden flex items-center gap-2 text-sm mb-1">
                    <FontAwesomeIcon icon={faUser} className="text-indigo-400" />
                    <span>{lead.nome}</span>
                  </div>
                  <div className="hidden md:block">{lead.nome}</div>

                  <div className="md:hidden flex items-center gap-2 text-sm mb-1">
                    <i className="fa-brands fa-whatsapp text-green-600"></i>
                    <span>{formatWhatsApp(lead.whatsapp)}</span>
                  </div>
                  <div className="md:hidden flex items-center gap-2 text-sm mb-1">
                    <FontAwesomeIcon icon={faClock} className="text-yellow-400" />
                    <span>{lead.follow_up_atual}</span>
                  </div>
                  <div className="md:hidden flex items-center gap-2 text-sm">
                    <FontAwesomeIcon icon={faHeadset} className="text-blue-400" />
                    <span>{lead.atendente}</span>
                  </div>
                </div>

                <div className="hidden md:block">{formatWhatsApp(lead.whatsapp)}</div>
                <div className="hidden md:block">{lead.follow_up_atual}</div>
                <div className="hidden md:block">{lead.atendente}</div>

                <div className="text-center self-center">
                  <button
                    onClick={() => handleAtendeuClick(lead, index)}
                    className="atendeu-button bg-[#13cd67] hover:bg-[#10b85a] px-4 py-2 rounded-lg transition-colors whitespace-nowrap transition-transform duration-150 hover:scale-105 active:scale-95"
                  >
                    <FontAwesomeIcon icon={faPhoneVolume} className="mr-2" />
                    Atendeu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => window.location.reload()}
          className="bg-[#ee7533] hover:bg-[#d66426] px-8 py-3 rounded-lg text-lg font-semibold transition-colors transition-transform duration-150 hover:scale-105 active:scale-95"
        >
          <FontAwesomeIcon icon={faArrowsRotate} className="mr-2" />
          Atualizar Tabela
        </button>
      </div>

      {/* Modal */}
      <div
        id="modal-confirm"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50"
      >
        <div className="bg-[#2d2d30] p-8 rounded-lg text-white w-[90%] max-w-sm md:max-w-md shadow-lg text-center">
          <p className="mb-4 text-lg font-semibold leading-relaxed">
            Você confirma que
            <br />
            <span id="lead-name" className="text-[#ee7533] font-bold uppercase">
              este lead
            </span>
            <br />
            atendeu a ligação?
          </p>
          <div className="flex justify-center gap-4">
            <button
              id="confirm-yes"
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              Sim
            </button>
            <button
              id="confirm-no"
              className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded transition-transform duration-150 hover:scale-105 active:scale-95"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
