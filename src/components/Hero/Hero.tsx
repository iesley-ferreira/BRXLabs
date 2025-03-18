const Hero = () => {
  return (
    <section className="hero-text flex flex-col items-center pt-8 md:pt-20 justify-center h-[calc(100vh-220px)]">
      <h1 className="relative z-10 mb-6 max-w-4xl mx-auto text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600 leading-tight">
        {/* Desbloqueie o potencial do seu negócio! */}
        Automatize tarefas, potencialize resultados!
      </h1>
      <p className="text-white font-light text-xl md:text-2xl mt-4 text-center">
        Agilidade e inovação: automações que geram eficiência e performance.
      </p>
      <div className="card">
        <div className="loader mt-10">
          <p>Automatize</p>
          <div className="words">
            <span className="word">Atendimento</span>
            <span className="word">Agendamento</span>
            <span className="word">Planilhas</span>
            <span className="word">Vendas</span>
            {/* <span className="word">Mais</span> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
