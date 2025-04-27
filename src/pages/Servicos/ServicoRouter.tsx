import { useParams } from "react-router-dom";
import Followups from "./Followups";

export default function ServicoRouter() {
  const { path } = useParams();

  switch (path) {
    case "followups-leads-96h":
      return <Followups />;
    default:
      return <div className="text-center text-red-500 mt-10">Serviço não encontrado</div>;
  }
}
