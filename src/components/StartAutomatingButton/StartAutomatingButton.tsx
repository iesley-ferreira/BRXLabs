import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const StartAutomatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isContactVisible, setIsContactVisible] = useState(false);

  useEffect(() => {
    const contactSection = document.querySelector("#contact");
    if (!contactSection) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsContactVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(contactSection);
    return () => observer.disconnect();
  }, []);

  if (isContactVisible) return null;

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? formatPhone(value) : value,
    }));
  };

  const validateForm = () => {
    const phoneRegex = /^(55\s?)?\(\d{2}\) \d{5}-\d{4}$/;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://webhook.brxlabs.com.br/webhook/8968e5f4-9083-4516-9f63-7f359f99f346",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );
      if (!res.ok) setMessage("Erro ao enviar, tente novamente.");
      else setIsSubmitted(true);
    } catch {
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
        className="cursor-pointer min-w-[330px] bg-gradient-to-b from-indigo-500 to-indigo-600 shadow-[0px_4px_32px_0_rgba(99,102,241,.70)] px-6 py-3 rounded-xl border-[1px] border-slate-500 text-white font-medium group"
      >
        <div className="relative overflow-hidden flex items-center justify-center h-7">
          <p className="absolute inset-0 flex items-center justify-center transition-transform duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
            QUERO AUTOMATIZAR AGORA
          </p>
          <p className="absolute inset-0 flex items-center justify-center transition-transform duration-[1.125s] ease-[cubic-bezier(0.19,1,0.22,1)] translate-y-full group-hover:translate-y-0">
            FAÇA MAIS COM MENOS
          </p>
        </div>
      </button>

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
                      Nome Completo
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
                      Telefone (com DDD)
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
};

export default StartAutomatingButton;
