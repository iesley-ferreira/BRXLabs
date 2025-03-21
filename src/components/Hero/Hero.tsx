import StartAutomatingButton from "../StartAutomatingButton/StartAutomatingButton";

const Hero = () => {
  return (
    <section className="hero-text flex gap-12 flex-col items-center md:pt-20  md:pb-40 justify-around h-[calc(100%-100px)]">
      <h1 className="relative z-10 pt-12 mb-6 max-w-4xl mx-auto text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600 leading-tight">
        {/* Desbloqueie o potencial do seu negócio! */}
        Automatize tarefas, potencialize resultados!
      </h1>
      <p className="text-white font-light text-xl lg:pb-8 md:text-2xl text-center">
        Agilidade e inovação: automações que geram eficiência e performance.
      </p>
      <div className="card">
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
      <div>
        <StartAutomatingButton />
      </div>
    </section>
  );
};

export default Hero;
