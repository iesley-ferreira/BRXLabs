import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MyJwtPayload {
  id: number;
  nome: string;
  usuario: string;
  nivel_acesso: string;
  exp: number;
}

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/webhook/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, senha }),
      });

      const [data] = await res.json();

      if (data.success) {
        const token = data.token.replace(/\n/g, "");
        localStorage.setItem("token", token);

        const decoded = jwtDecode<MyJwtPayload>(token);
        if (decoded.nivel_acesso === "admin") {
          navigate("/admin");
        } else {
          navigate("/cliente");
        }
      } else {
        setErro("Usuário ou senha incorretos.");
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setErro("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e1e2f] to-[#2a2a40] px-4">
      <div className="bg-[#2f2f42] p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Bem-vindo de volta</h2>

        {erro && (
          <p className="text-red-400 bg-red-950 p-2 rounded text-sm mb-4 text-center">{erro}</p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-[#1e1e2e] text-white border border-transparent focus:border-[#473ee7] focus:outline-none transition"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-[#1e1e2e] text-white border border-transparent focus:border-[#473ee7] focus:outline-none transition"
          />
          <button
            type="submit"
            className="w-full bg-[#473ee7] hover:bg-[#372fe2] transition-colors py-3 rounded-md text-white font-semibold tracking-wide"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
