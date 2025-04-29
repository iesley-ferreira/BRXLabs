export type Lead = {
  whatsapp: string;
  nome: string | null;
  follow_up_atual: string | null;
};

export type RespostasLead = {
  ramo: string;
  colaboradores: string;
  faturamento: string;
  desafio: string;
  nome: string;
  whatsapp: string;
  follow_up_atual: string;
  atendente?: string;
};

export type Mensagem = {
  type: string;
  content: string;
  additional_kwargs: string;
  response_metadata: string;
};
