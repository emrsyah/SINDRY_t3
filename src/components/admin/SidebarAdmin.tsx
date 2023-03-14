import { useSession } from "next-auth/react";
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
import type { WITResponse } from "../../dataStructure";
import { useForm } from "react-hook-form";
import SidebarItem from "../SidebarItem";

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

interface MessageProps {
  message: string;
}

const SidebarAdmin = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  const {  setValue, register, handleSubmit } =
    useForm<MessageProps>();
  // console.log(sessionData?.expires)

  const getWitResponse = handleSubmit(async (data) => {
    const basePath = `/app/${sessionData?.user?.role}`;
    const q = encodeURIComponent(data.message);
    const uri = "https://api.wit.ai/message?v=20230311&q=" + q;
    const auth = "Bearer " + process.env.NEXT_PUBLIC_WIT_CLIENT_KEY;
    try {
      const response = await fetch(uri, {
        headers: {
          Authorization: auth,
        },
      });
      const data: WITResponse = await response.json();
      const witIntent = data.intents[0]?.name;
      console.log(witIntent);
      const witOutletId =
        data.entities["outlet_id:outlet_id"] === undefined
          ? "no outlet"
          : data.entities["outlet_id:outlet_id"][0]?.value.includes("outlet")
          ? data.entities["outlet_id:outlet_id"][0]?.value.split(" ")[1]
          : data.entities["outlet_id:outlet_id"][0]?.value;
      console.log(witOutletId);
      if (witIntent === "tambah_pesanan") {
        router.push(
          witOutletId === "no outlet"
            ? `${basePath}/orderan/select-outlet`
            : `${basePath}/orderan/new/${witOutletId}`
        );
      } else if (witIntent === "tambah_kustomer") {
        router.push(
          `${basePath}/pelanggan/new?oid=${
            witOutletId === "no outlet" ? "" : witOutletId
          }`
        );
      } else if (witIntent === "tambah_produk") {
        router.push(
          `${basePath}/produk/new?oid=${
            witOutletId === "no outlet" ? "" : witOutletId
          }`
        );
      } else if (witIntent === "tambah_outlet") {
        router.push(`${basePath}/outlet/new`);
      } else if (witIntent === "tambah_pengguna") {
        router.push(
          `${basePath}/pengguna/new?oid=${
            witOutletId === "no outlet" ? "" : witOutletId
          }`
        );
      } else if (witIntent === "cari_pesanan") {
        router.push(
          `${basePath}/orderan/?oid=${
            witOutletId === "no outlet" ? "" : witOutletId
          }`
        );
      }
      setValue("message", "");
    } catch (error) {
      console.error(error);
    }
  });

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
          <SidebarItem
            isAdmin={false}
            item={item}
            icon={getSidebarIcon(item.name)}
            isActive={router.pathname
              .toLowerCase()
              .includes(item.name.toLowerCase())}
            key={i}
          />
        ))}
        <div className="my-2 h-[1px] w-full bg-gray-300"></div>

        {sidebarItemsAdmin.map((item, i) => (
          <SidebarItem
            isAdmin={true}
            item={item}
            icon={getSidebarIcon(item.name)}
            isActive={router.pathname
              .toLowerCase()
              .includes(item.name.toLowerCase())}
            key={i}
          />
        ))}
      </div>
      <form onSubmit={getWitResponse}>
        <h5 className="highlight text-sm font-semibold">Sindry AI - Beta</h5>
        <input
          type="text"
          {...register("message", { required: true })}
          className="input"
          placeholder="Ask something"
        />
      </form>
    </nav>
  );
};

export default SidebarAdmin;
