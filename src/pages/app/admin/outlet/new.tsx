import React from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../../../_app";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import type { Outlet } from "../../../../dataStructure";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../../components/BreadCrumbs";

const OutletNew: NextPageWithLayout = () => {
  const router = useRouter();
  const { oid } = router.query;

  const breadItems = [
    {
      name: "Outlet",
      path: `/app/admin/outlet`,
    },
    {
      name: "Tambah Outlet",
      path: `/app/admin/outlet/${oid}`,
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Outlet>();

  const createMutation = trpc.outlet.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menambahkan Data", { autoClose: 1000 });
      router.push(`/app/admin/outlet`)
    },
    onError: () => {
      toast.error("Gagal Menambahkan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    createMutation.mutate({
      name: data.name,
      contact: data.contact,
      address: data.address,
    });
  });

  return (
    <>
      <BreadCrumbs items={breadItems} />
      <form onSubmit={submitHandler}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Outlet Baru</h3>
          <button className="btn-primary rounded">Tambah Data</button>
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
        </div>
      </form>
    </>
  );
};
export default OutletNew;

OutletNew.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
