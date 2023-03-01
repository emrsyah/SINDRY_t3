import React, {useState} from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import { ReactElement } from "react";
import { NextPageWithLayout } from "../../../_app";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import { Outlet } from "../../../../dataStructure";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { UilTrashAlt } from "@iconscout/react-unicons";
import DeleteConfirmationModal from "../../../../components/DeleteConfirmationModal";

const OutletDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const { oid } = router.query;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Outlet>();
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { data, isLoading, isError } = trpc.outlet.getById.useQuery({
    id: parseInt(oid as string),
  });

  const updateOutlet = trpc.outlet.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menyimpan Data", { autoClose: 1000 });
    },
    onError: () => {
      toast.error("Gagal Menyimpan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    // console.log(data);
    updateOutlet.mutate({
      id: parseInt(oid as string),
      name: data.name,
      contact: data.contact,
      address: data.address,
    });
  });

  return (
    <>
      <DeleteConfirmationModal isOpen={isOpen} type="outlet" setIsOpen={setIsOpen} id={parseInt(oid as string)} />
      <form onSubmit={submitHandler}>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Detail Outlet</h3>
          <div className="flex items-center gap-2">
            <button className="btn-primary rounded">Simpan Data</button>
            <button type="button" onClick={()=>setIsOpen(true)} className="btn-secondary rounded p-2 hover:border-red-500 hover:bg-red-50 hover:text-red-500">
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
              <p className="text-sm font-semibold text-gray-500">
                Total Penjualan
              </p>
              <input
                type="text"
                disabled
                placeholder="Alamat"
                defaultValue={data?.total_sales}
                className={`input-disabled ${
                  errors.address ? "!border-red-500" : null
                } `}
              />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Dibuat Pada</p>
              <input
                type="text"
                disabled
                placeholder="Kontak"
                defaultValue={dayjs(data?.created_at).format("DD MMM YYYY")}
                className={`input-disabled ${
                  errors.contact ? "!border-red-500" : null
                } `}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default OutletDetail;

OutletDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
