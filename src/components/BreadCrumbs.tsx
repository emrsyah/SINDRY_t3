import React from "react";
import { UilAngleRight } from "@iconscout/react-unicons";
import Link from "next/link";

type breadProps = {
    name: string;
    path: string;
}

const BreadCrumbs = ({ items } : {items: breadProps[]}) => {
  return (
    <div className="flex text-sm items-center mb-2 gap-[1.2px] bg-gray-100 py-1 px-2 rounded w-fit">
      {items.map((item, i: number) => (
        <>
          <Link
            key={item.path}
            href={item.path}
            className={`font-medium ${
              items.length - 1 === i
                ? "text-indigo-500 !font-semibold"
                : "text-gray-600"
            }`}
          >
            {item.name}
          </Link>
          {items.length - 1 !== i && (
            <UilAngleRight size="16" className="text-gray-600" />
          )}
        </>
      ))}
    </div>
  );
};

export default BreadCrumbs;
