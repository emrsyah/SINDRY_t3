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
        backgroundColor: translucentColors,
        borderColor: opaqueColors,
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
      // title: {
      //   display: true,
      //   text: "Chart.js Line Chart",
      // },
    },
  };
  return <Pie data={data} options={options} />;
}
