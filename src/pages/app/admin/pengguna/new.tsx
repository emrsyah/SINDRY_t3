import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../../../_app";
import type { RouterOutputs } from "../../../../utils/trpc";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import type { Role, OutletSelectFriendly } from "../../../../dataStructure";
import { roleOptions } from "../../../../dataStructure";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../../components/BreadCrumbs";
import Select from "react-select";
import sha1 from "sha1";
import { generateRandomId } from "../../../../helpers/generateRandomId";

type UserProps = RouterOutputs["user"]["getById"];
const PenggunaNew: NextPageWithLayout = () => {
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
  } = useForm<UserProps>();

  const [selectedRole, setSelectedRole] = useState<Role>(
    roleOptions[0] as Role
  );
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
      setSelectedOutlet(dataSelectFriendly[0]);
    },
  });

  const createUser = trpc.user.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menambahkan Data", { autoClose: 1000 });
      router.back();
    },
    onError: () => {
      toast.error("Gagal Menambahkan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    const newPass = sha1(data?.password.replace(/^\s+|\s+$/gm, ""));
    const idRand = generateRandomId(8);
    createUser.mutate({
      id: idRand,
      email: data?.email as string,
      name: data?.name as string,
      role: selectedRole.value,
      password: newPass,
      outlet_id: selectedOutlet?.value as number
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
              placeholder="Nama Pelanggan"
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
              <p className="text-sm font-semibold text-gray-500">Email</p>
              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
                className={`input ${errors.email ? "!border-red-500" : null} `}
              />
              {errors.email && (
                <span className="text-xs font-medium text-red-500">
                  This field is required
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Password</p>
              <input
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
                className={`input ${
                  errors.password ? "!border-red-500" : null
                } `}
              />
              {errors.password && (
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
export default PenggunaNew;

PenggunaNew.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
