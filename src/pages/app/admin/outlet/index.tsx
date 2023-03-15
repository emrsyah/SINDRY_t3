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
import { CSVLink } from 'react-csv';
import getHeaderCsv from '../../../../helpers/getHeaderCsv';

const Index: NextPageWithLayout = () => {
  const [filterInput, setFilterInput] = useState<string>("");

  const { data, isLoading, isError } = trpc.outlet.getAll.useQuery();

  // console.log(data);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value || "";
    setFilterInput(value);
  };

  // const dataMemo = useMemo(() => outlets, [outlets]);

  const columns = useMemo(
    () => [
      {
        Header: "Nama",
        accessor: "name",
      },
      {
        Header: "Lokasi",
        accessor: "address",
      },
      {
        Header: "Kontak",
        accessor: "contact",
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
          Atur Outlet{" "}
          <span className="text-base font-medium text-gray-500">
            ({data?.length ? data.length : 0})
          </span>
        </h3>
        <Link href={'outlet/new'} className="btn-primary rounded px-3 font-semibold">
          <UilPlus size="20" /> Tambah Outlet
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
              filename={`Laporan Outlet Laundry | Admin | ${dayjs().format("MMM DD YYYY")}`}
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
