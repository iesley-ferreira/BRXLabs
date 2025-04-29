import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type LeadsPorMesData = {
  mes: string; // Ex: "Jan", "Fev"
  total: number; // Total de leads no mês
  atendidos: number; // Leads que atenderam ligação
};

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderRadius: number;
  }[];
};

const LeadsPorMesChart = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/webhook/gi/leads-por-mes`)
      .then((res) => res.json())
      .then((data: LeadsPorMesData[]) => {
        const labels = data.map((item) => item.mes);
        const totalLeads = data.map((item) => item.total);
        const atendidos = data.map((item) => item.atendidos);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total de Leads",
              data: totalLeads,
              backgroundColor: "#6366f1",
              borderRadius: 5,
            },
            {
              label: "Atendimentos",
              data: atendidos,
              backgroundColor: "#10b981", // verde
              borderRadius: 5,
            },
          ],
        });
      });
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Leads por Mês e Atendimentos",
      },
    },
  };

  return (
    <div className="bg-white p-6 h-[600px] rounded shadow mt-6">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">Leads por Mês</h2>
      {chartData && <Bar data={chartData} options={chartOptions} key={JSON.stringify(chartData)} />}
    </div>
  );
};

export default LeadsPorMesChart;
