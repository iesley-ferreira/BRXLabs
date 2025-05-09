// import React from "react";
// import UserInfoCard from "../../../../components/UserInfoCard/UserInfoCard";
// import { useUserFromToken } from "../../../../hooks/useUserFromToken";

// type UserSidebarProps = {
//   activeTab: "dashboard" | "servicos" | "personalizados" | "chats";
//   setActiveTab: (tab: UserSidebarProps["activeTab"]) => void;
//   userName: string;
//   userPhoto?: string;
// };

// const UserSidebar: React.FC<UserSidebarProps> = ({ activeTab, setActiveTab }) => {
//   const user = useUserFromToken();
//   return (
//     <div className="hidden lg:w-72 lg:block relative z-50">
//       <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-72 pt-6 pb-8 bg-gray-800 overflow-y-auto">
//         <div className="flex flex-col w-full gap-6 px-6 pb-6 mb-6 border-b border-gray-700">
//           <div className="flex items-center">
//             <img src="/assets/minilogo.svg" alt="Logo" className="w-8 h-8 mr-2" />
//             <span className="text-xl text-white font-semibold">BRX Labs</span>
//           </div>
//           {user && (
//             <UserInfoCard
//               nome={user.nome}
//               foto={user.foto || `https://i.pravatar.cc/150?u=${user.id}`}
//               status="online"
//             />
//           )}
//         </div>

//         {/* Menu de Usuário */}
//         <div className="flex flex-col justify-between h-full px-4">
//           <div>
//             <h3 className="mb-2 text-xs uppercase text-gray-500 font-medium">User</h3>
//             <ul className="space-y-2 text-sm font-medium">
//               {/* Dashboard */}
//               <li
//                 className={`flex items-center p-3 rounded cursor-pointer ${
//                   activeTab === "dashboard"
//                     ? "bg-indigo-500 text-white"
//                     : "text-gray-50 hover:bg-gray-900"
//                 }`}
//                 onClick={() => setActiveTab("dashboard")}
//               >
//                 <i
//                   className={`fa-solid fa-gauge-high mr-3 text-lg ${
//                     activeTab === "dashboard" ? "text-white" : "text-gray-400"
//                   }`}
//                 />
//                 <span>Dashboard</span>
//               </li>

//               {/* Serviços */}
//               <li
//                 className={`flex items-center p-3 rounded cursor-pointer ${
//                   activeTab === "servicos"
//                     ? "bg-indigo-500 text-white"
//                     : "text-gray-50 hover:bg-gray-900"
//                 }`}
//                 onClick={() => setActiveTab("servicos")}
//               >
//                 <i
//                   className={`fa-solid fa-cube mr-3 text-lg ${
//                     activeTab === "servicos" ? "text-white" : "text-gray-400"
//                   }`}
//                 />
//                 <span>Serviços</span>
//               </li>

//               {/* Serviços Personalizados */}
//               <li
//                 className={`flex items-center p-3 rounded cursor-pointer ${
//                   activeTab === "personalizados"
//                     ? "bg-indigo-500 text-white"
//                     : "text-gray-50 hover:bg-gray-900"
//                 }`}
//                 onClick={() => setActiveTab("personalizados")}
//               >
//                 <i
//                   className={`fa-solid fa-rocket mr-3 text-lg ${
//                     activeTab === "personalizados" ? "text-white" : "text-gray-400"
//                   }`}
//                 />
//                 <span>Serviços Personalizados</span>
//               </li>
//               {/* Chats */}
//               <li
//                 className={`flex items-center p-3 rounded cursor-pointer ${
//                   activeTab === "chats"
//                     ? "bg-indigo-500 text-white"
//                     : "text-gray-50 hover:bg-gray-900"
//                 }`}
//                 onClick={() => setActiveTab("chats")}
//               >
//                 <i
//                   className={`fa-solid fa-comments mr-3 text-lg ${
//                     activeTab === "chats" ? "text-white" : "text-gray-400"
//                   }`}
//                 />
//                 <span>Chats</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </nav>
//       {/* Espaço para empurrar o conteúdo principal */}
//       {/* <div className="lg:ml-64" /> */}
//       <div className="mx-auto lg:ml-80"></div>
//     </div>
//   );
// };

// export default UserSidebar;
//----------------------  funciona
// UserSidebar.tsx
import {
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Rocket,
  Settings,
  Trello,
} from "lucide-react"; // Ícones Lucide, adicionado Trello
import React from "react";
import UserInfoCard from "../../../../components/UserInfoCard/UserInfoCard"; // Ajuste o caminho se necessário
import { useUserFromToken } from "../../../../hooks/useUserFromToken"; // Ajuste o caminho se necessário

// 1. Atualizar o tipo UserSidebarProps para incluir "kanban"
type UserSidebarProps = {
  activeTab: "dashboard" | "servicos" | "personalizados" | "chats" | "kanban";
  setActiveTab: (tab: UserSidebarProps["activeTab"]) => void;
  userName: string; // userName e userPhoto são props esperadas pelo componente, mas não usadas no código fornecido.
  userPhoto?: string;
};

const UserSidebar: React.FC<UserSidebarProps> = ({ activeTab, setActiveTab }) => {
  const user = useUserFromToken();

  // Estrutura de dados para os itens de navegação para facilitar a manutenção
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "servicos", label: "Serviços", icon: Package },
    { id: "personalizados", label: "Serviços Personalizados", icon: Rocket },
    { id: "chats", label: "Chats", icon: MessageSquare },
    { id: "kanban", label: "Pipeline", icon: Trello }, // 2. Adicionar novo item para Kanban
  ];

  return (
    <div className="hidden lg:w-72 lg:block relative z-50">
      <nav className="fixed top-0 left-0 bottom-0 flex flex-col w-72 pt-6 pb-8 bg-gray-800 text-white overflow-y-auto">
        {/* Header da Sidebar */}
        <div className="flex flex-col w-full gap-6 px-6 pb-6 mb-6 border-b border-gray-700">
          <div className="flex items-center">
            <img src="/assets/minilogo.svg" alt="Logo BRX Labs" className="w-8 h-8 mr-2" />
            <span className="text-xl font-semibold">BRX Labs</span>
          </div>
          {user && (
            <UserInfoCard
              nome={user.nome} // A prop userName não estava a ser usada, user.nome é mais direto do hook
              foto={user.foto || `https://i.pravatar.cc/150?u=${user.id}`}
              status="online"
            />
          )}
        </div>

        {/* Menu de Usuário */}
        <div className="flex flex-col justify-between h-full px-4">
          <div>
            <h3 className="mb-2 ml-3 text-xs uppercase text-gray-500 font-medium tracking-wider">
              User
            </h3>
            <ul className="space-y-1 text-sm font-medium">
              {navItems.map((item) => (
                <li
                  key={item.id}
                  className={`flex items-center w-full pl-3 py-2.5 pr-4 rounded-md text-left cursor-pointer transition-colors duration-150 group
                    ${
                      activeTab === item.id
                        ? "bg-indigo-600 text-white shadow-sm" // Estilo ativo melhorado
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  onClick={() => setActiveTab(item.id as UserSidebarProps["activeTab"])}
                >
                  <item.icon // 3. Usar ícone Lucide
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      activeTab === item.id
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Secção "Outros" (opcional, pode ser removida se não for usada) */}
          <div className="mt-auto">
            {" "}
            {/* Empurra para o final */}
            <h3 className="mt-6 mb-2 ml-3 text-xs uppercase text-gray-500 font-medium tracking-wider">
              Outros
            </h3>
            <ul className="space-y-1 text-sm font-medium">
              <li
                className="flex items-center w-full pl-3 py-2.5 pr-4 rounded-md text-left text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors duration-150 group"
                onClick={() => console.log("Configurações futuras")}
              >
                <Settings
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300"
                  aria-hidden="true"
                />
                <span>Configurações</span>
              </li>
              <li
                className="flex items-center w-full pl-3 py-2.5 pr-4 rounded-md text-left text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors duration-150 group"
                onClick={() => console.log("Log out futuro")}
              >
                <LogOut
                  className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300"
                  aria-hidden="true"
                />
                <span>Log Out</span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* Espaço para empurrar o conteúdo principal - removi o div extra que não tinha classes de largura */}
      {/* <div className="lg:ml-72"></div>  // Se a sidebar tem w-72, o ml deve ser w-72 */}
    </div>
  );
};

export default UserSidebar;
