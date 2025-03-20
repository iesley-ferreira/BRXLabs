import EmblaCarousel from "../EmblaCarousel/EmblaCarousel";

const Toolbox = () => {
  return (
    <section className="hero-text flex gap-12 flex-col items-center md:pt-20 justify-around pb-6 md:pb-22">
      <h1 className="relative z-10 pt-12 mb-6 max-w-4xl mx-auto text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600 leading-tight">
        Nossa Caixa de Ferramentas
      </h1>
      <p className="text-white font-light text-xl pb-16 lg:pb-18 md:text-2xl text-center">
        Sempre atualizados com as tendências do mercado e abertos a novas ferramentas e inovações
      </p>
      <EmblaCarousel />
    </section>
  );
};

export default Toolbox;
