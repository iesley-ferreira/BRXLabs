import { RespostasLead } from "../../../types/Lead";

type Props = {
  respostas: RespostasLead;
  onClose: () => void;
  nome?: string;
  whatsapp?: string;
  followup?: string;
};

export default function LeadRespostasModal({ respostas, onClose }: Props) {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-72 bg-[#000000b0] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative border-2 border-[rgba(75,30,133,0.5)]">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">Respostas do Lead</h2>

        {/* Informações do Lead */}
        <div className="space-y-2 mb-6 bg-gray-100 p-4 rounded-lg border border-gray-200">
          <div>
            <strong className="text-gray-700">Nome:</strong>{" "}
            <span className="text-gray-900">{respostas.nome}</span>
          </div>
          <div>
            <strong className="text-gray-700">WhatsApp:</strong>{" "}
            <span className="text-gray-900">{respostas.whatsapp}</span>
          </div>
          <div>
            <strong className="text-gray-700">Follow-up:</strong>{" "}
            <span className="text-gray-900">{respostas.follow_up_atual}</span>
          </div>
        </div>

        {/* Respostas */}
        <div className="space-y-3">
          <div>
            <strong className="text-gray-700">Ramo:</strong>{" "}
            <span className="text-gray-900">{respostas.ramo || "Não informado"}</span>
          </div>
          <div>
            <strong className="text-gray-700">Colaboradores:</strong>{" "}
            <span className="text-gray-900">{respostas.colaboradores || "Não informado"}</span>
          </div>
          <div>
            <strong className="text-gray-700">Faturamento:</strong>{" "}
            <span className="text-gray-900">{respostas.faturamento || "Não informado"}</span>
          </div>
          <div>
            <strong className="text-gray-700">Desafio:</strong>{" "}
            <span className="text-gray-900">{respostas.desafio || "Não informado"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
