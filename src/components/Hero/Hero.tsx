const Hero = () => {
  return (
    <section className="hero-text flex flex-col items-center md:pt-20 justify-around h-[calc(100vh-100px)]">
      <h1 className="relative z-10 pt-12 mb-6 max-w-4xl mx-auto text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600 leading-tight">
        {/* Desbloqueie o potencial do seu negócio! */}
        Automatize tarefas, potencialize resultados!
      </h1>
      <p className="text-white font-light text-xl lg:pb-8 md:text-2xl text-center">
        Agilidade e inovação: automações que geram eficiência e performance.
      </p>
      <div className="card mb-18">
        <div className="loader">
          <p className="text-3xl">Automatize</p>
          <div className="words text-3xl">
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
