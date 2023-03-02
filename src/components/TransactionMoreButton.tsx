import { Menu } from "@headlessui/react";
import React from "react";
import { UilEllipsisV, UilTrashAlt, UilPrint } from "@iconscout/react-unicons";

function TransactionMoreButton({setIsOpen}) {
  return (
    <Menu className="relative" as="div">
      <Menu.Button className="btn-secondary gap-2 rounded p-2">
        <UilEllipsisV size="20" />
      </Menu.Button>
      <Menu.Items className="shadowProfile absolute right-0 z-10 mt-1 flex w-36 flex-col gap-[2px] rounded border-[1px] border-gray-300 bg-white p-1 text-sm font-medium">
        <Menu.Item>
          {({ active }) => (
            <button
              className={` flex gap-2 px-3 py-[6px]  ${
                active && "bg-gray-100"
              }`}
            //   onClick={() => setShowModal(true)}
            >
              <UilPrint size="18" />
              <p className="font-medium">Cetak Struk</p>
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={` flex gap-2 px-3 py-[6px]  ${
                active && "bg-gray-100 text-red-500"
              }`}
                onClick={()=>setIsOpen(true)}
            >
              <UilTrashAlt size="18" />
              <p className="font-medium">Hapus</p>
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export default TransactionMoreButton;
