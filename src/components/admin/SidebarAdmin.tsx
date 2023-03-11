import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  UilEstate,
  UilClipboardNotes,
  UilTagAlt,
  UilUserSquare,
  UilStoreAlt,
  UilPlus,
  UilUsersAlt,
} from "@iconscout/react-unicons";
import Link from "next/link";
import { useRouter } from "next/router";
import SidebarProfile from "../SidebarProfile";
import type { WITResponse } from '../../dataStructure';

const sidebarItems = [
  {
    path: "/app/admin/beranda",
    name: "Beranda",
  },
  {
    path: "/app/admin/orderan",
    name: "Orderan",
  },
  {
    path: "/app/admin/produk",
    name: "Produk",
  },
  {
    path: "/app/admin/pelanggan",
    name: "Pelanggan",
  },
  {
    path: "/app/admin/outlet",
    name: "Outlet",
  },
];

const sidebarItemsAdmin = [
  {
    path: "/app/admin/pengguna",
    name: "Pengguna",
  },
];

const getSidebarIcon = (name: string) => {
  if (name == "Beranda") return <UilEstate size="20" />;
  else if (name == "Orderan") return <UilClipboardNotes size="20" />;
  else if (name == "Produk") return <UilTagAlt size="20" />;
  else if (name == "Pelanggan") return <UilUserSquare size="20" />;
  else if (name == "Outlet") return <UilStoreAlt size="20" />;
  else if (name == "Pengguna") return <UilUsersAlt size="20" />;
};

const SidebarAdmin = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState("");
  // console.log(sessionData?.expires)

  const extractLocation = () => {
    const ar = router.pathname.split("/");
    if (ar[3] === "beranda") return "Beranda";
    else if (ar[3] === "orderan") return "Orderan";
    else if (ar[3] === "produk") return "Produk";
    else if (ar[3] === "pelanggan") return "Pelanggan";
    else if (ar[3] === "outlet") return "Outlet";
    else if (ar[3] === "pengguna") return "Pengguna";
  };

  const getWitResponse = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const basePath = `/app/${sessionData?.user?.role}`
    const q = encodeURIComponent(message);
    const uri = "https://api.wit.ai/message?v=20230311&q=" + q;
    const auth = "Bearer " + process.env.NEXT_PUBLIC_WIT_CLIENT_KEY;
    try {
      const response = await fetch(uri, {
        headers: {
          Authorization: auth,
        },
      });
      const data: WITResponse = await response.json();
      const witIntent = data.intents[0]?.name
      console.log(witIntent)
      const witOutletId = data.entities["outlet_id:outlet_id"] === undefined ? "no outlet" : data.entities["outlet_id:outlet_id"][0]?.value.includes("outlet") ? data.entities["outlet_id:outlet_id"][0]?.value.split(" ")[1] : data.entities["outlet_id:outlet_id"][0]?.value
      if(witIntent === "tambah_pesanan"){
        router.push(witOutletId === "no outlet" ? `${basePath}/orderan/select-outlet` :  `${basePath}/orderan/new/${witOutletId}`)
      }
      else if(witIntent === "tambah_kustomer"){
        router.push(`${basePath}/pelanggan/new?oid=${witOutletId === "no outlet" ? "" : witOutletId}`)
      }
      else if(witIntent === "tambah_produk"){
        router.push(`${basePath}/produk/new?oid=${witOutletId === "no outlet" ? "" : witOutletId}`)
      }
      else if(witIntent === "tambah_outlet"){
        router.push(`${basePath}/outlet/new`)
      }
      setMessage("")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className="sticky top-0 flex h-screen flex-col gap-4 border-r-[1.3px] bg-gray-50 p-6 pt-7">
      <SidebarProfile
        email={sessionData?.user?.email as string}
        role={sessionData?.user?.role as "admin" | "owner" | "cashier"}
      />
      <Link
        href={"orderan/select-outlet"}
        className="btn-primary flex items-center justify-center gap-1 rounded-md"
      >
        Buat Transaksi
        <UilPlus size="20" />
      </Link>
      <div className="flex flex-grow flex-col gap-1">
        {sidebarItems.map((item, i) => (
          <Link
            href={item.path}
            className={`flex items-center gap-3 rounded p-2 text-sm font-medium text-gray-500 hover:bg-gray-100 ${
              extractLocation() === item.name
                ? "bg-purple-100 !text-indigo-600 hover:bg-purple-100"
                : ""
            }`}
            key={i}
          >
            <div
              className={`text-gray-500 
            ${extractLocation() === item.name ? " !text-indigo-600" : ""}
            `}
            >
              {getSidebarIcon(item.name)}
            </div>
            <p>{item.name}</p>
          </Link>
        ))}
        <div className="my-2 h-[1px] w-full bg-gray-300"></div>

        {sidebarItemsAdmin.map((item, i) => (
          <Link
            href={item.path}
            className={`flex items-center gap-3 rounded p-2 text-sm font-medium text-gray-500 hover:bg-gray-100 ${
              extractLocation() === item.name
                ? "bg-purple-100 !text-indigo-600 hover:bg-purple-100"
                : ""
            }`}
            key={i}
          >
            <div
              className={`text-gray-500 
            ${extractLocation() === item.name ? " !text-indigo-600" : ""}
            `}
            >
              {getSidebarIcon(item.name)}
            </div>
            <p>{item.name}</p>
            <p className="rounded bg-indigo-500 py-1 px-2 text-xs text-white">
              Admin✨
            </p>
          </Link>
        ))}
      </div>
      <form onSubmit={getWitResponse}>
        <h5 className="highlight text-sm font-semibold">Sindry AI - Beta</h5>
        <input
          type="text"
          value={message}
          onChange={(ev)=>setMessage(ev.target.value)}
          className="input"
          placeholder="Ask AI to do something"
        />
      </form>
    </nav>
  );
};

export default SidebarAdmin;
