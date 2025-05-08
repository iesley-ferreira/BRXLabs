// import { Mensagem } from "./Chats";

// const API_URL = import.meta.env.VITE_API_URL;
// const token = localStorage.getItem("token") || "";

// type Conversa = {
//   id: string; // pode ser o session_id
//   nome: string; // lead_nome
//   telefone: string; // session_id
//   ultimaMensagem: string; // message.content
//   atualizadoEm: string; // created_at
//   remetenteUltimaMensagem: "bot" | "user";
// };

// interface MensagemBruta {
//   content: string;
//   type: "ai" | "user";
//   created_at: string;
// }

// export async function getConversasRecentes(): Promise<Conversa[]> {
//   const res = await fetch(`${API_URL}/webhook/gi/conversas-recentes`);
//   const data = await res.json();

//   const conversasMap = new Map<string, Conversa>();

//   for (const item of data) {
//     const id = item.session_id;
//     const nome = item.lead_nome || "Desconhecido";
//     const telefone = item.session_id;
//     const remetenteUltimaMensagem = item.message?.type === "ai" ? "bot" : "user";
//     const ultimaMensagem = item.message?.content || "";
//     const atualizadoEm = item.created_at;

//     // só atualiza se for mais nova
//     if (
//       !conversasMap.has(id) ||
//       new Date(atualizadoEm) > new Date(conversasMap.get(id)!.atualizadoEm)
//     ) {
//       conversasMap.set(id, {
//         id,
//         nome,
//         telefone,
//         ultimaMensagem,
//         remetenteUltimaMensagem,
//         atualizadoEm,
//       });
//     }
//   }

//   return Array.from(conversasMap.values()).sort(
//     (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
//   );
// }

// export const getHistoricoConversa = async (sessionId: string) => {
//   const res = await fetch(`${API_URL}/webhook/gi/leads-historico2?whatsapp=${sessionId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   const data: MensagemBruta[] = await res.json();
//   return data.map(
//     (item): Mensagem => ({
//       id: crypto.randomUUID(), // ou item.id, se existir no backend
//       content: item.content,
//       sender: item.type === "ai" ? "bot" : "user",
//       timestamp: item.created_at,
//     }),
//   );
// };

// export const enviarMensagem = async (sessionId: string, mensagem: string) => {
//   const res = await fetch(`${API_URL}/webhook/gi/enviar-mensagem`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify({
//       session_id: sessionId,
//       content: mensagem,
//     }),
//   });

//   const data = await res.json();
//   return data;
// };
import { Mensagem } from "./Chats"; // Assume que Chats.tsx exporta o tipo Mensagem

const API_URL = import.meta.env.VITE_API_URL; // Certifique-se que esta variável de ambiente está configurada
const token = localStorage.getItem("token") || ""; // Ou sua lógica de autenticação

// --- Tipos Esperados do Backend (Ajuste conforme sua API) ---

// Tipo para a resposta da lista de conversas recentes
interface ConversaRecenteRaw {
  lead_whatsapp: string; // Corresponde a leads.whatsapp
  lead_nome: string; // Corresponde a leads.nome
  ultima_mensagem_content: string | null; // Conteúdo da última mensagem
  ultima_mensagem_tipo: "ai" | "human" | null; // Tipo da última mensagem
  ultima_mensagem_timestamp: string | null; // Timestamp da última mensagem
  // Adicione outras informações do lead se necessário (ex: atendente, nota_geral)
}

// Tipo para o histórico de mensagens (parece ok, mas confirmando)
interface MensagemBruta {
  id?: string; // Opcional, se o backend retornar um ID para a mensagem
  content: string;
  type: "ai" | "human"; // 'user' no frontend é mapeado de 'human'
  created_at: string;
}

// Tipo para detalhes do lead (para o painel lateral)
export interface LeadDetailsData {
  id: string; // O whatsapp do lead
  nota: string; // nota_geral da tabela leads
  tags: Array<{ id: string; nome: string; cor: string }>; // Tags associadas da tabela lead_tags JOIN tags
}

// Tipo para tags globais
export interface TagGlobal {
  id: string; // id da tabela tags
  nome: string;
  cor: string;
}

// Tipo para o frontend (definido no seu Chats.tsx, mas repetido aqui para clareza)
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
 * Busca o histórico de mensagens de uma conversa específica.
 */
export const getHistoricoConversa = async (sessionId: string): Promise<Mensagem[]> => {
  // O endpoint parece ok, mas confirme se o parâmetro é 'whatsapp' ou 'session_id'
  const res = await fetch(`${API_URL}/webhook/gi/leads-historico2?whatsapp=${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Erro ao buscar histórico:", res.status, await res.text());
    throw new Error("Falha ao buscar histórico da conversa");
  }

  const data: MensagemBruta[] = await res.json();

  // Mapeia para o tipo Mensagem do frontend
  return data.map(
    (item): Mensagem => ({
      id: item.id || crypto.randomUUID(), // Usa ID do backend se existir, senão gera um
      content: item.content,
      sender: item.type === "ai" ? "bot" : "user", // Mapeia 'human' para 'user'
      timestamp: item.created_at,
    }),
  );
};

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
