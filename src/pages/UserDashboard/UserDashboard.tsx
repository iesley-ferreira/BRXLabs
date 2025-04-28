import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../../styles/transitions.css";
import Followups from "../Servicos/Followups";
import BottomBar from "./components/BottomBar/BottomBar";
import MobileHeader from "./components/MobileHeader/MobileHeader";
import UserSidebar from "./components/UserSidebar/UserSidebar";

type TokenPayload = {
  id: number;
  nome: string;
  email: string;
};

type Servico = {
  id: number;
  nome: string;
  descricao: string;
  path: string;
  tipo: "padrao" | "personalizado";
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "servicos" | "personalizados">(
    "dashboard",
  );
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [meuUsuarioId, setMeuUsuarioId] = useState<number | null>(null);
  const [nomeDoUsuario, setNomeDoUsuario] = useState<string>("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const servicoRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const componentesPorServico: Record<string, React.FC> = {
    followups: Followups,
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setMeuUsuarioId(decoded.id);
      setNomeDoUsuario(decoded.nome);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    const carregarServicos = async () => {
      try {
        const res = await fetch(`${API_URL}/webhook/servicos-usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Falha ao carregar serviços");
        const data = await res.json();
        setServicos(data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    carregarServicos();
  }, [API_URL, token, navigate]);

  useEffect(() => {
    if (!token || !meuUsuarioId) return;

    atualizarStatus(); // chama uma vez

    const intervalo = setInterval(atualizarStatus, 60000); // chama a cada 60s

    return () => clearInterval(intervalo);
  }, [API_URL, token, meuUsuarioId]);

  const atualizarStatus = () => {
    fetch(`${API_URL}/webhook/atualizar-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ usuario_id: meuUsuarioId }),
    }).catch((err) => console.error("Erro ao atualizar status:", err));
  };

  if (loading) {
    return <div className="text-neutral-600 text-center mt-10">Carregando seus serviços…</div>;
  }

  const servicosFiltrados = servicos.filter((servico) => {
    if (activeTab === "servicos") return servico.tipo === "padrao";
    if (activeTab === "personalizados") return servico.tipo === "personalizado";
    return true;
  });

  const handleChangeTab = (tab: "dashboard" | "servicos" | "personalizados") => {
    setActiveTab(tab);
    setServicoSelecionado(null);
  };

  const nodeRef = servicoSelecionado ? servicoRef : dashboardRef;

  const iconePorAba: Record<"dashboard" | "servicos" | "personalizados", string> = {
    dashboard: "fa-gauge",
    servicos: "fa-cubes",
    personalizados: "fa-wand-magic-sparkles",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar activeTab={activeTab} setActiveTab={handleChangeTab} userName={nomeDoUsuario} />
      <MobileHeader
        activeTab={activeTab}
        servicoSelecionado={servicoSelecionado}
        onBack={() => setServicoSelecionado(null)}
      />

      <main
        className={`flex-1 overflow-y-auto bg-neutral-50 relative ${
          isMobile ? (servicoSelecionado ? "p-0 py-12" : "pt-24 px-4") : "p-8"
        }`}
      >
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={servicoSelecionado?.id || activeTab}
            timeout={300}
            classNames="fade"
            nodeRef={nodeRef}
            unmountOnExit
          >
            {servicoSelecionado ? (
              <div ref={servicoRef}>
                {isMobile ? (
                  // Versão Mobile (sem título, sem descrição, sem botão)
                  componentesPorServico[servicoSelecionado.path] ? (
                    <div className="border rounded bg-gray-100">
                      {React.createElement(componentesPorServico[servicoSelecionado.path])}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center mt-10">
                      Serviço ainda não configurado para visualização.
                    </div>
                  )
                ) : (
                  // Versão Desktop (com título, descrição e botão)
                  <div className="bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-bold mb-4">{servicoSelecionado.nome}</h2>
                    <p className="mb-6 text-gray-600">{servicoSelecionado.descricao}</p>

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
                      Voltar para serviços
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div ref={dashboardRef}>
                <section className="hidden lg:block py-8 px-6 bg-white mb-8 rounded shadow">
                  <div className="flex flex-wrap -mx-3 items-center">
                    <div className="w-full lg:w-1/2 flex items-center mb-5 lg:mb-0 px-3">
                      <span className="inline-flex justify-center items-center w-16 h-16 min-w-16 min-h-16 mr-4 bg-indigo-500 rounded">
                        <i className={`fa-solid ${iconePorAba[activeTab]} text-white text-2xl`}></i>
                      </span>
                      <div>
                        <h2 className="mb-1 text-2xl font-bold">
                          {activeTab === "dashboard"
                            ? "Dashboard"
                            : activeTab === "servicos"
                            ? "Seus Serviços"
                            : "Serviços Personalizados"}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">
                          {activeTab === "dashboard"
                            ? "Selecione uma opção no menu para visualizar seus serviços."
                            : "Acesse os serviços disponíveis para sua conta."}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {activeTab === "dashboard" ? (
                  <div className="text-gray-500 text-center mt-10">
                    Selecione uma categoria no menu lateral.
                  </div>
                ) : (
                  <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servicosFiltrados.length === 0 ? (
                      <p className="text-gray-500 col-span-full text-center mt-10">
                        Nenhum serviço disponível.
                      </p>
                    ) : (
                      servicosFiltrados.map((servico) => (
                        <div
                          key={servico.id}
                          className="relative bg-white rounded-lg shadow p-6 flex flex-col justify-between hover:shadow-md transition"
                        >
                          <div className="flex gap-4">
                            <i className="fa-solid fa-cube text-2xl text-neutral-700 mb-4"></i>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                              {servico.nome}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm">{servico.descricao}</p>
                          <button
                            onClick={() => setServicoSelecionado(servico)}
                            className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition cursor-pointer"
                          >
                            Acessar serviço
                          </button>
                        </div>
                      ))
                    )}
                  </section>
                )}
              </div>
            )}
          </CSSTransition>
        </SwitchTransition>
      </main>
      <BottomBar activeTab={activeTab} setActiveTab={handleChangeTab} />
    </div>
  );
}
