import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import type { ReactElement } from "react";
import { useEffect } from "react";
import type { NextPageWithLayout } from "../../../_app";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import type { Outlet, ProductType, Product } from "../../../../dataStructure";
import { productTypeOptions } from "../../../../dataStructure";
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

const ProdukDetail: NextPageWithLayout = () => {
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
  } = useForm<Product>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<ProductType>();
  const [selectedOutlet, setSelectedOutlet] = useState<OutletSelectFriendly>();
  const [outlets, setOutlets] = useState<OutletSelectFriendly[]>([]);

  const { data, isLoading, isError } = trpc.product.getById.useQuery(
    {
      id: parseInt(pid as string),
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

  useEffect(() => {
    if (isLoading || loadingOutlets) return;
    const localSelectedOutlet = outlets.find((d) => d.id === data?.outlet_id);
    setSelectedOutlet(localSelectedOutlet);
  }, [selectedType, outlets]);

  const updateProduct = trpc.product.update.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menyimpan Data", { autoClose: 1000 });
    },
    onError: () => {
      toast.error("Gagal Menyimpan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    updateProduct.mutate({
      id: parseInt(pid as string),
      name: data.name,
      outlet_id: selectedOutlet?.value as number,
      price: data.price,
      type: selectedType?.value as
        | "kiloan"
        | "selimut"
        | "kaos"
        | "bed_cover"
        | "lainnya",
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
            <h3 className="text-xl font-bold">Detail Produk</h3>
            <p className="text-sm font-medium text-indigo-500">
              Ditambahkan pada {dayjs(data?.created_at).format("DD MMM")}
            </p>
          </div>
          <div className="flex flex-col-reverse items-end gap-1">
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
            <p className="text-sm font-medium text-indigo-500">
              Terjual sebanyak {data?.sold}
            </p>
          </div>
        </div>
        <div className="my-6 flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_30%] gap-4">
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
              <p className="text-sm font-semibold text-gray-500">Harga</p>
              <input
                type="text"
                placeholder="Alamat"
                defaultValue={data?.price}
                {...register("price", { required: true })}
                className={`input ${errors.price ? "!border-red-500" : null} `}
              />
              {errors.price && (
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
                options={productTypeOptions}
                value={selectedType}
                className="selectInput"
                onChange={setSelectedType}
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
export default ProdukDetail;

ProdukDetail.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
