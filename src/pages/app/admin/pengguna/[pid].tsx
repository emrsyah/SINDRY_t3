import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/admin/LayoutAdmin";
import type { ReactElement } from "react";
import { useEffect } from "react";
import type { NextPageWithLayout } from "../../../_app";
import type { RouterOutputs } from "../../../../utils/trpc";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import type { OutletSelectFriendly, Role } from "../../../../dataStructure";
import { roleOptions } from "../../../../dataStructure";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { UilTrashAlt } from "@iconscout/react-unicons";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";
import BreadCrumbs from "../../../../components/BreadCrumbs";
import Select from "react-select";
import UserMoreButton from "../../../../components/UserMoreButton";
import ResetPasswordModal from "../../../../components/admin/ResetPasswordModal";

type UserProps = RouterOutputs["user"]["getById"];
const PenggunaDetail: NextPageWithLayout = () => {
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
  } = useForm<UserProps>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenReset, setIsOpenReset] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role>();
  const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectFriendly>();
  const [outlets, setOutlets] = useState<OutletSelectFriendly[]>([]);

  const { data, isLoading, isError } = trpc.user.getById.useQuery(
    {
      id: pid as string,
    },
    {
      onSuccess: (data) => {
        setValue("name", data?.name as string);
        setValue("email", data?.email as string);
        const localSelectedRole = roleOptions.find(
          (d) => d.value === data?.role
        );
        setSelectedRole(localSelectedRole as Role);
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
    const localSelectedOutlet = outlets.find((d) => d.id === data?.outletsId);
    setSelectedOutlet(localSelectedOutlet);
  }, [selectedRole, outlets]);

  const updateUser = trpc.user.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menyimpan Data", { autoClose: 1000 });
    },
    onError: () => {
      toast.error("Gagal Menyimpan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    updateUser.mutate({
      id: pid as string,
      name: data.name as string,
      role: selectedRole?.value as "admin" | "owner" | "cashier",
      email: data.email,
      outlet_id: selectedOutlet?.value as number,
    });
  });

  return (
    <>
      <DeleteConfirmationModal
        isOpen={isOpen}
        type="pengguna"
        setIsOpen={setIsOpen}
        id={parseInt(pid as string)}
      />
      <ResetPasswordModal id={pid as string} isOpen={isOpenReset} setIsOpen={setIsOpenReset}  />
      <BreadCrumbs items={breadItems} />
      <form onSubmit={submitHandler}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Detail Pelanggan</h3>
            <p className="text-sm font-medium text-indigo-500">
              Ditambahkan pada {dayjs(data?.created_at).format("DD MMM")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary rounded">Simpan Data</button>
            {/* <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="btn-secondary rounded p-2 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
            >
              <UilTrashAlt size="20" />
            </button> */}
            <UserMoreButton setIsOpen={setIsOpen} setIsOpenReset={setIsOpenReset} />
          </div>
        </div>
        <div className="my-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-4">
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
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Email</p>
              <input
                type="text"
                placeholder="Kontak"
                defaultValue={data?.email}
                {...register("email", { required: true })}
                className={`input ${errors.email ? "!border-red-500" : null} `}
              />
              {errors.email && (
                <span className="text-xs font-medium text-red-500">
                  This field is required
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Role</p>
              <Select
                options={roleOptions}
                value={selectedRole}
                className="selectInput"
                onChange={setSelectedRole}
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
export default PenggunaDetail;

PenggunaDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
