import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { generateRandomRGBAArrays } from "../helpers/colorGenerator";
// import { ProductDashboard } from "../pages/app/admin/Beranda";

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({ dataP }: { dataP: any }) {
  const [opaqueColors, translucentColors] = generateRandomRGBAArrays(dataP.length, 0.3);
//   console.log(dataP)
  const fiveFirst = dataP.slice(0, 5)
  const arrayLabels = fiveFirst.filter(d => d.total_sales > 0).map(d=>d.name)
  const arrayDatas = fiveFirst.filter(d => d.total_sales > 0).map(d=>d.total_sales)
  const data = {
    labels: arrayLabels,
    datasets: [
      {
        label: "Jumlah Penjualan",
        data: arrayDatas,
        backgroundColor: ["rgb(224 231 255)", "rgb(220 252 231)", "rgb(224 242 254)","rgb(252 231 243)", "rgb(255 237 213)"],
        borderColor: ["rgb(99 102 241)", "rgb(34 197 94)", "rgb(14 165 233)", "rgb(236 72 153)", "rgb(249 115 22)"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    // aspectRat
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        align: "center",
      },
    },
  };
  return <Pie data={data} options={options} />;
}
