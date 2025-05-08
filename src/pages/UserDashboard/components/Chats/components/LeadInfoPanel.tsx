// import { ChevronLeft } from "lucide-react";
// import { useEffect, useState } from "react";
// import { Conversa } from "../Chats";

// interface LeadDetails {
//   // Você precisará buscar esses dados do backend
//   id: string;
//   nota: string;
//   tags: Array<{ id: string; nome: string; cor: string }>;
// }

// interface TagGlobal {
//   id: string;
//   nome: string;
//   cor: string;
// }

// const corPadraoNovaTag = "#CCCCCC"; // Cor inicial para novas tags

// const LeadInfoPanel: React.FC<{
//   lead: Conversa; // Informações básicas do lead/conversa
//   isOpen: boolean;
//   onClose: () => void;
//   // Funções para interagir com o backend (a serem implementadas)
//   onUpdateNota: (leadId: string, novaNota: string) => Promise<void>;
//   onAddTagToLead: (leadId: string, tagId: string) => Promise<void>;
//   onRemoveTagFromLead: (leadId: string, tagId: string) => Promise<void>;
//   onCreateNewTag: (nome: string, cor: string) => Promise<TagGlobal | null>;
// }> = ({
//   lead,
//   isOpen,
//   onClose,
//   onUpdateNota,
//   onAddTagToLead,
//   onRemoveTagFromLead,
//   onCreateNewTag,
// }) => {
//   const [leadDetails, setLeadDetails] = useState<LeadDetails | null>(null);
//   const [availableTags, setAvailableTags] = useState<TagGlobal[]>([]);
//   const [notaEditavel, setNotaEditavel] = useState("");
//   const [novaTagName, setNovaTagName] = useState("");
//   const [novaTagCor, setNovaTagCor] = useState(corPadraoNovaTag);
//   const [isLoading, setIsLoading] = useState(false);

//   const coresDisponiveisParaTags = [
//     "#FF5733",
//     "#33FF57",
//     "#3357FF",
//     "#FF33A1",
//     "#A133FF",
//     "#FF8C33",
//     "#33FFF3",
//     "#F3FF33",
//   ];

//   useEffect(() => {
//     if (isOpen && lead) {
//       setIsLoading(true);
//       // Simulação de busca de dados do lead e tags globais
//       // Substitua por chamadas reais ao seu backend (n8n)
//       Promise.all([
//         // Exemplo: fetchLeadDetails(lead.id),
//         // Exemplo: fetchAvailableTags()
//         new Promise<LeadDetails>((resolve) =>
//           setTimeout(
//             () =>
//               resolve({
//                 id: lead.id,
//                 nota: "Este é um lead muito promissor.",
//                 tags: [{ id: "tag1", nome: "VIP", cor: "#FFD700" }],
//               }),
//             500,
//           ),
//         ),
//         new Promise<TagGlobal[]>((resolve) =>
//           setTimeout(
//             () =>
//               resolve([
//                 { id: "tag2", nome: "Interesse Produto A", cor: "#3357FF" },
//                 { id: "tag3", nome: "Follow-up", cor: "#33FF57" },
//               ]),
//             500,
//           ),
//         ),
//       ])
//         .then(([details, tagsGlobais]) => {
//           setLeadDetails(details);
//           setNotaEditavel(details.nota);
//           // Filtra tags disponíveis para não mostrar as que o lead já possui
//           const leadTagIds = details.tags.map((t) => t.id);
//           setAvailableTags(tagsGlobais.filter((t) => !leadTagIds.includes(t.id)));
//         })
//         .catch(console.error)
//         .finally(() => setIsLoading(false));
//     }
//   }, [isOpen, lead]);

//   const handleSaveNota = async () => {
//     if (!leadDetails) return;
//     setIsLoading(true);
//     try {
//       await onUpdateNota(leadDetails.id, notaEditavel);
//       setLeadDetails((prev) => (prev ? { ...prev, nota: notaEditavel } : null));
//     } catch (error) {
//       console.error("Erro ao salvar nota:", error);
//       // Adicionar feedback para o usuário
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddTag = async (tagId: string) => {
//     if (!leadDetails) return;
//     setIsLoading(true);
//     try {
//       await onAddTagToLead(leadDetails.id, tagId);
//       // Atualizar UI (re-fetch ou adicionar localmente)
//       // Exemplo simplificado:
//       const tagToAdd = availableTags.find((t) => t.id === tagId);
//       if (tagToAdd) {
//         setLeadDetails((prev) => (prev ? { ...prev, tags: [...prev.tags, tagToAdd] } : null));
//         setAvailableTags((prev) => prev.filter((t) => t.id !== tagId));
//       }
//     } catch (error) {
//       console.error("Erro ao adicionar tag:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleRemoveTag = async (tagId: string) => {
//     if (!leadDetails) return;
//     setIsLoading(true);
//     try {
//       await onRemoveTagFromLead(leadDetails.id, tagId);
//       // Atualizar UI (re-fetch ou remover localmente)
//       // Exemplo simplificado:
//       const tagToRemove = leadDetails.tags.find((t) => t.id === tagId);
//       if (tagToRemove) {
//         setLeadDetails((prev) =>
//           prev ? { ...prev, tags: prev.tags.filter((t) => t.id !== tagId) } : null,
//         );
//         setAvailableTags((prev) => [...prev, tagToRemove]); // Adiciona de volta às disponíveis
//       }
//     } catch (error) {
//       console.error("Erro ao remover tag:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateTag = async () => {
//     if (!novaTagName.trim()) return;
//     setIsLoading(true);
//     try {
//       const novaTagCriada = await onCreateNewTag(novaTagName, novaTagCor);
//       if (novaTagCriada) {
//         setAvailableTags((prev) => [...prev, novaTagCriada]); // Adiciona às disponíveis
//         setNovaTagName("");
//         setNovaTagCor(corPadraoNovaTag);
//       }
//     } catch (error) {
//       console.error("Erro ao criar tag:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const cycleNovaTagCor = () => {
//     const currentIndex = coresDisponiveisParaTags.indexOf(novaTagCor);
//     const nextIndex = (currentIndex + 1) % coresDisponiveisParaTags.length;
//     setNovaTagCor(coresDisponiveisParaTags[nextIndex]);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/30 z-40 flex justify-end" onClick={onClose}>
//       <div
//         className="w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out"
//         onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar dentro do painel
//         style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
//       >
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-2xl font-semibold text-gray-800">
//             {lead?.nome || "Detalhes do Lead"}
//           </h3>
//           <button onClick={onClose} className="text-gray-500 hover:text-red-600 p-1 rounded-full">
//             <ChevronLeft className="w-7 h-7 rotate-180" /> {/* Ícone X ou fechar */}
//           </button>
//         </div>

//         {isLoading && !leadDetails ? <p>Carregando informações...</p> : null}

//         {leadDetails && (
//           <div className="space-y-6">
//             {/* Seção de Notas */}
//             <div>
//               <label htmlFor="leadNota" className="block text-sm font-medium text-gray-700 mb-1">
//                 Nota sobre o Lead:
//               </label>
//               <textarea
//                 id="leadNota"
//                 rows={4}
//                 className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#615fff] focus:border-[#615fff]"
//                 value={notaEditavel}
//                 onChange={(e) => setNotaEditavel(e.target.value)}
//                 disabled={isLoading}
//               />
//               <button
//                 onClick={handleSaveNota}
//                 disabled={isLoading || notaEditavel === leadDetails.nota}
//                 className="mt-2 px-4 py-2 bg-[#615fff] text-white rounded-md hover:bg-[#473ee7] disabled:opacity-50"
//               >
//                 {isLoading ? "Salvando..." : "Salvar Nota"}
//               </button>
//             </div>

//             {/* Seção de Tags do Lead */}
//             <div>
//               <h4 className="text-md font-medium text-gray-700 mb-2">Tags do Lead:</h4>
//               {leadDetails.tags.length === 0 ? (
//                 <p className="text-sm text-gray-500">Nenhuma tag adicionada.</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {leadDetails.tags.map((tag) => (
//                     <span
//                       key={tag.id}
//                       className="flex items-center px-3 py-1 rounded-full text-sm font-medium"
//                       style={{ backgroundColor: tag.cor + "33", color: tag.cor }}
//                     >
//                       {" "}
//                       {/* Cor com opacidade */}
//                       {tag.nome}
//                       <button
//                         onClick={() => handleRemoveTag(tag.id)}
//                         disabled={isLoading}
//                         className="ml-2 text-xs hover:text-red-700"
//                         style={{ color: tag.cor }}
//                       >
//                         &times; {/* 'x' para remover */}
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Seção de Tags Disponíveis */}
//             <div>
//               <h4 className="text-md font-medium text-gray-700 mb-2">Tags Disponíveis:</h4>
//               {availableTags.length === 0 ? (
//                 <p className="text-sm text-gray-500">Nenhuma tag nova disponível.</p>
//               ) : (
//                 <div className="flex flex-wrap gap-2">
//                   {availableTags.map((tag) => (
//                     <button
//                       key={tag.id}
//                       onClick={() => handleAddTag(tag.id)}
//                       disabled={isLoading}
//                       className="px-3 py-1 rounded-full text-sm font-medium border hover:border-transparent"
//                       style={{
//                         borderColor: tag.cor,
//                         color: tag.cor,
//                         backgroundColor: "transparent",
//                       }} // Estilo para clique
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.backgroundColor = tag.cor + "22";
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.backgroundColor = "transparent";
//                       }}
//                     >
//                       + {tag.nome}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Seção de Criar Nova Tag */}
//             <div>
//               <h4 className="text-md font-medium text-gray-700 mb-2">Criar Nova Tag:</h4>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={cycleNovaTagCor}
//                   className="w-6 h-6 rounded-full border border-gray-300 focus:outline-none"
//                   style={{ backgroundColor: novaTagCor }}
//                   aria-label="Mudar cor da tag"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Nome da nova tag"
//                   value={novaTagName}
//                   onChange={(e) => setNovaTagName(e.target.value)}
//                   className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#615fff] focus:border-[#615fff]"
//                   disabled={isLoading}
//                 />
//                 <button
//                   onClick={handleCreateTag}
//                   disabled={isLoading || !novaTagName.trim()}
//                   className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
//                 >
//                   Criar
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeadInfoPanel;
import { X as XIcon } from "lucide-react"; // Importar XIcon para fechar
import React, { useEffect, useState } from "react";
import { Conversa } from "../Chats"; // Ajuste o caminho se necessário
// Importar os tipos necessários, que podem estar em chatService ou definidos aqui
import { LeadDetailsData, TagGlobal } from "../chatService"; // Ajuste o caminho se necessário

// --- Componente LeadInfoPanel (Corrigido para Processar Resposta da API) ---

interface LeadInfoPanelProps {
  lead: Conversa | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNota: (leadId: string, novaNota: string) => Promise<void>;
  onAddTagToLead: (leadId: string, tagId: string) => Promise<void>;
  onRemoveTagFromLead: (leadId: string, tagId: string) => Promise<void>;
  onCreateNewTag: (nome: string, cor: string) => Promise<TagGlobal | null>;
  fetchLeadDetails: (leadId: string) => Promise<LeadDetailsData[]>; // Espera um array
  fetchAvailableTags: () => Promise<TagGlobal[]>;
}

// Tipo interno para garantir que tags seja sempre um array após o parse
interface ParsedLeadDetails extends Omit<LeadDetailsData, "tags"> {
  tags: TagGlobal[];
}

const corPadraoNovaTag = "#CCCCCC";

const LeadInfoPanel: React.FC<LeadInfoPanelProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateNota,
  onAddTagToLead,
  onRemoveTagFromLead,
  onCreateNewTag,
  fetchLeadDetails,
  fetchAvailableTags,
}) => {
  const [leadDetails, setLeadDetails] = useState<ParsedLeadDetails | null>(null);
  const [availableTags, setAvailableTags] = useState<TagGlobal[]>([]);
  const [notaEditavel, setNotaEditavel] = useState("");
  const [novaTagName, setNovaTagName] = useState("");
  const [novaTagCor, setNovaTagCor] = useState(corPadraoNovaTag);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const coresDisponiveisParaTags = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#FF8C33",
    "#33FFF3",
    "#F3FF33",
    "#BDBDBD",
    "#795548",
  ];

  const loadPanelData = async () => {
    if (!lead) {
      console.warn("[LeadInfoPanel] Tentativa de carregar dados sem lead selecionado.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setLeadDetails(null);

    try {
      console.log(`[LeadInfoPanel] Buscando detalhes para lead ID: ${lead.id}`);
      const [responseData, tagsGlobais] = await Promise.all([
        fetchLeadDetails(lead.id),
        fetchAvailableTags(),
      ]);
      console.log(
        "[LeadInfoPanel] Resposta bruta recebida (fetchLeadDetails):",
        JSON.stringify(responseData),
      );
      console.log("[LeadInfoPanel] Tags globais recebidas:", tagsGlobais);

      // Pega o primeiro objeto do array retornado pela API
      const rawDetailsObject = responseData && responseData.length > 0 ? responseData[0] : null;

      if (!rawDetailsObject) {
        console.warn("[LeadInfoPanel] API fetchLeadDetails retornou array vazio ou null.");
        setError("Dados do lead não encontrados.");
        setLeadDetails(null);
        setAvailableTags(tagsGlobais || []);
        setNotaEditavel("");
        setIsLoading(false);
        return;
      }

      let parsedTags: TagGlobal[] = [];
      let processingError = null;

      // Processamento das Tags (usando rawDetailsObject.tags)
      if (rawDetailsObject.tags) {
        if (typeof rawDetailsObject.tags === "string") {
          console.log("[LeadInfoPanel] Campo 'tags' é uma string. Tentando parse...");
          try {
            parsedTags = JSON.parse(rawDetailsObject.tags);
            if (!Array.isArray(parsedTags)) {
              console.warn(
                "[LeadInfoPanel] Parse da string 'tags' não resultou em array. Tratando como vazio.",
                parsedTags,
              );
              parsedTags = [];
            } else {
              console.log("[LeadInfoPanel] Parse da string 'tags' bem-sucedido:", parsedTags);
            }
          } catch (parseError) {
            console.error(
              "[LeadInfoPanel] Erro ao fazer parse da string de tags:",
              parseError,
              rawDetailsObject.tags,
            );
            parsedTags = [];
            processingError = "Erro ao processar as tags recebidas.";
          }
        } else if (Array.isArray(rawDetailsObject.tags)) {
          console.log("[LeadInfoPanel] Campo 'tags' já é um array.");
          parsedTags = rawDetailsObject.tags;
        } else {
          console.warn(
            "[LeadInfoPanel] Campo 'tags' não é string nem array. Tratando como vazio.",
            rawDetailsObject.tags,
          );
          parsedTags = [];
        }
      } else {
        console.warn("[LeadInfoPanel] Campo 'tags' não encontrado nos detalhes recebidos.");
        parsedTags = [];
      }

      // Atualização do Estado
      if (!processingError) {
        // --- CORREÇÃO AQUI: Montar o objeto corretamente ---
        // Cria o objeto final combinando as propriedades do objeto recebido
        // com o array de tags processado.
        const processedDetails: ParsedLeadDetails = {
          id: rawDetailsObject.id || lead.id, // Usa o ID do objeto ou do lead original
          nota: rawDetailsObject.nota || "", // Usa a nota do objeto ou string vazia
          tags: parsedTags, // Usa as tags que foram processadas (garantido ser array)
          // Adicione outras propriedades de rawDetailsObject se necessário:
          // nome: rawDetailsObject.nome || lead.nome, // Exemplo
          // ... outras propriedades ...
        };
        // --- FIM DA CORREÇÃO ---

        console.log("[LeadInfoPanel] Detalhes processados:", processedDetails);
        setLeadDetails(processedDetails); // Define o estado com o objeto correto
        setNotaEditavel(processedDetails.nota); // Define a nota editável
        console.log(`[LeadInfoPanel] Nota definida para: "${processedDetails.nota}"`);

        const leadTagIds = processedDetails.tags.map((t) => t.id);
        setAvailableTags(tagsGlobais.filter((t) => !leadTagIds.includes(t.id)));
        console.log(
          "[LeadInfoPanel] Tags disponíveis definidas:",
          tagsGlobais.filter((t) => !leadTagIds.includes(t.id)),
        );
      } else {
        setError(processingError);
        setLeadDetails(null);
        setAvailableTags(tagsGlobais || []);
        setNotaEditavel("");
      }
    } catch (err) {
      console.error("[LeadInfoPanel] Erro na chamada API ao carregar dados:", err);
      setError("Não foi possível carregar os dados do lead.");
      setLeadDetails(null);
      setAvailableTags([]);
      setNotaEditavel("");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect (sem alterações)
  useEffect(() => {
    console.log(`[LeadInfoPanel] useEffect disparado. isOpen: ${isOpen}, lead: ${lead?.id}`);
    if (isOpen && lead) {
      loadPanelData();
    } else {
      console.log("[LeadInfoPanel] Limpando estado.");
      setLeadDetails(null);
      setAvailableTags([]);
      setNotaEditavel("");
      setError(null);
      setIsLoading(false);
      setIsSubmitting(false);
      setIsCreatingTag(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lead]);

  // Funções de manipulação (sem alterações)
  const handleSaveNota = async () => {
    /* ... */ if (!leadDetails || !lead || notaEditavel === (leadDetails.nota || "")) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdateNota(lead.id, notaEditavel);
      setLeadDetails((prev) => (prev ? { ...prev, nota: notaEditavel } : null));
      console.log("[LeadInfoPanel] Nota salva com sucesso!");
    } catch (error) {
      console.error("[LeadInfoPanel] Erro ao salvar nota:", error);
      setError("Falha ao salvar a nota.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddTag = async (tag: TagGlobal) => {
    /* ... */ if (!leadDetails || !lead) return;
    setIsSubmitting(true);
    setError(null);
    const originalLeadTags = [...leadDetails.tags];
    const originalAvailableTags = [...availableTags];
    setLeadDetails((prev) => (prev ? { ...prev, tags: [...prev.tags, tag] } : null));
    setAvailableTags((prev) => prev.filter((t) => t.id !== tag.id));
    try {
      await onAddTagToLead(lead.id, tag.id);
      console.log(`[LeadInfoPanel] Tag "${tag.nome}" adicionada ao lead ${lead.id}`);
    } catch (error) {
      console.error("[LeadInfoPanel] Erro ao adicionar tag:", error);
      setError("Falha ao adicionar a tag.");
      setLeadDetails((prev) => (prev ? { ...prev, tags: originalLeadTags } : null));
      setAvailableTags(originalAvailableTags);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRemoveTag = async (tag: TagGlobal) => {
    /* ... */ if (!leadDetails || !lead) return;
    setIsSubmitting(true);
    setError(null);
    const originalLeadTags = [...leadDetails.tags];
    const originalAvailableTags = [...availableTags];
    setLeadDetails((prev) =>
      prev ? { ...prev, tags: prev.tags.filter((t) => t.id !== tag.id) } : null,
    );
    setAvailableTags((prev) => [...prev, tag].sort((a, b) => a.nome.localeCompare(b.nome)));
    try {
      await onRemoveTagFromLead(lead.id, tag.id);
      console.log(`[LeadInfoPanel] Tag "${tag.nome}" removida do lead ${lead.id}`);
    } catch (error) {
      console.error("[LeadInfoPanel] Erro ao remover tag:", error);
      setError("Falha ao remover a tag.");
      setLeadDetails((prev) => (prev ? { ...prev, tags: originalLeadTags } : null));
      setAvailableTags(originalAvailableTags);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCreateTag = async () => {
    /* ... */ if (!novaTagName.trim() || !lead) return;
    setIsCreatingTag(true);
    setError(null);
    try {
      const novaTagCriada = await onCreateNewTag(novaTagName, novaTagCor);
      if (novaTagCriada && novaTagCriada.id) {
        setAvailableTags((prev) =>
          [...prev, novaTagCriada].sort((a, b) => a.nome.localeCompare(b.nome)),
        );
        setNovaTagName("");
        setNovaTagCor(corPadraoNovaTag);
        console.log("[LeadInfoPanel] Nova tag criada e adicionada às disponíveis:", novaTagCriada);
      } else {
        console.error(
          "[LeadInfoPanel] API onCreateNewTag não retornou uma tag válida.",
          novaTagCriada,
        );
        setError("Não foi possível criar a tag (resposta inválida da API).");
      }
    } catch (error) {
      console.error("[LeadInfoPanel] Erro ao criar tag:", error);
      setError("Falha ao criar a tag.");
    } finally {
      setIsCreatingTag(false);
    }
  };
  const cycleNovaTagCor = () => {
    /* ... */ const currentIndex = coresDisponiveisParaTags.indexOf(novaTagCor);
    let nextIndex = (currentIndex + 1) % coresDisponiveisParaTags.length;
    if (
      coresDisponiveisParaTags[nextIndex] === corPadraoNovaTag &&
      coresDisponiveisParaTags.length > 1
    ) {
      nextIndex = (nextIndex + 1) % coresDisponiveisParaTags.length;
    }
    setNovaTagCor(coresDisponiveisParaTags[nextIndex] || corPadraoNovaTag);
  };

  // --- Renderização (sem alterações) ---
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-800">{lead?.nome || "Detalhes"}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Loading / Erro */}
        {isLoading && (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-500 animate-pulse">Carregando...</p>
          </div>
        )}
        {error && !isLoading && (
          <div className="flex-grow flex items-center justify-center text-red-600 p-4 text-center bg-red-50 rounded-md">
            {error}
          </div>
        )}

        {/* Conteúdo */}
        {!isLoading && !error && leadDetails && (
          <div className="space-y-6 flex-grow">
            {/* Notas */}
            <div>
              <label htmlFor="leadNota" className="block text-sm font-medium text-gray-700 mb-1">
                Nota sobre o Lead:
              </label>
              <textarea
                id="leadNota"
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#615fff] focus:border-[#615fff] disabled:bg-gray-50"
                value={notaEditavel}
                onChange={(e) => setNotaEditavel(e.target.value)}
                disabled={isSubmitting}
              />
              <button
                onClick={handleSaveNota}
                disabled={isSubmitting || notaEditavel === (leadDetails?.nota || "")}
                className="mt-2 px-4 py-2 bg-[#615fff] text-white rounded-md hover:bg-[#473ee7] disabled:opacity-50 transition-opacity"
              >
                {" "}
                {isSubmitting ? "Salvando..." : "Salvar Nota"}{" "}
              </button>
            </div>
            {/* Tags do Lead */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Tags do Lead:</h4>
              {leadDetails.tags.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhuma tag adicionada.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {leadDetails.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: tag.cor + "33",
                        color: tag.cor,
                        border: `1px solid ${tag.cor + "80"}`,
                      }}
                    >
                      {tag.nome}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        disabled={isSubmitting}
                        className="ml-1.5 -mr-0.5 p-0.5 rounded-full hover:bg-black/10 disabled:opacity-50"
                        style={{ color: tag.cor }}
                        title="Remover tag"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* Tags Disponíveis */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-2">Tags Disponíveis:</h4>
              {availableTags.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhuma tag nova disponível ou todas já foram adicionadas.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag)}
                      disabled={isSubmitting}
                      className="px-3 py-1 rounded-full text-sm font-medium border hover:border-transparent transition-colors duration-150 disabled:opacity-50"
                      style={{
                        borderColor: tag.cor,
                        color: tag.cor,
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = tag.cor + "22";
                          e.currentTarget.style.color = tag.cor;
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      + {tag.nome}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Criar Nova Tag */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-md font-medium text-gray-700 mb-2">Criar Nova Tag Global:</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={cycleNovaTagCor}
                  className="w-7 h-7 rounded-full border-2 border-white shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#615fff] flex-shrink-0"
                  style={{ backgroundColor: novaTagCor }}
                  aria-label="Mudar cor da tag"
                  title={`Cor selecionada: ${novaTagCor}. Clique para mudar.`}
                />
                <input
                  type="text"
                  placeholder="Nome da nova tag"
                  value={novaTagName}
                  onChange={(e) => setNovaTagName(e.target.value)}
                  className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#615fff] focus:border-[#615fff] disabled:bg-gray-50"
                  disabled={isCreatingTag || isSubmitting}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && novaTagName.trim()) handleCreateTag();
                  }}
                />
                <button
                  onClick={handleCreateTag}
                  disabled={isCreatingTag || isSubmitting || !novaTagName.trim()}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 transition-opacity"
                >
                  {" "}
                  {isCreatingTag ? "Criando..." : "Criar"}{" "}
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Mensagem caso não haja detalhes */}
        {!isLoading && !error && !leadDetails && lead && (
          <div className="flex-grow flex items-center justify-center text-gray-500 p-4 text-center">
            Não há detalhes disponíveis para este lead.
          </div>
        )}
      </div>
    </div>
  );
};

// Se este componente estiver em seu próprio arquivo (ex: LeadInfoPanel.tsx),
// adicione a linha abaixo no final do arquivo:
export default LeadInfoPanel;
