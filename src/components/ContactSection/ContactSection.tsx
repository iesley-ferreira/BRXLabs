import { useState } from "react";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulário enviado:", formData);
  };

  return (
    <section className="py-20 bg-[#131313] text-white">
      <div className="container mx-auto px-6 lg:px-20">
        <h2 className="text-4xl font-bold text-center mb-6">Comece a automatizar hoje mesmo!</h2>
        <p className="text-gray-400 text-center mb-10">
          Entre em contato preenchendo o formulário abaixo. Retornaremos o mais rápido possível!
        </p>

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
              placeholder="Seu telefone"
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
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
