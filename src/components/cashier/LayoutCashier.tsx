import React from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SidebarApp from "../SidebarApp";
import {
  UilEstate,
  UilClipboardNotes,
  UilUserSquare,
} from "@iconscout/react-unicons";

interface Props {
  children: React.ReactNode;
}


const getSidebarIcon = (name: string) => {
  if (name == "Beranda") return <UilEstate size="20" />;
  else if (name == "Orderan") return <UilClipboardNotes size="20" />;
  else if (name == "Pelanggan") return <UilUserSquare size="20" />;
};

const LayoutCashier = ({ children }: Props) => {
  const { data, status } = useSession();
  const route = useRouter();
  const { oid } = route.query;

  const sidebarItems = [
    {
      path: `/app/cashier/${oid as string}/beranda`,
      name: `Beranda`,
    },
    {
      path: `/app/cashier/${oid as string}/orderan`,
      name: `Orderan`,
    },
    {
      path: `/app/cashier/${oid as string}/pelanggan`,
      name: `Pelanggan`,
    },
  ];

  useEffect(() => {
    if (status === "unauthenticated" || data?.user?.role !== "cashier") {
      route.replace("/");
    }
  }, []);

  return (
    <div className="grid min-h-screen grid-cols-[252px_1fr]">
      <nav>
        {/* <SidebarAdmin /> */}
        <SidebarApp items={sidebarItems} iconGetter={getSidebarIcon} />
      </nav>
      <main className="m-8">{children}</main>
    </div>
  );
};

export default LayoutCashier;
