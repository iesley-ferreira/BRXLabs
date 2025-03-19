const servicesData = [
  {
    title: "Automação para Atendimento",
    image: "src/assets/images/chatbotia.webp",
    items: [
      {
        category: "WhatsApp",
        points: [
          "Envio automatizado de mensagens para pacientes.",
          "Lembretes de consultas e exames agendados.",
          "Oferta de pacotes promocionais para tratamentos.",
          "Funis de recuperação de pacientes que não compareceram.",
          "Suporte automatizado para dúvidas frequentes.",
        ],
      },
      {
        category: "Chatbots e Inteligência Artificial",
        points: [
          "Atendimento virtual para agendamento de consultas e exames.",
          "Respostas automáticas para dúvidas frequentes sobre tratamentos.",
          "Encaminhamento de pacientes para setores específicos via chatbot.",
        ],
      },
      {
        category: "Gerenciamento de Agendamentos",
        points: [
          "Confirmação automática de consultas e exames.",
          "Lembretes de compromissos via WhatsApp, SMS e e-mail.",
          "Reagendamento automatizado para evitar faltas.",
          "Organização de listas de espera para encaixes.",
        ],
      },
      {
        category: "Avisos e Notificações",
        points: [
          "Aviso sobre campanhas de check-up e exames preventivos.",
          "Notificação de retorno para acompanhamento médico e odontológico.",
          "Comunicação automática sobre novos serviços e tratamentos.",
        ],
      },
    ],
  },
  {
    title: "Automação de Processos Administrativos",
    image: "src/assets/images/machinelearning.webp",
    items: [
      {
        category: "CRM para Clínicas e Consultórios",
        points: [
          "Gestão de pacientes com histórico detalhado.",
          "Automação de follow-ups para retornos e fidelização.",
          "Segmentação de pacientes por tipo de tratamento realizado.",
        ],
      },
    ],
  },
  {
    title: "Automação para Marketing Médico e Relacionamento com Pacientes",
    image: "src/assets/images/aicellphone.webp",
    items: [
      {
        category: "Instagram",
        points: [
          "Respostas automáticas no Direct para dúvidas sobre procedimentos.",
          "Automação de mensagens para pacientes interessados em tratamentos.",
          "Campanhas personalizadas para captação de novos pacientes.",
        ],
      },
      {
        category: "E-mail Marketing",
        points: [
          "Envio automatizado de e-mails com dicas de saúde e estética.",
          "Campanhas de fidelização para pacientes antigos.",
          "Divulgação de novos tratamentos e tecnologias disponíveis na clínica.",
        ],
      },
      {
        category: "Telegram",
        points: [
          "Grupos exclusivos para pacientes com dicas e orientações.",
          "Notificações de campanhas e promoções sazonais.",
        ],
      },
      {
        category: "Prospecção e Captação de Novos Pacientes",
        points: [
          "Estratégias automatizadas para atrair novos pacientes via WhatsApp e e-mail.",
          "Funis de conversão para aumentar a taxa de agendamento.",
          "Captação de leads qualificados para tratamentos específicos.",
        ],
      },
    ],
  },
  {
    title: "Automação para Lançamentos e Venda de Tratamentos",
    image: "src/assets/images/aiagentlabel.png",
    items: [
      {
        category: "Promoções e Campanhas Periódicas",
        points: [
          "Sequências automáticas para lançamento de novos serviços.",
          "Envio de lembretes sobre promoções sazonais (ex.: 'Mês da Saúde Bucal').",
        ],
      },
      {
        category: "Programas de Fidelização",
        points: [
          "Comunicação automatizada para planos recorrentes e pacotes de tratamento.",
          "Benefícios exclusivos para pacientes que retornam regularmente.",
        ],
      },
    ],
  },
];

const ServiceCategory = ({ category, points }: { category: string; points: string[] }) => {
  return (
    <div className="mb-6 bg-[#131313]">
      <h3 className="font-semibold text-lg text-[#956afa]">{category}</h3>
      <ul className="mt-2 space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="2 -6 48 48" width="48px" height="22px">
              <rect
                width="35.707"
                height="5.649"
                x="15.726"
                y="16.364"
                fill="#6c19ff"
                transform="rotate(-46.06 33.58 19.187)"
              />
              <rect
                width="5.649"
                height="16.857"
                x="16.276"
                y="17.713"
                fill="#6c19ff"
                transform="rotate(-46.188 19.1 26.141)"
              />
            </svg>
            <p>{point}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ServicesProvided = () => {
  return (
    <div className="bg-[#131313] w-full py-20">
      <div className="flex flex-col items-center w-10/12 md-w-8/12 mx-auto">
        {servicesData.map((service, index) => (
          <div
            data-aos="fade-up"
            data-aos-anchor-placement="top-center"
            key={index}
            className={`flex w-1/2 flex-col lg:flex-row ${
              index % 2 !== 0 ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center flex-wrap w-full mt-10 mb-20`}
          >
            {/* Texto */}
            <div className="w-full lg:w-1/2">
              <div className="lg-p-6">
                <h2 className="relative z-10 mb-6 max-w-4xl mx-auto text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600 leading-tight">
                  {service.title}
                </h2>
                {service.items.map((item, idx) => (
                  <ServiceCategory key={idx} category={item.category} points={item.points} />
                ))}
              </div>
            </div>

            {/* Imagem ilustrativa */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="service-image w-lg h-96 rounded-3xl">
              <img
                  className="relative top-10 mx-auto w-md h-96 rounded-3xl transform hover:-translate-y-16 transition ease-in-out duration-500"
                  src={service.image}
                  alt={service.title}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesProvided;
