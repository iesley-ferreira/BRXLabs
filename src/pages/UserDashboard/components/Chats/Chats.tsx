import {
  Bot,
  ChevronLeft,
  Info,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Smile,
  User,
} from "lucide-react"; // Importar Info e XIcon
import React, { useEffect, useRef, useState } from "react";
// Importar TODAS as funções necessárias do chatService
import {
  addTagToLead,
  createNewTag,
  // enviarMensagem,
  fetchAvailableTags,
  fetchLeadDetails,
  getConversasRecentes,
  getHistoricoConversa,
  removeTagFromLead,
  updateLeadNote,
} from "./chatService";
// Ajuste o caminho se o LeadInfoPanel estiver em um arquivo separado
import LeadInfoPanel from "./components/LeadInfoPanel";
// Ou defina LeadInfoPanel aqui se ele foi integrado anteriormente

// Tipos (mantidos como antes)
export type Conversa = {
  id: string;
  nome: string;
  telefone: string;
  ultimaMensagem: string;
  atualizadoEm: string;
  remetenteUltimaMensagem: "bot" | "user";
  avatarSeed?: string;
  unreadCount?: number;
};

export type Mensagem = {
  id: string;
  content: string;
  sender: "bot" | "user";
  timestamp: string;
};

// Componente AvatarPlaceholder (mantido como antes)
const AvatarPlaceholder: React.FC<{ seed?: string; size?: number; className?: string }> = ({
  seed,
  size = 10,
  className = "",
}) => {
  const colors = [
    "bg-red-400",
    "bg-green-400",
    "bg-blue-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-teal-400",
  ];
  const safeSeed = String(seed || "Fallback");
  const charCodeSum = safeSeed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const color = colors[charCodeSum % colors.length];
  const initial = safeSeed.substring(0, 1).toUpperCase() || "?";
  return (
    <div
      className={`w-${size} h-${size} ${color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
};

const Chats: React.FC = () => {
  // Estados (mantidos como antes)
  const [conversas, setConversas] = useState<Conversa[]>([]);
  const [filteredConversas, setFilteredConversas] = useState<Conversa[]>([]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | null>(null);
  const [mensagemInput, setMensagemInput] = useState("");
  const [isLoadingHistorico, setIsLoadingHistorico] = useState(false);
  const [isLoadingConversas, setIsLoadingConversas] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLeadInfoPanelOpen, setIsLeadInfoPanelOpen] = useState(false);
  const [selectedLeadForInfo, setSelectedLeadForInfo] = useState<Conversa | null>(null);

  const mensagensEndRef = useRef<null | HTMLDivElement>(null);

  // Funções (mantidas como antes)
  const scrollToBottom = () => {
    mensagensEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    if (!isLoadingHistorico && mensagens.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [mensagens, isLoadingHistorico]);
  const carregarConversas = async () => {
    setIsLoadingConversas(true);
    try {
      const res = await getConversasRecentes();
      const conversasComAvatar = res.map((c) => ({ ...c, avatarSeed: c.avatarSeed || c.nome }));
      setConversas(conversasComAvatar);
      setFilteredConversas(conversasComAvatar);
    } catch (error) {
      console.error("Erro carregar conversas:", error);
      setConversas([]);
      setFilteredConversas([]);
    } finally {
      setIsLoadingConversas(false);
    }
  };
  const abrirConversa = async (conversa: Conversa) => {
    if (isLeadInfoPanelOpen) {
      setIsLeadInfoPanelOpen(false);
      setSelectedLeadForInfo(null);
    }
    if (conversaAtiva?.id === conversa.id && mensagens.length > 0 && !isLoadingHistorico) {
      setConversaAtiva(conversa);
      return;
    }
    setConversaAtiva(conversa);
    setMensagens([]);
    setIsLoadingHistorico(true);
    try {
      const historico = await getHistoricoConversa(conversa.id);
      setMensagens(historico);
    } catch (error) {
      console.error("Erro carregar histórico:", error);
      setMensagens([]);
    } finally {
      setIsLoadingHistorico(false);
    }
  };
  // const handleEnviar = async () => {
  //   if (!conversaAtiva || !mensagemInput.trim()) return;
  //   const mensagemParaEnviar = mensagemInput;
  //   setMensagemInput("");
  //   const novaMensagemUsuario: Mensagem = {
  //     id: `temp-${Date.now()}`,
  //     content: mensagemParaEnviar,
  //     sender: "user",
  //     timestamp: new Date().toISOString(),
  //   };
  //   setMensagens((prevMensagens) => [...prevMensagens, novaMensagemUsuario]);
  //   try {
  //     await enviarMensagem(conversaAtiva.id, mensagemParaEnviar);
  //     const historicoAtualizado = await getHistoricoConversa(conversaAtiva.id);
  //     setMensagens(historicoAtualizado);
  //     await carregarConversas();
  //   } catch (error) {
  //     console.error("Erro enviar mensagem:", error);
  //     setMensagens((prevMensagens) => prevMensagens.filter((m) => m.id !== novaMensagemUsuario.id));
  //     setMensagemInput(mensagemParaEnviar);
  //   }
  // };
  useEffect(() => {
    carregarConversas();
  }, []);
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredConversas(conversas);
    } else {
      setFilteredConversas(
        conversas.filter((c) => c.nome.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }
  }, [searchTerm, conversas]);
  const formatarDataSidebar = (dataStr: string): string => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    const agora = new Date();
    const diffEmSegundos = Math.floor((agora.getTime() - data.getTime()) / 1000);
    const diffEmMinutos = Math.floor(diffEmSegundos / 60);
    const diffEmHoras = Math.floor(diffEmMinutos / 60);
    const diffEmDias = Math.floor(diffEmHoras / 24);
    if (diffEmMinutos < 1) return "Agora";
    if (diffEmMinutos < 60) return `${diffEmMinutos}m`;
    if (diffEmHoras < 24 && data.getDate() === agora.getDate()) {
      return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    }
    if (diffEmDias === 1 || (diffEmHoras < 48 && data.getDate() === agora.getDate() - 1))
      return "Ontem";
    if (diffEmDias < 7) {
      const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      return diasSemana[data.getDay()];
    }
    return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
  };
  const formatarTimestampMensagem = (dataStr: string): string => {
    if (!dataStr) return "";
    const data = new Date(dataStr);
    return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  // Funções de Callback (mantidas como antes)
  const handleUpdateNota = async (leadId: string, novaNota: string) => {
    try {
      await updateLeadNote(leadId, novaNota);
      console.log("Nota atualizada!");
    } catch (error) {
      console.error("Falha atualizar nota:", error);
    }
  };
  const handleAddTagToLead = async (leadId: string, tagId: string) => {
    try {
      await addTagToLead(leadId, tagId);
      console.log("Tag adicionada!");
    } catch (error) {
      console.error("Falha adicionar tag:", error);
    }
  };
  const handleRemoveTagFromLead = async (leadId: string, tagId: string) => {
    try {
      await removeTagFromLead(leadId, tagId);
      console.log("Tag removida!");
    } catch (error) {
      console.error("Falha remover tag:", error);
    }
  };
  const handleCreateNewTag = async (nome: string, cor: string) => {
    try {
      const novaTag = await createNewTag(nome, cor);
      console.log("Tag criada:", novaTag);
      return novaTag;
    } catch (error) {
      console.error("Falha criar tag:", error);
      return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-800 font-sans overflow-hidden">
      {/* Sidebar de Conversas */}
      <div
        className={`w-full md:w-[320px] lg:w-[360px] h-full bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          conversaAtiva ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}
      >
        {/* Conteúdo da Sidebar ... */}
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          {" "}
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Conversas</h2>{" "}
          <div className="relative">
            {" "}
            <input
              type="text"
              placeholder="Buscar conversas..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#615fff] focus:border-[#615fff] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />{" "}
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />{" "}
          </div>{" "}
        </div>
        {isLoadingConversas ? (
          <div className="flex-grow flex items-center justify-center text-gray-500 p-4">
            <svg
              className="animate-spin h-8 w-8 text-[#615fff]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="ml-2">Carregando...</span>
          </div>
        ) : filteredConversas.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 p-4">
            <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-lg font-medium">
              {searchTerm ? "Nenhuma encontrada" : "Nenhuma conversa."}
            </p>
            <p className="text-sm">{searchTerm ? "Tente outro termo." : "Inicie uma conversa."}</p>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto">
            {filteredConversas.map((c) => (
              <div
                key={c.id}
                onClick={() => abrirConversa(c)}
                className={`p-3 flex items-start space-x-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors duration-150 ${
                  conversaAtiva?.id === c.id ? "bg-[#f0efff] border-l-4 border-l-[#615fff]" : ""
                }`}
              >
                <div className="w-10 h-10 flex-shrink-0">
                  <AvatarPlaceholder seed={c.avatarSeed || c.nome} size={10} className="mt-1" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-semibold text-gray-700 truncate">{c.nome}</p>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatarDataSidebar(c.atualizadoEm)}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500 truncate flex items-center">
                      <span className="flex-shrink-0">
                        {c.remetenteUltimaMensagem === "bot" ? (
                          <Bot size={14} className="mr-1.5 text-gray-400" />
                        ) : (
                          <User size={14} className="mr-1.5 text-gray-400" />
                        )}
                      </span>
                      <span className="truncate">{c.ultimaMensagem}</span>
                    </div>
                    {c.unreadCount && c.unreadCount > 0 && (
                      <span className="bg-[#615fff] text-white text-xs font-bold px-1.5 py-0.5 rounded-full ml-2 flex-shrink-0">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Área de Mensagens Principal */}
      {/* --- AJUSTE 1: Garantir flex-col e h-full --- */}
      <div
        className={`flex-1 flex flex-col h-full bg-white transition-all duration-300 ease-in-out relative ${
          conversaAtiva ? "md:flex" : "hidden md:flex md:items-center md:justify-center"
        }`}
      >
        {conversaAtiva ? (
          <>
            {/* --- AJUSTE 2: Cabeçalho Inteiro Clicável + Ícone Info --- */}
            <div
              className="p-3 flex items-center space-x-3 bg-gray-100/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 cursor-pointer hover:bg-gray-200/80 transition-colors"
              onClick={() => {
                // A verificação !conversaAtiva é redundante aqui, pois só renderiza se conversaAtiva existir
                setSelectedLeadForInfo(conversaAtiva);
                setIsLeadInfoPanelOpen(true);
              }}
              title="Ver detalhes do lead" // Tooltip
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConversaAtiva(null);
                }} // Impede que o clique no botão abra o painel
                className="md:hidden p-1 text-gray-600 hover:text-[#615fff] rounded-full hover:bg-gray-300/50" // Ajuste no hover do botão
                title="Voltar para conversas"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <AvatarPlaceholder seed={conversaAtiva.avatarSeed || conversaAtiva.nome} size={10} />
              <div className="flex-grow">
                {" "}
                {/* Ocupa espaço para empurrar o ícone para a direita */}
                <p className="font-semibold text-gray-800 truncate">{conversaAtiva.nome}</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
              <Info className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />{" "}
              {/* Ícone de Informação */}
            </div>
            {/* --- FIM AJUSTE 2 --- */}

            {/* --- AJUSTE 3: Área de Mensagens com flex-1 --- */}
            {/* A div pai já é flex-col, então flex-1 aqui fará ela ocupar o espaço restante */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-[url('https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg')] bg-contain z-[5]">
              {/* Conteúdo das mensagens (loading, lista, etc.) ... */}
              {isLoadingHistorico ? (
                <div className="flex h-full items-center justify-center text-gray-500 p-4">
                  <svg
                    className="animate-spin h-8 w-8 text-[#615fff]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="ml-2">Carregando...</span>
                </div>
              ) : mensagens.length === 0 && !isLoadingHistorico ? (
                <div className="flex h-full flex-col items-center justify-center text-center text-gray-500 p-4">
                  <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-lg font-medium">Sem mensagens.</p>
                  <p className="text-sm">Envie uma mensagem!</p>
                </div>
              ) : (
                mensagens.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender === "bot" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] sm:max-w-[60%] px-3 py-2 rounded-lg shadow-sm ${
                        m.sender === "bot"
                          ? "bg-[#E1FFC7]/90 backdrop-blur-sm text-gray-800 rounded-bl-none"
                          : "bg-white/90 backdrop-blur-sm text-gray-800 rounded-br-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{m.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          m.sender === "bot"
                            ? "text-green-700 opacity-80"
                            : "text-gray-500 opacity-80"
                        } text-right`}
                      >
                        {formatarTimestampMensagem(m.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={mensagensEndRef} />
            </div>
            {/* --- FIM AJUSTE 3 --- */}

            {/* Input (mantido como antes, ele fica fixo no final por causa do flex-col) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // handleEnviar();
              }}
              className="p-2 sm:p-3 bg-gray-100/80 backdrop-blur-sm border-t border-gray-200 flex items-center space-x-2 sticky bottom-0 z-10 flex-shrink-0"
            >
              {" "}
              {/* Adicionado flex-shrink-0 */}
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-[#615fff] rounded-full hover:bg-gray-200"
              >
                <Smile className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <input
                type="text"
                className="flex-1 p-2 sm:p-3 border border-gray-300 bg-white/70 rounded-lg focus:ring-1 focus:ring-[#615fff] focus:border-[#615fff] outline-none transition-shadow"
                placeholder="Digite uma mensagem..."
                value={mensagemInput}
                onChange={(e) => setMensagemInput(e.target.value)}
              />
              <button
                type="button"
                className="p-2 text-gray-500 hover:text-[#615fff] rounded-full hover:bg-gray-200"
              >
                <Paperclip className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="submit"
                className="p-2 bg-[#615fff] text-white rounded-lg hover:bg-[#473ee7] transition-colors disabled:opacity-50"
                disabled={!mensagemInput.trim() || isLoadingHistorico}
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <MessageSquare className="w-24 h-24 mx-auto text-gray-300 mb-4" />
            <p className="text-xl font-medium text-gray-600">Bem-vindo ao Chat!</p>
            <p className="text-gray-500">Selecione uma conversa à esquerda.</p>
          </div>
        )}
      </div>

      {/* Painel de Informações do Lead (mantido como antes) */}
      {selectedLeadForInfo && (
        <LeadInfoPanel
          lead={selectedLeadForInfo}
          isOpen={isLeadInfoPanelOpen}
          onClose={() => setIsLeadInfoPanelOpen(false)}
          onUpdateNota={handleUpdateNota}
          onAddTagToLead={handleAddTagToLead}
          onRemoveTagFromLead={handleRemoveTagFromLead}
          onCreateNewTag={handleCreateNewTag}
          fetchLeadDetails={fetchLeadDetails}
          fetchAvailableTags={fetchAvailableTags}
        />
      )}
    </div>
  );
};

export default Chats;
