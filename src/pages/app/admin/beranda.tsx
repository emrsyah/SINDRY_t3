import React from "react";
import LayoutAdmin from "../../../components/LayoutAdmin";
import type { NextPageWithLayout } from "../../_app";
import type { ReactElement } from "react";
import rupiahConverter from "../../../helpers/rupiahConverter";
import { UilMoneyStack } from "@iconscout/react-unicons";
import { trpc } from "../../../utils/trpc";
import { LineChart } from "../../../components/LineChart";
import { PieChart } from "../../../components/PieChart";

const Beranda: NextPageWithLayout = () => {
  const { data: salesData } = trpc.transaction.getSalesStatistics.useQuery();
  const { data: lastTransaction, isLoading: loadingLastTxn } =
    trpc.transaction.getLast.useQuery({
      limit: 5,
    });
  const { data: topProduct } = trpc.product.getMostSold.useQuery();
  const { data: topPerOutlet } = trpc.outlet.getTopSales.useQuery();
  return (
    <div>
      <div className="flex w-full items-center justify-between gap-1">
        <h3 className="raleway text-lg font-extrabold text-indigo-800">
          Beranda
        </h3>
      </div>
      <div className="my-2 grid grid-cols-3 gap-3">
        <div className="container flex flex-row gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600">
            {/* <UilMoneyStack size="24" /> */}
            💵
          </div>
          <div>
            <p className="dashboardTitle">Total Penjualan</p>
            <h5 className="text-xl font-bold">
              {rupiahConverter(
                salesData ? (salesData._sum.total as number) : 0
              )}
            </h5>
          </div>
        </div>
        <div className="container flex flex-row gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600">
            {/* <UilMoneyStack size="24" /> */}
            📊
          </div>
          <div>
            <p className="dashboardTitle">Rata-rata Per Transaksi</p>
            <h5 className="text-xl font-bold">
              {rupiahConverter(
                Math.round(salesData ? (salesData._avg.total as number) : 0)
              )}
            </h5>
          </div>
        </div>
        <div className="container flex flex-row gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-2xl text-indigo-600">
            {/* <UilMoneyStack size="24" /> */}
            📃
          </div>
          <div>
            <p className="dashboardTitle">Total Transaksi</p>
            <h5 className="text-xl font-bold">
              {salesData ? (salesData._count as number) : 0}
            </h5>
          </div>
        </div>
        <div className="container col-span-2">
          <h3 className="raleway text-base font-semibold text-black">
            <span className="text-lg">📈</span>
            Statistik Penjualan
          </h3>
          <div>
            {loadingLastTxn ? (
              <div>Mengambil Data...</div>
            ) : (
              <LineChart submitted={lastTransaction} />
            )}
          </div>
        </div>
        <div className="container">
          <h3 className="raleway text-base font-semibold text-black">
            <span className="text-lg">📦</span>
            Produk Favorit
          </h3>
          {topProduct?.map((d, i) => (
            <div key={d.id} className="grid grid-cols-9 gap-2">
              <div className="col-span-7 flex gap-2">
                <p className="col-span-1 font-medium text-gray-500">
                  {i >= 3
                    ? i + 1
                    : i + 1 === 1
                    ? "🥇"
                    : i + 1 === 2
                    ? "🥈"
                    : "🥉"}
                </p>
                <span className="font-medium text-gray-400">|</span>
                <h5 className="col-span-6 font-medium truncate text-gray-900">
                  {d.name}
                </h5>
              </div>
              <p className="col-span-2 text-xs text-gray-500">
                Terjual{" "}
                <span className="font-medium text-gray-700">{d.sold}</span>
              </p>
            </div>
          ))}
        </div>
        <div className="col-span-3 flex gap-3">
          <div className="container">
            <h3 className="raleway text-base font-semibold text-black">
              <span className="text-lg">🏪</span>
              Penjualan Per Outlet
            </h3>
            <div className="w-96 h-96">
              <PieChart dataP={topPerOutlet} />
            </div>
          </div>
          <div className="container">
            <h3 className="raleway text-base font-semibold text-black">
              <span className="text-lg">🧺</span>
              Penjualan Per Paket
            </h3>
            <div className="w-96 h-96">
              <PieChart dataP={topPerOutlet} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Beranda;

Beranda.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
