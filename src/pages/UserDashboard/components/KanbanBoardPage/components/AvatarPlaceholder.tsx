import React from "react";

interface AvatarProps {
  seed: string;
  size?: string;
  className?: string;
  textSize?: string;
}

const AvatarPlaceholder: React.FC<AvatarProps> = ({
  seed,
  size = "w-8 h-8",
  className = "",
  textSize = "text-xs",
}) => {
  const colors = [
    "bg-red-500",
    "bg-green-500",
    "bg-blue-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const charCodeSum = seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const color = colors[charCodeSum % colors.length];
  const initial = seed.substring(0, 2).toUpperCase();

  return (
    <div
      className={`${size} ${color} rounded-full flex items-center justify-center text-white font-bold ${textSize} ${className}`}
    >
      {initial}
    </div>
  );
};

export default AvatarPlaceholder;
