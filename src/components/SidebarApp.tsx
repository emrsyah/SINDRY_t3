import { useSession } from "next-auth/react";
import { UilPlus } from "@iconscout/react-unicons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import type { sidebarItemProps } from "./SidebarItem";
import type { WITResponse } from "../dataStructure";
import SidebarProfile from "./SidebarProfile";
import SidebarItem from "./SidebarItem";

interface MessageProps {
  message: string;
}

const SidebarApp = ({
  items,
  iconGetter,
}: {
  items: sidebarItemProps[];
  iconGetter: (name: string) => JSX.Element | undefined;
}) => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const { oid } = router.query;

  const { setValue, register, handleSubmit } = useForm<MessageProps>();
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
      // const witOutletId =
      //   data.entities["outlet_id:outlet_id"] === undefined
      //     ? "no outlet"
      //     : data.entities["outlet_id:outlet_id"][0]?.value.includes("outlet")
      //     ? data.entities["outlet_id:outlet_id"][0]?.value.split(" ")[1]
      //     : data.entities["outlet_id:outlet_id"][0]?.value;
      if (witIntent === "tambah_pesanan") {
        router.push(`/${basePath}/${oid}/orderan/new`);
        // console.log(basePath)
      } else if (witIntent === "tambah_kustomer") {
        router.push(`/${basePath}/${oid}/pelanggan/new`);
      } else if (witIntent === "cari_pesanan") {
        router.push(`/${basePath}/${oid}/orderan`);
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
        href={"orderan/new"}
        as={`/app/cashier/${oid}/orderan/new`}
        className="btn-primary flex items-center justify-center gap-1 rounded-md"
      >
        Buat Transaksi
        <UilPlus size="20" />
      </Link>
      <div className="flex flex-grow flex-col gap-1">
        {items.map((item, i) => (
          <SidebarItem
            isAdmin={false}
            item={item}
            icon={iconGetter(item.name)}
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

export default SidebarApp;
