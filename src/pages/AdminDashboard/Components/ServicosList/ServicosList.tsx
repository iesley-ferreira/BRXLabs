import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import AlertToast from "../AlertToast/AlertToast";
type Servico = {
  id: number;
  nome: string;
  descricao: string;
  path: string;
  ativo: boolean;
  tipo: "padrao" | "personalizado";
  cliente_nome: string;
};

type Cliente = {
  id: number;
  nome: string;
};

type Usuario = {
  id: number;
  nome: string;
};

type ServicosListProps = {
  API_URL: string;
  token: string;
};

const agruparPorCliente = (servicos: Servico[]) => {
  return servicos.reduce((acc, servico) => {
    if (!acc[servico.cliente_nome]) {
      acc[servico.cliente_nome] = [];
    }
    acc[servico.cliente_nome].push(servico);
    return acc;
  }, {} as Record<string, Servico[]>);
};

const ServicosList: React.FC<ServicosListProps> = ({ API_URL, token }) => {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<number[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null);

  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [clienteIdSelecionado, setClienteIdSelecionado] = useState<string>("");
  const [newServiceType, setNewServiceType] = useState<"padrao" | "personalizado">("padrao");

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info" | "warning">("success");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resServicos, resClientes] = await Promise.all([
          fetch(`${API_URL}/webhook/admin/listar-servicos`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/webhook/admin/listar-clientes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!resServicos.ok || !resClientes.ok) throw new Error("Erro ao buscar dados.");
        const dataServicos = await resServicos.json();
        const dataClientes = await resClientes.json();
        setServicos(dataServicos);
        setClientes(dataClientes);
      } catch (err) {
        console.error(err);
        setError("Erro ao buscar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL, token]);

  useEffect(() => {
    // Limpa imediatamente toda vez que mudar de cliente:
    setUsuarios([]);
    setUsuariosSelecionados([]);

    if (!clienteIdSelecionado) {
      // Se não escolheu nenhum cliente, não faz fetch
      return;
    }

    const fetchUsuarios = async () => {
      try {
        const response = await fetch(
          `${API_URL}/webhook/admin/listar-usuarios?cliente_id=${clienteIdSelecionado}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (!response.ok) {
          console.error("Erro ao buscar usuários do cliente:", response.statusText);
          return; // mantém o array vazio
        }

        const data: Usuario[] = await response.json();
        setUsuarios(data); // se vier [], sobrescreve com vazio
      } catch (err) {
        console.error("Erro no fetch de usuários:", err);
        // em caso de erro de rede, mantém array vazio
      }
    };

    fetchUsuarios();
  }, [API_URL, token, clienteIdSelecionado]);

  const handleUsuarioToggle = (id: number) => {
    setUsuariosSelecionados((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id],
    );
  };

  const handleAddService = async () => {
    try {
      const res = await fetch(`${API_URL}/webhook/admin/adicionar-servico`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: newServiceName,
          descricao: newServiceDescription,
          cliente_id: clienteIdSelecionado,
          usuarios: usuariosSelecionados,
          tipo: newServiceType,
        }),
      });

      const data = await res.json();

      if (res.ok && !data.responseData?.erro) {
        const novoServicoRecebido = data.responseData?.servico;

        if (!novoServicoRecebido) {
          throw new Error("Serviço não retornado corretamente pelo backend.");
        }

        // Confere se o cliente_nome foi preenchido, senão adiciona manualmente
        const clienteEncontrado = clientes.find((c) => c.id.toString() === clienteIdSelecionado);

        const novoServico = {
          ...novoServicoRecebido,
          cliente_nome: clienteEncontrado ? clienteEncontrado.nome : "Cliente Desconhecido",
        };

        setServicos((prev) => [...prev, novoServico]);

        setToastMessage(data.responseData?.mensagem || "Serviço adicionado com sucesso!");
        setToastType("success");
        setToastOpen(true);

        // Limpa o formulário
        setNewServiceName("");
        setNewServiceDescription("");
        setClienteIdSelecionado("");
        setUsuarios([]);
        setUsuariosSelecionados([]);
        setShowAddModal(false);
      } else {
        setToastMessage(data.responseData?.erro || "Erro ao adicionar o serviço.");
        setToastType("error");
        setToastOpen(true);
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Erro inesperado ao adicionar serviço.");
      setToastType("error");
      setToastOpen(true);
    }
  };

  const handleDeleteClick = (svc: Servico) => {
    setServicoSelecionado(svc);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!servicoSelecionado) return;
    try {
      const res = await fetch(`${API_URL}/webhook/admin/remover-servico`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: servicoSelecionado.id }),
      });

      const data = await res.json();

      if (res.ok && !data.responseData?.erro) {
        // Sucesso real
        setServicos((prev) => prev.filter((s) => s.id !== servicoSelecionado.id));
        setToastMessage(data.responseData?.mensagem || "Serviço excluído com sucesso!");
        setToastType("success");
      } else {
        // Erro de resposta vindo do backend
        setToastMessage(data.responseData?.erro || "Erro ao excluir serviço.");
        setToastType("error");
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Erro inesperado ao excluir serviço.");
      setToastType("error");
    } finally {
      setToastOpen(true); // ✅ Abre o Toast aqui!
      setShowConfirmModal(false);
      setServicoSelecionado(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setServicoSelecionado(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando serviços...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );

  const iconePorServico: Record<string, string> = {
    followups: "fa-rocket",
    tickets: "fa-ticket",
    chat: "fa-comments",
    analytics: "fa-chart-line",
    default: "fa-cube",
  };

  return (
    <>
      {/* Header de Serviços */}
      <section className="py-8 px-6 bg-white rounded shadow mb-8">
        <div className="flex flex-wrap -mx-3 items-center">
          <div className="w-full lg:w-1/2 flex items-center mb-5 lg:mb-0 px-3">
            <span className="inline-flex justify-center items-center w-16 h-16 min-w-16 min-h-16 mr-4 bg-indigo-500 rounded">
              <i className="fa-solid fa-cubes text-white text-2xl"></i> {/* Ícone de cubos */}
            </span>
            <div>
              <h2 className="mb-1 text-2xl font-bold">Serviços</h2> {/* Título */}
              <p className="text-sm text-gray-500 font-medium">
                Gerencie todos os serviços cadastrados na plataforma.
              </p>{" "}
              {/* Descrição */}
            </div>
          </div>

          {/* Botão Adicionar */}
          <div className="w-full lg:w-auto ml-auto px-12">
            <button
              className="inline-flex items-center px-4 py-2 text-sm text-white font-medium bg-indigo-500 hover:bg-indigo-600 rounded"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              Adicionar Serviço
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-4 p-6 pt-8">
        {Object.entries(agruparPorCliente(servicos)).map(([cliente, servicosCliente]) => (
          <div key={cliente} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#4f39f6] w-8 h-8 flex items-center justify-center rounded-full">
                <span className="text-white text-sm font-bold">{cliente.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-bold text-[#1e2939]">{cliente}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
              {servicosCliente.map((servico) => (
                <div
                  key={servico.id}
                  className="bg-white border border-gray-200 rounded-xl shadow-md p-5 flex items-center justify-between hover:shadow-lg transition max-w-[45vw]"
                >
                  <div className="flex items-center gap-3">
                    {/* Ícone Dinâmico */}
                    <i
                      className={`fa-solid ${
                        iconePorServico[servico.path] || iconePorServico.default
                      } text-2xl text-neutral-700`}
                    ></i>

                    {/* Status Ativo/Inativo */}
                    <div className="relative flex h-3 w-3 ml-3">
                      {servico.ativo ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                      )}
                    </div>

                    {/* Nome e ID */}
                    <div className="ml-2">
                      <h3 className="text-lg font-semibold text-[#1e2939]">{servico.nome}</h3>
                      <p className="text-sm text-gray-500">ID: {servico.id}</p>
                    </div>
                  </div>

                  {/* Botão Deletar */}
                  <button
                    onClick={() => handleDeleteClick(servico)}
                    className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                    title="Excluir serviço"
                  >
                    <FaTrashAlt size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {showConfirmModal && servicoSelecionado && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000000b0]">
            <div className="bg-white p-6 rounded shadow-md">
              <p className="mb-4">
                Tem certeza que deseja excluir o serviço "{servicoSelecionado.nome}"?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000000b0]">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="text-xl font-semibold mb-4">Adicionar Novo Serviço</h2>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nome do Serviço</label>
                <input
                  type="text"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={newServiceDescription}
                  onChange={(e) => setNewServiceDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Cliente</label>
                <select
                  value={clienteIdSelecionado}
                  onChange={(e) => setClienteIdSelecionado(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tipo do Serviço</label>
                <select
                  value={newServiceType}
                  onChange={(e) => setNewServiceType(e.target.value as "padrao" | "personalizado")}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="padrao">Padrão</option>
                  <option value="personalizado">Personalizado</option>
                </select>
              </div>
              {clienteIdSelecionado && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Usuários</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                    {usuarios.map((usuario) => (
                      <button
                        key={usuario.id}
                        type="button"
                        onClick={() => handleUsuarioToggle(usuario.id)}
                        className={`px-3 py-1 border rounded-full text-sm transition focus:outline-none ${
                          usuariosSelecionados.includes(usuario.id)
                            ? "bg-indigo-500 text-white border-transparent"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {usuario.nome}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {usuariosSelecionados.length > 0 && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Usuários Selecionados</label>
                  <div className="flex flex-wrap gap-2">
                    {usuarios
                      .filter((u) => usuariosSelecionados.includes(u.id))
                      .map((u) => (
                        <span
                          key={u.id}
                          className="inline-flex items-center bg-indigo-100 text-indigo-700 text-sm rounded-full px-3 py-1"
                        >
                          {u.nome}
                        </span>
                      ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddService}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AlertToast
        toastOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        type={toastType}
        message={toastMessage}
      />
    </>
  );
};

export default ServicosList;
