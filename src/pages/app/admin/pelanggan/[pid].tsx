import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import type { ReactElement} from "react";
import { useEffect } from "react";
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
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { UilTrashAlt } from "@iconscout/react-unicons";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import BreadCrumbs from "../../../../components/BreadCrumbs";
import Select from "react-select";

interface OutletSelectFriendly extends Outlet {
  value: number;
  label: string;
}

const PelangganDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { pid } = router.query;

  const breadItems = [
    {
      name: "Pelanggan",
      path: `/app/admin/pelanggan`,
    },
    {
      name: "Detail Pelanggan",
      path: `/app/admin/pelanggan/${pid}`,
    },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Customer>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedGender, setSelectedGender] = useState<Gender>();
  const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectFriendly>();
  const [outlets, setOutlets] = useState<OutletSelectFriendly[]>([]);

  const { data, isLoading, isError } = trpc.customer.getById.useQuery(
    {
      id: parseInt(pid as string),
    },
    {
      onSuccess: (data) => {
        setValue("name", data?.name as string);
        setValue("address", data?.address as string);
        setValue("contact", data?.contact as string);
        const localSelectedGender = genderOptions.find(
          (d) => d.value === data?.gender
        );
        setSelectedGender(localSelectedGender as Gender);
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

  useEffect(() => {
    if (isLoading || loadingOutlets) return;
    const localSelectedOutlet = outlets.find(
      (d) => d.id === data?.outlet_id
    );
    setSelectedOutlet(localSelectedOutlet)
  }, [selectedGender, outlets]);

  const updateCustomer = trpc.customer.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menyimpan Data", { autoClose: 1000 });
    },
    onError: () => {
      toast.error("Gagal Menyimpan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    updateCustomer.mutate({
      id: parseInt(pid as string),
      name: data.name,
      contact: data.contact,
      address: data.address,
      gender: selectedGender?.value as "L" | "P",
      outlet_id: selectedOutlet?.value as number,
    });
  });

  return (
    <>
      <DeleteConfirmationModal
        isOpen={isOpen}
        type="pelanggan"
        setIsOpen={setIsOpen}
        id={parseInt(pid as string)}
      />
      <BreadCrumbs items={breadItems} />
      <form onSubmit={submitHandler}>
        <div className="flex items-center justify-between">
          <div>
          <h3 className="text-xl font-bold">Detail Pelanggan</h3>
          <p className="text-sm font-medium text-indigo-500">Ditambahkan pada {dayjs(data?.created_at).format("DD MMM")}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary rounded">Simpan Data</button>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="btn-secondary rounded p-2 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
            >
              <UilTrashAlt size="20" />
            </button>
          </div>
        </div>
        <div className="my-6 flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-gray-500">Nama</p>
            <input
              type="text"
              placeholder="Nama Outlet"
              defaultValue={data?.name}
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
                defaultValue={data?.address}
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
                defaultValue={data?.contact}
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
export default PelangganDetail;

PelangganDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
