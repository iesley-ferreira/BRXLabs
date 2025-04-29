import React from "react";
import UserInfoCard from "../../../../components/UserInfoCard/UserInfoCard";
import { useUserFromToken } from "../../../../hooks/useUserFromToken";

type UserSidebarProps = {
  activeTab: "dashboard" | "servicos" | "personalizados";
  setActiveTab: (tab: UserSidebarProps["activeTab"]) => void;
  userName: string;
  userPhoto?: string;
};

const UserSidebar: React.FC<UserSidebarProps> = ({ activeTab, setActiveTab }) => {
  const user = useUserFromToken();
  return (
    <div className="hidden lg:w-72 lg:block relative z-50">
      <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-72 pt-6 pb-8 bg-gray-800 overflow-y-auto">
        <div className="flex flex-col w-full gap-6 px-6 pb-6 mb-6 border-b border-gray-700">
          <div className="flex items-center">
            <img src="public/assets/minilogo.svg" alt="Logo" className="w-8 h-8 mr-2" />
            <span className="text-xl text-white font-semibold">BRX Labs</span>
          </div>
          {user && (
            <UserInfoCard
              nome={user.nome}
              foto={user.foto || `https://i.pravatar.cc/150?u=${user.id}`}
              status="online"
            />
          )}
        </div>

        {/* Menu de Usuário */}
        <div className="flex flex-col justify-between h-full px-4">
          <div>
            <h3 className="mb-2 text-xs uppercase text-gray-500 font-medium">User</h3>
            <ul className="space-y-2 text-sm font-medium">
              {/* Dashboard */}
              <li
                className={`flex items-center p-3 rounded cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-indigo-500 text-white"
                    : "text-gray-50 hover:bg-gray-900"
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <i
                  className={`fa-solid fa-gauge-high mr-3 text-lg ${
                    activeTab === "dashboard" ? "text-white" : "text-gray-400"
                  }`}
                />
                <span>Dashboard</span>
              </li>

              {/* Serviços */}
              <li
                className={`flex items-center p-3 rounded cursor-pointer ${
                  activeTab === "servicos"
                    ? "bg-indigo-500 text-white"
                    : "text-gray-50 hover:bg-gray-900"
                }`}
                onClick={() => setActiveTab("servicos")}
              >
                <i
                  className={`fa-solid fa-cube mr-3 text-lg ${
                    activeTab === "servicos" ? "text-white" : "text-gray-400"
                  }`}
                />
                <span>Serviços</span>
              </li>

              {/* Serviços Personalizados */}
              <li
                className={`flex items-center p-3 rounded cursor-pointer ${
                  activeTab === "personalizados"
                    ? "bg-indigo-500 text-white"
                    : "text-gray-50 hover:bg-gray-900"
                }`}
                onClick={() => setActiveTab("personalizados")}
              >
                <i
                  className={`fa-solid fa-rocket mr-3 text-lg ${
                    activeTab === "personalizados" ? "text-white" : "text-gray-400"
                  }`}
                />
                <span>Serviços Personalizados</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Espaço para empurrar o conteúdo principal */}
      {/* <div className="lg:ml-64" /> */}
      <div className="mx-auto lg:ml-80"></div>
    </div>
  );
};

export default UserSidebar;
