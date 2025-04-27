import React, { useEffect, useState } from "react";
import { FaCog, FaTrashAlt } from "react-icons/fa";
import AlertToast from "../AlertToast/AlertToast";
import CreateUserModal from "../CreateUserModal/CreateUserModal";
type Usuario = {
  id: number;
  nome: string;
  usuario: string;
  status: string;
  servicos: { id: number; nome: string }[]; // ← atualizado aqui
  foto?: string;
  email: string;
  status_online: boolean;
};

type Cliente = { id: number; nome: string };
type Servico = { id: number; nome: string };

type UsuariosListProps = { API_URL: string; token: string };

const UsuariosList: React.FC<UsuariosListProps> = ({ API_URL, token }) => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [clients, setClients] = useState<Cliente[]>([]);
  const [services, setServices] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [assignMode, setAssignMode] = useState(false);
  const [deassignMode, setDeassignMode] = useState(false);

  const [selectedClient, setSelectedClient] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info" | "warning">("success");

  // Fetch usuários e clientes
  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/webhook/admin/listar-usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setUsuarios(await res.json());
    } catch {
      setError("Erro ao buscar usuários.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/webhook/admin/listar-clientes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setClients(await res.json());
    } catch {
      console.error("Erro ao buscar clientes");
      setError("Erro ao buscar clientes.");
      setLoading(false);
    }
  };

  // Fetch serviços do cliente para atribuir
  const fetchServices = async (clientId: number) => {
    try {
      const res = await fetch(`${API_URL}/webhook/admin/listar-servicos?cliente_id=${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setServices(await res.json());
    } catch {
      console.error("Erro ao buscar serviços");
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchClients();
  }, []);

  const closeModal = () => {
    setSelectedUser(null);
    setAssignMode(false);
    setDeassignMode(false);
    setSelectedClient(null);
    setSelectedServices([]);
    setServices([]);
  };

  // Modo atribuir
  const openAssignMode = () => {
    setAssignMode(true);
    setDeassignMode(false);
    setSelectedClient(null);
    setSelectedServices([]);
    setServices([]);
  };

  const handleAssignSubmit = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`${API_URL}/webhook/admin/atribuir-servico`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ usuario_id: selectedUser.id, servico_id: selectedServices }),
      });
      fetchUsuarios();
      showToast("Serviços atribuídos com sucesso!", "success");
      closeModal();
    } catch {
      console.error("Erro ao atribuir serviços");
      showToast("Erro ao atribuir serviços.", "error");
    }
  };

  // Modo desatribuir
  const openDeassignMode = () => {
    setDeassignMode(true);
    setAssignMode(false);
    setSelectedServices([]);
  };

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    );
  };

  const handleDeassignSubmit = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`${API_URL}/webhook/admin/desatribuir-servico`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ usuario_id: selectedUser.id, servico_id: selectedServices }),
      });
      fetchUsuarios();
      showToast("Serviços desatribuídos com sucesso!", "success");
      closeModal();
    } catch {
      console.error("Erro ao desatribuir serviços");
      showToast("Erro ao desatribuir serviços.", "error");
    }
  };

  const handleToggleUsuarioStatus = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`${API_URL}/webhook/admin/desabilitar-usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id: selectedUser.id }),
      });
      fetchUsuarios();
      const action = selectedUser.status === "ativo" ? "desabilitado" : "habilitado";
      showToast(`Usuário ${action} com sucesso!`, "success");
      closeModal();
    } catch {
      console.error("Erro ao alterar status do usuário");
      showToast("Erro ao alterar status do usuário.", "error");
    }
  };

  const handleDeleteUsuario = async () => {
    if (!selectedUser) return;
    try {
      await fetch(`${API_URL}/webhook/admin/excluir-usuario`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usuario_id: selectedUser.id }),
      });
      fetchUsuarios();
      showToast("Usuário excluído com sucesso!", "success");
      closeModal();
    } catch {
      console.error("Erro ao excluir usuário");
      showToast("Erro ao excluir usuário.", "error");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  if (loading)
    return <div className="flex items-center justify-center h-screen">Carregando usuários...</div>;
  if (error)
    return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

  return (
    <>
      {/* Header de Usuários */}
      <section className="py-8 px-6 bg-white rounded shadow mb-8">
        <div className="flex flex-wrap -mx-3 items-center">
          <div className="w-full lg:w-1/2 flex items-center mb-5 lg:mb-0 px-3">
            <span className="inline-flex justify-center items-center w-16 h-16 min-w-16 min-h-16 mr-4 bg-indigo-500 rounded">
              <i className="fa-solid fa-users text-white text-2xl"></i>
            </span>
            <div>
              <h2 className="mb-1 text-2xl font-bold">Usuários</h2>
              <p className="text-sm text-gray-500 font-medium">
                Visualize e gerencie todos os usuários cadastrados.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-auto ml-auto px-12">
            <button
              className="inline-flex items-center px-4 py-2 text-sm text-white font-medium bg-indigo-500 hover:bg-indigo-600 rounded"
              onClick={() => setShowModal(true)}
            >
              <i className="fa-solid fa-user-plus mr-2"></i>
              Criar Usuário
            </button>
          </div>
        </div>
      </section>
      {/* Modal de criar usuário */}
      {showModal && (
        <div className="fixed inset-0 bg-[#000000b0] flex items-center justify-center z-50">
          <div onClick={(e) => e.stopPropagation()}>
            <CreateUserModal
              onClose={() => setShowModal(false)}
              API_URL={API_URL}
              token={token}
              onUserCreated={fetchUsuarios}
            />
          </div>
        </div>
      )}
      {/* Lista de usuários */}
      <div className="space-y-4 p-6 pt-8">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white rounded-lg shadow-sm p-6 mb-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={
                    usuario.foto?.trim() ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      usuario.nome,
                    )}&background=4f39f6&color=fff&rounded=true&size=64`
                  }
                  alt={usuario.nome}
                  className="w-12 h-12 object-cover rounded-full"
                />
                {usuario.status_online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div className="min-w-[240px]">
                <h3 className="text-[#1e2939] font-semibold">{usuario.nome}</h3>
                <p className="text-gray-500 text-sm">{usuario.usuario}</p>
                <p className="text-gray-500 text-sm">{usuario.email}</p>
              </div>
              {/* Status do usuário */}
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  usuario.status === "ativo"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)}
              </span>
            </div>
            {/* Tags de serviços */}
            <div className="flex flex-wrap space-x-2 max-w-sm">
              {usuario.servicos.length > 0 ? (
                usuario.servicos.map((s) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm"
                  >
                    {s.nome}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">Nenhum serviço</span>
              )}
            </div>
            {/* Botão abrir modal */}
            <button
              className="text-gray-500 hover:text-[#4f39f6]"
              onClick={() => setSelectedUser(usuario)}
            >
              <FaCog size={20} />
            </button>
          </div>
        ))}
      </div>
      {/* Modal de Ações */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#000000b0] flex items-center justify-center">
          <section className="bg-white rounded-lg shadow-sm p-8 w-full max-w-[35vw]">
            <div className="flex flex-col items-center mb-8">
              <img
                src={
                  selectedUser.foto?.trim() ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedUser.nome,
                  )}&background=4f39f6&color=fff&rounded=true&size=128`
                }
                alt={selectedUser.nome}
                className="w-24 h-24 object-cover rounded-full mb-4"
              />
              <h2 className="text-2xl font-bold text-[#1e2939] mb-2">{selectedUser.nome}</h2>
              <p className="text-gray-500 mb-1">{selectedUser.usuario}</p>
              <p className="text-sm text-gray-500 mb-4">{selectedUser.email}</p>
            </div>

            {/* Menu principal ou modos */}
            {!assignMode && !deassignMode ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={openAssignMode}
                    className="px-6 py-2 w-[190px] rounded-lg bg-[#4f39f6] text-white hover:bg-[#4f39f6]/90"
                  >
                    Atribuir serviço
                  </button>
                  <button
                    onClick={openDeassignMode}
                    className="px-6 py-2 w-[190px] rounded-lg bg-gray-700 text-white hover:bg-gray-800"
                  >
                    Desatribuir serviço
                  </button>
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={handleToggleUsuarioStatus}
                    className="px-6 py-2 w-[190px] rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    {selectedUser.status === "ativo" ? "Desabilitar" : "Habilitar"} usuário
                  </button>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-6 py-2 w-[190px] rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Excluir usuário
                  </button>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : assignMode ? (
              // UI de atribuição
              <div className="space-y-4">
                <div className="mb-4">
                  <label
                    htmlFor="client-assign"
                    className="block text-lg font-medium text-[#1e2939] mb-2"
                  >
                    Selecione o Cliente
                  </label>
                  <select
                    id="client-assign"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={selectedClient ?? ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedClient(id);
                      setSelectedServices([]);
                      fetchServices(id);
                    }}
                  >
                    <option value="" disabled>
                      -- Escolha um cliente --
                    </option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedClient && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#1e2939] mb-2">
                      Serviços Disponíveis
                    </h3>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto border border-gray-300 p-2 rounded-lg">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className={`px-4 py-2 rounded-lg border ${
                            selectedServices.includes(s.id)
                              ? "bg-[#4f39f6] text-white"
                              : "bg-white text-gray-700 border-gray-300"
                          }`}
                          onClick={() => handleServiceToggle(s.id)}
                        >
                          {s.nome}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selectedServices.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-[#1e2939] mb-2">
                      Serviços Selecionados
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {services
                        .filter((s) => selectedServices.includes(s.id))
                        .map((s) => (
                          <span
                            key={s.id}
                            className="px-4 py-2 rounded-lg bg-blue-100 text-blue-600"
                          >
                            {s.nome}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAssignSubmit}
                    disabled={!selectedServices.length}
                    className="px-6 py-2 rounded-lg bg-[#4f39f6] text-white hover:bg-[#4f39f6]/90 disabled:opacity-50"
                  >
                    Atribuir
                  </button>
                </div>
              </div>
            ) : (
              // UI de desatribuição em cards
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1e2939] mb-2">Serviços vinculados</h3>
                <div className="grid grid-cols-2 gap-4 max-h-40 overflow-auto">
                  {selectedUser.servicos.map((s) => (
                    <div
                      key={s.id}
                      className={`p-4 flex justify-between items-center border rounded-lg cursor-pointer ${
                        selectedServices.includes(s.id)
                          ? "bg-red-100 border-red-400"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleServiceToggle(s.id)}
                    >
                      <span>{s.nome}</span>
                      <FaTrashAlt
                        className={
                          selectedServices.includes(s.id) ? "text-red-600" : "text-gray-400"
                        }
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeassignSubmit}
                    disabled={!selectedServices.length}
                    className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    Desatribuir
                  </button>
                </div>
              </div>
            )}
          </section>
          {confirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-40 z-60 flex items-center justify-center">
              <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-sm">
                <p className="mb-4 text-gray-700">
                  Tem certeza que deseja <strong>excluir</strong> o usuário <br />
                  <span className="text-red-600 font-bold">{selectedUser?.nome}</span>?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDeleteUsuario}
                    className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                  >
                    Confirmar exclusão
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <AlertToast
        toastOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        type={toastType}
        message={toastMessage}
      />
    </>
  );
};

export default UsuariosList;
