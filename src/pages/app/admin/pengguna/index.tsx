import React, { useState, useMemo } from "react";
import LayoutAdmin from "../../../../components/admin/LayoutAdmin";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../../../_app";
import { UilPlus, UilImport } from "@iconscout/react-unicons";
import { trpc } from "../../../../utils/trpc";
import dayjs from "dayjs";
import Table from "../../../../components/Table";
import EmptyTable from "../../../../components/EmptyTable";
import Link from "next/link";
import getHeaderCsv from '../../../../helpers/getHeaderCsv';
import { CSVLink } from 'react-csv';

const Index: NextPageWithLayout = () => {
  const [filterInput, setFilterInput] = useState<string>("");

  const { data, isLoading, isError } = trpc.user.getAll.useQuery();


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nama",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <span className={`${value === "admin" ? "klType" : value === "owner" ? "sType" : "kType"}`}>{value}</span>
          ),
      },
      {
        Header: "Outlet",
        accessor: "outlets.name",
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <span className="text-indigo-500 font-semibold">{value}</span>
        ),
      },
      {
        Header: "Ditambahkan Pada",
        accessor: "created_at",
        Cell: ({ cell: { value } }: { cell: { value: Date } }) => (
          <>{dayjs(value).format("DD MMM")}</>
        ),
      },
    ],
    []
  );
  
  return (
    <div>
      <div className="flex w-full items-center justify-between gap-1">
        <h3 className="text-lg raleway font-extrabold text-indigo-800">
          Atur Pengguna{" "}
          <span className="text-base font-medium text-gray-500">
          ({data?.length ? data.length : 0})
          </span>
        </h3>
        <Link href={'pengguna/new'} className="btn-primary rounded px-3 font-semibold">
          <UilPlus size="20" /> Tambah Pengguna
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
              filename={`Laporan Pengguna Laundry | Admin | ${dayjs().format("MMM DD YYYY")}`}
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
            filterColumn="name"
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
