import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Line } from "react-chartjs-2";
  import type { TransactionListType } from "../dataStructure";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export function LineChart({ submitted }: { submitted: TransactionListType }) {
    const firstFive = submitted;
    const arrayScore = firstFive?.map((item) => item.total);
    const arrayLabel = firstFive?.map((item) => {
      return `Transaksi ${item.id}`;
    });
    //   const min = arrayScore?.reduce((a: number, b:number) => Math.min(a, b));
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        // title: {
        //   display: true,
        //   text: "Chart.js Line Chart",
        // },
      },
      scales: {
        y: {
          min: 0,
          // max: 100,
        },
      },
    };
    const data = {
      labels: arrayLabel?.reverse(),
      datasets: [
        {
          label: "Transaksi",
          data: arrayScore.reverse(),
          borderColor: "#646cff",
          backgroundColor: "rgba(147, 51, 234, 0.4)",
        },
      ],
    };
    return <Line options={options} data={data} className="text-pur" />;
  }
  