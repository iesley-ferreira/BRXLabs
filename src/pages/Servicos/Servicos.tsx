// src/pages/Servico.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Servico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const carregarHtmlDoServico = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        if (!API_URL || !id) throw new Error("API_URL ou ID inválido");

        // Buscar path do serviço
        const resPath = await fetch(`${API_URL}/webhook/servico-path`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ servico_id: Number(id) }),
        });

        if (!resPath.ok) throw new Error("Erro ao buscar path do serviço");

        const pathData = await resPath.json();
        const path = pathData[0]?.path;

        if (!path) throw new Error("Path do serviço não encontrado.");

        // Buscar HTML do serviço
        const resHtml = await fetch(`${API_URL}/webhook/${path}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ servico_id: Number(id) }),
        });

        if (!resHtml.ok) throw new Error("Acesso negado ou erro ao carregar serviço.");

        const data = await resHtml.json();
        setHtmlContent(
          data[0]?.html || "<div class='text-center text-red-500'>Erro ao carregar conteúdo.</div>",
        );
      } catch (err) {
        setErro("Usuário não tem acesso a esse serviço ou erro ao carregar página.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarHtmlDoServico();
  }, [id, navigate]);

  if (loading) return <div className="text-white text-center mt-10">Carregando serviço...</div>;
  if (erro) return <div className="text-red-500 text-center mt-10">{erro}</div>;

  return (
    <div
      className="min-h-screen bg-[#1a1a1a] text-white p-6"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
