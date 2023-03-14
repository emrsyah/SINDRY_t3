import type { ReactElement } from "react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import type { NextPageWithLayout } from "../../../../../_app";
import BreadCrumbs from "../../../../../../components/BreadCrumbs";
import Select from "react-select";
import type {
  Gender,
  SelectFriendlyString,
  TransactionWithCustomer,
  CustomerSelectFriendly,
  ProductSelectFriendly,
  SelectFriendlyNumber,
  AddedProductProps,
} from "../../../../../../dataStructure";
import {
  paidStatusOptions,
  transactionStatusOptions,
  genderOptions,
} from "../../../../../../dataStructure";
import { trpc } from "../../../../../../utils/trpc";
import { useForm } from "react-hook-form";
import rupiahConverter from "../../../../../../helpers/rupiahConverter";
import { UilMinus, UilPlus, UilTrashAlt } from "@iconscout/react-unicons";
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { generateRandomId } from "../../../../../../helpers/generateRandomId";
import LayoutCashier from "../../../../../../components/cashier/LayoutCashier";

const OrderanNew: NextPageWithLayout = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { oid } = router.query;
  const breadItems = [
    {
      name: "Orderan",
      path: `/app/cashier/${oid}/orderan`,
    },
    {
      name: "Orderan Baru",
      path: `/app/cashier/${oid}/orderan/new`,
    },
  ];

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransactionWithCustomer>();

  const watchAdditional = watch(["discount", "taxes", "additional_cost"]);

  const [selectedGender, setSelectedGender] = useState<Gender>(
    genderOptions[0] as Gender
  );
  const [selectedPaidStat, setSelectedPaidStat] = useState(
    paidStatusOptions[0]
  );
  const [selectedTransactionStat, setSelectedTransactionStat] = useState(
    transactionStatusOptions[0]
  );
  const [customerOptions, setCustomerOptions] = useState<
    CustomerSelectFriendly[]
  >([]);
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerSelectFriendly>();

  const [productOptions, setProductOptions] = useState<ProductSelectFriendly[]>(
    []
  );
  const [addedProductOptions, setAddedProductOptions] = useState<
    AddedProductProps[]
  >([]);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductSelectFriendly>();

  const { data: customers, isLoading: loadingCustomers } =
    trpc.customer.getByOutlet.useQuery(
      {
        id: parseInt(oid as string),
      },
      {
        onSuccess: (data) => {
          const dataSelectFriendly = data.map((d) => {
            return {
              ...d,
              value: d.id,
              label: d.name,
            };
          });
          setCustomerOptions(dataSelectFriendly);
        },
      }
    );

  const { data: products, isLoading: loadingProducts } =
    trpc.product.getByOutlet.useQuery(
      {
        id: parseInt(oid as string),
      },
      {
        onSuccess: (data) => {
          const dataSelectFriendly = data.map((d) => {
            return {
              ...d,
              value: d.id,
              label: d.name,
            };
          });
          console.log(dataSelectFriendly);
          setProductOptions(dataSelectFriendly);
        },
      }
    );

  const changeCustomerHandler = (data: CustomerSelectFriendly | null) => {
    if (data === null) {
      setSelectedCustomer(undefined);
      setValue("name", "");
      setValue("address", "");
      setValue("contact", "");
      setSelectedGender(genderOptions[0] as Gender);
    } else {
      setSelectedCustomer(data);
      setValue("name", data.name);
      setValue("address", data.address);
      setValue("contact", data.contact);
      const selectedGenderLocal = genderOptions.find(
        (d) => d.value === data.gender
      );
      setSelectedGender(selectedGenderLocal as Gender);
    }
  };

  const addProductHandler = (data: ProductSelectFriendly) => {
    setSelectedProduct(undefined);
    const localProductOptions = [...productOptions];
    const toAddProduct = localProductOptions.find((d) => d.id === data.id);
    const newProductOptions = localProductOptions.filter(
      (d) => d.id !== data.id
    );
    setProductOptions(newProductOptions);
    setAddedProductOptions((cur) => [
      ...cur,
      { ...toAddProduct, quantity: 1 } as AddedProductProps,
    ]);
  };

  const changeQuantityHandler = (quantity: number, id: number) => {
    const localAddedProduct = [...addedProductOptions];
    const productToUpdate = localAddedProduct.find((d) => d.id === id);
    productToUpdate!.quantity += quantity;
    setAddedProductOptions(localAddedProduct);
  };

  const deleteProductHandler = (id: number) => {
    const tmpCurrent = [...addedProductOptions];
    const deletedItem = tmpCurrent.find((p) => p.id === id);
    const tmpNew = tmpCurrent.filter((p) => p.id !== id);
    setAddedProductOptions(tmpNew);
    setProductOptions((current) => [...current, deletedItem!]);
  };

  const getSubTotal = (): number => {
    const localAddedProducts = [...addedProductOptions];
    return localAddedProducts.reduce((acc, cur) => {
      return acc + cur.price * cur.quantity;
    }, 0);
  };

  const getDiscount = (): number => {
    const discount = watchAdditional[0];
    return (getSubTotal() * discount) / 100;
  };

  const getTaxes = (): number => {
    const taxes = watchAdditional[1];
    return ((getSubTotal() - getDiscount()) * taxes) / 100;
  };

  const createCustomer = trpc.customer.create.useMutation({
    onSuccess: (data) => {
      return data.id;
    },
    onError: () => {
      toast.error("Gagal Menambahkan Data", { autoClose: 1000 });
    },
  });

  const createTransaction = trpc.transaction.create.useMutation({
    onSuccess: (data) => {
      toast.success("Berhasil Menambahkan Data", { autoClose: 1000 });
      router.push(`/app/cashier/${oid}/orderan`)
    },
    onError: () => {
      toast.error("Gagal Menambahkan Data", { autoClose: 1000 });
    },
  });

  const submitHandler = handleSubmit((data) => {
    let customerId = selectedCustomer === undefined ? -1 : selectedCustomer.id;
    const discount = parseInt(data.discount.toString() ? data.discount.toString() : "0");
    const taxes = parseInt(data.taxes.toString() ? data.taxes.toString() : "0");
    const subTotal = getSubTotal();
    const additionalCost = parseInt(data.additional_cost.toString() ? data.additional_cost.toString() : "0");
    const total =
      subTotal -
      getDiscount() +
      getTaxes() +
      parseInt(watchAdditional[2].toString() ? watchAdditional[2].toString() : "0");
    const userId = session?.user?.id;
    const randomId = generateRandomId(8);
    const invoiceCode = `ID-${randomId}`;
    const toAddedProducts = addedProductOptions.map((d) => {
      return {
        product_id: d.id,
        quantity: d.quantity,
        description: "",
      };
    });

    // * Add Customer If Create New
    if (selectedCustomer === undefined) {
      createCustomer.mutate({
        name: data.name,
        address: data.address,
        contact: data.contact,
        gender: selectedGender.value,
        outlet_id: parseInt(oid as string),
      });
      customerId = createCustomer.data?.id as number;
    }
    // // Add Transaction and transaction details
    createTransaction.mutate({
      customer_id: customerId,
      total: total,
      sub_total: subTotal,
      cashier_id: userId as string,
      invoice_code: invoiceCode,
      outlet_id: parseInt(oid as string),
      additional_cost: additionalCost,
      discount: discount,
      taxes: taxes,
      status: selectedTransactionStat?.value as
        | "new"
        | "on_process"
        | "finished"
        | "picked_up",
      is_paid: selectedPaidStat?.value === 1 ? true : false,
      transaction_details: toAddedProducts,
    });
  });

  return (
    <>
      <BreadCrumbs items={breadItems} />
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Orderan Baru</h3>
        </div>
        <form
          onSubmit={submitHandler}
          className="my-3 grid grid-cols-[1fr_40%] gap-4"
        >
          {/* Sisi Kiri */}
          <div className="flex flex-col gap-4">
            <div className="container pb-6">
              <div className="flex items-center justify-between">
                <h3 className="raleway text-base font-bold text-indigo-600">
                  Informasi Pelanggan
                </h3>
                <Select
                  options={customerOptions}
                  value={selectedCustomer}
                  isClearable={true}
                  className="selectInput"
                  onChange={(data) =>
                    // setSelectedCustomer(data as CustomerSelectFriendly)
                    changeCustomerHandler(data)
                  }
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
                <p className="text-sm font-semibold text-gray-500">Nama</p>
                <input
                  type="text"
                  disabled={selectedCustomer !== undefined}
                  placeholder="Nama Pelanggan"
                  {...register("name", { required: true })}
                  className={`input ${errors.name ? "!border-red-500" : null} ${
                    selectedCustomer !== undefined ? "input-disabled" : null
                  }`}
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
                  disabled={selectedCustomer !== undefined}
                  placeholder="+62"
                  {...register("contact", { required: true })}
                  className={`input ${
                    errors.contact ? "!border-red-500" : null
                  } ${
                    selectedCustomer !== undefined ? "input-disabled" : null
                  }`}
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
                  disabled={selectedCustomer !== undefined}
                  placeholder="Jalan Buah Batu"
                  {...register("address", { required: true })}
                  className={`input ${
                    errors.address ? "!border-red-500" : null
                  } ${
                    selectedCustomer !== undefined ? "input-disabled" : null
                  }`}
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
                  isDisabled={selectedCustomer !== undefined}
                  className="selectInput"
                  onChange={(data) => setSelectedGender(data as Gender)}
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
            <div className="container pb-4">
              <div
                className={`flex items-center justify-between ${
                  addedProductOptions.length > 0 ? "mb-2" : null
                }`}
              >
                <h3 className="raleway text-base font-bold text-indigo-600">
                  Produk
                </h3>
                <Select
                  options={productOptions}
                  value={selectedProduct}
                  className="selectInput"
                  onChange={(data) =>
                    addProductHandler(data as ProductSelectFriendly)
                  }
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "rgb(224 231 255)",
                      primary: "rgb(99 102 241)",
                    },
                  })}
                />{" "}
              </div>
              {addedProductOptions.length > 0
                ? addedProductOptions.map((d) => (
                    <div key={d.id} className="grid grid-cols-9 items-center">
                      <div className="col-span-4">
                        <h3 className="text-base font-semibold">{d.name}</h3>
                        <p className="font-medium text-gray-500">
                          {rupiahConverter(d.price)}
                        </p>
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <button
                          type="button"
                          disabled={d.quantity === 1}
                          onClick={() => changeQuantityHandler(-1, d.id)}
                          className={`flex h-5  w-5 items-center justify-center rounded bg-indigo-500 text-white hover:bg-indigo-600 ${
                            d.quantity === 1
                              ? "opacity-60 hover:bg-indigo-500"
                              : null
                          }`}
                        >
                          <UilMinus size="16" />
                        </button>
                        <h5 className="font-medium">{d.quantity}</h5>
                        <button
                          type="button"
                          onClick={() => changeQuantityHandler(1, d.id)}
                          className="flex h-5  w-5 items-center justify-center rounded bg-indigo-500 text-white hover:bg-indigo-600"
                        >
                          <UilPlus size="16" />
                        </button>
                      </div>
                      <div className="col-span-2  text-base font-semibold">
                        {rupiahConverter(d.price * d.quantity)}
                      </div>
                      <div className="mr-2 flex items-center justify-end">
                        <button
                          onClick={() => deleteProductHandler(d.id)}
                          type="button"
                          className="flex w-fit items-center justify-end bg-gray-100 p-1 text-end text-gray-600  hover:text-red-500"
                        >
                          <UilTrashAlt size="20" />
                        </button>
                      </div>
                    </div>
                  ))
                : null}
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
                  type="number"
                  placeholder="0%"
                  min={0}
                  max={100}
                  {...register("discount", { required: false })}
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
                  type="number"
                  placeholder="0%"
                  min={0}
                  max={100}
                  {...register("taxes", { required: false, min: 0, max: 100 })}
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
                  type="number"
                  placeholder="Rp 0"
                  {...register("additional_cost", { required: false })}
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
                  onChange={(data) =>
                    setSelectedTransactionStat(data as SelectFriendlyString)
                  }
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
          <div className="container h-fit pb-5">
            <h3 className="raleway text-base font-bold text-indigo-600">
              Rincian Pesanan
            </h3>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Sub-Total</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}
                {rupiahConverter(getSubTotal())}
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Diskon</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}-{" "}
                {rupiahConverter(getDiscount())}
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Pajak</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}+{" "}
                {rupiahConverter(getTaxes())}
              </h5>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-gray-600">Biaya Tambahan</p>
              <h5 className="font-medium">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}+{" "}
                {rupiahConverter(watchAdditional[2] ? watchAdditional[2] : 0)}
              </h5>
            </div>
            <div className="flex items-center justify-between text-base">
              <p className="font-semibold">Total</p>
              <h5 className="font-semibold text-indigo-500">
                {/* {rupiahConverter(transactions?.sub_total as number)} */}
                {rupiahConverter(
                  getSubTotal() -
                    getDiscount() +
                    getTaxes() +
                    parseInt(watchAdditional[2] ? watchAdditional[2] : 0)
                )}
              </h5>
            </div>
            <Select
              options={paidStatusOptions}
              value={selectedPaidStat}
              className="selectInput"
              onChange={(data) =>
                setSelectedPaidStat(data as SelectFriendlyNumber)
              }
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary25: "rgb(224 231 255)",
                  primary: "rgb(99 102 241)",
                },
              })}
            />
            <button className="btn-primary justify-center rounded">
              Tambah Transaksi
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default OrderanNew;

OrderanNew.getLayout = function getLayout(page: ReactElement) {
  return <LayoutCashier>{page}</LayoutCashier>;
};
