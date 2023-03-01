import React from "react";

function EmptyTable({ columns, status } : {columns :any, status: "loading" | "empty" }) {
  return (
    <div className="borderin my-2 rounded-md">
      <table className="  border-collapse rounded-2xl bg-white text-sm w-full text-left">
        <thead className="bg-slate-100 border-b-[1px] border-b-gray-300">
          <tr>
            {columns.map((col: any, i: number) => (
              <th
                className="font-semibold rounded-sm text-gray-500 p-3"
                key={i}
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <p className="text-sm text-center text-gray-600 py-3 font-medium">{status === "loading" ? "Mengambil Data..." : "Belum Ada Data"}</p>
    </div>
  );
}

export default EmptyTable;
