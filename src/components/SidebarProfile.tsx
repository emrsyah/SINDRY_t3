import { Menu } from "@headlessui/react";
import React from "react";
import { UilSignout } from "@iconscout/react-unicons";
import Image from "next/image";

function SidebarProfile({
  email,
  role,
}: {
  email: string;
  role: "admin" | "owner" | "cashier";
}) {
  return (
    <Menu className="relative" as="div">
      <Menu.Button className="flex p-2 rounded-md hover:bg-slate-100 w-full items-center gap-3">
        <Image
          src={`https://avatars.dicebear.com/api/adventurer-neutral/${email}.svg`}
          alt="profile"
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="flex flex-col items-start">
          <h5 className="text-sm font-semibold">{email}</h5>
          <p className="text-xs font-medium text-gray-400">{role}</p>
        </div>
      </Menu.Button>
      <Menu.Items className="shadowProfile absolute left-0 z-10 mt-1 flex w-36 flex-col gap-[2px] rounded border-[1px] border-gray-300 bg-white p-1 text-sm font-medium">
        <Menu.Item>
          {({ active }) => (
            <button
              className={` flex gap-2 px-3 items-center py-[6px]  ${
                active && "bg-gray-100  text-sm text-red-500"
              }`}
              // onClick={() => setIsOpen(true)}
            >
              <UilSignout  size="16" />
              <p className="font-medium">Log Out</p>
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}

export default SidebarProfile;
