import Link from "next/link";
import React from "react";

export interface sidebarItemProps {
  path: string;
  name: string;
}
const SidebarItem = ({
  item,
  icon,
  isActive,
  isAdmin = false,
}: {
  item: sidebarItemProps;
  icon: JSX.Element | undefined;
  isActive: boolean;
  isAdmin: boolean;
}) => {
  return (
    <Link
      href={item.path}
      className={`flex items-center gap-3 rounded p-2 text-sm font-medium text-gray-500 hover:bg-gray-100 ${
        isActive ? "bg-purple-100 !text-indigo-600 hover:bg-purple-100" : ""
      }`}
    >
      <div
        className={`text-gray-500 
    ${isActive ? " !text-indigo-600" : ""}
    `}
      >
        {icon}
      </div>
      <p>{item.name}</p>
      {isAdmin ? (
        <p className="rounded bg-indigo-500 py-1 px-2 text-xs text-white">
          Admin✨
        </p>
      ) : null}
    </Link>
  );
};

export default SidebarItem;
