import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../../styles/transitions.css"; // (importa as animações)

import AplicacoesList from "./Components/AplicacoesList/AplicacoesList";
import ServicosList from "./Components/ServicosList/ServicosList";
import Sidebar from "./Components/Sidebar/Sidebar";
import UsuariosList from "./Components/UsuariosList/UsuariosList";

// Supondo que esse é o único serviço implementado no Admin ainda
import Followups from "../Servicos/Followups";

type JwtPayload = {
  nivel_acesso: string;
  exp: number;
};

type Servico = {
  id: number;
  nome: string;
  cliente_nome: string;
  path: string;
  tipo: "padrao" | "personalizado";
};

const componentesPorServico: Record<string, React.FC> = {
  followups: Followups,
  // Adicione outros serviços aqui
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"usuarios" | "servicos" | "aplicacoes" | "dashboard">(
    "usuarios",
  );
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime || decoded.nivel_acesso !== "admin") {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
    } catch (err) {
      localStorage.removeItem("token");
      console.error("Erro ao decodificar o token:", err);
      navigate("/login");
    }
  }, [navigate, token]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setServicoSelecionado(null); // reset ao mudar de aba
        }}
      />

      {/* Conteúdo principal */}
      <main className="flex-1 p-8 overflow-y-auto bg-neutral-50 relative">
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={servicoSelecionado?.id || activeTab}
            nodeRef={contentRef}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div ref={contentRef}>
              {/* Se tiver serviço selecionado, mostra o serviço */}
              {servicoSelecionado ? (
                <div className="bg-white p-8 rounded shadow">
                  <h2 className="text-2xl font-bold mb-4">{servicoSelecionado.nome}</h2>
                  {componentesPorServico[servicoSelecionado.path] ? (
                    <div className="border rounded p-6 bg-gray-100">
                      {React.createElement(componentesPorServico[servicoSelecionado.path])}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center mt-10">
                      Serviço ainda não configurado para visualização.
                    </div>
                  )}
                  <button
                    onClick={() => setServicoSelecionado(null)}
                    className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded"
                  >
                    Voltar para Aplicações
                  </button>
                </div>
              ) : (
                <>
                  {activeTab === "usuarios" && <UsuariosList API_URL={API_URL} token={token} />}
                  {activeTab === "servicos" && <ServicosList API_URL={API_URL} token={token} />}
                  {activeTab === "aplicacoes" && (
                    <AplicacoesList
                      API_URL={API_URL}
                      token={token}
                      onSelectServico={(servico) => setServicoSelecionado(servico)}
                    />
                  )}
                  {activeTab === "dashboard" && (
                    <div className="text-gray-600 text-center mt-10">
                      Dashboard Admin - Em breve...
                    </div>
                  )}
                </>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </main>
    </div>
  );
}
