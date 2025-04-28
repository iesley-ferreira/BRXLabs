import React from "react";

type UserInfoCardProps = {
  nome: string;
  foto: string;
  status: "online" | "offline";
};

const UserInfoCard: React.FC<UserInfoCardProps> = ({ nome, foto, status }) => {
  return (
    <div className="flex items-center w-full">
      <div className="relative">
        <img src={foto} alt="Foto do usuário" className="w-12 h-12 rounded-full object-cover" />
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
            status === "online" ? "bg-green-400" : "bg-gray-400"
          }`}
        />
      </div>
      <div className="ml-4">
        <h4 className="text-white font-semibold text-regular">{nome}</h4>
        <p className="text-xs text-gray-400">{status === "online" ? "Online" : "Offline"}</p>
      </div>
    </div>
  );
};

export default UserInfoCard;
