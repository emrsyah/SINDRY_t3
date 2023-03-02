import React from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../../components/LayoutAdmin";
import type { NextPageWithLayout } from "../../../../_app";
import BreadCrumbs from "../../../../../components/BreadCrumbs";

const OrderanNew: NextPageWithLayout = () => {
  const router = useRouter();
  const { oid } = router.query;
  const breadItems = [
    {
      name: "Orderan",
      path: `/app/admin/orderan`,
    },
    {
      name: "Pilih Outlet",
      path: `/app/admin/orderan/select-outlet`,
    },
    {
      name: "Orderan Baru",
      path: `/app/admin/orderan/new/${oid}`,
    },
  ];

  return (
    <>
      <BreadCrumbs items={breadItems} />
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Orderan Baru</h3>
          {/* <div className="flex items-center gap-2">
            <button className="btn-primary gap-2 rounded px-3">
              Edit Pesanan <UilEditAlt size="20" />
            </button>
            <TransactionMoreButton setIsOpen={setIsOpen} />
          </div> */}
        </div>
        <div className="my-3 grid grid-cols-[1fr_35%] gap-5">
          {/* Sisi Kiri */}
          <div>
            <div className="container">
              <h3 className="raleway text-indigo-600 text-base font-bold">
                Informasi Pelanggan
              </h3>
            </div>
          </div>

          {/* Sisi Kanan */}
          <div className="container">
            <h3 className="raleway text-indigo-600 text-base font-bold">Rincian Pesanan</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderanNew;

OrderanNew.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
