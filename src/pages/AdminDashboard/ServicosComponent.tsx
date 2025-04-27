type Servico = {
  id: number;
  nome: string;
};

type ServicosComponentProps = {
  servicos: Servico[];
};

export default function ServicosComponent({ servicos }: ServicosComponentProps) {
  return (
    <ul>
      {servicos.map((servico) => (
        <li key={servico.id}>{servico.nome}</li>
      ))}
    </ul>
  );
}
