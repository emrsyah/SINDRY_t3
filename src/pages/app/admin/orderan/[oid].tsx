import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/admin/LayoutAdmin";
import type { ReactElement } from "react";
import { useEffect } from "react";
import type { NextPageWithLayout } from "../../../_app";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import type { Outlet, ProductType, Product } from "../../../../dataStructure";
import { productTypeOptions } from "../../../../dataStructure";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { UilEditAlt } from "@iconscout/react-unicons";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import BreadCrumbs from "../../../../components/BreadCrumbs";
import rupiahConverter from "../../../../helpers/rupiahConverter";
import transactionStatusConverter from "../../../../helpers/transactionStatusConverter";
import PaidStatus from "../../../../components/PaidStatus";
import ProductTypeStatus from "../../../../components/ProductTypeStatus";
import Link from "next/link";
import TransactionMoreButton from "../../../../components/TransactionMoreButton";

interface OutletSelectFriendly extends Outlet {
  value: number;
  label: string;
}

const OrderanDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { oid } = router.query;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const breadItems = [
    {
      name: "Orderan",
      path: `/app/admin/orderan`,
    },
    {
      name: "Detail Orderan",
      path: `/app/admin/orderan/${oid}`,
    },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Product>();

  const getChangePath = (newPath: string, newId: string) => {
    return router.asPath
      .replace("orderan", newPath)
      .replace(oid as string, newId);
  };

  const [selectedType, setSelectedType] = useState<ProductType>();
  const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectFriendly>();
  const [outlets, setOutlets] = useState<OutletSelectFriendly[]>([]);

  const { data, isLoading, isError } = trpc.product.getById.useQuery(
    {
      id: parseInt(oid as string),
    },
    {
      onSuccess: (data) => {
        setValue("name", data?.name as string);
        setValue("price", data?.price as number);
        const localSelectedType = productTypeOptions.find(
          (d) => d.value === data?.type
        );
        setSelectedType(localSelectedType as ProductType);
      },
      onError: (err) => {
        toast.error("Terjadi Kesalahan");
        console.error(err);
        router.back();
      },
    }
  );

  const {
    data: outletsD,
    isLoading: loadingOutlets,
    isError: errorOutlets,
  } = trpc.outlet.getAll.useQuery(undefined, {
    onSuccess: (dataP) => {
      const dataSelectFriendly = dataP.map((d) => {
        return {
          ...d,
          value: d.id,
          label: d.name,
        };
      });
      setOutlets(dataSelectFriendly as OutletSelectFriendly[]);
    },
  });

  const { data: transactions, isLoading: loadingTxn } =
    trpc.transaction.getById.useQuery({
      id: parseInt(oid as string),
    });
  //   console.log(transactions);

  useEffect(() => {
    if (isLoading || loadingOutlets) return;
    const localSelectedOutlet = outlets.find((d) => d.id === data?.outlet_id);
    setSelectedOutlet(localSelectedOutlet);
  }, [selectedType, outlets]);

  return (
    <>
      <DeleteConfirmationModal
        isOpen={isOpen}
        type="orderan"
        setIsOpen={setIsOpen}
        id={parseInt(oid as string)}
      />
      <BreadCrumbs items={breadItems} />
      {loadingTxn ? (
        <div>loading...</div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">Detail Orderan</h3>
            <div className="flex items-center gap-2">
              <Link
                href={`edit/${oid}`}
                className="btn-primary gap-2 rounded px-3"
              >
                Edit Pesanan <UilEditAlt size="20" />
              </Link>
              <TransactionMoreButton setIsOpen={setIsOpen} />
            </div>
          </div>
          <div className="my-6 flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-md py-3 px-5 shadow">
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold uppercase text-indigo-500">
                  #{transactions?.invoice_code}
                </h3>
                <p className="text-sm font-medium text-gray-600">
                  {dayjs(transactions?.created_at).format("DD MMM YYYY")}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <h3 className="text-lg font-bold">
                  {rupiahConverter(transactions?.total as number)}
                </h3>
                <p
                  className={`stat ${
                    transactions?.status === "new"
                      ? "lType"
                      : transactions?.status === "on_process"
                      ? "kType"
                      : transactions?.status === "finished"
                      ? "sType"
                      : transactions?.status === "picked_up"
                      ? "bcType"
                      : ""
                  }`}
                >
                  {transactionStatusConverter(
                    transactions?.status as
                      | "new"
                      | "on_process"
                      | "finished"
                      | "picked_up"
                  )}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-[1fr_40%] gap-3">
              <div className="container">
                <h3 className="raleway mb-1 text-base font-bold">
                  Detail Pesanan
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Kode Pesanan</p>
                  <h5 className="font-medium uppercase">
                    #{transactions?.invoice_code}
                  </h5>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Tanggal Pemesanan</p>
                  <h5 className="font-medium">
                    {dayjs(transactions?.created_at).format("DD MMM YYYY")}
                  </h5>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Status</p>
                  <div className="!text-xs">
                    <ProductTypeStatus
                      status={
                        transactions?.status as
                          | "on_process"
                          | "finished"
                          | "picked_up"
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Pembayaran</p>
                  <div className="!text-xs">
                    <PaidStatus is_paid={transactions?.is_paid as boolean} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Outlet</p>
                  <Link
                    href={getChangePath(
                      transactions?.outlet_id.toString() as string,
                      "outlet"
                    )}
                    className="link font-medium"
                  >
                    {transactions?.outlets.name}
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-[10px] rounded-md py-3 px-5 text-sm shadow">
                  <h3 className="raleway text-base font-bold">
                    Detail Pelanggan
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Nama</p>
                    <Link
                      href={getChangePath(
                        "pelanggan",
                        transactions?.customer_id.toString() as string
                      )}
                      className="link font-medium"
                    >
                      {transactions?.customers.name}
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Alamat</p>
                    <h5 className="font-medium">
                      {transactions?.customers.address}
                    </h5>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Kontak</p>
                    <h5 className="font-medium">
                      {transactions?.customers.contact}
                    </h5>
                  </div>
                </div>

                <div className="flex flex-col gap-[10px] rounded-md py-3 px-5 text-sm shadow">
                  <h3
                    className="raleway text-base font-bold
                  "
                  >
                    Detail Kasir
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Nama</p>
                    <Link
                      href={getChangePath(
                        "user",
                        transactions?.outlet_id.toString() as string
                      )}
                      className="link font-medium"
                    >
                      {transactions?.user.name}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <h3 className="raleway mb-1 text-base font-bold">
                Ringkasan Pesanan
              </h3>
              {transactions?.transaction_details.map((d, i) => (
                <div className="grid grid-cols-12" key={d.id}>
                  <div className="col-span-6 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-200 font-semibold text-indigo-600">
                      {d.products.name.substring(0, 2)}
                    </div>
                    <div className="flex flex-col">
                      <h5 className="font-medium">
                        {d.products.name}
                      </h5>
                      <p className="text-xs font-medium text-indigo-500">{rupiahConverter(d.products.price)}</p>
                    </div>
                  </div>
                  <h5 className="col-span-1 flex items-center justify-center font-semibold text-gray-500">
                    x{d.quantity}
                  </h5>
                  <h5 className="col-span-5 flex items-center justify-end font-semibold text-gray-800">
                    {rupiahConverter(d.products.price * d.quantity)}
                  </h5>
                </div>
              ))}
              <div className="my-1 h-[0.8px] w-full bg-gray-300"></div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-600">Sub-Total</p>
                <h5 className="font-medium">
                  {rupiahConverter(transactions?.sub_total as number)}
                </h5>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-600">Diskon</p>
                <h5 className="font-medium">
                  {transactions?.discount as number}%
                </h5>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-600">Pajak</p>
                <h5 className="font-medium">
                  {transactions?.taxes as number}%
                </h5>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-600">Biaya Tambahan</p>
                <h5 className="font-medium">
                  {rupiahConverter(transactions?.additional_cost as number)}
                </h5>
              </div>
              <div className="flex items-center justify-between">
                <p className=" text-lg font-semibold">Total Akhir</p>
                <h5 className="text-lg font-bold text-indigo-500">
                  {rupiahConverter(transactions?.total as number)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default OrderanDetail;

OrderanDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
