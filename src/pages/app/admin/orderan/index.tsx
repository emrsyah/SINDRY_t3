import React, { useState, useMemo } from "react";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../../../_app";
import { UilPlus, UilTimesCircle, UilCheckCircle } from "@iconscout/react-unicons";
import { trpc } from "../../../../utils/trpc";
import dayjs from "dayjs";
import Table from "../../../../components/Table";
import EmptyTable from "../../../../components/EmptyTable";
import Link from "next/link";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import transactionStatusConverter from "../../../../helpers/transactionStatusConverter";
import PaidStatus from "../../../../components/PaidStatus";
import ProductType from "../../../../components/ProductTypeStatus";

const Index: NextPageWithLayout = () => {
  const [filterInput, setFilterInput] = useState<string>("");

  const { data, isLoading, isError } = trpc.transaction.getAll.useQuery();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };


  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <>#{value}</>
        ),
      },
      {
        Header: "Tanggal",
        accessor: "created_at",
        Cell: ({ cell: { value } }: { cell: { value: Date } }) => (
          <>{dayjs(value).format("DD MMM")}</>
        ),
        // Cell: ({ cell: { value } }: { cell: { value: "kiloan" | "bed_cover" | "selimut" | "kaos" | "lainnya" } }) => (
        //   <span className={`${value === "bed_cover" ? "bcType" : value === "kaos" ? "kType" : value === "kiloan" ? "klType" : value === "selimut" ? "sType" : "lType"}`}>{(value)}</span>
        // ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }: { cell: { value: "on_process" | "finished" | "picked_up" | "new" } }) => (
          <ProductType status={value} />
        ),
      },
      {
        Header: "Pelanggan",
        accessor: "customers.name",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <span className="">{value}</span>
        ),
      },
      {
        Header: "Bayar",
        accessor: "is_paid",
        Cell: ({ cell: { value } }: { cell: { value: boolean } }) => (
          <PaidStatus is_paid={value} />
        ),
      },
      {
        Header: "Outlet",
        accessor: "outlets.name",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <span className="font-semibold text-indigo-500">{(value)}</span>
        ),
      },
      {
        Header: "Total",
        accessor: "total",
        Cell: ({ cell: { value } }: { cell: { value: number } }) => (
          <span className="">{rupiahConverter(value)}</span>
        ),
      },
    ],
    []
  );

  return (
    <div>
      <div className="flex w-full items-center justify-between gap-1">
        <h3 className="text-lg raleway font-extrabold text-indigo-800">
          Atur Orderan{" "}
          <span className="text-base font-medium text-gray-500">
            ({data?.length})
          </span>
        </h3>
        <Link
          href={"orderan/select-outlet"}
          className="btn-primary rounded px-3 font-semibold"
        >
          <UilPlus size="20" /> Tambah Orderan
        </Link>
      </div>
      <div className="my-3">
        <input
          type="text"
          placeholder="Cari Dengan Nama"
          onChange={handleFilterChange}
          value={filterInput}
          className="input mt-4 mb-2 w-full border-gray-300 text-sm focus:border-indigo-500"
        />
        {isLoading ? (
          <EmptyTable status="loading" columns={columns} />
        ) : data?.length ? (
          <Table
            columns={columns}
            data={data}
            filterColumn="id"
            filterInput={filterInput}
          />
        ) : (
          <EmptyTable status="empty" columns={columns} />
        )}
      </div>
    </div>
  );
};

export default Index;

Index.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
