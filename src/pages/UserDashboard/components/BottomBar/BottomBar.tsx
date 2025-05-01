import React from "react";

type BottomBarProps = {
  activeTab: "dashboard" | "servicos" | "personalizados" | "chats";
  setActiveTab: (tab: "dashboard" | "servicos" | "personalizados") => void;
};

const BottomBar: React.FC<BottomBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 flex justify-around items-center py-2 z-50">
      <button
        onClick={() => setActiveTab("dashboard")}
        className="flex flex-col items-center text-xs"
      >
        <i
          className={`fa-solid fa-gauge-high text-xl ${
            activeTab === "dashboard" ? "text-indigo-600" : "text-gray-400"
          }`}
        />
        <span className={`${activeTab === "dashboard" ? "text-indigo-600" : "text-gray-400"}`}>
          Dashboard
        </span>
      </button>

      <button
        onClick={() => setActiveTab("servicos")}
        className="flex flex-col items-center text-xs"
      >
        <i
          className={`fa-solid fa-cube text-xl ${
            activeTab === "servicos" ? "text-indigo-600" : "text-gray-400"
          }`}
        />
        <span className={`${activeTab === "servicos" ? "text-indigo-600" : "text-gray-400"}`}>
          Serviços
        </span>
      </button>

      <button
        onClick={() => setActiveTab("personalizados")}
        className="flex flex-col items-center text-xs"
      >
        <i
          className={`fa-solid fa-rocket text-xl ${
            activeTab === "personalizados" ? "text-indigo-600" : "text-gray-400"
          }`}
        />
        <span className={`${activeTab === "personalizados" ? "text-indigo-600" : "text-gray-400"}`}>
          Personalizados
        </span>
      </button>
    </div>
  );
};

export default BottomBar;
