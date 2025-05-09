// import { jwtDecode } from "jwt-decode";
// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { CSSTransition, SwitchTransition } from "react-transition-group";
// import "../../styles/transitions.css";
// import Followups from "../Servicos/Followups";
// import BottomBar from "./components/BottomBar/BottomBar";
// import Chats from "./components/Chats/Chats";
// import ConteudoDashboardPorCliente from "./components/ConteudoDashboardPorCliente/ConteudoDashboardPorCliente";
// import MobileHeader from "./components/MobileHeader/MobileHeader";
// import UserSidebar from "./components/UserSidebar/UserSidebar";

// type TokenPayload = {
//   id: number;
//   nome: string;
//   email: string;
//   cliente: string;
// };

// type Servico = {
//   id: number;
//   nome: string;
//   descricao: string;
//   path: string;
//   tipo: "padrao" | "personalizado";
// };

// type Aba = "dashboard" | "servicos" | "personalizados" | "chats" | "kanban";

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const [servicos, setServicos] = useState<Servico[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<Aba>("dashboard");
//   const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
//   // const [meuUsuarioId, setMeuUsuarioId] = useState<number | null>(null);
//   const [nomeDoUsuario, setNomeDoUsuario] = useState<string>("");
//   const [cliente, setCliente] = useState<string>("");

//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   const dashboardRef = useRef<HTMLDivElement>(null);
//   const servicoRef = useRef<HTMLDivElement>(null);

//   const API_URL = import.meta.env.VITE_API_URL;
//   const token = localStorage.getItem("token") || "";

//   const componentesPorServico: Record<string, React.FC> = {
//     followups: Followups,
//   };

//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     try {
//       const decoded = jwtDecode<TokenPayload>(token);
//       // setMeuUsuarioId(decoded.id);
//       setNomeDoUsuario(decoded.nome);
//       setCliente(decoded.cliente);
//     } catch (error) {
//       console.error("Erro ao decodificar token:", error);
//       localStorage.removeItem("token");
//       navigate("/login");
//     }
//   }, [token, navigate]);

//   useEffect(() => {
//     if (!token) return;

//     const carregarServicos = async () => {
//       try {
//         const res = await fetch(`${API_URL}/webhook/servicos-usuario`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (!res.ok) throw new Error("Falha ao carregar serviços");
//         const data = await res.json();
//         setServicos(data);
//       } catch (err) {
//         console.error(err);
//         localStorage.removeItem("token");
//         navigate("/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     carregarServicos();
//   }, [API_URL, token, navigate]);

//   // useEffect(() => {
//   //   if (!token || !meuUsuarioId) return;

//   //   const atualizarStatus = () => {
//   //     fetch(`${API_URL}/webhook/atualizar-status`, {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify({ usuario_id: meuUsuarioId }),
//   //     }).catch((err) => console.error("Erro ao atualizar status:", err));
//   //   };

//   //   atualizarStatus();
//   //   const intervalo = setInterval(atualizarStatus, 60000);
//   //   return () => clearInterval(intervalo);
//   // }, [API_URL, token, meuUsuarioId]);

//   if (loading) {
//     return <div className="text-neutral-600 text-center mt-10">Carregando seus serviços…</div>;
//   }

//   const servicosFiltrados = servicos.filter((servico) => {
//     if (activeTab === "servicos") return servico.tipo === "padrao";
//     if (activeTab === "personalizados") return servico.tipo === "personalizado";
//     return true;
//   });

//   const handleChangeTab = (tab: Aba) => {
//     setActiveTab(tab);
//     setServicoSelecionado(null);
//   };

//   const nodeRef = servicoSelecionado ? servicoRef : dashboardRef;

//   const iconePorAba: Record<Aba, string> = {
//     dashboard: "fa-gauge",
//     servicos: "fa-cubes",
//     personalizados: "fa-wand-magic-sparkles",
//     chats: "fa-comments", // ✅ NOVO
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       <UserSidebar activeTab={activeTab} setActiveTab={handleChangeTab} userName={nomeDoUsuario} />
//       <MobileHeader
//         activeTab={activeTab}
//         servicoSelecionado={servicoSelecionado}
//         onBack={() => setServicoSelecionado(null)}
//       />

//       <main
//         className={`flex-1 overflow-y-auto bg-neutral-50 relative ${
//           isMobile ? (servicoSelecionado ? "p-0 py-12" : "pt-24 px-4") : ""
//         }`}
//       >
//         <SwitchTransition mode="out-in">
//           <CSSTransition
//             key={servicoSelecionado?.id || activeTab}
//             timeout={300}
//             classNames="fade"
//             nodeRef={nodeRef}
//             unmountOnExit
//           >
//             {servicoSelecionado ? (
//               <div ref={servicoRef}>
//                 <div className="bg-white p-8 rounded shadow mb-6 hidden lg:block">
//                   <div className="w-full flex items-start mb-5 px-3">
//                     <span className="inline-flex justify-center items-center w-16 h-16 min-w-16 min-h-16 mr-4 bg-indigo-500 rounded">
//                       <i className={`fa-solid ${iconePorAba[activeTab]} text-white text-2xl`} />
//                     </span>
//                     <div>
//                       <h2 className="text-2xl font-bold mb-4">{servicoSelecionado.nome}</h2>
//                       <p className="mb-6 text-gray-600 w-2/3">{servicoSelecionado.descricao}</p>
//                     </div>
//                     <div className="ml-auto">
//                       <button
//                         onClick={() => setServicoSelecionado(null)}
//                         className="mt-6 w-fit bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded"
//                       >
//                         <i className="fa-solid fa-arrow-left text-md mr-2"></i>
//                         Voltar
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {componentesPorServico[servicoSelecionado.path] ? (
//                   <div className="pt-3">
//                     {React.createElement(componentesPorServico[servicoSelecionado.path])}
//                   </div>
//                 ) : (
//                   <div className="text-gray-500 text-center mt-10">
//                     Serviço ainda não configurado para visualização.
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div ref={dashboardRef}>
//                 {/* Seção Principal */}
//                 {activeTab === "dashboard" ? (
//                   <>
//                     <section className="hidden lg:block py-8 px-6 bg-white mb-8 rounded shadow">
//                       <div className="flex flex-wrap -mx-3 items-center p-8">
//                         <div className="w-full lg:w-1/2 flex items-center px-3">
//                           <span className="inline-flex justify-center items-center w-16 h-16 min-w-16 min-h-16 mr-4 bg-indigo-500 rounded">
//                             <i
//                               className={`fa-solid ${iconePorAba[activeTab]} text-white text-2xl`}
//                             />
//                           </span>
//                           <div>
//                             <h2 className="text-2xl font-bold">Dashboard</h2>
//                             <p className="text-sm text-gray-500 font-medium">
//                               Selecione uma opção no menu para visualizar seus serviços.
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </section>

//                     <ConteudoDashboardPorCliente cliente={cliente} apiUrl={API_URL} token={token} />
//                   </>
//                 ) : activeTab === "chats" ? (
//                   <Chats /> // ✅ RENDERIZAÇÃO DE CHATS
//                 ) : (
//                   <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
//                     {servicosFiltrados.length === 0 ? (
//                       <p className="text-gray-500 col-span-full text-center mt-10">
//                         Nenhum serviço disponível.
//                       </p>
//                     ) : (
//                       servicosFiltrados.map((servico) => (
//                         <div
//                           key={servico.id}
//                           className="relative bg-white rounded-lg shadow p-6 flex flex-col justify-between hover:shadow-md transition"
//                         >
//                           <div className="flex gap-4">
//                             <i className="fa-solid fa-cube text-2xl text-neutral-700 mb-4"></i>
//                             <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                               {servico.nome}
//                             </h3>
//                           </div>
//                           <p className="text-gray-600 text-sm">{servico.descricao}</p>
//                           <button
//                             onClick={() => setServicoSelecionado(servico)}
//                             className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition"
//                           >
//                             Acessar serviço
//                           </button>
//                         </div>
//                       ))
//                     )}
//                   </section>
//                 )}
//               </div>
//             )}
//           </CSSTransition>
//         </SwitchTransition>
//       </main>
//       <BottomBar activeTab={activeTab} setActiveTab={handleChangeTab} />
//     </div>
//   );
// }

import { jwtDecode } from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../../styles/transitions.css"; // Certifique-se que este caminho está correto
import Followups from "../Servicos/Followups"; // Ajuste o caminho se necessário
import BottomBar from "./components/BottomBar/BottomBar"; // Ajuste o caminho se necessário
import Chats from "./components/Chats/Chats"; // Ajuste o caminho se necessário
import ConteudoDashboardPorCliente from "./components/ConteudoDashboardPorCliente/ConteudoDashboardPorCliente"; // Ajuste o caminho se necessário
import MobileHeader from "./components/MobileHeader/MobileHeader"; // Ajuste o caminho se necessário
import UserSidebar from "./components/UserSidebar/UserSidebar"; // Ajuste o caminho se necessário

// Importar ícones do Lucide para as abas
import { ChevronLeft, LayoutDashboard, MessageSquare, Package, Rocket, Trello } from "lucide-react";
import KanbanBoardPage from "./components/KanbanBoardPage/KanbanBoardPage";

type TokenPayload = {
  id: number;
  nome: string;
  email: string;
  cliente: string;
};

type Servico = {
  id: number;
  nome: string;
  descricao: string;
  path: string;
  tipo: "padrao" | "personalizado";
};

// 1. Atualizar o tipo Aba para incluir "kanban"
type Aba = "dashboard" | "servicos" | "personalizados" | "chats" | "kanban";

export default function Dashboard() {
  const navigate = useNavigate();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Aba>("dashboard");
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);
  const [nomeDoUsuario, setNomeDoUsuario] = useState<string>("");
  const [cliente, setCliente] = useState<string>("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const dashboardRef = useRef<HTMLDivElement>(null);
  const servicoRef = useRef<HTMLDivElement>(null);
  const chatsRef = useRef<HTMLDivElement>(null); // Ref para Chats
  const kanbanRef = useRef<HTMLDivElement>(null); // 3. Adicionar ref para Kanban

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token") || "";

  const componentesPorServico: Record<string, React.FC> = {
    followups: Followups,
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      setNomeDoUsuario(decoded.nome);
      setCliente(decoded.cliente);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    const carregarServicos = async () => {
      // Só carrega serviços se não for aba de chats ou kanban, que não dependem deles
      if (activeTab !== "chats" && activeTab !== "kanban") {
        setLoading(true);
      }
      try {
        const res = await fetch(`${API_URL}/webhook/servicos-usuario`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Falha ao carregar serviços");
        const data = await res.json();
        setServicos(data);
      } catch (err) {
        console.error(err);
        // Considerar se quer deslogar o usuário em caso de falha ao carregar serviços
        // localStorage.removeItem("token");
        // navigate("/login");
      } finally {
        // Só para de carregar se não for chats ou kanban
        if (activeTab !== "chats" && activeTab !== "kanban") {
          setLoading(false);
        } else {
          setLoading(false); // Para kanban e chats, o loading principal não se aplica da mesma forma
        }
      }
    };
    // Carrega serviços apenas se a aba não for chats ou kanban, ou se for a primeira carga
    if (activeTab !== "chats" && activeTab !== "kanban") {
      carregarServicos();
    } else {
      setLoading(false); // Para kanban e chats, não há "serviços" a carregar desta forma
    }
  }, [API_URL, token, navigate, activeTab]); // Adicionado activeTab como dependência

  // 7. Ajustar condição de loading
  if (loading && activeTab !== "kanban" && activeTab !== "chats" && !servicoSelecionado) {
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-600 text-center">
        Carregando seus serviços…
      </div>
    );
  }

  // 8. Ajustar filtro de serviços
  const servicosFiltrados = servicos.filter((servico) => {
    if (activeTab === "servicos") return servico.tipo === "padrao";
    if (activeTab === "personalizados") return servico.tipo === "personalizado";
    return false; // Não mostrar serviços se a aba for dashboard, chats ou kanban
  });

  const handleChangeTab = (tab: Aba) => {
    setActiveTab(tab);
    setServicoSelecionado(null); // Reseta serviço selecionado ao mudar de aba principal
  };

  // 4. Atualizar lógica de nodeRef
  let nodeRef = dashboardRef; // Padrão
  if (servicoSelecionado) {
    nodeRef = servicoRef;
  } else {
    switch (activeTab) {
      case "chats":
        nodeRef = chatsRef;
        break;
      case "kanban":
        nodeRef = kanbanRef;
        break;
      case "dashboard":
      default:
        nodeRef = dashboardRef;
        break;
    }
  }

  // 5. Atualizar mapeamento de ícones
  const iconePorAba: Record<Aba, React.ElementType> = {
    dashboard: LayoutDashboard,
    servicos: Package,
    personalizados: Rocket,
    chats: MessageSquare,
    kanban: Trello,
  };

  // 6. Atualizar função renderContent
  const renderContent = () => {
    if (servicoSelecionado) {
      const ServicoComponente = componentesPorServico[servicoSelecionado.path];
      const IconeAbaAtual = iconePorAba[activeTab] || Package; // Ícone de fallback
      return (
        <div ref={servicoRef} className="h-full">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mb-6 hidden lg:block">
            <div className="w-full flex items-start mb-5">
              <span className="inline-flex justify-center items-center w-12 h-12 md:w-16 md:h-16 mr-4 bg-indigo-500 rounded-lg text-white">
                <IconeAbaAtual className="w-6 h-6 md:w-8 md:h-8" />
              </span>
              <div className="flex-grow">
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">
                  {servicoSelecionado.nome}
                </h2>
                <p className="text-sm md:text-base text-gray-600">{servicoSelecionado.descricao}</p>
              </div>
              <div className="ml-auto flex-shrink-0">
                <button
                  onClick={() => setServicoSelecionado(null)}
                  className="mt-1 w-fit bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm flex items-center gap-2 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </button>
              </div>
            </div>
          </div>

          {ServicoComponente ? (
            <div className="pt-3 h-full">
              <ServicoComponente />
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-10">
              Serviço ainda não configurado para visualização.
            </div>
          )}
        </div>
      );
    }

    // Renderização baseada na activeTab
    switch (activeTab) {
      case "dashboard":
        return (
          <div ref={dashboardRef} className="h-full">
            <section className="hidden lg:block py-6 px-4 md:py-8 md:px-6 bg-white mb-6 md:mb-8 rounded-lg shadow-md">
              <div className="flex flex-wrap -mx-3 items-center p-4 md:p-8">
                <div className="w-full lg:w-1/2 flex items-center px-3">
                  <span className="inline-flex justify-center items-center w-12 h-12 md:w-16 md:h-16 mr-4 bg-indigo-500 rounded-lg text-white">
                    <LayoutDashboard className="w-6 h-6 md:w-8 md:h-8" />
                  </span>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Dashboard</h2>
                    <p className="text-sm text-gray-500 font-medium">
                      Visão geral e atalhos importantes.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <ConteudoDashboardPorCliente cliente={cliente} apiUrl={API_URL} token={token} />
          </div>
        );
      case "chats":
        return (
          <div ref={chatsRef} className="h-full w-full">
            <Chats />
          </div>
        );
      case "kanban":
        return (
          <div ref={kanbanRef} className="h-full w-full">
            <KanbanBoardPage />
          </div>
        );
      case "servicos":
      case "personalizados": {
        // Adicionadas chaves
        const TituloAbaServicos =
          activeTab === "servicos" ? "Serviços Padrão" : "Serviços Personalizados";
        const IconeAbaServicos = iconePorAba[activeTab] || Package;
        return (
          <div ref={dashboardRef} className="h-full p-4 md:p-6">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <IconeAbaServicos className="w-6 h-6 text-indigo-500" />
                {TituloAbaServicos}
              </h2>
            </div>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? ( // Mantém o loading aqui para a aba de serviços
                <p className="text-gray-500 col-span-full text-center mt-10">
                  Carregando serviços...
                </p>
              ) : servicosFiltrados.length === 0 ? (
                <p className="text-gray-500 col-span-full text-center mt-10">
                  Nenhum serviço {activeTab === "servicos" ? "padrão" : "personalizado"} disponível.
                </p>
              ) : (
                servicosFiltrados.map((servico) => (
                  <div
                    key={servico.id}
                    className="relative bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4 mb-3">
                      <span className="p-2 bg-indigo-100 rounded-lg text-indigo-500">
                        <Package className="w-6 h-6" />
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800 mt-1">{servico.nome}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 flex-grow min-h-[60px]">
                      {servico.descricao}
                    </p>
                    <button
                      onClick={() => setServicoSelecionado(servico)}
                      className="mt-auto bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 w-full text-sm"
                    >
                      Acessar serviço
                    </button>
                  </div>
                ))
              )}
            </section>
          </div>
        );
      }
      default: {
        // Adicionadas chaves
        // Verifica se activeTab é um valor inesperado
        const exhaustiveCheck: never = activeTab;
        console.warn("Aba desconhecida:", exhaustiveCheck);
        return <div ref={dashboardRef}>Conteúdo não encontrado para a aba: {activeTab}</div>;
      }
    }
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
        className={`flex-1 overflow-y-auto bg-neutral-100 relative
          ${isMobile ? (servicoSelecionado ? "pt-12 pb-16" : "pt-16 pb-16") : "pt-0"}
        `}
      >
        <SwitchTransition mode="out-in">
          <CSSTransition
            key={servicoSelecionado?.id || activeTab}
            timeout={300}
            classNames="fade"
            nodeRef={nodeRef}
            unmountOnExit
          >
            {renderContent()}
          </CSSTransition>
        </SwitchTransition>
      </main>
      <BottomBar activeTab={activeTab} setActiveTab={handleChangeTab} />
    </div>
  );
}
