import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutAdmin from "../../../../components/LayoutAdmin";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "../../../_app";
import { trpc } from "../../../../utils/trpc";
import { useForm } from "react-hook-form";
import type { Outlet, ProductType, Product } from "../../../../dataStructure";
import { productTypeOptions } from "../../../../dataStructure";
import { toast } from "react-toastify";
import BreadCrumbs from "../../../../components/BreadCrumbs";
import Select from "react-select";

interface OutletSelectFriendly extends Outlet {
  value: number;
  label: string;
}

const ProdukNew: NextPageWithLayout = () => {
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
  } = useForm<Product>();

  const [selectedType, setSelectedType] = useState<ProductType>();
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

  const createProduct = trpc.product.create.useMutation({
    onSuccess: () => {
      toast.success("Berhasil Menyimpan Data", { autoClose: 1000 });
      router.back()
    },
    onError: () => {
      toast.error("Gagal Menyimpan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    createProduct.mutate({
      name: data.name,
      outlet_id: selectedOutlet?.value as number,
      price: parseInt(data.price),
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
      <BreadCrumbs items={breadItems} />
      <form onSubmit={submitHandler}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Detail Produk</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-primary rounded">Simpan Data</button>
          </div>
        </div>
        <div className="my-6 flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_30%] gap-4">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-gray-500">Nama</p>
              <input
                type="text"
                placeholder="Nama Produk"
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
                placeholder="Rp 0"
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
export default ProdukNew;

ProdukNew.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAdmin>{page}</LayoutAdmin>;
};
