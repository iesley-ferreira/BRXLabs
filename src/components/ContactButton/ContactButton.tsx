import { X } from "lucide-react";
import { useState } from "react";

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botão fixo na lateral direita */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-2/12 right-0 origin-bottom-right -rotate-90 translate-x-0 hover:translate-x-0 z-[9999] cursor-pointer 
                   bg-[#5048e5e3] text-[#a6a4d4e0] hover:text-white hover:bg-[#5048e5] font-bold text-sm px-4 py-2 h-12 rounded-t-md 
                   hover:shadow-[0px_0px_10px_rgba(255,255,255,0.4)] transition-all 
                   hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Fale Conosco
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="contact-card fixed inset-0 bg-opacity-50 flex items-center justify-center z-[10000] transition-opacity duration-300 ease-in-out">
          <div className="contact-card-box bg-[#1b1a1a] p-6 rounded-lg shadow-lg w-96 relative">
            {/* Botão de fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Conteúdo do Modal */}
            <h2 className="text-xl font-semibold mb-4 text-white text-center">
              Agendaremos um horário para conversar!
            </h2>

            <form className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="nome" className="text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  id="nome"
                  placeholder="Digite seu nome"
                  className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="telefone" className="text-gray-300 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  id="telefone"
                  placeholder="Digite seu telefone"
                  className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="Digite seu e-mail"
                  className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                />
              </div>

              <div className="text-center text-sm mt-1">
                <p className="text-[rgb(80,72,229)] hover:underline">Entraremos em contato!</p>
              </div>

              <button
                type="submit"
                className="w-full bg-[rgb(80,72,229)] text-white py-2 rounded-md shadow-md hover:bg-[rgb(60,55,200)] transition"
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
