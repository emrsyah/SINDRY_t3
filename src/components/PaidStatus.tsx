import React from "react";
import { UilCheckCircle, UilTimesCircle } from "@iconscout/react-unicons";

const PaidStatus = ({ is_paid }: { is_paid: boolean }) => {
  return (
    <span>
      {is_paid ? (
        <span className="flex w-fit items-center gap-1 rounded bg-green-100 p-1 px-2 text-sm font-semibold text-green-500">
          <UilCheckCircle size="18" />
          <p>Dibayar</p>
        </span>
      ) : (
        <span className="flex w-fit items-center gap-1 rounded bg-red-100 p-1 px-2 text-sm font-semibold text-red-500">
          <UilTimesCircle size="18" />
          <p>Belum</p>
        </span>
      )}
    </span>
  );
};

export default PaidStatus;
