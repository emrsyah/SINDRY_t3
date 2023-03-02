import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../../components/LayoutAdmin";
import type { NextPageWithLayout } from "../../../../_app";
import BreadCrumbs from "../../../../../components/BreadCrumbs";
import Select from "react-select";
import {
  Gender,
  genderOptions,
  Customer,
  TransactionWithCustomer,
} from "../../../../../dataStructure";
import { trpc } from "../../../../../utils/trpc";
import { useForm } from "react-hook-form";

const paidStatusOptions = [
  { value: 0, label: "Belum Dibayar" },
  { value: 1, label: "Sudah Dibayar" },
];

const transactionStatusOptions = [
  { value: "new", label: "Baru" },
  { value: "on_process", label: "Diproses" },
  { value: "finished", label: "Selesai" },
  { value: "picked_up", label: "Diambil" },
];

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TransactionWithCustomer>();

  const { data: customers, isLoading } = trpc.customer.getByOutlet.useQuery({
    id: parseInt(oid as string),
  });

  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0] as Gender
  );
  const [selectedPaidStat, setSelectedPaidStat] = useState(
    paidStatusOptions[0]
  );
  const [selectedTransactionStat, setSelectedTransactionStat] = useState(
    transactionStatusOptions[0]
  );


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
        <div className="my-3 grid grid-cols-[1fr_40%] gap-4">
          {/* Sisi Kiri */}
          <div className="flex flex-col gap-4">
            <div className="container pb-6">
              <div className="flex items-center justify-between">
                <h3 className="raleway text-base font-bold text-indigo-600">
                  Informasi Pelanggan
                </h3>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Nama</p>
                <input
                  type="text"
                  placeholder="Nama Pelanggan"
                  {...register("name", { required: true })}
                  className={`input ${false ? "!border-red-500" : null} `}
                />
                {errors.name && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Kontak</p>
                <input
                  type="text"
                  placeholder="+62"
                  {...register("contact", { required: true })}
                  className={`input ${false ? "!border-red-500" : null} `}
                />
                {errors.contact && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Alamat</p>
                <input
                  type="text"
                  placeholder="Jalan Buah Batu"
                  {...register("address", { required: true })}
                  className={`input ${false ? "!border-red-500" : null} `}
                />
                {errors.address && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Gender</p>
                <Select
                  options={genderOptions}
                  value={selectedGender}
                  className="selectInput"
                  onChange={setSelectedGender}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "rgb(224 231 255)",
                      primary: "rgb(99 102 241)",
                    },
                  })}
                />
              </div>
            </div>
            <div className="container">
              <div className="flex items-center justify-between">
                <h3 className="raleway text-base font-bold text-indigo-600">
                  Produk
                </h3>
                <button className="btn-secondary">Pilih Produk</button>
              </div>
            </div>
            <div className="container pb-6">
              <div className="flex items-center justify-between">
                <h3 className="raleway text-base font-bold text-indigo-600">
                  Lainnya
                </h3>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Diskon</p>
                <input
                  type="text"
                  placeholder="0%"
                  {...register("discount", { required: true })}
                  className={`input ${
                    errors.discount ? "!border-red-500" : null
                  } `}
                />
                {errors.discount && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Pajak</p>
                <input
                  type="text"
                  placeholder="0%"
                  {...register("taxes", { required: true })}
                  className={`input ${
                    errors.taxes ? "!border-red-500" : null
                  } `}
                />
                {errors.taxes && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">
                  Biaya Tambahan
                </p>
                <input
                  type="text"
                  placeholder="Rp 0"
                  {...register("additional_cost", { required: true })}
                  className={`input ${
                    errors.additional_cost ? "!border-red-500" : null
                  } `}
                />
                {errors.additional_cost && (
                  <span className="text-xs font-medium text-red-500">
                    This field is required
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-gray-500">Status</p>
                <Select
                  options={transactionStatusOptions}
                  value={selectedTransactionStat}
                  onChange={setSelectedTransactionStat}
                  className="selectInput"
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "rgb(224 231 255)",
                      primary: "rgb(99 102 241)",
                    },
                  })}
                />
              </div>
            </div>
          </div>

          {/* Sisi Kanan */}
          <div className="container h-fit">
            <h3 className="raleway text-base font-bold text-indigo-600">
              Rincian Pesanan
            </h3>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Sub-Total</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}
                Rp 0
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Diskon</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}- Rp
                0
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Pajak</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}+ Rp
                0
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Biaya Tambahan</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}+ Rp
                0
              </h5>
            </div>
            <div className="flex items-center justify-between text-base">
              <p className="font-semibold">Total</p>
              <h5 className="font-semibold text-indigo-500">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}
                Rp 0
              </h5>
            </div>
            <Select
              options={paidStatusOptions}
              value={selectedPaidStat}
              className="selectInput"
              onChange={setSelectedPaidStat}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "rgb(224 231 255)",
                  primary: "rgb(99 102 241)",
                },
              })}
            />
            <button className="btn-primary justify-center rounded">Tambah Transaksi</button>
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
