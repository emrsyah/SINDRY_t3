import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
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
import { useRouter } from 'next/router';

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
    path: "/app/a/pengguna",
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
  const router = useRouter()

  useEffect(() => {
    // console.log(sessionData)
    // console.log(status)
  }, [sessionData, status]);

  const extractLocation = () => {
    const ar = router.pathname.split("/");
    if (ar[3] === "beranda") return "Beranda";
    else if (ar[3] === "orderan") return "Orderan";
    else if (ar[3] === "produk") return "Produk";
    else if (ar[3] === "pelanggan") return "Pelanggan";
    else if (ar[3] === "outlet") return "Outlet";
    else if (ar[3] === "pengguna") return "Pengguna";
  };

  return (
    <nav className="flex h-full flex-col gap-4 border-r-[1.3px] bg-gray-50 p-6 pt-7">
      <div className="flex items-center gap-3">
        <Image
          src={
            "https://avatars.dicebear.com/api/adventurer-neutral/your-custom-seed.svg"
          }
          alt="profile"
          width={36}
          height={36}
          className="rounded-full"
        />
        <div className="">
          <h5 className="text-sm font-semibold">{sessionData?.user?.email}</h5>
          <p className="text-xs font-medium text-gray-400">
            {sessionData?.user?.role}
          </p>
        </div>
      </div>
      <button className="btn-primary flex items-center justify-center gap-1 rounded-md">
        Buat Transaksi
        <UilPlus size="20" />
      </button>
      <div className="flex flex-col gap-1">
        {sidebarItems.map((item, i) => (
          <Link
            href={item.path}
            className={`flex items-center gap-3 rounded p-2 font-medium text-gray-500 hover:bg-gray-100 ${
              extractLocation() === item.name
                ? "bg-purple-100 hover:bg-purple-100 !text-indigo-600"
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
            className={`flex items-center gap-3 rounded p-2 font-medium text-gray-500 hover:bg-gray-100 ${
              extractLocation() === item.name
                ? "bg-purple-100 hover:bg-purple-100 !text-indigo-600"
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
            <p className="bg-indigo-500 text-xs py-1 px-2 rounded text-white">Admin✨</p>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SidebarAdmin;
