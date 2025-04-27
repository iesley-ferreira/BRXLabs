import React from "react";

type MobileHeaderProps = {
  activeTab: "dashboard" | "servicos" | "personalizados";
  servicoSelecionado: { nome: string } | null;
  onBack: () => void;
  onReport?: () => void; // opção para botão de reportar
};

const MobileHeader: React.FC<MobileHeaderProps> = ({
  activeTab,
  servicoSelecionado,
  onBack,
  onReport,
}) => {
  const title = servicoSelecionado
    ? servicoSelecionado.nome
    : activeTab === "dashboard"
    ? "Dashboard"
    : activeTab === "servicos"
    ? "Seus Serviços"
    : "Serviços Personalizados";

  const isServicoAberto = !!servicoSelecionado;

  return (
    <div className="fixed top-0 left-0 right-0 bg-indigo-600 shadow p-4 flex items-center justify-between z-50 lg:hidden">
      {isServicoAberto ? (
        <>
          {/* Botão voltar */}
          <button onClick={onBack} className="text-white font-bold text-sm px-2 py-1">
            <i className="fa-solid fa-arrow-left"></i>
          </button>

          {/* Título Centralizado */}
          <h2 className="text-lg font-bold text-center text-white flex-1">{title}</h2>

          {/* Botão reportar problema */}
          <button onClick={onReport} className="text-indigo-100 font-bold text-sm px-2 py-1">
            <i className="fa-solid fa-circle-exclamation"></i>
          </button>
        </>
      ) : (
        <>
          {/* Espaço vazio onde seria o voltar */}
          <div className="w-16"></div>

          {/* Título Centralizado */}
          <h2 className="text-lg font-bold text-center flex-1 text-white">{title}</h2>

          {/* Espaço vazio onde seria o botão reportar */}
          <div className="w-16"></div>
        </>
      )}
    </div>
  );
};

export default MobileHeader;

// type MobileHeaderProps = {
//   title: string;
//   onBack: () => void;
//   onReportIssue?: () => void;
//   isServicePage?: boolean;
// };

// const MobileHeader: React.FC<MobileHeaderProps> = ({
//   title,
//   onBack,
//   onReportIssue,
//   isServicePage,
// }) => {
//   return (
//     <div className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 text-white flex items-center justify-between px-4 py-3 shadow lg:hidden">
//       <button onClick={onBack} className="text-white text-xl">
//         <i className="fa-solid fa-arrow-left"></i>
//       </button>

//       <h2 className="text-lg font-semibold truncate">{title}</h2>

//       {isServicePage && onReportIssue ? (
//         <button onClick={onReportIssue} className="text-white text-xl">
//           <i className="fa-solid fa-circle-exclamation"></i>
//         </button>
//       ) : (
//         <div className="w-6" />
//       )}
//     </div>
//   );
// };

// export default MobileHeader;
