import {
  PlusCircle,
  Save as SaveIcon,
  Search as SearchIcon,
  Tag as TagIcon,
  X as XIcon,
} from "lucide-react"; // Importar ícones relevantes
import React, { useEffect, useMemo, useState } from "react";
import { Conversa } from "../Chats"; // Ajuste o caminho se necessário
// Importar os tipos necessários, que podem estar em chatService ou definidos aqui
import { LeadDetailsData, TagGlobal } from "../chatService"; // Ajuste o caminho se necessário

// --- Componente LeadInfoPanel (Design Moderno e Filtro de Tags) ---

interface LeadInfoPanelProps {
  lead: Conversa | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateNota: (leadId: string, novaNota: string) => Promise<void>;
  onAddTagToLead: (leadId: string, tagId: string) => Promise<void>;
  onRemoveTagFromLead: (leadId: string, tagId: string) => Promise<void>;
  onCreateNewTag: (nome: string, cor: string) => Promise<TagGlobal | null>;
  fetchLeadDetails: (leadId: string) => Promise<LeadDetailsData>; // Espera objeto único
  fetchAvailableTags: () => Promise<TagGlobal[]>;
}

// Tipo interno para garantir que tags seja sempre um array após o parse
interface ParsedLeadDetails extends Omit<LeadDetailsData, "tags"> {
  tags: TagGlobal[];
}

const corPadraoNovaTag = "#CCCCCC";

// Função auxiliar para determinar se a cor de fundo é clara ou escura
// Retorna true se a cor for clara (para usar texto escuro), false caso contrário (usar texto branco)
const isColorLight = (hexColor: string): boolean => {
  try {
    const color = hexColor.substring(1); // Remove #
    const rgb = parseInt(color, 16); // Converte rrggbb para decimal
    const r = (rgb >> 16) & 0xff; // Extrai R
    const g = (rgb >> 8) & 0xff; // Extrai G
    const b = (rgb >> 0) & 0xff; // Extrai B
    // Fórmula de luminosidade relativa (perceptual)
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 160; // Limiar ajustável (cores acima de ~160 são consideradas claras)
  } catch (e) {
    console.error("Erro ao calcular luminosidade da cor:", e);
    return false; // Assume escuro em caso de erro
  }
};

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
  const [tagFilter, setTagFilter] = useState(""); // Estado para o filtro de tags
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
    "#009688",
    "#E91E63",
  ];

  const loadPanelData = async () => {
    // ... (lógica de busca mantida como na versão anterior) ...
    if (!lead) {
      console.warn("[LeadInfoPanel] Tentativa de carregar dados sem lead selecionado.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setLeadDetails(null);
    try {
      console.log(`[LeadInfoPanel] Buscando detalhes para lead ID: ${lead.id}`);
      const [rawDetailsObject, tagsGlobais] = await Promise.all([
        fetchLeadDetails(lead.id),
        fetchAvailableTags(),
      ]);
      console.log(
        "[LeadInfoPanel] Objeto de detalhes brutos recebido:",
        JSON.stringify(rawDetailsObject),
      );
      console.log("[LeadInfoPanel] Tags globais recebidas:", tagsGlobais);
      if (!rawDetailsObject) {
        console.warn("[LeadInfoPanel] API fetchLeadDetails retornou null ou undefined.");
        setError("Dados do lead não encontrados.");
        setLeadDetails(null);
        setAvailableTags(tagsGlobais || []);
        setNotaEditavel("");
        setIsLoading(false);
        return;
      }
      let parsedAndValidatedTags: TagGlobal[] = [];
      let processingError = null;
      if (rawDetailsObject.tags) {
        let tagsPotenciais: unknown[] = [];
        if (typeof rawDetailsObject.tags === "string") {
          try {
            const parsedResult = JSON.parse(rawDetailsObject.tags);
            if (Array.isArray(parsedResult)) {
              tagsPotenciais = parsedResult;
            } else {
              tagsPotenciais = [];
            }
          } catch (parseError) {
            console.error("[LeadInfoPanel] Erro parse tags:", parseError);
            tagsPotenciais = [];
            processingError = "Erro ao processar tags.";
          }
        } else if (Array.isArray(rawDetailsObject.tags)) {
          tagsPotenciais = rawDetailsObject.tags as unknown[];
        } else {
          tagsPotenciais = [];
        }
        parsedAndValidatedTags = tagsPotenciais.filter(
          (tag): tag is TagGlobal =>
            tag !== null && typeof tag === "object" && "id" in tag && "nome" in tag && "cor" in tag,
        );
        if (parsedAndValidatedTags.length !== tagsPotenciais.length) {
          console.warn("[LeadInfoPanel] Algumas tags filtradas.");
        }
      } else {
        parsedAndValidatedTags = [];
      }
      if (!processingError) {
        const processedDetails: ParsedLeadDetails = {
          id: rawDetailsObject.id || lead.id,
          nota: rawDetailsObject.nota || "",
          tags: parsedAndValidatedTags,
        };
        setLeadDetails(processedDetails);
        setNotaEditavel(processedDetails.nota);
        const leadTagIds = processedDetails.tags.map((t) => t.id);
        setAvailableTags(tagsGlobais.filter((t) => !leadTagIds.includes(t.id)));
      } else {
        setError(processingError);
        setLeadDetails(null);
        setAvailableTags(tagsGlobais || []);
        setNotaEditavel("");
      }
    } catch (err) {
      console.error("[LeadInfoPanel] Erro API:", err);
      setError("Não foi possível carregar dados.");
      setLeadDetails(null);
      setAvailableTags([]);
      setNotaEditavel("");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && lead) {
      loadPanelData();
    } else {
      setLeadDetails(null);
      setAvailableTags([]);
      setNotaEditavel("");
      setError(null);
      setIsLoading(false);
      setIsSubmitting(false);
      setIsCreatingTag(false);
      setTagFilter(""); /* Limpa filtro */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, lead]);

  // --- Funções de Manipulação (Handlers) ---
  // (Lógica interna mantida, apenas adicionando logs ou feedback se necessário)
  const handleSaveNota = async () => {
    if (!leadDetails || !lead || notaEditavel === (leadDetails.nota || "")) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdateNota(lead.id, notaEditavel);
      setLeadDetails((prev) => (prev ? { ...prev, nota: notaEditavel } : null));
      console.log("[LeadInfoPanel] Nota salva!"); /* Adicionar Toast de sucesso */
    } catch (error) {
      console.error("Erro salvar nota:", error);
      setError("Falha ao salvar nota.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAddTag = async (tag: TagGlobal) => {
    if (!leadDetails || !lead) return;
    setIsSubmitting(true);
    setError(null);
    const originalLeadTags = [...leadDetails.tags];
    const originalAvailableTags = [...availableTags];
    setLeadDetails((prev) => (prev ? { ...prev, tags: [...prev.tags, tag] } : null));
    setAvailableTags((prev) => prev.filter((t) => t.id !== tag.id));
    try {
      await onAddTagToLead(lead.id, tag.id); /* Adicionar Toast */
    } catch (error) {
      console.error("Erro add tag:", error);
      setError("Falha ao adicionar tag.");
      setLeadDetails((prev) => (prev ? { ...prev, tags: originalLeadTags } : null));
      setAvailableTags(originalAvailableTags);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRemoveTag = async (tag: TagGlobal) => {
    if (!leadDetails || !lead) return;
    setIsSubmitting(true);
    setError(null);
    const originalLeadTags = [...leadDetails.tags];
    const originalAvailableTags = [...availableTags];
    setLeadDetails((prev) =>
      prev ? { ...prev, tags: prev.tags.filter((t) => t.id !== tag.id) } : null,
    );
    setAvailableTags((prev) => [...prev, tag].sort((a, b) => a.nome.localeCompare(b.nome)));
    try {
      await onRemoveTagFromLead(lead.id, tag.id); /* Adicionar Toast */
    } catch (error) {
      console.error("Erro remover tag:", error);
      setError("Falha ao remover tag.");
      setLeadDetails((prev) => (prev ? { ...prev, tags: originalLeadTags } : null));
      setAvailableTags(originalAvailableTags);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleCreateTag = async () => {
    if (!novaTagName.trim() || !lead) return;
    setIsCreatingTag(true);
    setError(null);
    try {
      const novaTagCriada = await onCreateNewTag(novaTagName, novaTagCor);
      if (novaTagCriada && novaTagCriada.id) {
        setAvailableTags((prev) =>
          [...prev, novaTagCriada].sort((a, b) => a.nome.localeCompare(b.nome)),
        );
        setNovaTagName("");
        setNovaTagCor(corPadraoNovaTag); /* Adicionar Toast */
      } else {
        setError("Não foi possível criar tag (API).");
      }
    } catch (error) {
      console.error("Erro criar tag:", error);
      setError("Falha ao criar tag.");
    } finally {
      setIsCreatingTag(false);
    }
  };
  const cycleNovaTagCor = () => {
    const currentIndex = coresDisponiveisParaTags.indexOf(novaTagCor);
    let nextIndex = (currentIndex + 1) % coresDisponiveisParaTags.length;
    if (
      coresDisponiveisParaTags[nextIndex] === corPadraoNovaTag &&
      coresDisponiveisParaTags.length > 1
    ) {
      nextIndex = (nextIndex + 1) % coresDisponiveisParaTags.length;
    }
    setNovaTagCor(coresDisponiveisParaTags[nextIndex] || corPadraoNovaTag);
  };

  // --- Filtragem das Tags Disponíveis ---
  const filteredAvailableTags = useMemo(() => {
    if (!tagFilter) {
      return availableTags; // Retorna todas se o filtro estiver vazio
    }
    return availableTags.filter((tag) => tag.nome.toLowerCase().includes(tagFilter.toLowerCase()));
  }, [availableTags, tagFilter]); // Recalcula apenas quando estas dependências mudam

  // --- Renderização ---
  if (!isOpen) return null;

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end"
      onClick={onClose}
    >
      {/* Container do Painel */}
      <div
        className="w-full max-w-md h-full bg-gradient-to-b from-white to-gray-50 shadow-2xl p-1 overflow-hidden transform transition-transform duration-300 ease-in-out flex flex-col" // Gradiente sutil, overflow hidden
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-4 px-6 pt-5 pb-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">{lead?.nome || "Detalhes"}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        {/* Conteúdo com Scroll */}
        <div className="flex-grow overflow-y-auto px-6 pb-6 space-y-6">
          {/* Loading / Erro */}
          {isLoading && (
            <div className="py-10 flex items-center justify-center">
              <p className="text-gray-500 animate-pulse">Carregando...</p>
            </div>
          )}
          {error && !isLoading && (
            <div className="p-3 text-center text-red-700 bg-red-100 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Detalhes (renderiza apenas se carregado e sem erro) */}
          {!isLoading && !error && leadDetails && (
            <>
              {/* Seção de Notas */}
              <div className="space-y-2">
                <label htmlFor="leadNota" className="block text-sm font-medium text-gray-700">
                  Nota:
                </label>
                <textarea
                  id="leadNota"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#615fff]/50 focus:border-[#615fff] disabled:bg-gray-100 text-sm"
                  value={notaEditavel}
                  onChange={(e) => setNotaEditavel(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Adicione uma nota sobre este lead..."
                />
                <button
                  onClick={handleSaveNota}
                  disabled={isSubmitting || notaEditavel === (leadDetails?.nota || "")}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#615fff] text-white text-sm font-medium rounded-lg shadow-sm hover:bg-[#473ee7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#615fff] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  <SaveIcon className="w-4 h-4" />
                  {isSubmitting ? "Salvando..." : "Salvar Nota"}
                </button>
              </div>

              {/* Seção de Tags do Lead */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Tags do Lead:</h4>
                {leadDetails.tags.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">Nenhuma tag adicionada.</p>
                ) : (
                  <div className="flex flex-wrap gap-2 items-center">
                    {leadDetails.tags.map(
                      (tag) =>
                        tag &&
                        tag.id &&
                        tag.nome &&
                        tag.cor && (
                          <span
                            key={tag.id}
                            className="flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm"
                            // --- ESTILO DA TAG ATUALIZADO ---
                            style={{
                              backgroundColor: tag.cor,
                              // Define a cor do texto baseada na luminosidade do fundo
                              color: isColorLight(tag.cor) ? "#374151" : "#FFFFFF", // Cinza escuro ou branco
                            }}
                          >
                            {tag.nome}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              disabled={isSubmitting}
                              className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-white/30 disabled:opacity-50 transition-colors"
                              style={{ color: isColorLight(tag.cor) ? "#555" : "#eee" }} // Cor do X ajustada
                              title="Remover tag"
                            >
                              <XIcon className="w-3 h-3" strokeWidth={3} />
                            </button>
                          </span>
                        ),
                    )}
                  </div>
                )}
              </div>

              {/* Seção de Tags Disponíveis com Filtro */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Adicionar Tags:</h4>
                {/* Input de Filtro */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Filtrar tags..."
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="w-full p-2 pl-8 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#615fff]/50 focus:border-[#615fff] text-sm"
                  />
                  <SearchIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                {/* Lista de Tags Filtradas */}
                {filteredAvailableTags.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">
                    {availableTags.length === 0
                      ? "Nenhuma tag disponível."
                      : "Nenhuma tag encontrada no filtro."}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                    {" "}
                    {/* Altura máxima e scroll */}
                    {filteredAvailableTags.map(
                      (tag) =>
                        tag &&
                        tag.id &&
                        tag.nome &&
                        tag.cor && (
                          <button
                            key={tag.id}
                            onClick={() => handleAddTag(tag)}
                            disabled={isSubmitting}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ borderColor: tag.cor, color: tag.cor }}
                          >
                            <PlusCircle className="w-3 h-3" />
                            {tag.nome}
                          </button>
                        ),
                    )}
                  </div>
                )}
              </div>

              {/* Seção de Criar Nova Tag */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Criar Nova Tag Global:</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={cycleNovaTagCor}
                    className="w-6 h-6 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#615fff] flex-shrink-0 transition-colors"
                    style={{ backgroundColor: novaTagCor }}
                    aria-label="Mudar cor da tag"
                    title={`Cor selecionada: ${novaTagCor}. Clique para mudar.`}
                  />
                  <input
                    type="text"
                    placeholder="Nome da nova tag"
                    value={novaTagName}
                    onChange={(e) => setNovaTagName(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#615fff]/50 focus:border-[#615fff] disabled:bg-gray-100 text-sm"
                    disabled={isCreatingTag || isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && novaTagName.trim()) handleCreateTag();
                    }}
                  />
                  <button
                    onClick={handleCreateTag}
                    disabled={isCreatingTag || isSubmitting || !novaTagName.trim()}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  >
                    <TagIcon className="w-4 h-4" />
                    {isCreatingTag ? "Criando..." : "Criar"}
                  </button>
                </div>
              </div>
            </>
          )}
          {/* Mensagem caso não haja detalhes */}
          {!isLoading && !error && !leadDetails && lead && (
            <div className="flex-grow flex items-center justify-center text-gray-500 p-4 text-center">
              Não há detalhes disponíveis para este lead.
            </div>
          )}
        </div>{" "}
        {/* Fim do conteúdo com scroll */}
      </div>{" "}
      {/* Fim do Container do Painel */}
    </div> // Fim do Overlay
  );
};

export default LeadInfoPanel;
