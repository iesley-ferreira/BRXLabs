import React, { useEffect, useState } from "react";
import { enviarMensagem, getConversasRecentes, getHistoricoConversa } from "./chatService";

type Conversa = {
  id: string;
  nome: string;
  telefone: string;
  ultimaMensagem: string;
  atualizadoEm: string;
  remetenteUltimaMensagem: "bot" | "user";
};

export type Mensagem = {
  id: string;
  content: string;
  sender: "bot" | "user";
  timestamp: string;
};

const Chats: React.FC = () => {
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | null>(null);
  const [mensagem, setMensagem] = useState("");

  const carregarConversas = async () => {
    const res = await getConversasRecentes();
    setConversas(res);
  };

  const abrirConversa = async (conversa: Conversa) => {
    setConversaAtiva(conversa);
    const historico = await getHistoricoConversa(conversa.id);
    console.log(historico);

    setMensagens(historico);
  };

  const handleEnviar = async () => {
    if (!conversaAtiva || !mensagem.trim()) return;
    await enviarMensagem(conversaAtiva.id, mensagem);
    setMensagem("");
    abrirConversa(conversaAtiva); // recarrega histórico
  };

  useEffect(() => {
    carregarConversas();
  }, []);

  const formatarDataSidebar = (dataStr: string) => {
    const data = new Date(dataStr);
    const agora = new Date();

    const hoje = new Date(agora);
    const ontem = new Date(agora);
    const inicioDaSemana = new Date(agora);

    hoje.setHours(0, 0, 0, 0);
    ontem.setDate(ontem.getDate() - 1);
    ontem.setHours(0, 0, 0, 0);
    inicioDaSemana.setDate(inicioDaSemana.getDate() - inicioDaSemana.getDay());
    inicioDaSemana.setHours(0, 0, 0, 0);

    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const ano = data.getFullYear().toString().slice(-2);

    const diasSemana = [
      "domingo",
      "segunda-feira",
      "terça-feira",
      "quarta-feira",
      "quinta-feira",
      "sexta-feira",
      "sábado",
    ];

    if (data >= hoje) {
      return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    } else if (data >= ontem) {
      return "Ontem";
    } else if (data >= inicioDaSemana) {
      return diasSemana[data.getDay()];
    } else {
      return `${dia}/${mes}/${ano}`;
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-800 font-sans">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200 text-[#615fff]">
          Conversas
        </h2>
        {conversas.map((c) => (
          <div
            key={c.id}
            onClick={() => abrirConversa(c)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-100 cursor-pointer ${
              conversaAtiva?.id === c.id ? "bg-gray-100" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold">{c.nome}</div>
              <div className="text-xs text-gray-400"> {formatarDataSidebar(c.atualizadoEm)}</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 truncate">
              {c.remetenteUltimaMensagem === "bot" ? (
                <i className="fas fa-robot"></i>
              ) : (
                <i className="fa-solid fa-user"></i>
              )}
              <span className="truncate">{c.ultimaMensagem}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {conversaAtiva ? (
          <>
            <div className="p-4 border-b border-gray-200 font-semibold text-[#615fff] bg-gray-50">
              {conversaAtiva.nome}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {mensagens.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.sender === "bot" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg text-sm shadow ${
                      m.sender === "bot" ? "bg-[#615fff] text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {m.content}
                    <div className="text-xs text-right mt-1 text-gray-300">
                      {new Date(m.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-200 flex bg-white">
              <input
                type="text"
                className="flex-1 p-3 bg-gray-100 rounded-lg mr-2 text-gray-800 focus:outline-[#615fff]"
                placeholder="Digite sua mensagem..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
              />
              <button
                onClick={handleEnviar}
                className="bg-[#615fff] px-4 py-2 rounded-lg text-white hover:brightness-110 transition"
              >
                Enviar
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Selecione uma conversa para começar
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
