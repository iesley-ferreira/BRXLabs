import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  TooltipItem,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, Colors);

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

  const dadosOrdenados = [...dados].sort((a, b) => b.total - a.total); // ordena decrescente

  const chartData = {
    labels: dadosOrdenados.map((item) => item.categoria),
    datasets: [
      {
        label: "Leads por Categoria",
        data: dadosOrdenados.map((item) => item.total),
        backgroundColor: "#6366f1",
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"bar">) {
            const value = context.raw as number;

            return `${value} Leads`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#1f2937", // texto do eixo x
          font: {
            family: "Inter, sans-serif",
            size: 13,
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#1f2937",
          font: {
            family: "Inter, sans-serif",
            size: 13,
          },
        },
        grid: {
          color: "#e5e7eb", // gray-200
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg w-full h-auto shadow mt-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-indigo-700 mb-4 text-center">Leads por Categoria</h2>
      <div className="w-full min-h-96">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
