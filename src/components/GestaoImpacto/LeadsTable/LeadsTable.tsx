import { useEffect, useState } from "react";
import AlertToast from "../../../pages/AdminDashboard/Components/AlertToast/AlertToast";
import { Lead, Mensagem, RespostasLead } from "../../../types/Lead";
import LeadHistoricoModal from "../LeadHistoricoModal/LeadHistoricoModal";
import LeadRespostasModal from "../LeadRespostasModal/LeadRespostasModal";

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [respostasLead, setRespostasLead] = useState<RespostasLead | null>(null);
  const [historicoLead, setHistoricoLead] = useState<Mensagem[] | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info" | "warning">("info");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/webhook/gi/listar-leads`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log(data);

          setLeads(data);
        } else {
          console.error("Resposta inválida, esperava array!");
          setLeads([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setLeads([]);
      });
  }, []);

  const handleOpenRespostas = async (whatsapp: string) => {
    try {
      const res = await fetch(`${API_URL}/webhook/gi/leads-respostas?whatsapp=${whatsapp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Erro ao buscar respostas");

      const data = await res.json();

      // Campos que representam as perguntas que queremos validar
      const camposDeRespostas = ["ramo", "colaboradores", "faturamento", "desafio"];

      const respondeuAlguma = camposDeRespostas.some(
        (campo) => data[campo] !== null && data[campo] !== "" && data[campo] !== undefined,
      );

      if (!respondeuAlguma) {
        setToastType("warning");
        setToastMessage("Este lead ainda não respondeu nenhuma pergunta.");
        setToastOpen(true);
        return;
      }

      setRespostasLead(data);
    } catch (error) {
      console.error(error);
      setToastType("error");
      setToastMessage("Erro ao buscar respostas do lead.");
      setToastOpen(true);
    }
  };

  const handleOpenHistorico = async (whatsapp: string) => {
    try {
      const res = await fetch(`${API_URL}/webhook/gi/leads-historico?whatsapp=${whatsapp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Erro ao buscar histórico");

      const data = await res.json();

      if (
        !Array.isArray(data) ||
        data.length === 0 ||
        data.every((item) => Object.keys(item).length === 0)
      ) {
        setToastType("warning");
        setToastMessage("Nenhum histórico de conversa encontrado para este lead.");
        setToastOpen(true);
        return;
      }

      setHistoricoLead(data);
    } catch (error) {
      console.error(error);
      setToastType("error");
      setToastMessage("Erro ao buscar histórico do lead.");
      setToastOpen(true);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">Leads Recebidos</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                WhatsApp
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Follow-up
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Especialista
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.whatsapp} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{lead.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {lead.whatsapp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {lead.follow_up_atual || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {lead.atendente || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap flex gap-3 justify-center">
                  <button
                    className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-full transition"
                    onClick={() => handleOpenRespostas(lead.whatsapp)}
                  >
                    <i className="fa-solid fa-list text-sm"></i> Respostas
                  </button>
                  <button
                    className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 text-xs font-semibold px-3 py-2 rounded-full transition"
                    onClick={() => handleOpenHistorico(lead.whatsapp)}
                  >
                    <i className="fa-solid fa-comments text-sm"></i> Histórico
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modais */}
      {respostasLead && (
        <LeadRespostasModal respostas={respostasLead} onClose={() => setRespostasLead(null)} />
      )}

      {historicoLead && (
        <LeadHistoricoModal historico={historicoLead} onClose={() => setHistoricoLead(null)} />
      )}

      {/* Toast de Alerta */}
      <AlertToast
        toastOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        type={toastType}
        message={toastMessage}
      />
    </div>
  );
}
