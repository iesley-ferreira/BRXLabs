import { Mensagem } from "./Chats";

const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token") || "";

type Conversa = {
  id: string; // pode ser o session_id
  nome: string; // lead_nome
  telefone: string; // session_id
  ultimaMensagem: string; // message.content
  atualizadoEm: string; // created_at
  remetenteUltimaMensagem: "bot" | "user";
};

interface MensagemBruta {
  content: string;
  type: "ai" | "user";
  created_at: string;
}

export async function getConversasRecentes(): Promise<Conversa[]> {
  const res = await fetch(`${API_URL}/webhook/gi/conversas-recentes`);
  const data = await res.json();

  const conversasMap = new Map<string, Conversa>();

  for (const item of data) {
    const id = item.session_id;
    const nome = item.lead_nome || "Desconhecido";
    const telefone = item.session_id;
    const remetenteUltimaMensagem = item.message?.type === "ai" ? "bot" : "user";
    const ultimaMensagem = item.message?.content || "";
    const atualizadoEm = item.created_at;

    // só atualiza se for mais nova
    if (
      !conversasMap.has(id) ||
      new Date(atualizadoEm) > new Date(conversasMap.get(id)!.atualizadoEm)
    ) {
      conversasMap.set(id, {
        id,
        nome,
        telefone,
        ultimaMensagem,
        remetenteUltimaMensagem,
        atualizadoEm,
      });
    }
  }

  return Array.from(conversasMap.values()).sort(
    (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
  );
}

export const getHistoricoConversa = async (sessionId: string) => {
  const res = await fetch(`${API_URL}/webhook/gi/leads-historico2?whatsapp=${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: MensagemBruta[] = await res.json();
  return data.map(
    (item): Mensagem => ({
      id: crypto.randomUUID(), // ou item.id, se existir no backend
      content: item.content,
      sender: item.type === "ai" ? "bot" : "user",
      timestamp: item.created_at,
    }),
  );
};

export const enviarMensagem = async (sessionId: string, mensagem: string) => {
  const res = await fetch(`${API_URL}/webhook/gi/enviar-mensagem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      session_id: sessionId,
      content: mensagem,
    }),
  });

  const data = await res.json();
  return data;
};
