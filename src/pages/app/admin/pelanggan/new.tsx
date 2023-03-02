import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../../../_app";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import type {
  Customer,
  Gender,
  Outlet} from "../../../../dataStructure";
import {
  genderOptions
} from "../../../../dataStructure";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../../components/BreadCrumbs";
import Select from "react-select";

interface OutletSelectFriendly extends Outlet {
  value: number;
  label: string;
}

const PelangganNew: NextPageWithLayout = () => {
  const router = useRouter();

  const breadItems = [
    {
      name: "Pelanggan",
      path: `/app/admin/pelanggan`,
    },
    {
      name: "Tambah Pelanggan",
      path: `/app/admin/pelanggan/new`,
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Customer>();

  const [selectedGender, setSelectedGender] = useState<Gender>();
  const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectFriendly>();
  const [outlets, setOutlets] = useState<OutletSelectFriendly[]>([]);

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

  const createCustomer = trpc.customer.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menambahkan Data", { autoClose: 1000 });
      router.back();
    },
    onError: () => {
      toast.error("Gagal Menambahkan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    createCustomer.mutate({
      name: data.name,
      contact: data.contact,
      address: data.address,
      gender: selectedGender?.value as "L" | "P",
      outlet_id: selectedOutlet?.value as number,
    });
  });

  return (
    <>
      <BreadCrumbs items={breadItems} />
      <form onSubmit={submitHandler}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Detail Pelanggan</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary rounded">Simpan Data</button>
          </div>
        </div>
        <div className="my-6 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-500">Nama</p>
            <input
              type="text"
              placeholder="Nama Outlet"
              {...register("name", { required: true })}
              className={`input ${errors.name ? "!border-red-500" : null} `}
            />
            {errors.name && (
              <span className="text-xs font-medium text-red-500">
                This field is required
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Alamat</p>
              <input
                type="text"
                placeholder="Alamat"
                {...register("address", { required: true })}
                className={`input ${
                  errors.address ? "!border-red-500" : null
                } `}
              />
              {errors.address && (
                <span className="text-xs font-medium text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Kontak</p>
              <input
                type="text"
                placeholder="Kontak"
                {...register("contact", { required: true })}
                className={`input ${
                  errors.contact ? "!border-red-500" : null
                } `}
              />
              {errors.contact && (
                <span className="text-xs font-medium text-red-500">
                  This field is required
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Outlet</p>
              <Select
                options={outlets}
                value={selectedOutlet}
                className="selectInput"
                onChange={setSelectedOutlet}
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
      </form>
    </>
  );
};
export default PelangganNew;

PelangganNew.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
