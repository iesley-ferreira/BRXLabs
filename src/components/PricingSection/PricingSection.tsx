import React, { FormEvent, useEffect, useState } from "react";
import "./pricingSection.css";

interface PlanCardData {
  name: string;
  monthlyPrice: number;
  isPopular?: boolean;
  setupNoteDefault: string;
  description: string;
  features: string[];
  buttonText: string;
}

const mainPlansData: PlanCardData[] = [
  {
    name: "Starter",
    monthlyPrice: 1500,
    setupNoteDefault: "Setup incluso. Mínimo 3 meses.",
    description:
      "Ideal para:<br>Pequeno empreendedor / profissional autônomo, começando a estruturar sua operação digital.",
    features: [
      "Agente de IA (Nível Silver)",
      "Automações Iniciais",
      "Integrações Essenciais",
      "Armazenamento Básico",
      "Reunião de Alinhamento Mensal",
      "Suporte",
    ],
    buttonText: "Contratar",
  },
  {
    name: "Boost",
    monthlyPrice: 2000,
    isPopular: true,
    setupNoteDefault: "Setup incluso. Mínimo 3 meses.",
    description:
      "Ideal para:<br>Pequena ou média empresa, com operação digital funcionando, buscando mais automação.",
    features: [
      "Agente IA (Nível Gold)",
      "Automações Avançadas",
      "Mais Integrações",
      "Front-end's Customizados",
      "Armazenamento Estruturado",
      "Reunião de Alinhamento Quinzenal",
      "Suporte",
    ],
    buttonText: "Contratar",
  },
  {
    name: "BRX Custom",
    monthlyPrice: 0, // Preço não aplicável da mesma forma
    setupNoteDefault: "",
    description:
      "Ideal para:<br>Empresas com necessidades específicas que desejam uma solução de IA totalmente personalizada.",
    features: [
      "Flexibilidade total de recursos",
      "Agentes de IA sob medida",
      "Automações complexas e dedicadas",
      "Desenvolvimento de modelos exclusivos",
      "E muito mais...",
    ],
    buttonText: "Solicitar Orçamento",
  },
];

const PricingSection: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "semiannual" | "annual">(
    "monthly",
  );
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState("");

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [formMessage, setFormMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number): string => {
    return `R$ ${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPeriod(event.target.value as "monthly" | "semiannual" | "annual");
  };

  const openContactModal = (planName: string) => {
    setSelectedPlanForModal(planName);
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setFormMessage(null);
    setIsContactModalOpen(true);
    document.body.classList.add("overflow-hidden-body");
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    document.body.classList.remove("overflow-hidden-body");
  };

  const handleContactFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    const data = {
      nome: contactName,
      telefone: contactPhone,
      email: contactEmail,
      plano_escolhido: selectedPlanForModal,
    };

    try {
      const response = await fetch(
        "https://webhook.brxlabs.com.br/webhook/8968e5f4-9083-4516-9f63-7f359f99f346",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (response.ok) {
        setFormMessage({
          type: "success",
          text: "Solicitação enviada com sucesso! Entraremos em contato em breve.",
        });
        setContactName("");
        setContactPhone("");
        setContactEmail("");
        setTimeout(() => {
          closeContactModal();
        }, 3000);
      } else {
        setFormMessage({
          type: "error",
          text: "Ocorreu um erro ao enviar sua solicitação. Tente novamente.",
        });
        console.error("Webhook error:", response.status, response.statusText);
      }
    } catch (error) {
      setFormMessage({
        type: "error",
        text: "Erro de conexão. Verifique sua internet e tente novamente.",
      });
      console.error("Fetch error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Efeito para adicionar/remover classe no body quando o modal abre/fecha
  useEffect(() => {
    if (isContactModalOpen) {
      document.body.classList.add("overflow-hidden-body");
    } else {
      document.body.classList.remove("overflow-hidden-body");
    }
    return () => {
      document.body.classList.remove("overflow-hidden-body");
    };
  }, [isContactModalOpen]);

  const renderPlanPrice = (monthlyPrice: number) => {
    let originalPriceText = "";
    let finalPriceText = formatCurrency(monthlyPrice);
    let periodSuffixText = "/mês";

    if (selectedPeriod === "semiannual") {
      const totalSemiannual = monthlyPrice * 6;
      const discountedSemiannual = totalSemiannual * 0.92;
      originalPriceText = formatCurrency(totalSemiannual);
      finalPriceText = formatCurrency(discountedSemiannual);
      periodSuffixText = "/semestre (pag. único)";
    } else if (selectedPeriod === "annual") {
      const totalAnnual = monthlyPrice * 12;
      const discountedAnnual = totalAnnual * 0.9;
      originalPriceText = formatCurrency(totalAnnual);
      finalPriceText = formatCurrency(discountedAnnual);
      periodSuffixText = "/ano (pag. único)";
    }

    return (
      <div className="plan-card-price">
        {originalPriceText && <span className="original-price">{originalPriceText}</span>}
        <span className="final-price">{finalPriceText}</span>
        <span className="period-suffix">{periodSuffixText}</span>
      </div>
    );
  };

  return (
    <>
      <header className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
        <h1 className="main-header-title text-4xl md:text-5xl mb-3 font-bold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600">
            Nossos Planos de
          </span>{" "}
          <span className="accent-text">Automação</span>
        </h1>
        <p className="text-lg md:text-xl section-subtitle">
          Soluções inteligentes para impulsionar o futuro do seu negócio.
        </p>
      </header>

      <div className="mb-10 text-center">
        <div className="period-selector-main" id="mainPagePeriodSelector">
          <input
            type="radio"
            id="mainPeriodMonthly"
            name="mainBillingPeriod"
            value="monthly"
            checked={selectedPeriod === "monthly"}
            onChange={handlePeriodChange}
          />
          <label htmlFor="mainPeriodMonthly">Mensal</label>
          <input
            type="radio"
            id="mainPeriodSemiannual"
            name="mainBillingPeriod"
            value="semiannual"
            checked={selectedPeriod === "semiannual"}
            onChange={handlePeriodChange}
          />
          <label htmlFor="mainPeriodSemiannual">Semestral</label>
          <input
            type="radio"
            id="mainPeriodAnnual"
            name="mainBillingPeriod"
            value="annual"
            checked={selectedPeriod === "annual"}
            onChange={handlePeriodChange}
          />
          <label htmlFor="mainPeriodAnnual">Anual</label>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-center w-10/12 md-w-8/12 mx-auto">
        {mainPlansData.map((plan) => (
          <div
            key={plan.name}
            className={`plan-card p-6 md:p-8 ${
              plan.name === "BRX Custom" ? "lg:col-span-1 md:col-span-2 col-span-1" : ""
            } ${
              plan.isPopular
                ? "relative! border-3 border-[#473ee7]! shadow-lg shadow-[#473ee7]/30"
                : ""
            }`}
          >
            {plan.isPopular && (
              <div className="absolute top-10 left-1/2 transform -translate-x-1/40 -translate-y-1/12 popular-badge z-10">
                Mais Popular
              </div>
            )}
            <h2 className="plan-card-title accent-text">{plan.name}</h2>

            {plan.name === "BRX Custom" ? (
              <p
                className="plan-card-price"
                style={{ fontSize: "2rem", minHeight: "auto", justifyContent: "flex-start" }}
              >
                Monte o Seu
              </p>
            ) : (
              renderPlanPrice(plan.monthlyPrice)
            )}

            {plan.name === "BRX Custom" && <p className="plan-card-setup-note">&nbsp;</p>}

            <p
              className="plan-card-description"
              dangerouslySetInnerHTML={{ __html: plan.description }}
            ></p>
            <ul className="space-y-2 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <p
              className="plan-card-setup-note text-center"
              style={{
                display:
                  selectedPeriod === "monthly" && plan.name !== "BRX Custom" ? "block" : "none",
              }}
            >
              {plan.setupNoteDefault}
            </p>
            <button
              className="plan-button contact-trigger-button"
              onClick={() => openContactModal(plan.name)}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </section>

      <div className="decorative-line w-full max-w-7xl"></div>

      <section className="flex flex-col items-center justify-center w-10/12 md-w-8/12 mx-auto mt-10 md:mt-12 px-2">
        <h2 className="main-header-title text-3xl md:text-4xl mb-8 font-bold leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600">
            Compare Nossas
          </span>{" "}
          <span className="accent-text">Soluções de IA</span>
        </h2>

        <div className="comparison-table-container w-full max-w-6xl">
          <div className="overflow-x-auto">
            <table className="plan-table w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="w-2/5 text-start! text-white! plan-header-cell">
                    Principais Funcionalidades
                  </th>
                  <th className="text-center plan-header-cell">Starter</th>
                  <th className="text-center plan-header-cell">Boost</th>
                  <th className="text-center plan-header-cell">BRX Custom</th>
                </tr>
              </thead>
              <tbody>
                <tr className="feature-category">
                  <td colSpan={4}>Agente de IA</td>
                </tr>
                <tr>
                  <td>Nível do Agente</td>
                  <td>
                    <span className="text-xs text-gray-400 block text-center">(Silver)</span>
                  </td>
                  <td className="svg-cell-center">
                    <span className="text-xs text-gray-400 block text-center">(Gold)</span>{" "}
                  </td>
                  <td className="svg-cell-center">
                    <span className="text-xs text-gray-400 block text-center">(Personalizado)</span>
                  </td>
                </tr>
                <tr>
                  <td>Desenvolvimento de Modelos AI Customizados</td>
                  <td className="empty-cell">-</td>
                  <td className="empty-cell">-</td>
                  <td className="svg-cell-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2 -6 48 48"
                      width="48px"
                      height="22px"
                      className="mx-auto"
                    >
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
                  </td>
                </tr>
                <tr className="feature-category">
                  <td colSpan={4}>Automações</td>
                </tr>
                <tr>
                  <td>Complexidade das Automações</td>
                  <td>Baixa</td>
                  <td>Média</td>
                  <td>Conforme Escopo</td>
                </tr>
                <tr className="feature-category">
                  <td colSpan={4}>Recursos da Plataforma</td>
                </tr>
                <tr>
                  <td>Integrações</td>
                  <td>Básicas</td>
                  <td>Moderadas</td>
                  <td>Conforme Escopo</td>
                </tr>
                <tr>
                  <td>Front-end Customizados</td>
                  <td className="empty-cell">-</td>
                  <td className="svg-cell-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2 -6 48 48"
                      width="48px"
                      height="22px"
                      className="mx-auto"
                    >
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
                  </td>
                  <td>Conforme Escopo</td>
                </tr>
                <tr>
                  <td>Armazenamento de Dados</td>
                  <td>Básico (Planilha)</td>
                  <td>Estruturado (Banco de Dados)</td>
                  <td>Estruturado (Conforme Escopo)</td>
                </tr>
                <tr className="feature-category">
                  <td colSpan={4}>Acompanhamento e Suporte</td>
                </tr>
                <tr>
                  <td>Reuniões de Alinhamento</td>
                  <td>Mensal</td>
                  <td>Quinzenal</td>
                  <td>Conforme Necessidade</td>
                </tr>
                <tr>
                  <td>Suporte</td>
                  <td className="svg-cell-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2 -6 48 48"
                      width="48px"
                      height="22px"
                      className="mx-auto"
                    >
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
                  </td>
                  <td className="svg-cell-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2 -6 48 48"
                      width="48px"
                      height="22px"
                      className="mx-auto"
                    >
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
                  </td>
                  <td className="svg-cell-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="2 -6 48 48"
                      width="48px"
                      height="22px"
                      className="mx-auto"
                    >
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
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="general-notes">
          * Todos os planos incluem uma sessão inicial para diagnóstico e definição do escopo.
          <br />
          ** Setup incluso no valor para os planos Starter e Boost. Permanência mínima recomendada
          de 3 meses para contratação mensal. <br />
          *** Detalhes adicionais sobre funcionalidades específicas, limites e serviços opcionais
          serão apresentados durante a consultoria inicial.
        </p>
      </section>

      <h2 className="main-header-title text-3xl md:text-4xl mb-8 font-bold leading-tight text-center pt-26">
        <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-zinc-600">
          Entenda Nossos
        </span>{" "}
        <span className="accent-text">Componentes de IA</span>
      </h2>

      <section className="items-center w-10/12 md-w-8/12 max-w-6xl mx-auto mt-10 md:mt-16 px-2 details-section">
        <div className="detail-category">
          <h4>Níveis de Agente de IA</h4>
          <div className="detail-item">
            <strong>Nível Silver (Básico):</strong>
            <p>
              Ideal para automatizar tarefas repetitivas e simples do dia a dia, como responder
              perguntas comuns ou coletar informações iniciais de clientes. Esse agente segue um
              roteiro padrão e executa ações básicas automaticamente.
            </p>
            <span className="example-tag">
              Ex: Receber e organizar e-mails iniciais para encaminhamento correto
            </span>{" "}
            <span className="example-tag">
              Responder dúvidas frequentes sobre horários de funcionamento
            </span>
          </div>
          <div className="detail-item">
            <strong>Nível Gold (Avançado):</strong>
            <p>
              Indicado para empresas que precisam de um atendimento mais inteligente e adaptável.
              Esse agente consegue entender melhor as mensagens, decidir o que fazer com base em
              informações diversas e realizar tarefas que envolvem vários passos.
            </p>
            <span className="example-tag">
              Ex: Identificar se um cliente está interessado em um produto e encaminhá-lo para o
              setor comercial.
            </span>{" "}
            <span className="example-tag">
              Oferecer suporte técnico inicial, solucionando problemas simples sem necessidade de
              intervenção humana.
            </span>{" "}
            <span className="example-tag">
              Analisar o tom de mensagens para entender se o cliente está satisfeito ou
              insatisfeito.
            </span>
          </div>
          <div className="detail-item">
            <strong>Nível Platinum / Personalizado:</strong>
            <p>
              Soluções de inteligência artificial feitas sob medida para a sua empresa. Esses
              agentes aprendem com os dados, se adaptam com o tempo e executam tarefas complexas com
              autonomia e precisão.
            </p>
            <span className="example-tag">
              Ex: Criar um consultor virtual que sugere soluções personalizadas aos seus clientes.
            </span>{" "}
            <span className="example-tag">
              Prever comportamentos de compra com base no histórico dos clientes.
            </span>{" "}
            <span className="example-tag">
              Automatizar e otimizar processos internos complexos, como o planejamento logístico.
            </span>
          </div>
        </div>

        <div className="detail-category">
          <h4>Complexidade das Automações</h4>
          <div className="detail-item">
            <strong>Baixa Complexidade:</strong>
            <p>
              São automações diretas e repetitivas, ideais para tarefas simples e rápidas, como
              enviar mensagens automáticas ou transferir dados entre sistemas.
            </p>
            <span className="example-tag">
              Ex: Enviar alertas quando determinado evento ocorrer.
            </span>{" "}
            <span className="example-tag">Copiar informações de uma planilha para outra.</span>{" "}
            <span className="example-tag">
              Enviar automaticamente um e-mail de boas-vindas para novos clientes.
            </span>
          </div>
          <div className="detail-item">
            <strong>Média Complexidade:</strong>
            <p>
              Processos com algumas ramificações lógicas (condicionais), múltiplas etapas,
              integrações com 3-4 sistemas diferentes e tratamento básico de exceções. Podem
              envolver alguma transformação de dados.
            </p>
            <span className="example-tag">Ex: Processamento de pedidos com validação</span>{" "}
            <span className="example-tag">Geração de relatórios consolidados</span>{" "}
            <span className="example-tag">Atualização de CRM baseada em interações</span>
          </div>
          <div className="detail-item">
            <strong>Alta Complexidade / Conforme Escopo:</strong>
            <p>
              Automação mais robusta, capaz de lidar com várias situações diferentes, conectar
              diversos sistemas e realizar ajustes nos dados conforme necessário.
            </p>
            <span className="example-tag">
              Ex: Validar automaticamente um pedido antes de enviá-lo ao estoque.
            </span>{" "}
            <span className="example-tag">
              Gerar relatórios periódicos com informações de vendas.
            </span>{" "}
            <span className="example-tag">
              Atualizar o cadastro do cliente conforme ele interage com a empresa.
            </span>
          </div>
        </div>
      </section>

      {isContactModalOpen && (
        <div
          id="contactModal"
          className="fixed inset-0 bg-[#1a1a1a96] bg-opacity-50 flex items-center justify-center z-[10000] transition-opacity duration-300 ease-in-out"
        >
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg w-96 relative">
            <button
              id="closeContactModal"
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              onClick={closeContactModal}
            >
              &times;
            </button>
            <h2 className="text-xl md:text-2xl font-semibold main-header-title mb-6 text-center">
              Solicitar Orçamento para <br />
              <span className="accent-text">{selectedPlanForModal}</span>
            </h2>
            <form
              id="contactForm"
              className="space-y-4 max-w-lg mx-auto bg-[#1A1A1A] p-8 rounded-lg"
              onSubmit={handleContactFormSubmit}
            >
              <div className="flex flex-col mb-4">
                <label htmlFor="contactName" className="text-gray-300 font-semibold mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="nome"
                  placeholder="Digite seu nome"
                  className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="contactPhone" className="text-gray-300 font-semibold mb-1">
                  Telefone (com DDD)
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="telefone"
                  placeholder="Digite seu telefone"
                  className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="contactEmail" className="text-gray-300 font-semibold mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  placeholder="Digite seu e-mail"
                  className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-[rgb(80,72,229)] text-white"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                />
              </div>
              <input
                type="hidden"
                id="selectedPlanInput"
                name="plano_escolhido"
                value={selectedPlanForModal}
              />

              {formMessage && (
                <div
                  className={`contact-modal-message ${
                    formMessage.type === "success" ? "success" : "error"
                  }`}
                >
                  {formMessage.text}
                </div>
              )}

              <button
                type="submit"
                id="contactSubmitButton"
                className="w-full mt-6 bg-[#956afa] hover:bg-[#7d4fd1] transition text-white font-semibold py-3 rounded-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PricingSection;
