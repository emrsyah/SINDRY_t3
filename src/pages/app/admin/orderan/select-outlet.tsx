import React from "react";
import LayoutAdmin from "../../../../components/admin/LayoutAdmin";
import type { NextPageWithLayout } from "../../../_app";
import { trpc } from "../../../../utils/trpc";
import { UilStoreAlt } from "@iconscout/react-unicons";
import empty from '../../../../../public/empty_outlet.svg'
import Image from 'next/image';
import Link from "next/link";

const SelectOutlet: NextPageWithLayout = () => {
  const { data: outlet, isLoading } = trpc.outlet.getAll.useQuery();
  return (
    <div>
      <h3 className="raleway text-xl font-bold">Pilih Outlet</h3>
      <div className="my-3 grid grid-cols-3 gap-3">
        {isLoading ? (
          <div className="col-span-3">Loading...</div>
        ) : outlet?.length === 0 ? (
          <div className=" flex flex-col items-center justify-center gap-1 col-span-3">
            <Image src={empty} width={280} height={280} alt="Empty Placeholder" />
            <h3 className="text-2xl font-bold text-gray-900 raleway">Belum Ada Outlet</h3>
            <p className="font-medium text-sm tracking-wide text-gray-600">Silahkan tambahkan outlet terlebih dahulu</p>
            <Link href="/app/admin/outlet/new" className="btn-primary rounded mt-4">Tambah Outlet</Link>
          </div>
        ) : (
          outlet?.map((d, i) => (
            <Link
              href={`new/${d.id}`}
              key={d.id}
              className="flex items-center gap-3 rounded-md p-2 shadow transition-all hover:-translate-y-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-indigo-500 bg-indigo-100 text-indigo-500">
                <UilStoreAlt size="20" />
              </div>
              <div className="flex flex-col items-start">
                <h5 className="font-medium text-gray-800">{d.name}</h5>
                <p className="text-sm font-medium text-indigo-400">
                  {d.address}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectOutlet;

SelectOutlet.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
