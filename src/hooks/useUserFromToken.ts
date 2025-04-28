// hooks/useUserFromToken.ts
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

type TokenPayload = {
  id: number;
  nome: string;
  usuario: string;
  nivel_acesso: string;
  foto?: string;
  exp: number;
};

export function useUserFromToken() {
  const [user, setUser] = useState<TokenPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      console.log(decoded);

      setUser(decoded);
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      setUser(null);
    }
  }, []);

  return user;
}
