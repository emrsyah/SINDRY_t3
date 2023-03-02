import React from "react";
import transactionStatusConverter from '../helpers/transactionStatusConverter';

const ProductTypeStatus = ({status} : {status: "new" | "on_process" | "finished" | "picked_up"}) => {
  return (
    <span
      className={`${
        status === "new"
          ? "lType"
          : status === "on_process"
          ? "kType"
          : status === "finished"
          ? "sType"
          : status === "picked_up"
          ? "bcType"
          : ""
      }`}
    >
      {transactionStatusConverter(status)}
    </span>
  );
};

export default ProductTypeStatus;
