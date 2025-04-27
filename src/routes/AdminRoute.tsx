import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

type JwtPayload = {
  nivel_acesso?: string;
};

export default function AdminRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    if (decoded.nivel_acesso === "admin") {
      return <Outlet />;
    } else {
      return <Navigate to="/cliente" replace />;
    }
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return <Navigate to="/login" replace />;
  }
}
