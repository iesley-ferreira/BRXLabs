const servicesData = [
  {
    title: "Automação para Atendimento",
    image: "./chatbotia.webp",
    items: [
      {
        category: "WhatsApp",
        points: [
          "Automatize o atendimento no WhatsApp e melhore a comunicação com clientes, pacientes e leads.",
          "Lembretes inteligentes reduzem faltas e aumentam a taxa de conversão em diversos segmentos.",
          "Envio automático de promoções e pacotes personalizados para clientes e alunos.",
          "Funis estratégicos para recuperação de leads, pacientes ou clientes inativos.",
          "Suporte instantâneo para dúvidas frequentes, reduzindo carga da equipe de atendimento.",
        ],
      },
      {
        category: "Chatbots e Inteligência Artificial",
        points: [
          "Responda clientes e leads 24h por dia sem esforço. Nossa IA entende e resolve dúvidas rapidamente.",
          "Chatbots inteligentes para agendamento de reuniões, consultas ou suporte técnico.",
          "Encaminhamento automático de leads para setores específicos, otimizando a conversão e atendimento.",
        ],
      },
      {
        category: "Gerenciamento de Agendamentos",
        points: [
          "Confirmação automática de compromissos, sessões ou reuniões para evitar cancelamentos de última hora.",
          "Lembretes estratégicos via WhatsApp, SMS e e-mail para manter clientes e pacientes informados.",
          "Reagendamentos automáticos para otimizar a agenda e evitar horários vagos.",
          "Gerenciamento inteligente de listas de espera para encaixes e otimização do tempo.",
        ],
      },
    ],
  },
  {
    title: "Automação de Processos Administrativos",
    image: "./process.png",
    items: [
      {
        category: "CRM para Negócios e Empreendedores",
        points: [
          "Gerencie leads, clientes e pacientes com um histórico detalhado e centralizado.",
          "Automação de follow-ups para aumentar engajamento e fidelização.",
          "Segmentação de contatos para campanhas personalizadas, otimizando conversão.",
        ],
      },
    ],
  },
  {
    title: "Automação para Marketing e Relacionamento",
    image: "./aiagentlabel.png",
    items: [
      {
        category: "Instagram e Redes Sociais",
        points: [
          "Responda mensagens no Direct automaticamente e converta seguidores em clientes.",
          "Criação de funis automatizados para atrair e converter leads.",
          "Agendamento automatizado de posts para manter engajamento contínuo.",
        ],
      },
      {
        category: "E-mail Marketing",
        points: [
          "Mantenha clientes e leads engajados com campanhas automatizadas.",
          "Criação de estratégias personalizadas para fidelização de clientes e alunos.",
          "Divulgação de lançamentos e atualizações de forma segmentada.",
        ],
      },
      {
        category: "Telegram e Comunicação Direta",
        points: [
          "Grupos exclusivos no Telegram para mentoria, suporte e fidelização de clientes.",
          "Automação de notificações sobre lançamentos, campanhas e promoções.",
        ],
      },
      {
        category: "Prospecção e Captação de Leads",
        points: [
          "Automação estratégica para atrair novos clientes, pacientes e alunos.",
          "Funis de conversão inteligentes para maximizar resultados.",
          "Captação de leads qualificados para produtos digitais, serviços ou consultorias.",
        ],
      },
    ],
  },
  {
    title: "Automação para Lançamentos e Vendas",
    image: "./aicellphone.webp",
    items: [
      {
        category: "Promoções e Campanhas Estratégicas",
        points: [
          "Venda mais com campanhas automatizadas! Notifique clientes e leads sobre novos produtos e serviços.",
          "Automação de sequências de e-mails e mensagens para lançamentos e ofertas especiais.",
        ],
      },
      {
        category: "Programas de Fidelização",
        points: [
          "Transforme clientes eventuais em compradores recorrentes com comunicação automatizada.",
          "Criação de estratégias exclusivas para retenção de alunos, pacientes e consumidores.",
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
    <div className="bg-[#131313] w-full pt-10 pb-20">
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
