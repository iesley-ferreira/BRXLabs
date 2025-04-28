import React, { useEffect, useState } from "react";
import AlertToast from "../AlertToast/AlertToast";

type Servico = {
  id: number;
  nome: string;
};

type CreateUserModalProps = {
  onClose: () => void;
  API_URL: string;
  token: string;
  onUserCreated: () => void;
};

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  onClose,
  API_URL,
  token,
  onUserCreated,
}) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clientes, setClientes] = useState<{ id: number; nome: string }[]>([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    usuario: "",
    senha: "",
    nivel_acesso: "usuario",
    foto: "",
    cliente_id: "",
    servicos: [] as number[],
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resClientes = await fetch(`${API_URL}/webhook/admin/listar-clientes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resClientes.ok) {
          throw new Error("Erro ao buscar clientes.");
        }

        const clientesData = await resClientes.json();

        setClientes(clientesData);
      } catch (error) {
        console.error("Erro ao buscar serviços/clientes:", error);
      }
    };

    fetchData();
  }, [API_URL, token]);

  const fetchServicosDoCliente = async (clienteId: string) => {
    setServicos([]); // ← limpa imediatamente para forçar re-render

    try {
      const response = await fetch(
        `${API_URL}/webhook/admin/listar-servicos?cliente_id=${clienteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Erro ao buscar serviços do cliente");

      const data = await response.json();
      setServicos(data); // ← se vazio, a UI vai mostrar a mensagem automaticamente
    } catch (error) {
      console.error("Erro ao buscar serviços do cliente:", error);
      setServicos([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "cliente_id") {
      setFormData((prev) => ({
        ...prev,
        cliente_id: value,
        servicos: [],
      }));
      fetchServicosDoCliente(value); // ← vai limpar e atualizar os serviços
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleServicoToggle = (id: number) => {
    setFormData((prev) => {
      const alreadySelected = prev.servicos.includes(id);
      return {
        ...prev,
        servicos: alreadySelected
          ? prev.servicos.filter((sid) => sid !== id)
          : [...prev.servicos, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/webhook/admin/criar-usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.responseData?.usuario?.success) {
        // Sucesso
        setToastType("success");
        setToastMessage(data.responseData.mensagem || "Usuário criado com sucesso!");
        setToastOpen(true);
        onUserCreated();
        onClose();
      } else {
        // Falha (mesmo que o HTTP tenha sido 200, mas o success é false)
        setToastType("error");
        setToastMessage(data.responseData?.mensagem || "Erro ao criar usuário.");
        setToastOpen(true);
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      setToastType("error");
      setToastMessage("Erro ao conectar com o servidor.");
      setToastOpen(true);
    }
  };

  return (
    <>
      <section className="bg-white rounded-lg shadow-sm p-8 w-[35vw]">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-[#1e2939] mb-2">Criar Novo Usuário</h2>
          <p className="text-gray-500 mb-4">Preencha os dados abaixo para cadastrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1e2939]">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e2939]">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e2939]">Usuário</label>
            <input
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e2939]">Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e2939]">Nível de Acesso</label>
            <select
              name="nivel_acesso"
              value={formData.nivel_acesso}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="usuario">Usuário</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e2939]">Foto (URL)</label>
            <input
              type="text"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1e2939]">Cliente Vinculado</label>
            <select
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required={formData.nivel_acesso === "usuario"}
              disabled={formData.nivel_acesso === "admin"}
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>

          {formData.cliente_id && (
            <div>
              <label className="block text-sm font-medium text-[#1e2939] mb-2">Serviços</label>
              {servicos.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {servicos.map((servico) => (
                    <label key={servico.id} className="flex items-center text-sm text-[#1e2939]">
                      <input
                        type="checkbox"
                        checked={formData.servicos.includes(servico.id)}
                        onChange={() => handleServicoToggle(servico.id)}
                        className="mr-2"
                      />
                      {servico.nome}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Nenhum serviço implementado</p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-4 justify-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#4f39f6] text-white hover:bg-[#4f39f6]/90 cursor-pointer"
            >
              Criar
            </button>
          </div>
        </form>
      </section>
      {/* Alert Toast */}
      <AlertToast
        toastOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        type={toastType}
        message={toastMessage}
      />
    </>
  );
};

export default CreateUserModal;
