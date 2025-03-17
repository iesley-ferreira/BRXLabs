const Footer = () => {
  return (
    <footer className="bg-[#131313] pt-12 text-gray-400 py-6">
      <div className="container mx-auto h-22 px-6 flex flex-col md:flex-row items-center justify-between">
        {/* Logo ou Nome da Empresa */}
        <div className="text-lg font-semibold text-white">BRX Labs</div>

        {/* Links do Footer */}
        <nav className="flex space-x-6 text-sm mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition">
            Início
          </a>
          <a href="#" className="hover:text-white transition">
            Serviços
          </a>
          <a href="#" className="hover:text-white transition">
            Contato
          </a>
          <a href="#" className="hover:text-white transition">
            Sobre
          </a>
        </nav>

        {/* Redes Sociais */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 1 0-11.5 9.87V14.7H7.9V12h2.6V9.8c0-2.6 1.5-4 3.8-4 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.7h-2.4v7.17A10 10 0 0 0 22 12z" />
            </svg>
          </a>
          <a href="#" className="hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 19h2v-6H8v6zm1-7c.7 0 1.3-.6 1.3-1.3S9.7 9.3 9 9.3 7.7 9.9 7.7 10.7s.6 1.3 1.3 1.3zm4.2 7h2v-3.5c0-.9.1-2 1.3-2 1.3 0 1.3 1.1 1.3 2V19h2v-3.5c0-2.4-1.3-3.5-3.1-3.5-1.4 0-2.1.7-2.5 1.3V9H12v10z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} BRX Labs. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
