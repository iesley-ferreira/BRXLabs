import React from "react";
import LeadsTable from "../../../../components/GestaoImpacto/LeadsTable/LeadsTable";

type Props = {
  cliente: string;
  apiUrl: string;
  token: string;
};

const ConteudoDashboardPorCliente: React.FC<Props> = ({ cliente }: { cliente: string }) => {
  if (cliente === "Gestão Impacto") {
    return <LeadsTable />;
  }

  if (cliente === "outro_cliente") {
    return <div>Componente específico para outro cliente</div>;
  }

  return <div>O Cliente ainda não possui dashboard.</div>;
};

export default ConteudoDashboardPorCliente;
