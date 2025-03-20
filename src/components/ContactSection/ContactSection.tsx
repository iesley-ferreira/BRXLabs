import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Formata o telefone para o padrão (XX) XXXXX-XXXX
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length < 3) return `(${digits}`;
    if (digits.length < 8) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
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

  // Validação dos campos
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

  // Envio do formulário e exibição da mensagem após o sucesso
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
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        console.error("Erro ao enviar o formulário", response.statusText);
        setMessage("Erro ao enviar, tente novamente.");
      } else {
        console.log("Formulário enviado com sucesso!");
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário", error);
      setMessage("Erro ao enviar, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-[#131313] text-white">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-4xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600 leading-tight">
          Comece a automatizar hoje mesmo!
        </h2>
        <p className="text-gray-400 text-center mb-10">
          Entre em contato preenchendo o formulário abaixo. Retornaremos o mais rápido possível!
        </p>

        {isSubmitted ? (
          <div className="max-w-lg mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-lg">
            <p className="text-center text-xl">Entraremos em contato!</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-lg mx-auto bg-[#1A1A1A] p-8 rounded-lg shadow-lg"
          >
            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="name">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Seu nome"
                className="w-full p-3 rounded-md bg-[#222] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#956afa]"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="phone">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="(53) 98444-3366"
                className="w-full p-3 rounded-md bg-[#222] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#956afa]"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-400 text-sm mb-2" htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Seu e-mail"
                className="w-full p-3 rounded-md bg-[#222] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#956afa]"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#956afa] hover:bg-[#7d4fd1] transition text-white font-semibold py-3 rounded-md"
              disabled={loading}
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>

            {message && <p className="mt-4 text-center text-sm text-gray-300">{message}</p>}
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
