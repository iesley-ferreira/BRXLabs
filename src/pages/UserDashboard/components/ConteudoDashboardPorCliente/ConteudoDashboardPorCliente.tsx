import React from "react";
import LeadsPorCategoriaChart from "../../../../components/GestaoImpacto/LeadsPorCategoriaChart/LeadsPorCategoriaChart";
import LeadsPorMesChart from "../../../../components/GestaoImpacto/LeadsPorMesChart/LeadsPorMesChart";
import LeadsTable from "../../../../components/GestaoImpacto/LeadsTable/LeadsTable";

type Props = {
  cliente: string;
  apiUrl: string;
  token: string;
};

const ConteudoDashboardPorCliente: React.FC<Props> = ({ cliente }: { cliente: string }) => {
  if (cliente === "Gestão Impacto") {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-10">
          <LeadsPorMesChart />
          <LeadsPorCategoriaChart />
        </div>
        <LeadsTable />
      </>
    );
  }

  if (cliente === "outro_cliente") {
    return <div>Componente específico para outro cliente</div>;
  }

  return <div>O Cliente ainda não possui dashboard.</div>;
};

export default ConteudoDashboardPorCliente;
