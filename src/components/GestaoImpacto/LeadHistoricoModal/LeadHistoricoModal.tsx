import { Mensagem } from "../../../types/Lead";

type Props = {
  historico: Mensagem[];
  onClose: () => void;
};

export default function LeadHistoricoModal({ historico, onClose }: Props) {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-72 bg-[#000000b0] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative border-2 border-[rgba(75,30,133,0.5)]">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">
          Histórico de Conversa
        </h2>

        {/* Chat */}
        <div className="flex flex-col pr-4 space-y-4 max-h-96 overflow-y-auto">
          {historico.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === "human" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[70%] text-white ${
                  msg.type === "human" ? "bg-indigo-500" : "bg-gray-300 text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
