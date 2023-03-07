import { Menu } from "@headlessui/react";
import React from "react";
import { UilEllipsisV, UilTrashAlt, UilKeyholeCircle } from "@iconscout/react-unicons";

function UserMoreButton({setIsOpen, setIsOpenReset} : {setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, setIsOpenReset: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <Menu className="relative" as="div">
      <Menu.Button className="btn-secondary gap-2 rounded p-2">
        <UilEllipsisV size="20" />
      </Menu.Button>
      <Menu.Items className="shadowProfile absolute right-0 z-10 mt-1 flex w-40 flex-col gap-[2px] rounded border-[1px] border-gray-300 bg-white p-1 text-sm font-medium">
        <Menu.Item>
          {({ active }) => (
            <button
              className={` flex gap-2 px-2 py-[6px]  ${
                active && "bg-gray-100"
              }`}
              onClick={() => setIsOpenReset(true)}
            >
              <UilKeyholeCircle  size="18" />
              <p className="font-medium">Ubah Password</p>
            </button>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button
              className={` flex gap-2 px-2 py-[6px]  ${
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

export default UserMoreButton;
