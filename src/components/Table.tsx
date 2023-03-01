// Table.js
import React, { useEffect } from "react";
// import {
//   // UilPen,
//   // UilTrashAlt,
//   UilAngleRight,
//   UilAngleLeft,
// } from "@iconscout/react-unicons";
import { useTable, useFilters, useSortBy, usePagination } from "react-table";
import { useRouter } from "next/router";

export default function Table({
  columns,
  data,
  filterInput,
  filterColumn,
}: {
  columns: any;
  data: any;
  filterInput: string;
  filterColumn: string;
}) {
  const navigate = useRouter();

  // Table component logic and UI come here
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setFilter,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize },
  } = useTable({ columns, data }, useFilters, useSortBy, usePagination);

  useEffect(() => {
    const value = filterInput || "";
    setFilter(filterColumn, value);
  }, [filterInput]);

  const rowClickHandler = (id: number) => {
    const curPath = (navigate.pathname.split("/")[navigate.pathname.split('/').length - 1])
    navigate.push(`${curPath}/${id.toString()}`);
    // console.log(id)
  };

  return (
    <div className="fillTable">
      <table
        {...getTableProps()}
        className=" borderin w-full border-collapse overflow-auto rounded-xl bg-white text-left text-sm"
      >
        <thead className="bg-slate-100">
          {headerGroups.map((headerGroup: any, i: number) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, i: number) => (
                <th
                  key={i}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="rounded-sm p-3 font-semibold text-gray-500"
                >
                  {column.render("Header")}{" "}
                  {column.isSorted
                    ? column.isSortedDesc
                      ? //   <Icon
                        //     icon="ant-design:caret-down-filled"
                        //     className="inline"
                        //   />
                        "v"
                      : //   <Icon
                        //     icon="ant-design:caret-up-filled"
                        //     className="inline"
                        //   />
                        "^"
                    : ""}
                </th>
              ))}
              {/* <th className="font-semibold rounded-sm text-gray-500 p-2">
                Aksi
              </th> */}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr
                key={i}
                {...row.getRowProps()}
                className="cursor-pointer border-y-[1px] border-gray-300 font-medium hover:bg-indigo-50"
                onClick={() => rowClickHandler(row.original.id)}
              >
                {row.cells.map((cell: any, i: number) => {
                  return (
                    <td key={i} {...cell.getCellProps()} className="p-3">
                      {cell.render("Cell")}
                    </td>
                  );
                })}
                {/* <td className="flex items-center gap-4 p-3 text-gray-500">
                  <UilPen size="22" className="hover:text-blue-500" />
                  <UilTrashAlt size="22" className="hover:text-blue-500" />
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="paginasiNav mx-2 mt-6 mb-2 flex items-center justify-end gap-3">
        <button
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
          className={`${!canPreviousPage && "disableArrow"}`}
        >
          {/* <Icon
            icon="cil:chevron-circle-left-alt"
            width="28"
            className={`${
              !canPreviousPage
                ? "opacity-40 cursor-auto"
                : "hover:text-blue-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {/* <UilAngleLeft
            size="24"
            className={`${
              !canPreviousPage
                ? "opacity-40 cursor-auto"
                : "hover:text-blue-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {"<"}
        </button>
        <p className="font-medium text-gray-500">
          <span className="text-indigo-700">{pageIndex + 1}</span> dari{" "}
          {pageOptions.length}
        </p>
        <button
          disabled={!canNextPage}
          onClick={() => nextPage()}
          className={`${!canNextPage && "disableArrow"}`}
        >
          {/* <Icon
            icon="cil:chevron-circle-right-alt"
            width="28"
            className={`${
              !canNextPage ? "opacity-40 cursor-auto" : "hover:text-indigo-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {/* <UilAngleRight
            size="24"
            className={`${
              !canNextPage
                ? "opacity-40 cursor-auto"
                : "hover:text-indigo-600 text-gray-700"
            } cursor-pointer`}
          /> */}
          {">"}
        </button>
      </div>
    </div>
  );
}
