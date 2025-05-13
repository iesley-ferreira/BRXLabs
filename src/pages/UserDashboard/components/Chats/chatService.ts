const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token") || "";

// --- Tipos Esperados do Backend (Ajuste conforme sua API) ---

interface ConversaRecenteRaw {
  lead_whatsapp: string; // Corresponde a leads.whatsapp
  lead_nome: string; // Corresponde a leads.nome
  ultima_mensagem_content: string | null; // Conteúdo da última mensagem
  ultima_mensagem_tipo: "ai" | "human" | null; // Tipo da última mensagem
  ultima_mensagem_timestamp: string | null; // Timestamp da última mensagem
  // Adicione outras informações do lead se necessário (ex: atendente, nota_geral)
}

export interface LeadDetailsData {
  id: string; // O whatsapp do lead
  nota: string; // nota_geral da tabela leads
  tags: Array<{ id: string; nome: string; cor: string }>; // Tags associadas da tabela lead_tags JOIN tags
}

export interface TagGlobal {
  id: string; // id da tabela tags
  nome: string;
  cor: string;
}

export type Conversa = {
  id: string; // Mapeado de lead_whatsapp
  nome: string; // Mapeado de lead_nome
  telefone: string; // Pode ser o mesmo que id (lead_whatsapp)
  ultimaMensagem: string;
  atualizadoEm: string; // Timestamp da última mensagem
  remetenteUltimaMensagem: "bot" | "user";
  // Adicione outras props se necessário
  avatarSeed?: string; // Gerado no frontend ou vindo do backend
  unreadCount?: number; // Lógica a ser implementada
};

// --- Funções do Serviço ---

/**
 * Busca as conversas mais recentes.
 * Espera que o backend retorne uma lista de leads com detalhes da última mensagem.
 */
export async function getConversasRecentes(): Promise<Conversa[]> {
  // Ajuste o endpoint se necessário
  const res = await fetch(`${API_URL}/webhook/gi/conversas-recentes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Erro ao buscar conversas recentes:", res.status, await res.text());
    throw new Error("Falha ao buscar conversas recentes");
  }

  const data: ConversaRecenteRaw[] = await res.json();

  // Mapeia os dados brutos para o tipo Conversa do frontend
  const conversasFormatadas: Conversa[] = data
    .filter((item) => item.ultima_mensagem_timestamp) // Garante que há uma última mensagem para ordenar
    .map(
      (item): Conversa => ({
        id: item.lead_whatsapp,
        nome: item.lead_nome || "Desconhecido",
        telefone: item.lead_whatsapp, // Ou outro campo se disponível
        ultimaMensagem: item.ultima_mensagem_content || "",
        remetenteUltimaMensagem: item.ultima_mensagem_tipo === "ai" ? "bot" : "user",
        atualizadoEm: item.ultima_mensagem_timestamp!, // Non-null assertion pois filtramos acima
        avatarSeed: item.lead_nome || item.lead_whatsapp, // Para o placeholder
      }),
    );

  // Ordena pelas mais recentes (o backend já deve fazer isso, mas garantimos aqui)
  return conversasFormatadas.sort(
    (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
  );
}

/**
 * Busca o histórico de mensagens de uma conversa específica da tabela chat_histories.
 */
// export const getHistoricoConversa = async (sessionId: string): Promise<Mensagem[]> => {
//   // O endpoint parece ok, mas confirme se o parâmetro é 'whatsapp' ou 'session_id'
//   const res = await fetch(`${API_URL}/webhook/gi/leads-historico2?whatsapp=${sessionId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) {
//     console.error("Erro ao buscar histórico:", res.status, await res.text());
//     throw new Error("Falha ao buscar histórico da conversa");
//   }

//   const data: MensagemBruta[] = await res.json();

//   // Mapeia para o tipo Mensagem do frontend
//   return data.map(
//     (item): Mensagem => ({
//       id: item.id || crypto.randomUUID(), // Usa ID do backend se existir, senão gera um
//       content: item.content,
//       sender: item.type === "ai" ? "bot" : "user", // Mapeia 'human' para 'user'
//       timestamp: item.created_at,
//     }),
//   );
// };

/**
 * Envia uma nova mensagem para uma conversa.
 */
// export const enviarMensagem = async (sessionId: string, mensagem: string): Promise<any> => {
//   // Confirme se o endpoint e o corpo da requisição estão corretos
//   const res = await fetch(`${API_URL}/webhook/gi/enviar-mensagem`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       session_id: sessionId, // Garanta que o backend espera 'session_id' (que é o whatsapp)
//       content: mensagem,
//       // O backend deve inferir o 'type' como 'human' ou 'user' para esta mensagem enviada
//     }),
//   });

//   if (!res.ok) {
//     console.error("Erro ao enviar mensagem:", res.status, await res.text());
//     throw new Error("Falha ao enviar mensagem");
//   }

//   const data = await res.json();
//   return data; // Retorna a resposta do backend (pode conter a mensagem criada, etc.)
// };

// --- Novas Funções para o Painel de Informações do Lead ---

/**
 * Busca os detalhes (nota, tags) de um lead específico.
 */
export const fetchLeadDetails = async (leadId: string): Promise<LeadDetailsData> => {
  // Path atualizado, ID como query param
  console.log(leadId);

  const res = await fetch(
    `${API_URL}/webhook/gi/lead-details?leadId=${encodeURIComponent(leadId)}`,
    {
      method: "GET", // GET é mais apropriado para buscar dados
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  if (!res.ok) {
    console.error("Erro ao buscar detalhes do lead:", res.status, await res.text());
    throw new Error("Falha ao buscar detalhes do lead");
  }
  const data: LeadDetailsData = await res.json();
  // Garante que 'tags' seja sempre um array
  data.tags = data.tags || [];
  return data;
};

/**
 * Busca todas as tags globais disponíveis.
 */
export const fetchAvailableTags = async (): Promise<TagGlobal[]> => {
  // Path atualizado
  const res = await fetch(`${API_URL}/webhook/gi/tags`, {
    method: "GET", // GET é apropriado
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    console.error("Erro ao buscar tags disponíveis:", res.status, await res.text());
    throw new Error("Falha ao buscar tags disponíveis");
  }
  return await res.json();
};

/**
 * Atualiza a nota geral de um lead.
 */
export const updateLeadNote = async (leadId: string, novaNota: string): Promise<void> => {
  // Path atualizado, usando POST para enviar dados no corpo
  const res = await fetch(`${API_URL}/webhook/gi/update-lead-note`, {
    method: "POST", // Usando POST para enviar dados no corpo de forma mais simples
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ leadId: leadId, nota: novaNota }), // Enviando ID no corpo
  });

  if (!res.ok) {
    console.error("Erro ao atualizar nota:", res.status, await res.text());
    throw new Error("Falha ao atualizar a nota do lead");
  }
};

/**
 * Adiciona uma tag existente a um lead.
 */
export const addTagToLead = async (leadId: string, tagId: string): Promise<void> => {
  // Path atualizado
  const res = await fetch(`${API_URL}/webhook/gi/add-lead-tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ leadId: leadId, tagId: tagId }), // Enviando IDs no corpo
  });

  if (!res.ok) {
    console.error("Erro ao adicionar tag ao lead:", res.status, await res.text());
    throw new Error("Falha ao adicionar tag ao lead");
  }
};

/**
 * Remove uma tag de um lead.
 */
export const removeTagFromLead = async (leadId: string, tagId: string): Promise<void> => {
  // Path atualizado, IDs como query params para DELETE
  const res = await fetch(
    `${API_URL}/webhook/gi/remove-lead-tag?leadId=${encodeURIComponent(
      leadId,
    )}&tagId=${encodeURIComponent(tagId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    console.error("Erro ao remover tag do lead:", res.status, await res.text());
    throw new Error("Falha ao remover tag do lead");
  }
};

/**
 * Cria uma nova tag global.
 */
export const createNewTag = async (nome: string, cor: string): Promise<TagGlobal> => {
  // Path atualizado
  const res = await fetch(`${API_URL}/webhook/gi/create-tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nome, cor }),
  });

  if (!res.ok) {
    console.error("Erro ao criar nova tag:", res.status, await res.text());
    throw new Error("Falha ao criar nova tag");
  }
  return await res.json(); // Retorna a tag criada (com ID do banco)
};

const EVOLUTION_API_BASE_URL = "https://evo.brxlabs.com.br";
const EVOLUTION_API_KEY = "AB2A599EBA82-40F5-997D-27D1AC5FB00D";
const EVOLUTION_INSTANCE_NAME = "Giovana - GI";

type ContextInfo = Record<string, unknown>;

interface ExtendedTextMessageDetails {
  text: string;
  title?: string;
  description?: string;
  canonicalUrl?: string;
  matchedText?: string;
  jpegThumbnail?: string; // Geralmente uma string base64
  contextInfo?: ContextInfo;
  // Adicione outras propriedades comuns do extendedTextMessage se necessário
}

// Detalhes para mensagens de imagem
interface ImageMessageDetails {
  url?: string; // URL para download da imagem
  mimetype: string; // Ex: "image/jpeg", "image/png"
  caption?: string;
  fileSha256?: string; // Hash do arquivo
  fileEncSha256?: string; // Hash do arquivo encriptado
  mediaKey?: string; // Chave para decriptar a mídia
  directPath?: string; // Caminho direto para o arquivo no servidor do WhatsApp
  fileLength: string; // Tamanho do arquivo (a API retorna como string)
  height: number;
  width: number;
  jpegThumbnail?: string; // Miniatura em base64
  mediaKeyTimestamp?: string; // Timestamp da mediaKey (a API retorna como string)
  // Outras propriedades que podem existir em imageMessage
}

// Detalhes para mensagens de contato
interface ContactMessageDetails {
  displayName: string;
  vcard: string; // String no formato VCard
  contextInfo?: ContextInfo;
}

interface EvolutionMessageRecord {
  id: string;
  key: {
    id: string;
    fromMe: boolean;
    remoteJid: string;
    participant?: string; // Para mensagens de grupo
  };
  pushName?: string;
  messageType: string;
  message: {
    conversation?: string;
    extendedTextMessage?: ExtendedTextMessageDetails;
    imageMessage?: ImageMessageDetails;
    contactMessage?: ContactMessageDetails;
    // Adicione outros tipos de mensagem conforme necessário
  };
  messageTimestamp: number;
}

interface EvolutionMessagesResponse {
  messages: {
    total: number;
    pages: number;
    currentPage: number;
    records: EvolutionMessageRecord[];
  };
}

export type Mensagem = {
  id: string;
  content: string;
  sender: "bot" | "user";
  timestamp: string;
};

/**
 * Busca o histórico de mensagens de uma conversa específica direto da evolution api.
 */
export const getHistoricoConversa = async (sessionId: string): Promise<Mensagem[]> => {
  console.log("SessionId recebido pela função:", sessionId);
  const url = `${EVOLUTION_API_BASE_URL}/chat/findMessages/${EVOLUTION_INSTANCE_NAME}`;
  const remoteJidParaAPI = `${sessionId}@s.whatsapp.net`;

  const options = {
    method: "POST",
    headers: {
      apikey: EVOLUTION_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      where: {
        key: {
          remoteJid: remoteJidParaAPI,
        },
      },
    }),
  };

  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorBody = await res.text();
      console.error("Erro ao buscar histórico da Evolution API:", res.status, errorBody);
      throw new Error(`Falha ao buscar histórico da conversa (Evolution API): ${res.status}`);
    }

    const apiData = await res.json();

    const evolutionResponse = apiData as EvolutionMessagesResponse;

    if (!evolutionResponse || !evolutionResponse.messages || !evolutionResponse.messages.records) {
      console.warn(
        "Resposta da API não contém 'messages.records' ou está em formato inesperado para o remoteJid:",
        sessionId,
        evolutionResponse,
      );
      return [];
    }

    const records: EvolutionMessageRecord[] = evolutionResponse.messages.records;

    const mensagensFormatadas: Mensagem[] = records.map((record): Mensagem => {
      let content = `Tipo de mensagem '${record.messageType}' não traduzido.`;

      if (record.messageType === "conversation" && record.message?.conversation) {
        content = record.message.conversation;
      } else if (
        record.messageType === "extendedTextMessage" &&
        record.message?.extendedTextMessage?.text
      ) {
        content = record.message.extendedTextMessage.text;
      } else if (record.messageType === "imageMessage" && record.message?.imageMessage) {
        content = record.message.imageMessage.caption || "Imagem";
      } else if (record.messageType === "contactMessage" && record.message?.contactMessage) {
        const vcard = record.message.contactMessage.vcard;
        let contactName = record.message.contactMessage.displayName;
        if (!contactName && vcard) {
          const fnMatch = vcard.match(/^FN:(.*)$/m);
          if (fnMatch && fnMatch[1]) {
            contactName = fnMatch[1];
          }
        }
        content = `Contato: ${contactName || "Desconhecido"}`;
      }
      // Adicione mais 'else if' para outros tipos de mensagem que você quer suportar

      return {
        id: record.id || record.key.id,
        content: content,
        sender: record.key.fromMe ? "bot" : "user",
        timestamp: new Date((record.messageTimestamp || 0) * 1000).toISOString(),
      };
    });

    mensagensFormatadas.sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    return mensagensFormatadas;
  } catch (error) {
    console.error("Erro na função getHistoricoConversa (Evolution API Catch Block):", error);
    throw error;
  }
};
