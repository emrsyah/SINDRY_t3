import React, { useState, useMemo } from "react";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../../../../_app";
import { UilPlus, UilImport } from "@iconscout/react-unicons";
import { trpc } from "../../../../../utils/trpc";
import dayjs from "dayjs";
import Table from "../../../../../components/Table";
import EmptyTable from "../../../../../components/EmptyTable";
import Link from "next/link";
import rupiahConverter from "../../../../../helpers/rupiahConverter";
import PaidStatus from "../../../../../components/PaidStatus";
import ProductType from "../../../../../components/ProductTypeStatus";
import LayoutCashier from "../../../../../components/cashier/LayoutCashier";
import { useRouter } from "next/router";
import getHeaderCsv from '../../../../../helpers/getHeaderCsv';
import { CSVLink } from 'react-csv';

const Index: NextPageWithLayout = () => {
  const [filterInput, setFilterInput] = useState<string>("");
  const router = useRouter();
  const { oid } = router.query;

  const { data, isLoading, isError } = trpc.transaction.getByOutlet.useQuery({
    outlet_id: parseInt(oid as string),
  });

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
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({
          cell: { value },
        }: {
          cell: { value: "on_process" | "finished" | "picked_up" | "new" };
        }) => <ProductType status={value} />,
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
          <span className="font-semibold text-indigo-500">{value}</span>
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
        <h3 className="raleway text-lg font-extrabold text-indigo-800">
          Atur Orderan{" "}
          <span className="text-base font-medium text-gray-500">
            ({data?.length ? data.length : 0})
          </span>
        </h3>
        <Link
          href={"orderan/new"}
          as={`${router.asPath}/new`}
          className="btn-primary rounded px-3 font-semibold"
        >
          <UilPlus size="20" /> Tambah Orderan
        </Link>
      </div>
      <div className="my-3">
        <div className="mt-4  mb-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari Dengan Nama"
            onChange={handleFilterChange}
            value={filterInput}
            className="input  flex-grow border-gray-300 text-sm focus:border-indigo-500"
          />
          {isLoading ? (
            <UilImport size="18" />
          ) : (
            <CSVLink
              data={data}
              headers={getHeaderCsv(columns)}
              filename={`Laporan Orderan Laundry | Kasir | ${dayjs().format(
                "MMM DD YYYY"
              )}`}
              className="btn-secondary h-fit rounded py-2 px-3 font-medium"
            >
              <UilImport size="18" />
            </CSVLink>
          )}
        </div>
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
  return <LayoutCashier>{page}</LayoutCashier>;
};
