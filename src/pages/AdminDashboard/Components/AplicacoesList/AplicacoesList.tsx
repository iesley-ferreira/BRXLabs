import { useEffect, useState } from "react";

type Cliente = { id: number; nome: string }; // 🔥 Corrigido aqui
type Servico = {
  id: number;
  nome: string;
  descricao: string;
  path: string;
  ativo: boolean;
  tipo: "padrao" | "personalizado";
  cliente_nome: string;
};

type AplicacoesListProps = {
  API_URL: string;
  token: string;
  onSelectServico: (servico: Servico) => void;
};

export default function AplicacoesList({ API_URL, token, onSelectServico }: AplicacoesListProps) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
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
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar dados."); // 🔥 Correto agora
      } finally {
        setLoading(false); // 🔥 Finalmente desligamos o loading
      }
    }

    fetchData();
  }, [API_URL, token]);

  // 🔥 Agora aplica corretamente o filtro:
  const servicosFiltrados = servicos.filter((servico) => {
    if (!clienteSelecionado) return true;
    return servico.cliente_nome === clienteSelecionado;
  });

  const servicosPadrao = servicosFiltrados.filter((s) => s.tipo === "padrao"); // Usando filtrados
  const servicosPersonalizados = servicosFiltrados.filter((s) => s.tipo === "personalizado"); // Usando filtrados

  if (loading) {
    return <div className="text-gray-600 text-center mt-10">Carregando aplicações…</div>;
  }

  if (erro) {
    return <div className="text-red-600 text-center mt-10">{erro}</div>;
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <section className="py-8 px-6 bg-white rounded shadow mb-8">
        <div className="flex flex-wrap -mx-3 items-center">
          <div className="w-full lg:w-1/2 flex items-center mb-5 lg:mb-0 px-3">
            <span className="inline-flex justify-center items-center min-w-16 w-16 min-h-16 h-16 mr-4 bg-indigo-500 rounded">
              <i className="fa-solid fa-layer-group text-white text-2xl"></i>
            </span>
            <div>
              <h2 className="mb-1 text-2xl font-bold">Aplicações</h2>
              <p className="text-sm text-gray-500 font-medium">
                Visualize e acesse todas as aplicações ativas e personalizadas da plataforma.
              </p>
            </div>
          </div>
          <div className="w-full lg:w-auto ml-auto px-12">
            <select
              value={clienteSelecionado}
              onChange={(e) => setClienteSelecionado(e.target.value)}
              className="border rounded px-4 py-2 text-sm text-gray-700"
            >
              <option value="">Todos os clientes</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.nome}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
      <div className="space-y-4 p-6 pt-8">
        {/* Serviços Padrão */}
        <div className="pb-4">
          <h2 className="text-2xl font-bold mb-6 text-[#1e293b]">Serviços Padrão</h2>
          {servicosPadrao.length === 0 ? (
            <p className="text-gray-400">Nenhum serviço padrão disponível.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicosPadrao.map((servico) => (
                <div
                  key={servico.id}
                  className="relative bg-white rounded-lg shadow p-6 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="absolute top-4 right-4">
                    {servico.ativo ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    ) : (
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <i className="fa-solid fa-cube text-2xl text-neutral-700 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{servico.nome}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{servico.descricao}</p>
                  <button
                    onClick={() => onSelectServico(servico)}
                    className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition cursor-pointer"
                  >
                    Acessar serviço
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Serviços Personalizados */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#1e293b]">Serviços Personalizados</h2>
          {servicosPersonalizados.length === 0 ? (
            <p className="text-gray-400">Nenhum serviço personalizado disponível.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servicosPersonalizados.map((servico) => (
                <div
                  key={servico.id}
                  className="relative bg-white rounded-lg shadow p-6 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div className="absolute top-4 right-4">
                    {servico.ativo ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    ) : (
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <i className="fa-solid fa-cube text-2xl text-neutral-700 mb-4"></i>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{servico.nome}</h3>
                  </div>
                  <p className="text-gray-600 text-sm">{servico.descricao}</p>
                  <button
                    onClick={() => onSelectServico(servico)}
                    className="mt-6 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition"
                  >
                    Acessar serviço
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
