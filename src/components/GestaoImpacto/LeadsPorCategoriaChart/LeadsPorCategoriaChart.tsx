import { ArcElement, Chart as ChartJS, Colors, Legend, Tooltip, TooltipItem } from "chart.js";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

type CategoriaItem = {
  categoria: string;
  total: number;
};

export default function LeadsPorCategoriaChart() {
  const [dados, setDados] = useState<CategoriaItem[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/webhook/gi/leads-por-categoria`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDados(data);
      })
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  const totalLeads = dados.reduce((sum, item) => sum + item.total, 0);

  const chartData = {
    labels: dados.map((item) => item.categoria),
    datasets: [
      {
        label: "Leads por Categoria",
        data: dados.map((item) => item.total),
        backgroundColor: [
          "#6366f1", // indigo
          "#10b981", // green
          "#3b82f6", // blue
          "#8b5cf6", // purple
          "#9333ea", // deep purple
          "#ec4899", // pink
          "#14b8a6", // teal
          "#f59e0b", // amber
        ],
        borderColor: "#f9fafb",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#1f2937", // neutral-800
          font: {
            size: 13,
            family: "Inter, sans-serif",
            weight: "normal" as const,
          },
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"pie">) {
            const value = context.raw as number;
            const percent = ((value / totalLeads) * 100).toFixed(1);
            return `${context.label}: ${value} leads (${percent}%)`;
          },
        },
      },
      title: {
        display: true,
        text: "Leads por Categoria",
        color: "#432dd7", // Indigo-900
        font: {
          size: 20,
          family: "Inter, sans-serif",
          weight: "bold" as const,
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg w-[100%] h-[600px] shadow mt-6 max-w-3xl mx-auto">
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}
