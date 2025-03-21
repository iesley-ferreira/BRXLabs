import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);

  // Detecta se a seção de contato está visível na viewport
  useEffect(() => {
    const contactSection = document.querySelector("#contact");
    if (!contactSection) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsContactVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 },
    );
    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  // Se a seção de contato estiver visível, não renderiza o botão
  if (isContactVisible) return null;

  // Função para formatar o telefone para o padrão (XX) XXXXX-XXXX
  const formatPhone = (value: string): string => {
    const digitsOnly = value.replace(/\D/g, "");
    const hasCountryCode = digitsOnly.startsWith("55");
    const core = hasCountryCode ? digitsOnly.slice(2) : digitsOnly;
    const trimmed = core.slice(0, 11);

    if (!trimmed) return "";

    const ddd = trimmed.slice(0, 2);
    const firstPart = trimmed.slice(2, 7);
    const secondPart = trimmed.slice(7);

    let formatted = hasCountryCode || trimmed.length > 0 ? "55 " : "";

    if (trimmed.length < 3) {
      formatted += `(${trimmed}`;
    } else if (trimmed.length < 8) {
      formatted += `(${ddd}) ${firstPart}`;
    } else {
      formatted += `(${ddd}) ${firstPart}-${secondPart}`;
    }

    return formatted;
  };

  // Atualiza os valores do formulário e aplica formatação no telefone
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const formatted = formatPhone(value);
      setFormData({ ...formData, [name]: formatted });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Valida os campos do formulário
  const validateForm = () => {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setMessage("Por favor, insira um telefone no formato (XX) XXXXX-XXXX.");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setMessage("Por favor, insira um e-mail válido.");
      return false;
    }
    return true;
  };

  // Envio do formulário e exibição da mensagem de sucesso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://webhook.brxlabs.com.br/webhook/8968e5f4-9083-4516-9f63-7f359f99f346",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        setMessage("Erro ao enviar, tente novamente.");
      } else {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
      setMessage("Erro ao enviar, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
          setFormData({ name: "", phone: "", email: "" });
          setMessage("");
          setIsSubmitted(false);
        }}
        className="fixed top-4/18 md:top-2/12 right-0 origin-bottom-right -rotate-90 translate-x-0 hover:translate-x-0 z-[9999] cursor-pointer bg-[#473ee7] text-[#bebed6f5] hover:text-white hover:bg-[#5048e5] font-bold text-sm px-4 py-2 h-12 rounded-t-md hover:shadow-[0px_0px_10px_rgba(255,255,255,0.4)] transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white animate-custom-pulse pulse-element"
      >
        Fale Conosco
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#1a1a1a96] bg-opacity-50 flex items-center justify-center z-[10000] transition-opacity duration-300 ease-in-out">
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg w-96 relative">
            {/* Botão de fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {isSubmitted ? (
              <div className="text-center bg-[#1A1A1A] p-8 rounded-lg">
                <h2 className="text-xl font-semibold m-4 text-white">Entraremos em contato!</h2>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4 text-white text-center">
                  Agendaremos um horário para conversar!
                </h2>
                <form
                  onSubmit={handleSubmit}
                  className="max-w-lg mx-auto bg-[#1A1A1A] p-8 rounded-lg"
                >
                  <div className="flex flex-col mb-4">
                    <label htmlFor="nome" className="text-gray-300 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="name"
                      placeholder="Digite seu nome"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                    />
                  </div>

                  <div className="flex flex-col mb-4">
                    <label htmlFor="telefone" className="text-gray-300 mb-1">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="telefone"
                      name="phone"
                      placeholder="Digite seu telefone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                    />
                  </div>

                  <div className="flex flex-col mb-4">
                    <label htmlFor="email" className="text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Digite seu e-mail"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                    />
                  </div>

                  {message && <p className="text-center text-sm text-red-400">{message}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-[#956afa] hover:bg-[#7d4fd1] transition text-white font-semibold py-3 rounded-md"
                  >
                    {loading ? "Enviando..." : "Enviar"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
